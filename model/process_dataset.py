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

# The purpose of this script is for it to be run exactly once: when you want to load it into the
# Neo4j database for the first time. You can do the same if there's a huge increase in the provided
# dataset as well. If you are looking for the script you should be using for processing singular texts,
# it's under main.py!


def main():
    print("Initializing main process...")

    # Define paths
    repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    output_path = os.path.join(repo_path, 'redstring', 'data', 'output')
    raw_path = os.path.join(repo_path, 'redstring', 'data', 'raw')

    input_files = [os.path.join(output_path, 'news_excerpts_final.csv')]
    texts = []

    # Step 1: Load the text
    for file in input_files:
        print(f"Loading data from {file}...")
        df = pd.read_csv(file)
        texts.extend(df.iloc[:, 1].dropna().tolist())

    # Load RE model
    re_tokenizer, re_model = load_re_model()

    # Step 6: Perform RE for all provided text
    entity_csv_output_path = os.path.join(output_path, 'entities.csv')
    relation_csv_output_path = os.path.join(output_path, 'relationships.csv')
    extracted_results = process_text_relations(texts, re_tokenizer, re_model, relation_csv_output_path)

    # Load relationships
    df_relationships = pd.read_csv(relation_csv_output_path)

    # Extract unique entities from relationships
    unique_entities = set(df_relationships["Source"]).union(set(df_relationships["Target"]))
    pd.DataFrame({"name": list(unique_entities)}).to_csv(entity_csv_output_path, index=False)

    # Load entities
    df_entity = pd.read_csv(entity_csv_output_path)
    df_entity["frequency"] = 1

    # Function to clean entity names
    def clean_entity_name(name):
        name = name.lower().strip()  # Lowercase and strip whitespace
        name = re.sub(r"[^a-z0-9\s]", "", name)  # Remove special characters except alphanumeric & spaces
        return name

    # Clean entity names
    df_entity["cleaned_name"] = df_entity["name"].apply(clean_entity_name)
    df_entity = df_entity[~df_entity["cleaned_name"].str.isnumeric()]

    # Remove common stopwords
    stopwords = {"inc", "ltd", "company", "the", "corp", "group", "plc", "co", "llc", "gmbh", "sa", "sarl", "ag"}
    df_entity = df_entity[~df_entity["cleaned_name"].isin(stopwords)]
    df_entity = df_entity[df_entity["cleaned_name"].str.len() > 3]

    # Apply fuzzy matching to merge similar entities
    unique_entities_dict = {}
    for index, row in df_entity.iterrows():
        found = False
        for key in unique_entities_dict.keys():
            if fuzz.ratio(row["cleaned_name"], key) >= 50:  # Fuzzy similarity threshold of 50%
                unique_entities_dict[key]["frequency"] += 1
                found = True
                break
        if not found:
            unique_entities_dict[row["cleaned_name"]] = {
                "name": row["name"],
                "Label": row.get("Label", ""),
                "Confidence": row.get("Confidence", ""),
                "frequency": 1,
            }

    # Convert cleaned unique entities into DataFrame
    df_final = pd.DataFrame.from_dict(unique_entities_dict, orient="index")

    # Ensure only valid entities (that exist in relationships) are kept
    valid_entities = set(df_relationships["Source"]).union(set(df_relationships["Target"]))
    df_final = df_final[df_final["name"].isin(valid_entities)]
    df_final.to_csv(entity_csv_output_path, index=False)

    # Clean relationships to remove invalid entities
    df_relationships = df_relationships[
        df_relationships["Source"].isin(valid_entities) & df_relationships["Target"].isin(valid_entities)
    ]
    df_relationships.to_csv(relation_csv_output_path, index=False)

    print("Machine learning pipeline for initial dataset completed successfully!")


if __name__ == "__main__":
    main()
