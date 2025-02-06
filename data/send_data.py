import pandas as pd
import json
import requests
from generate_entity_hash import generate_hash  # Import your hash function

# Load CSVs
df_entities = pd.read_csv("output/entities.csv")
df_relationships = pd.read_csv("output/relationships.csv")
df_relationship_mapping = pd.read_csv("output/relationship_mapping.csv")

# Convert relationship mapping to a dictionary for easy lookup
relationship_dict = df_relationship_mapping.set_index("Relationship")[["Category", "Intensity"]].to_dict("index")

# Create a dictionary to store node data
nodes_data = {}

# Step 1: Populate nodes with entity names using hashed identifiers and include frequency
for _, row in df_entities.iterrows():
    entity_name = row["name"]
    identifier = generate_hash(entity_name)  # Use hash-based identifier
    frequency = row["frequency"] if "frequency" in row else 0  # Include frequency

    nodes_data[entity_name] = {
        "identifier": identifier,
        "metadata": {
            "name": entity_name,
            "frequency": frequency,  # Include frequency in metadata
            "affiliations": [],
            "location": ""
        }
    }

# Step 2: Ensure all entities from relationships.csv exist in nodes_data
for _, row in df_relationships.iterrows():
    for entity in [row["Source"], row["Target"]]:
        if entity not in nodes_data:
            nodes_data[entity] = {
                "identifier": generate_hash(entity),  # Use hash-based identifier
                "metadata": {
                    "name": entity,
                    "frequency": 0,  # Default to 0 if entity not in entities.csv
                    "affiliations": []
                }
            }

# Step 3: Process relationships and attach them to nodes
relationships_data = []
for _, row in df_relationships.iterrows():
    source = row["Source"]
    relation = row["Relationship"]
    target = row["Target"]

    # Look up relationship category and intensity score
    relation_info = relationship_dict.get(relation, {"Category": "neutral", "Intensity": 0.0})
    category = relation_info["Category"]
    intensity = relation_info["Intensity"]

    # Adjust relation wording
    relation_text = f"{relation} of" if intensity >= 0 else f"{relation} to"
    intensity_text = f"({intensity:+.1f} {category})"
    formatted_relation = f"{relation_text} {target} {intensity_text}"

    # Append the formatted relationship to affiliations
    nodes_data[source]["metadata"]["affiliations"].append({
        "relation": formatted_relation,
        "entity": target,
        "score": intensity,
        "category": category
    })

    nodes_data[target]["metadata"]["affiliations"].append({
        "relation": formatted_relation,
        "entity": source,
        "score": intensity,
        "category": category
    })

    # Generate hash for the relationship
    relationship_id = generate_hash(nodes_data[source]["identifier"] + nodes_data[target]["identifier"])

    # Store relationships separately for posting
    relationships_data.append({
        "identifier": relationship_id,  # Use hash-based identifier
        "source_id": nodes_data[source]["identifier"],
        "target_id": nodes_data[target]["identifier"],
        "rel_type": relation,
        "metadata": {
            "category": category,
            "score": intensity
        }
    })

# Define API endpoints
API_BASE_URL = "http://127.0.0.1:8000"  # Replace with actual API URL
ENTITIES_ENDPOINT = f"{API_BASE_URL}/entities/"
RELATIONSHIPS_ENDPOINT = f"{API_BASE_URL}/relationships/"

# Function to check if an entity exists before creating it
def post_entity(entity):
    check_response = requests.get(f"{ENTITIES_ENDPOINT}{entity['identifier']}")
    if check_response.status_code == 200:
        print(f"⚠️ Entity Already Exists: {entity['metadata']['name']} (ID: {entity['identifier']})")
        return check_response.json()

    # ✅ Send identifier as a query parameter instead of JSON
    response = requests.post(ENTITIES_ENDPOINT, params={"identifier": entity["identifier"]}, json=entity["metadata"])
    try:
        response_data = response.json()
    except json.JSONDecodeError:
        response_data = {"error": "Invalid JSON response", "status_code": response.status_code}

    print(f"✅ Entity Created: {entity['metadata']['name']} → Response: {response_data}")
    return response_data

# Function to send relationship data using query params
def post_relationship(relationship):
    response = requests.post(RELATIONSHIPS_ENDPOINT, params={
        "source_id": relationship["source_id"],
        "target_id": relationship["target_id"],
        "rel_type": relationship["rel_type"],
        "identifier": relationship["identifier"],  # Send relationship identifier
    }, json=relationship["metadata"])  # Send metadata separately

    try:
        response_data = response.json()
    except json.JSONDecodeError:
        response_data = {"error": "Invalid JSON response", "status_code": response.status_code}

    print(f"🔗 Relationship Created: {relationship['source_id']} → {relationship['rel_type']} → {relationship['target_id']} → Response: {response_data}")
    return response_data

# Send entity data and print response immediately
for entity in nodes_data.values():
    post_entity(entity)

# Send relationship data and print response immediately
for relationship in relationships_data:
    post_relationship(relationship)

print("✅ All entities and relationships have been processed successfully!")
