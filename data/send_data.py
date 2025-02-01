import pandas as pd
import json
import requests

# Load CSVs
df_entities = pd.read_csv("output/entities.csv")
df_relationships = pd.read_csv("output/relationships.csv")
df_relationship_mapping = pd.read_csv("output/relationship_mapping.csv")

# Convert relationship mapping to a dictionary for easy lookup
relationship_dict = df_relationship_mapping.set_index("Relationship")[["Category", "Intensity"]].to_dict("index")

# Create a dictionary to store node data
nodes_data = {}

# Step 1: Populate nodes with entity names
for index, row in df_entities.iterrows():
    entity_name = row["name"]
    identifier = str(index)  # Using index as a simple unique identifier
    nodes_data[entity_name] = {
        "identifier": identifier,
        "metadata": {
            "name": entity_name,
            "affiliations": []
        }
    }

# Step 2: Process relationships and attach them to nodes
relationships_data = []
for index, row in df_relationships.iterrows():
    source = row["Source"]
    relation = row["Relationship"]
    target = row["Target"]

    # Ensure missing entities are added
    for entity in [source, target]:
        if entity not in nodes_data:
            nodes_data[entity] = {
                "identifier": str(len(nodes_data) + 1),  # Assign a new unique ID
                "metadata": {
                    "name": entity,
                    "affiliations": []
                }
            }

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

    # Store relationships separately for posting
    relationships_data.append({
        "source_id": nodes_data[source]["identifier"],
        "target_id": nodes_data[target]["identifier"],
        "rel_type": relation,
        "metadata": {
            "category": category,
            "score": intensity
        }
    })

# Define API endpoints
API_BASE_URL = "https://redstring-45l8.onrender.com"  # Replace with actual API URL
ENTITIES_ENDPOINT = f"{API_BASE_URL}/entities/"
RELATIONSHIPS_ENDPOINT = f"{API_BASE_URL}/relationships/"

# Function to send entity data
def post_entity(entity):
    response = requests.post(ENTITIES_ENDPOINT, json=entity)
    return response.json()

# Function to send relationship data
def post_relationship(relationship):
    response = requests.post(RELATIONSHIPS_ENDPOINT, json=relationship)
    return response.json()

# Send entity data
entity_responses = [post_entity(entity) for entity in nodes_data.values()]

# Send relationship data
relationship_responses = [post_relationship(rel) for rel in relationships_data]

# Print responses
print("Entities Response:", json.dumps(entity_responses, indent=2))
print("Relationships Response:", json.dumps(relationship_responses, indent=2))
