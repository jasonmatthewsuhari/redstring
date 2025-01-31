from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from dotenv import load_dotenv
from pathlib import Path
from jina import Flow, Client, Document
import os
import csv
import time

def load_fc_model():
    print("Loading the pre-trained fact-checking model...")
    tokenizer = AutoTokenizer.from_pretrained("VinMir/GordonAI-fact_checking")
    model = AutoModelForSequenceClassification.from_pretrained("VinMir/GordonAI-fact_checking")

    nlp_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer)
    print("Fact-checking model loaded successfully!")
    return nlp_pipeline

def setup_jina_flow():
    print("Setting up Jina Reader Flow...")
    grounding_api_key = os.getenv("JINA_API_KEY")
    if not grounding_api_key:
        raise ValueError("JINA_API_KEY is not set. Ensure it is defined in your .env file.")

    flow = Flow().add(
        uses="jinaai/jina-reader:latest",
        uses_with={"retriever": "wikipedia"},
        env={"JINA_API_KEY": grounding_api_key},
    )

    print("Jina Reader Flow setup complete.")
    return flow

def retrieve_evidence_with_jina(jina_client, text):
    print(f"Retrieving evidence for: {text[:50]}...")
    response = jina_client.post("/", [Document(text=text)], return_results=True)

    if response:
        return response[0].matches[0].text if response[0].matches else "No evidence found."
    return "No evidence retrieved."

def fact_check(texts, nlp_pipeline, jina_client, output_path):
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

            # Retrieve evidence from Jina Reader
            evidence = retrieve_evidence_with_jina(jina_client, text)

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

    # Setup Jina Reader Flow
    jina_flow = setup_jina_flow()
    jina_client = Client(port=jina_flow.port)

    # Perform fact-checking and save results to a CSV file
    fact_check(example_texts, fact_check_pipeline, jina_client, "fact_check_results.csv")
