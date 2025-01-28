import pandas as pd
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

def load_re_model():
    """
    Load the relation extraction model and tokenizer.
    Returns:
        tuple: tokenizer and model objects
    """
    print("Loading the pre-trained Relation Extraction model...")
    model_name = "Babelscape/rebel-large"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    print("Relation Extraction model loaded successfully!")
    return tokenizer, model

def extract_triplets(text):
    """
    Extract triplets from the generated text.
    Args:
        text (str): Generated text containing triplets.
    Returns:
        list: List of triplets with source, relationship, and target.
    """
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

def process_text_relations(texts, tokenizer, model, output_path=None):
    results = []
    gen_kwargs = {
        "max_length": 256,
        "length_penalty": 0,
        "num_beams": 3,
        "num_return_sequences": 1,
    }

    # If output_path is provided, prepare the CSV writer
    csv_writer = None
    if output_path:
        with open(output_path, mode="a", newline="", encoding="utf-8") as csvfile:
            csv_writer = csv.writer(csvfile)

            csvfile.seek(0)
            if csvfile.tell() == 0:
                csv_writer.writerow(["Source", "Relationship", "Target"])

    for idx, text in enumerate(texts):
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
        structured_results = []
        for sentence in decoded_preds:
            triplets = extract_triplets(sentence)
            structured_results.extend(triplets)

            # Write to CSV if enabled
            if csv_writer:
                for triplet in triplets:
                    csv_writer.writerow([triplet["source"], triplet["relationship"], triplet["target"]])

        results.append({"text": text, "relationships": structured_results})

        print(f"Processed {idx + 1}/{len(texts)} entries...")

    print("Relation extraction completed.")
    if output_path:
        print(f"Results saved to {output_path}")
    return results

if __name__ == "__main__":
    # Sample list of news excerpts to process
    sample_texts = [
        "Michael Jordan was born in Brooklyn, New York, and played basketball for the Chicago Bulls.",
        "Elon Musk is the CEO of Tesla, which is headquartered in California.",
        "The G20 summit will be held in Tokyo next year, attended by leaders from around the world."
    ]

    # Load the pre-trained Relation Extraction model
    tokenizer, model = load_re_model()

    # Process the texts to extract relationships
    output_file = "./data/output/relationships.csv"
    extracted_results = process_text_relations(sample_texts, tokenizer, model, output_file)
