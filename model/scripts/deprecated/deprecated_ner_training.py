from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForTokenClassification, Trainer, TrainingArguments, DataCollatorForTokenClassification, pipeline
import torch

# Check if CUDA is available and select the GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Training on {device}")

# Load the dataset
dataset = load_dataset("json", data_files="../data/raw/spacy_generated_json.json")
print("WAGOO WAGOO")
print(dataset)

# Split the dataset into training and validation sets (80%/20% split)
train_size = int(0.8 * len(dataset["train"]))  # 80% for training
val_size = len(dataset["train"]) - train_size  # 20% for validation

# Use train_test_split and update dataset with the new split
train_dataset, eval_dataset = dataset["train"].train_test_split(test_size=val_size).values()

# Tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")

# Tokenization function with dynamic padding
def tokenize_function(examples):
    # Tokenizing with dynamic padding (padding to the longest sequence in the batch)
    tokenized_inputs = tokenizer(examples['tokens'], truncation=True, padding=True, is_split_into_words=True)
    return tokenized_inputs

# Apply tokenization on the training and validation datasets
train_dataset = train_dataset.map(tokenize_function, batched=True)
eval_dataset = eval_dataset.map(tokenize_function, batched=True)

# Calculate the number of labels (unique entity labels in the dataset)
unique_labels = set()
for example in dataset["train"]:
    unique_labels.update(example["labels"])

num_labels = len(unique_labels)

# Load the pre-trained BERT model for token classification (NER)
model = AutoModelForTokenClassification.from_pretrained("bert-base-cased", num_labels=num_labels)
model.to(device)  # Move the model to the GPU if available

# Use DataCollatorForTokenClassification for proper padding during batching
data_collator = DataCollatorForTokenClassification(tokenizer)

# Set up training arguments
training_args = TrainingArguments(
    output_dir="./results",          # where to save results
    num_train_epochs=3,              # number of training epochs
    per_device_train_batch_size=16,  # batch size for training
    per_device_eval_batch_size=16,   # batch size for evaluation
    logging_dir="./logs",            # where to store logs
    evaluation_strategy="epoch",     # evaluate after each epoch
    save_strategy="epoch",          # save model after each epoch
    fp16=True,  # Enable mixed precision training (FP16) to speed up training
)

# Initialize the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,  # Training dataset
    eval_dataset=eval_dataset,    # Validation dataset
    data_collator=data_collator,  # Use data collator for dynamic padding
)

# Fine-tune the model
trainer.train()

# Use the fine-tuned model for inference
nlp_ner = pipeline("ner", model=model, tokenizer=tokenizer)

# Sample text for prediction
text = "Michael Jordan is a basketball player."