import pandas as pd
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Function to extract triplets from the generated text
def extract_triplets(text):
    triplets = []
    relation, subject, object_ = '', '', ''
    current = 'x'
    for token in text.replace("<s>", "").replace("<pad>", "").replace("</s>", "").split():
        if token == "<triplet>":
            current = 't'
            if relation:
                triplets.append({'source': subject.strip(), 'relationship': relation.strip(), 'target': object_.strip()})
                relation = ''
            subject = ''
        elif token == "<subj>":
            current = 's'
            if relation:
                triplets.append({'source': subject.strip(), 'relationship': relation.strip(), 'target': object_.strip()})
            object_ = ''
        elif token == "<obj>":
            current = 'o'
            relation = ''
        else:
            if current == 't':
                subject += ' ' + token
            elif current == 's':
                object_ += ' ' + token
            elif current == 'o':
                relation += ' ' + token
    if subject and relation and object_:
        triplets.append({'source': subject.strip(), 'relationship': relation.strip(), 'target': object_.strip()})
    return triplets

# Load the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("Babelscape/rebel-large")
model = AutoModelForSeq2SeqLM.from_pretrained("Babelscape/rebel-large")

# Generation parameters
gen_kwargs = {
    "max_length": 256,
    "length_penalty": 0,
    "num_beams": 3,
    "num_return_sequences": 1,
}

# Paths to input and output files
input_file = "./data/raw/news_excerpts_parsed.csv"
output_file = "./data/output/relationships.csv"

# Load the CSV file
data = pd.read_csv(input_file)

# Ensure the second column contains text data for processing
if data.columns.size < 2:
    raise ValueError("The input CSV does not have at least two columns.")

text_data = data.iloc[:, 1].dropna()  # Use the second column (assuming it contains the text)

# Process each text entry and extract relationships
results = []
for idx, text in enumerate(text_data):
    # Tokenize the input text
    model_inputs = tokenizer(text, max_length=256, padding=True, truncation=True, return_tensors="pt")

    # Generate predictions
    generated_tokens = model.generate(
        model_inputs["input_ids"].to(model.device),
        attention_mask=model_inputs["attention_mask"].to(model.device),
        **gen_kwargs,
    )

    # Decode predictions
    decoded_preds = tokenizer.batch_decode(generated_tokens, skip_special_tokens=False)

    # Extract triplets
    for sentence in decoded_preds:
        triplets = extract_triplets(sentence)
        results.extend(triplets)

    print(f"Processed {idx + 1}/{len(text_data)} entries...")

# Save the results to a CSV file
output_df = pd.DataFrame(results)
output_df.to_csv(output_file, index=False, columns=["source", "relationship", "target"])

print(f"Relation extraction completed. Results saved to {output_file}")
