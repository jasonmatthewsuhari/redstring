
---

# RedString

**RedString** is an advanced analytics and visualization tool designed to uncover relationships between entities. It dynamically displays connections using an intuitive network graph, reminiscent of a *detective string board*, where patterns unfold, and insights come to life.

---

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**
- 🕵️‍♂️ **Dynamic Relationship Graph**: Visualizes connections between entities in an interactive, detective-board-style interface.
- 💡 **Real-time Data Processing**: Extracts and maps entity relationships from unstructured text using cutting-edge NLP and machine learning models.
- 🔍 **Hover-to-Reveal Details**: Highlight and inspect individual entities and their connections with detailed tooltips.
- ✨ **Custom Animations**: Engaging background animations and click effects enhance user interactivity.
- 🚀 **Responsive Design**: Fully optimized for desktops and mobile devices.

---

## **Technologies Used**
- **Frontend**: React, TypeScript, Tailwind CSS, Styled Components
- **Backend**: FastAPI, Neo4j Aura Database
- **NLP and Machine Learning**: Hugging Face Transformers (NER and Relationship Extraction Models)
- **Deployment**: Vercel
- **Other Libraries**:
  - `lucide-react`: For icons.
  - `fuzzywuzzy`: For fuzzy matching to deduplicate entities.
  - `schedule`: For periodic data ingestion.

---

## **Setup and Installation**

### **Prerequisites**
- **Node.js** (>= 14.0)
- **Python** (>= 3.10)
- **Neo4j Aura Database** (Cloud-based Neo4j instance)

### **Frontend Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/jasonmatthewsuhari/redstring.git
   cd redstring
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### **Backend Installation**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### **Environment Variables**
Create a `.env` file in the project root and configure:
```env
NEO4J_URI=neo4j+s://<your-neo4j-instance-uri>
NEO4J_USERNAME=<your-username>
NEO4J_PASSWORD=<your-password>
```

---

## **Usage**
1. Open the application in your browser (`http://localhost:3000` for the frontend).
2. Paste text or upload data to process entity relationships.
3. Interact with the dynamic network graph to explore connections and patterns.
4. Customize entity or relationship details through the backend APIs.

---

## **Project Structure**

```
redstring/
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI entry point
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models (Neo4j integration)
│   │   ├── scripts/        # Data processing scripts
│   │   └── utils.py        # Helper functions
│   └── requirements.txt    # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components (e.g., Cards, Buttons)
│   │   ├── pages/          # Main application pages
│   │   ├── App.tsx         # Root component
│   │   └── index.tsx       # Entry point
│   └── tailwind.config.js  # Tailwind CSS configuration
├── .env                    # Environment variables
├── package.json            # Frontend dependencies
└── README.md               # Project documentation
```

---

## **Screenshots**
### **Homepage**
![Homepage Screenshot](./screenshots/homepage.png)

### **Entity Relationship Graph**
![Graph Screenshot](./screenshots/graph.png)

---

## **Contributing**
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.