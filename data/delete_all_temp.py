import requests

# Define API endpoints
API_BASE_URL = "http://127.0.0.1:8000"  # Replace with actual API URL
GET_ENTITIES_ENDPOINT = f"{API_BASE_URL}/entities/"
DELETE_ENTITY_ENDPOINT = f"{API_BASE_URL}/entities/"

# Function to fetch all entity identifiers
def get_all_entity_ids():
    response = requests.get(GET_ENTITIES_ENDPOINT)
    try:
        data = response.json()
    except requests.exceptions.JSONDecodeError:
        print("❌ Error: Invalid JSON response from API.")
        return []

    if response.status_code == 200 and isinstance(data, list):
        return [entity["identifier"] for entity in data if "identifier" in entity]
    else:
        print(f"❌ Failed to fetch entities → Response: {data}")
        return []

# Function to delete an entity by its identifier
def delete_entity(identifier):
    response = requests.delete(f"{DELETE_ENTITY_ENDPOINT}{identifier}")
    try:
        response_data = response.json()
    except requests.exceptions.JSONDecodeError:
        response_data = {"error": "Invalid JSON response", "status_code": response.status_code}

    if response.status_code == 200:
        print(f"✅ Entity {identifier} deleted successfully → Response: {response_data}")
    else:
        print(f"❌ Failed to delete Entity {identifier} → Response: {response_data}")

# Fetch all entity identifiers
entity_ids = get_all_entity_ids()

# Delete all retrieved entities
if entity_ids:
    print(f"🗑️ Deleting {len(entity_ids)} entities...")
    for entity_id in entity_ids:
        delete_entity(entity_id)
    print("✅ Deletion process completed!")
else:
    print("⚠️ No entities found to delete.")
