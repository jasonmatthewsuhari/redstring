import json

def conll_to_json(conll_file, output_json_file):
    """
    Convert CoNLL format to JSON format for BERT fine-tuning.
    Args:
        conll_file (str): Path to the CoNLL file.
        output_json_file (str): Path to save the JSON data.
    """
    data = []
    labels_set = set()  # To track unique labels
    
    # Step 1: Read the CoNLL file and gather unique labels
    with open(conll_file, "r", encoding="utf-8") as f:
        tokens = []
        labels = []
        
        for line in f:
            line = line.strip()
            if line:  # Skip empty lines
                parts = line.split("\t")
                if len(parts) == 2:  # Ensure it's a valid token-label pair
                    token, label = parts
                    tokens.append(token)
                    labels.append(label)
                    labels_set.add(label)  # Add the label to the set
                else:
                    print(f"Skipping invalid line: {line}")  # Debug print for invalid lines
            else:
                # End of a sentence: store the current sentence data
                if tokens:
                    data.append({
                        "tokens": tokens,
                        "labels": labels
                    })
                    tokens = []  # Reset for next sentence
                    labels = []
    
    # Step 2: Create label-to-id mapping
    label_to_id = {label: idx for idx, label in enumerate(sorted(labels_set))}
    print(f"Label-to-ID mapping: {label_to_id}")
    
    # Step 3: Convert labels in the data to integers based on the label-to-id mapping
    for sentence in data:
        sentence["labels"] = [label_to_id[label] for label in sentence["labels"]]
    
    # Step 4: Save the converted data as a JSON file
    with open(output_json_file, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"Converted CoNLL data saved to {output_json_file}")
