import requests
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from dotenv import load_dotenv
import os
import csv
import time

# Jina API Configuration
JINA_API_URL = "https://g.jina.ai/"
JINA_API_KEY = "your_jina_api_key_here"  # Replace with your actual API key

def load_fc_model():
    print("Loading the pre-trained fact-checking model...")
    tokenizer = AutoTokenizer.from_pretrained("VinMir/GordonAI-fact_checking")
    model = AutoModelForSequenceClassification.from_pretrained("VinMir/GordonAI-fact_checking")
    
    nlp_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer)
    print("Fact-checking model loaded successfully!")
    return nlp_pipeline

def retrieve_evidence_with_jina(text):
    """Retrieve evidence from Jina's hosted API instead of running a local instance."""
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {JINA_API_KEY}",
    }
    
    try:
        response = requests.get(f"{JINA_API_URL}{text}", headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get("text", "No evidence found.")
    except requests.exceptions.RequestException as e:
        return f"Error retrieving evidence: {e}"

def fact_check(texts, nlp_pipeline, output_path):
    start_time = time.time()

    with open(output_path, mode="a", newline="", encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)

        # Write header if the file is empty
        csvfile.seek(0)
        if csvfile.tell() == 0:
            csv_writer.writerow(["Text", "Label", "Confidence", "Evidence"])

        for i, text in enumerate(texts):
            print(f"[{i / len(texts) * 100:.2f}%] Processing text: {text[:69]}...")

            # Perform fact-checking
            fc_results = nlp_pipeline(text)

            # Extract label and confidence (score)
            label = fc_results[0]["label"]
            confidence = fc_results[0]["score"]

            # Retrieve evidence from Jina API
            evidence = retrieve_evidence_with_jina(text)

            # Write results to CSV
            csv_writer.writerow([text, label, confidence, evidence])

    elapsed_time = time.time() - start_time
    print(f"Processing completed in {elapsed_time:.2f} seconds.")

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()

    # Example usage
    example_texts = [
        "The Earth is flat.",
        "The COVID-19 vaccine is effective and safe.",
        "Humans have landed on the moon.",
    ]

    # Load the fact-checking model
    fact_check_pipeline = load_fc_model()

    # Perform fact-checking and save results to a CSV file
    fact_check(example_texts, fact_check_pipeline, "fact_check_results.csv")
