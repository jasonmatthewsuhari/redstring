import pandas as pd
from preprocess_into_connl import preprocess
from named_entity_recognition import extract_entities

def main():
    print("Initializing main process...")

    # the 2 datasets provided by SMUBIA x ISD
    input_files = ["data/raw/wikileaks_parsed.csv", "data/raw/news_excerpts_parsed.csv"]
    texts = []

    # Step 1: Load the text
    for file in input_files:
        print(f"Loading data from {file}...")
        df = pd.read_csv(file)
        texts.extend(df.iloc[:, 1].dropna().tolist())

    # Step 2: Preprocess the text using SpaCy
    print("Preprocessing text...")
    for text in texts:
         preprocess([text], "data/raw/spacy_generated_conll.txt")

    print("Analytics tool completed successfully!")

if __name__ == "__main__":
    main()
