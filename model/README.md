## **Features**
- Extract entities (e.g., PERSON, ORG, LOC) using Named Entity Recognition (NER).
- Identify relationships between entities (e.g., HOSTILE, PARTNERSHIP).
- Validate and clean extracted entities and relationships.
- Generate a network graph for visualization.
- Export results to CSV for further analysis.

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd redstring
cd model
```

### **2. Set Up a Virtual Environment**
1. **Create a Virtual Environment**:
   ```bash
   python -m venv .env
   ```

2. **Activate the Virtual Environment**:
   - On Linux/Mac:
     ```bash
     source .env/bin/activate
     ```
   - On Windows:
     ```bash
     source .env/Scripts/activate
     ```

### **3. Install Dependencies**
Install the required packages using `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## **Usage Instructions**

### **1. Prepare the Input Data**
- Place your CSV files in the `data/raw_texts/` directory.
- Ensure the relevant text is in the second column of each CSV file (excluding the header).

### **2. Run the Tool**
Execute the main pipeline:
```bash
python main.py
```

### **3. Output Files**
After running the tool, you will find:
- **Extracted Entities**: `data/outputs/entities.csv`
- **Extracted Relationships**: `data/outputs/relationships.csv`
---

## **Directory Structure**
```plaintext
analytics_tool/
│
├── main.py                 # Main script to run the tool
├── preprocessing.py        # Text preprocessing functions
├── ner_extraction.py       # Named Entity Recognition functions
├── relationship_extraction.py # Relationship extraction functions
├── validation.py           # Data validation functions
├── visualization.py        # Visualization functions
├── utils.py                # Utility functions
├── requirements.txt        # List of dependencies
├── data/
│   ├── raw_texts/          # Input CSV files
│   ├── outputs/            # Outputs: entities, relationships
└── README.md               # Usage instructions
```

---

## **Customization**
1. **Text Preprocessing**: Modify `preprocessing.py` if your text requires custom cleaning.
2. **NER Model**: Update `ner_extraction.py` to use a custom or fine-tuned NER model.
3. **Relationship Extraction**: Replace or enhance the placeholder logic in `relationship_extraction.py` with a machine learning model or rule-based system.

---

## **Troubleshooting**
- **Missing Dependencies**:
  Ensure all dependencies are installed by re-running:
  ```bash
  pip install -r requirements.txt
  ```
- **CSV Format Issues**:
  Confirm your input files have the text in the second column and no empty rows.