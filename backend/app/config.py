from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("NEWS_API_KEY")

BASE_URL = "https://newsapi.org/v2/everything"
DEFAULT_PARAMS = {
    "language": "en",
    "sortBy": "publishedAt",
    "pageSize": 10,
}

if not API_KEY:
    raise ValueError("NEWS_API_KEY is not set in the .env file")
