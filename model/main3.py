from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

tokenizer = AutoTokenizer.from_pretrained("VinMir/GordonAI-fact_checking")
model = AutoModelForSequenceClassification.from_pretrained("VinMir/GordonAI-fact_checking")

classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)