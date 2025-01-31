import pandas as pd
import os
# from scripts.text_to_connl import text_to_connl
# from scripts.connl_to_json import conll_to_json
from scripts.llm.fact_checking import load_fac_model, fact_check
from scripts.llm.named_entity_recognition import load_ner_model, process_text
from scripts.llm.relation_extraction import load_re_model, process_text_relations
from scripts.cleaning_conversion import entity_filtering

# The purpose of this script is for it to be run exactly once: when you want to load it into the
# neo4j database for the first time. You can do the same if there's a huge increase in the provided
# dataset as well. If you are looking for the script you should be using for processing singular texts,
# it's under main.py!


def main():
    print("Initializing main process...")

    # the 2 datasets provided by SMUBIA x ISD
    # TODO/DEBUG: add on more CSV paths or make data ingestion pipeline via web crawling
    # Step 0: Ingest the provided data
    input_files = ["../ingestion/data/raw/wikileaks_parsed.csv", "../ingestion/data/raw/news_excerpts_parsed.csv"]
    texts = []

    repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    output_path = os.path.join(repo_path, 'data', 'output')
    raw_path = os.path.join(repo_path, 'data', 'raw')

    # Step 1: Load the text
    for file in input_files:
        print(f"Loading data from {file}...")
        df = pd.read_csv(file)
        texts.extend(df.iloc[:, 1].dropna().tolist())

    # DEBUG: UNCOMMENT THIS IF YOU NEED THE DATA IN CONNL/JSON FORMAT
    # FOR FINE-TUNING, OR OTHER USAGES.
    # [UNUSED] Step 2: Preprocess the text using SpaCy
    # print("Preprocessing text...")
    # for text in texts:
    #      text_to_connl([text], "../ingestion/data/raw/spacy_generated_conll.txt")
    # conll_to_json("../ingestion/data/raw/spacy_generated_conll.txt", "../ingestion/data/raw/spacy_generated_json.json")

    # Step 2: Load all relevant LLMs 
    # fc_pipeline = load_fc_model() #TODO: Uncomment this once Jina is activated
    ner_pipeline = load_ner_model()
    re_pipeline = load_re_model()

    # Step 3: Fact-check and filter provided text
    # This step is currently inactive, as we are not implementing Jina and
    # the base accuracy of the GordonAI fact-checking model is pretty bad.

    # Step 4: Perform NER for all provided text
    csv_output_path = os.path.join(output_path, 'entities.csv')
    extracted_results = process_text(texts, ner_pipeline, csv_output_path) # returned and written to csv, both  

    # Step 5: Filter for high-confidence entity recognitions using Mandy's data cleaning
    

    # Step 6: Perform RE for all provided text

    # Step 7: Attach entity relationships to high-confidence entity recognitions

    # Step 8: Save results to CSV: "entities_and_relations.csv"

    print("Machine learning pipeline for initial dataset completed successfully!")

if __name__ == "__main__":
    main()
