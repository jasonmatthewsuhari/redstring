from typing import ClassVar, Optional, List
from fastapi import FastAPI, HTTPException
from neontology import BaseNode, BaseRelationship, init_neontology, Neo4jConfig, GraphConnection
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
import json
import schedule
import time
import threading
from .fetch_articles import fetch_articles
import sys
from pathlib import Path

# find repo root
repo_path = Path(__file__).resolve().parents[2]
sys.path.append(str(repo_path))

from model.scripts.llm.named_entity_recognition import load_ner_model 
from model.scripts.llm.relation_extraction import load_re_model

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    neo4j_uri: str = os.getenv("NEO4J_URI")
    neo4j_username: str = os.getenv("NEO4J_USERNAME")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD")

settings = Settings()

class EntityNode(BaseNode):
    __primaryproperty__: ClassVar[str] = "identifier"  # Unique identifier
    __primarylabel__: ClassVar[str] = "Entity"
    identifier: str  # e.g., UUID or entity name
    type: str  # e.g., "Person", "Organization"
    metadata: Optional[str] = None  # Store metadata as a JSON string

    def set_metadata(self, metadata_dict: dict):
        """Set metadata as a JSON string."""
        self.metadata = json.dumps(metadata_dict)

    def get_metadata(self) -> Optional[dict]:
        """Get metadata as a dictionary."""
        return json.loads(self.metadata) if self.metadata else None

class EntityRelationship(BaseRelationship):
    __relationshiptype__: ClassVar[str] = "RELATIONSHIP"
    source: EntityNode
    target: EntityNode
    type: str  # Relationship type, e.g., "works_for"
    metadata: Optional[str] = None  # Store metadata as a JSON string

    def set_metadata(self, metadata_dict: dict):
        """Set metadata as a JSON string."""
        self.metadata = json.dumps(metadata_dict)

    def get_metadata(self) -> Optional[dict]:
        """Get metadata as a dictionary."""
        return json.loads(self.metadata) if self.metadata else None

def job():
    query = "world news" #TODO: CHECK BEST QUERY
    articles = fetch_articles(query)
    print(f"Fetched {len(articles)} articles")

def run_scheduler():
    schedule.every(24).hours.do(job)
    while True:
        schedule.run_pending()
        time.sleep(1)

# Initialize FastAPI
app = FastAPI(debug = True)
gc: GraphConnection = None

# STARTUP EVENT HERE
@app.on_event("startup")
async def startup_event():
    """Initialize Neo4j on app startup."""
    config = Neo4jConfig(
        uri=settings.neo4j_uri,
        username=settings.neo4j_username,
        password=settings.neo4j_password,
    )

    # initialize connection to neo4j aura db
    print("Initializing Neo4J Aura database connection...")
    global gc 
    init_neontology(config)
    gc = GraphConnection()
    print("Neo4J Aura database connection initialized!")

    # initialize threading job for continuous data ingestion via news api
    print("Initializing data ingestion job...")
    threading.Thread(target=run_scheduler, daemon=True).start()
    print("Data ingestion job initialized!")

    # load models on startup
    #TODO: add fc_pipeline once jina is setup
    print("Initializing machine learning models...")
    global ner_pipeline, re_pipeline
    ner_pipeline = load_ner_model()
    re_pipeline = load_re_model()
    print("Machine learning models initialized!")



@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.get("/entities/")
async def get_entities() -> list:
    """
    Fetch all entities from the database.
    """
    entities = EntityNode.match_nodes()

    # Convert metadata from JSON string to dictionary for each entity
    return [
        {
            "identifier": entity.identifier,
            "type": entity.type,
            "metadata": entity.get_metadata()
        }
        for entity in entities
    ]

@app.post("/entities/")
async def create_entity(identifier: str, entity_type: str, metadata: Optional[dict] = None):
    """
    Create or update an entity.
    Args:
        identifier (str): Unique identifier for the entity.
        entity_type (str): The type of the entity (e.g., "Person", "Organization").
        metadata (Optional[dict]): Additional data about the entity.
    """
    # Create an EntityNode instance
    entity = EntityNode(identifier=identifier, type=entity_type)

    # Set metadata if provided
    if metadata:
        entity.set_metadata(metadata)

    # Save to the database
    entity.create()
    return {
        "identifier": entity.identifier,
        "type": entity.type,
        "metadata": metadata
    }

@app.get("/entities/{identifier}")
async def get_entity(identifier: str) -> dict:
    """
    Fetch a specific entity by its identifier.
    """
    entity = EntityNode.match(identifier)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")

    return {
        "identifier": entity.identifier,
        "type": entity.type,
        "metadata": entity.get_metadata()
    }

@app.post("/relationships/")
async def create_relationship(source_id: str, target_id: str, rel_type: str, metadata: Optional[dict] = None):
    source = EntityNode.match(source_id)
    target = EntityNode.match(target_id)

    if not source or not target:
        raise HTTPException(status_code=404, detail="One or both entities not found")

    relationship = EntityRelationship(
        source=source,
        target=target,
        type=rel_type
    )

    # Set metadata if provided
    if metadata:
        relationship.set_metadata(metadata)

    relationship.merge()
    return {
        "source": source_id,
        "target": target_id,
        "type": rel_type,
        "metadata": metadata
    }

@app.get("/relationships/{entity_id}")
async def get_all_relationships(entity_id: str):
    """
    Fetch all relationships for a specific entity.
    Args:
        entity_id (str): Identifier of the entity to fetch relationships for.
    """
    try:
        # Cypher query to fetch relationships involving the given entity_id
        cypher = """
        MATCH (source:Entity)-[rel:RELATIONSHIP]->(target:Entity)
        WHERE source.identifier = $entity_id OR target.identifier = $entity_id
        RETURN source.identifier AS source, rel.type AS relationship, target.identifier AS target
        """
        results = gc.evaluate_query(cypher, {"entity_id": entity_id})

        relationships = [
            {
                "source": record["source"],
                "relationship": record["relationship"],
                "target": record["target"]
            }
            for record in results.records_raw
        ]

        return relationships

    except Exception as e:
        import logging
        logging.error(f"Error in /all-relationships/: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/process-text/")
async def process_new_text(texts: list[str]):
    if not texts:
        raise HTTPException(status_code=400, detail="No texts provided.")

    ner_results = process_text(texts, ner_pipeline)
    re_results = process_text_relations(texts, re_pipeline)

    for ner_result in ner_results:
        for entity in ner_result['entities']:
            identifier = entity['word']
            entity_type = entity['entity_group']
            metadata = {
                "confidence": entity['score']
            }
            await create_entity(identifier=identifier, entity_type=entity_type, metadata=metadata)

    for re_result in re_results:
        for relation in re_result:
            source_id = relation['source']
            target_id = relation['target']
            rel_type = relation['relationship']
            metadata = {
                "confidence": relation['score']
            }
            await create_relationship(source_id=source_id, target_id=target_id, rel_type=rel_type, metadata=metadata)

    return {"entities": ner_results, "relations": re_results}