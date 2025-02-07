from typing import ClassVar, Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neontology import BaseNode, BaseRelationship, init_neontology, Neo4jConfig, GraphConnection
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
import json
import schedule
import time
import threading
from .fetch_articles import fetch_articles
from .generate_entity_hash import generate_hash
import sys
from pathlib import Path
import numpy as np

# Find repo root
repo_path = Path(__file__).resolve().parents[2]
sys.path.append(str(repo_path))

from model.scripts.llm.relation_extraction import load_re_model, process_text_relations

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
    identifier: str  # Unique ID (e.g., UUID or entity name)
    metadata: Optional[str] = None  # Store all metadata as a JSON string

    def set_metadata(self, metadata_dict: dict):
        """Set metadata as a JSON string, converting non-serializable types."""
        cleaned_metadata = {key: float(value) if isinstance(value, (float, np.float32)) else value
                            for key, value in metadata_dict.items()}
        self.metadata = json.dumps(cleaned_metadata)

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
        """Set metadata as a JSON string, converting non-serializable types."""
        cleaned_metadata = {key: float(value) if isinstance(value, (float, np.float32)) else value
                            for key, value in metadata_dict.items()}
        self.metadata = json.dumps(cleaned_metadata)

    def get_metadata(self) -> Optional[dict]:
        """Get metadata as a dictionary."""
        return json.loads(self.metadata) if self.metadata else None

def job():
    query = "world news"  # TODO: CHECK BEST QUERY
    articles = fetch_articles(query)
    print(f"Fetched {len(articles)} articles")

def run_scheduler():
    schedule.every(24).hours.do(job)
    while True:
        schedule.run_pending()
        time.sleep(1)

# Initialize FastAPI
app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://redstring-37u4ow5uq-jason-matthew-suharis-projects.vercel.app", "https://redstring.website", "https://www.redstring.website"],  # CHANGE TO VERCEL LINK LATER
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

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

    # Initialize connection to Neo4j Aura DB
    print("Initializing Neo4J Aura database connection...")
    global gc
    init_neontology(config)
    gc = GraphConnection()
    print("Neo4J Aura database connection initialized!")

    # Initialize threading job for continuous data ingestion via news API
    print("Initializing data ingestion job...")
    threading.Thread(target=run_scheduler, daemon=True).start()
    print("Data ingestion job initialized!")

@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.get("/entities/")
async def get_entities() -> list:
    """
    Fetch all entities from the database.
    """
    entities = EntityNode.match_nodes()

    return [
        {
            "identifier": entity.identifier,
            "metadata": entity.get_metadata()
        }
        for entity in entities
    ]

@app.post("/entities/")
async def create_entity(identifier: str, metadata: Optional[dict] = None):
    """
    Create an entity with the given identifier and metadata.
    """
    entity = EntityNode(identifier=identifier)
    if metadata:
        entity.set_metadata(metadata)
    entity.create()
    return {
        "identifier": entity.identifier,
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
        "metadata": entity.get_metadata()
    }

@app.get("/entities/{}")
async def get_filtered_entities(query: str) -> list:
    # query by:
    # 1.) specific locations
    # 2.) total cluster size
    # 3.) number of times mentioned (size)
    # 4.) specific name

    # add clustered vs sparse view
    entities = EntityNode.match_nodes()

    cypher = """
    MATCH (e:Entity {identifier: $identifier})
    DETACH DELETE e
    RETURN COUNT(e) AS deleted_count
    """ 

    return [
        {
            "identifier": entity.identifier,
            "metadata": entity.get_metadata()
        }
    ]

@app.post("/relationships/")
async def create_relationship(source_id: str, target_id: str, rel_type: str, metadata: Optional[dict] = None):
    """
    Create a relationship between two entities.
    """
    source = EntityNode.match(source_id)
    target = EntityNode.match(target_id)

    if not source or not target:
        raise HTTPException(status_code=404, detail="One or both entities not found")

    relationship = EntityRelationship(
        source=source,
        target=target,
        type=rel_type
    )

    if metadata:
        relationship.set_metadata(metadata)

    relationship.merge()
    return {
        "identifier": generate_hash(source.identifier + target.identifier),
        "source": source_id,
        "target": target_id,
        "type": rel_type,
        "metadata": metadata
    }

