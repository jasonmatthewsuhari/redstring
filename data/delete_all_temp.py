import requests

# Define API endpoint
API_BASE_URL = "http://127.0.0.1:8000"  # Replace with actual API URL
DELETE_ENTITY_ENDPOINT = f"{API_BASE_URL}/entities/"

# Range of identifiers to delete
start_id = 1
end_id = 20

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

# Delete all entities in the specified range
for entity_id in range(start_id, end_id + 1):
    delete_entity(str(entity_id))

print("✅ Deletion process completed!")