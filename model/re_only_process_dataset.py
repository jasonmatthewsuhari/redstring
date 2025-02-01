import pandas as pd
from fuzzywuzzy import fuzz
import re
import os
# from scripts.text_to_connl import text_to_connl
# from scripts.connl_to_json import conll_to_json
# from scripts.llm.fact_checking import load_fc_model, fact_check
from scripts.llm.named_entity_recognition import load_ner_model, process_text
from scripts.llm.relation_extraction import load_re_model, process_text_relations
from scripts.cleaning_conversion.entity_filtering import process_entities
from pandas import read_csv

# The purpose of this script is for it to be run exactly once: when you want to load it into the
# neo4j database for the first time. You can do the same if there's a huge increase in the provided
# dataset as well. If you are looking for the script you should be using for processing singular texts,
# it's under main.py!


def main():
    print("Initializing main process...")

    # the 2 datasets provided by SMUBIA x ISD
    # TODO/DEBUG: add on more CSV paths or make data ingestion pipeline via web crawling
    # Step 0: Ingest the provided data
    repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    output_path = os.path.join(repo_path, 'redstring', 'data', 'output')
    raw_path = os.path.join(repo_path, 'redstring', 'data', 'raw')

    input_files = [os.path.join(raw_path, 'news_excerpts_parsed.csv'),os.path.join(raw_path, 'wikileaks_parsed.csv')]
    texts = []

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
    # ner_pipeline = load_ner_model()

    # keeping only said tokenizer and model active
    re_tokenizer, re_model = load_re_model()

    # Step 3: Fact-check and filter provided text
    # This step is currently inactive, as we are not implementing Jina and
    # the base accuracy of the GordonAI fact-checking model is pretty bad.

    # Step 4: Perform NER for all provided text
    # Deprecated: switching to using RE only to guarantee entities in relationships
    # entity_csv_output_path = os.path.join(output_path, 'entities.csv')
    # extracted_results = process_text(texts, ner_pipeline, entity_csv_output_path) # returned and written to csv, both  

    # Step 5: Filter for high-confidence entity recognitions using Mandy's data cleaning
    # with open(entity_csv_output_path, "r", encoding="utf-8") as file:
    #     entities = file.readlines()

    # entities = [entity.strip() for entity in entities[1:]]
    # print(f"Number of entities found: {len(entities)}")
    # filtered_entities_df = process_entities(entities)
    # print(f"Number of entities after filtering: {len(filtered_entities_df)}")
    
    # filtered_entities_df.to_csv(entity_csv_output_path, index=False, mode="w", encoding="utf-8")

    # Step 6: Perform RE for all provided text
    relation_csv_output_path = os.path.join(output_path, 'relationships.csv')
    # extracted_results = process_text_relations(texts, re_tokenizer, re_model, relation_csv_output_path)

    # Step 7: Re-Cleaning Entities
    df_relationships = pd.read_csv(relation_csv_output_path)
    df_relationships.to_csv(relation_csv_output_path, index = False)

    

    # print("Machine learning pipeline for initial dataset completed successfully!")

if __name__ == "__main__":
    main()