@app.get("/relationships/{entity_id}")
async def get_all_relationships(entity_id: str):
    """
    Fetch all relationships for a specific entity.
    """
    try:
        cypher = """
        MATCH (source:Entity)-[rel:RELATIONSHIP]->(target:Entity)
        WHERE source.identifier = $entity_id OR target.identifier = $entity_id
        RETURN source.identifier AS source, rel.type AS relationship, target.identifier AS target
        """
        results = gc.evaluate_query(cypher, {"entity_id": entity_id})

        return [{"source": record["source"], "relationship": record["relationship"], "target": record["target"]}
                for record in results.records_raw]

    except Exception as e:
        import logging
        logging.error(f"Error in /relationships/{entity_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.delete("/entities/{identifier}")
async def delete_entity(identifier: str):
    """
    Delete an entity by its identifier.
    """
    cypher = """
    MATCH (e:Entity {identifier: $identifier})
    DETACH DELETE e
    RETURN COUNT(e) AS deleted_count
    """
    result = gc.evaluate_query(cypher, {"identifier": identifier})

    if result.records_raw[0].get("deleted_count", 0) == 0:
        raise HTTPException(status_code=404, detail="Entity not found")

    return {"message": f"Entity with identifier '{identifier}' has been deleted."}

@app.delete("/relationships/{identifier}")
async def delete_relationship(identifier: str):
    """
    Delete a relationship by its identifier.
    """
    cypher = """
    MATCH ()-[r:RELATIONSHIP {identifier: $identifier}]->()
    DELETE r
    RETURN COUNT(r) AS deleted_count
    """
    result = gc.evaluate_query(cypher, {"identifier": identifier})

    if result.records_raw[0].get("deleted_count", 0) == 0:
        raise HTTPException(status_code=404, detail="Relationship not found")

    return {"message": f"Relationship with identifier '{identifier}' has been deleted."}

@app.get("/entities/filtered/")
async def get_filtered_entities(
    min_affiliations: Optional[int] = None,
    max_affiliations: Optional[int] = None,
    min_frequency: Optional[int] = None,
    max_frequency: Optional[int] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    name: Optional[str] = None
):
    """
    Fetch all entities from the database with filtering options:
    - min_affiliations: Minimum number of affiliations.
    - max_affiliations: Maximum number of affiliations.
    - min_frequency: Minimum number of times mentioned.
    - max_frequency: Maximum number of times mentioned.
    - min_year: Minimum year for affiliations.
    - max_year: Maximum year for affiliations.
    - name: Specific entity name (fuzzy search with at least 50% similarity).
    
    Any affiliated entities that are not filtered out will also be included.
    """
    filters = []
    params = {}

    if name:
        filters.append("apoc.text.levenshteinSimilarity(apoc.convert.fromJsonMap(e.metadata)['name'], $name) >= 0.5")
        params["name"] = name

    if min_affiliations is not None:
        filters.append("size(apoc.convert.fromJsonMap(e.metadata)['affiliations']) >= $min_affiliations")
        params["min_affiliations"] = min_affiliations

    if max_affiliations is not None:
        filters.append("size(apoc.convert.fromJsonMap(e.metadata)['affiliations']) <= $max_affiliations")
        params["max_affiliations"] = max_affiliations

    if min_frequency is not None:
        filters.append("apoc.convert.fromJsonMap(e.metadata)['frequency'] >= $min_frequency")
        params["min_frequency"] = min_frequency

    if max_frequency is not None:
        filters.append("apoc.convert.fromJsonMap(e.metadata)['frequency'] <= $max_frequency")
        params["max_frequency"] = max_frequency

    # Filtering by year extracted from affiliations' date field
    if min_year is not None:
        filters.append("""
        ANY(affiliation IN apoc.convert.fromJsonMap(e.metadata)['affiliations'] 
            WHERE affiliation['date'] IS NULL OR TOINTEGER(SUBSTRING(affiliation['date'], 0, 4)) >= $min_year)
        """)
        params["min_year"] = min_year

    if max_year is not None:
        filters.append("""
        ANY(affiliation IN apoc.convert.fromJsonMap(e.metadata)['affiliations'] 
            WHERE affiliation['date'] IS NULL OR TOINTEGER(SUBSTRING(affiliation['date'], 0, 4)) <= $max_year)
        """)
        params["max_year"] = max_year

    filter_clause = " AND ".join(filters) if filters else ""

    cypher_query = f"""
    MATCH (e:Entity)
    {f'WHERE {filter_clause}' if filter_clause else ''}
    WITH COLLECT(e) AS filtered_entities
    MATCH (e:Entity)-[r:RELATIONSHIP]-(affiliated:Entity)
    WHERE e IN filtered_entities OR affiliated IN filtered_entities
    RETURN DISTINCT e.identifier AS identifier, e.metadata AS metadata, 
                    COLLECT(DISTINCT affiliated.identifier) AS affiliated_entities
    """

    results = gc.evaluate_query(cypher_query, params)

    return [
        {
            "identifier": record["identifier"],
            "metadata": json.loads(record["metadata"]) if record["metadata"] else None,
            "affiliated_entities": record["affiliated_entities"]
        }
        for record in results.records_raw
    ]
