import csv
import requests
import json
from generate_entity_hash import generate_hash

# API endpoint
# TODO: change to actual api lol
API_URL = "https://redstring-45l8.onrender.com/entities"

def post_entities_from_csv(csv_path):
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row["name"].strip()
            category = row["category"].strip()
            confidence = float(row["confidence"].strip())
            frequency = int(row["frequency"].strip())
            
            # Generate identifier
            identifier = generate_hash(name)
            
            # Prepare data payload
            payload = {
                "identifier": identifier,
                "entity_type": category,
                "metadata": {"name": name, "confidence": confidence, "frequency": frequency}
            }
            
            # Send POST request
            response = requests.post(API_URL, json=payload)
            
            # Print response
            print(f"Posted: {name} -> {response.status_code}, Response: {response.text}")

# Run the function
if __name__ == "__main__":
    post_entities_from_csv("output/entities.csv")
    post_entities_from_csv("output/relationships.csv")
