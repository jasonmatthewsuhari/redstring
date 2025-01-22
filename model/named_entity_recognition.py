import spacy
nlp = spacy.load("en_core_web_sm")

def extract_entities(text):
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    return entities

# for quick testing
if __name__ == "__main__":
    sample_text = "John punched Jill in the face! Jill went to the hospital."
    print("Entities:", extract_entities(sample_text))
