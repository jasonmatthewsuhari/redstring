from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import csv
import time

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

    # If output_path is provided, prepare the CSV writer
    csv_writer = None
    if output_path:
        with open(output_path, mode="a", newline="", encoding="utf-8") as csvfile:
            csv_writer = csv.writer(csvfile)

            csvfile.seek(0)
            if csvfile.tell() == 0:
                csv_writer.writerow(["Entity Name", "Label", "Confidence"])

    # Process texts and collect results
    for i, text in enumerate(texts):
        print(f"[{i / len(texts) * 100:.2f}%] Processing text: {text[:69]}...")  # Preview first 69 chars
        ner_results = nlp_pipeline(text)

        # Structure results
        structured_results = []
        for entity in ner_results:
            entity_data = {
                "word": entity["word"],
                "label": entity["entity_group"],
                "confidence": entity["score"]
            }
            structured_results.append(entity_data)

            # Write to CSV if enabled
            if csv_writer:
                csv_writer.writerow([entity["word"], entity["entity_group"], entity["score"]])

        results.append({"text": text, "entities": structured_results})

    elapsed_time = time.time() - start_time
    print(f"Processing completed in {elapsed_time:.2f} seconds.")

    return results

if __name__ == "__main__":
    nlp_pipeline = load_ner_model()
    x = process_text(["The Obama administration has declared war against Donald Trump."], nlp_pipeline)
    print(x)
