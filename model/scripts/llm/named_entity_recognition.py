import csv
import time
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

def load_ner_model():
    print("Loading the pre-trained NER model...")
    model_name = "dbmdz/bert-large-cased-finetuned-conll03-english"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForTokenClassification.from_pretrained(model_name)

    # Create NER pipeline
    nlp_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
    print("NER model loaded successfully!")
    return nlp_pipeline

def process_text(texts, nlp_pipeline, output_path=None):
    start_time = time.time()
    results = []

    # Open the file once and keep it open while writing
    if output_path:
        with open(output_path, mode="w", newline="", encoding="utf-8") as csvfile:  # Open in 'w' mode to clear previous data
            csv_writer = csv.writer(csvfile)
            csv_writer.writerow(["Entity Name", "Label", "Confidence"])  # Ensure header is written

            for i, text in enumerate(texts):
                print(f"[{i / len(texts) * 100:.2f}%] Processing text: {text[:69]}...")  # Preview first 69 chars
                ner_results = nlp_pipeline(text)

                structured_results = []
                for entity in ner_results:
                    entity_data = {
                        "word": entity["word"],
                        "label": entity["entity_group"],
                        "confidence": entity["score"]
                    }
                    structured_results.append(entity_data)

                    # Write to CSV while the file is open
                    csv_writer.writerow([entity["word"], entity["entity_group"], entity["score"]])

                results.append({"text": text, "entities": structured_results})

    elapsed_time = time.time() - start_time
    print(f"Processing completed in {elapsed_time:.2f} seconds.")

    return results
