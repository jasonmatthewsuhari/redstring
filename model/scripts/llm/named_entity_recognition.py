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


def process_text(texts, nlp_pipeline, output_path):
    """
    Process a list of texts to extract named entities using the NER pipeline.
    Args:
        texts (list): List of text excerpts to process.
        nlp_pipeline: Hugging Face NER pipeline.
    Returns:
        results (list): List of NER results for each text.
    """

    start_time = time.time()

    with open(output_path, mode="a", newline="", encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)

        csvfile.seek(0)
        if csvfile.tell() == 0:
            # TODO: Decide whether or not we want to include the original text somehow.
            # The current issue is that including the original text will make the CSV
            # absolutely gigantic -- maybe we can make an index somehow.
            csv_writer.writerow(["Entity Name", "Label", "Confidence"])

        results = []

        # Process texts and write results to the CSV file
        print(type(texts))

        for i in range(len(texts)):
            text = texts[i]
            print(f"[{i/len(texts)*100:.2f}%] Processing text: {text[:69]}...") 
            ner_results = nlp_pipeline(text)
            results.append({"text": text, "entities": ner_results})
            for entity in ner_results:
                # TODO: Decide whether or not we want to include the original text somehow.
                # The current issue is that including the original text will make the CSV
                # absolutely gigantic -- maybe we can make an index somehow.
                csv_writer.writerow([entity["word"], entity["entity_group"], entity["score"]])

    elapsed_time = time.time() - start_time
    print(f"Processing completed in {elapsed_time:.2f} seconds.")

    return results


def display_results(results):
    """
    Display the extracted named entities in a readable format.
    Args:
        results (list): List of NER results for each text.
    """
    for result in results:
        print("\nOriginal Text:")
        print(result["text"])
        print("\nExtracted Entities:")
        for entity in result["entities"]:
            print(f"  - Entity: {entity['word']}, Label: {entity['entity_group']}, Confidence: {entity['score']:.2f}")


if __name__ == "__main__":
    # Sample list of news excerpts to process
    sample_texts = [
        "Michael Jordan was born in Brooklyn, New York, and played basketball for the Chicago Bulls.",
        "Elon Musk is the CEO of Tesla, which is headquartered in California.",
        "The G20 summit will be held in Tokyo next year, attended by leaders from around the world."
    ]

    # Load the pre-trained NER model
    ner_pipeline = load_ner_model()

    # Process the texts to extract named entities
    extracted_results = process_text(sample_texts, ner_pipeline)

    # Display the results
    display_results(extracted_results)
