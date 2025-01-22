import spacy

# Load spaCy's pre-trained NER model
nlp = spacy.load("en_core_web_sm")

def text_to_connl(text, doc):
    tokens = [token.text for token in doc]
    token_labels = ["O"] * len(tokens)

    for ent in doc.ents:
        for i, token in enumerate(tokens):
            if token == ent.text.split()[0]:  # Beginning of the entity
                token_labels[i] = f"B-{ent.label_}"
            elif token in ent.text.split()[1:]:  # Inside the entity
                token_labels[i] = f"I-{ent.label_}"

    # Generate CoNLL format
    conll_output = ""
    for token, label in zip(tokens, token_labels):
        conll_output += f"{token}\t{label}\n"
    conll_output += "\n"  # Separate sentences

    return conll_output


# Process all text excerpts
def preprocess(texts, output_file):
    conll_data = ""
    for text in texts:
        doc = nlp(text)
        conll_data += text_to_connl(text, doc)

    # Save to file
    with open(output_file, "a", encoding="utf-8") as f:
        f.write(conll_data)
    print(f"CoNLL data saved to {output_file}")


# Example usage
if __name__ == "__main__":
    text = """Pristina Airport – Possible administrative irregularity regarding tender procedures involving Vendor 1 and Vendor 2

Allegation

Two companies with the same owner took part at least three times in the same Airport tenders.

Background Information

The Kosovo citizen, Vendor 1 and Vendor 2 Representative, is the owner and Director of the Pristina-based Vendor 1 and also a 51% shareholder of the Pristina-Ljubljana-based company Vendor 2. Both companies have their residences at the same address in Pristina.

Both Vendor 1 and Vendor 2 submitted three times in 2003 for the same tenders:

Supply and Mounting of Sonic System in the Fire Station Building. Winner was Vendor 2 with €1,530 followed by Vendor 1 with €1,620. The third company, Vendor 3, did not provide a price offer.

Cabling of Flat Display Information System (FIDS). Winner was Vendor 1 with €15,919 followed by Vendor 2 with €19,248.70. The other two competitors, Vendor 3 and Vendor 4, offered prices of Euro 19,702 and Euro 21,045.

Purchase and fixing of Cramer Antenna. Winner was again Vendor 1 with €3,627.99 followed by Vendor 2 with €3,921. The other two competitors, Vendor 3 and Vendor 4, offered prices of €4,278 and €4,670."""
    preprocess(text, "data/raw/spacy_generated_conll.txt")
