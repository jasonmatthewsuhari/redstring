import pandas as pd
from scripts.text_to_connl import text_to_connl
from scripts.connl_to_json import conll_to_json
from scripts.named_entity_recognition import load_ner_model, process_text, display_results

def main():
    print("Initializing main process...")

    # the 2 datasets provided by SMUBIA x ISD
    # TODO/DEBUG: add on more CSV paths or make data ingestion pipeline via web crawling
    # Step 0: Ingest the provided data
    input_files = ["../ingestion/data/raw/wikileaks_parsed.csv", "../ingestion/data/raw/news_excerpts_parsed.csv"]
    texts = []

    # Step 1: Load the text
    for file in input_files:
        print(f"Loading data from {file}...")
        df = pd.read_csv(file)
        texts.extend(df.iloc[:, 1].dropna().tolist())

    # DEBUG: UNCOMMENT THIS IF YOU NEED THE DATA IN CONNL/JSON FORMAT
    # FOR FINE-TUNING, OR OTHER USAGES.
    # [UNUSED] Step 2: Preprocess the text using SpaCy
    print("Preprocessing text...")
    for text in texts:
         text_to_connl([text], "../ingestion/data/raw/spacy_generated_conll.txt")

    conll_to_json("../ingestion/data/raw/spacy_generated_conll.txt", "../ingestion/data/raw/spacy_generated_json.json")

    # Step 2: Load NER Model: bert-large-cased-finetuned-conll03-english
    ner_pipeline = load_ner_model()

    # Step 3: Process all provided text
    csv_output_path = "data/output/entities.csv"
    extracted_results = process_text(texts, ner_pipeline, csv_output_path) # returned and written to csv, both  

    # Step 4: Write NER'd data into data/output/entities.csv

    print("Analytics tool completed successfully!")

if __name__ == "__main__":
    main()
