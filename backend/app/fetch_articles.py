import requests
import logging
from .config import API_KEY, BASE_URL, DEFAULT_PARAMS

# Configure logging
logging.basicConfig(
    filename="job_execution.log",  # Logs will be saved here
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

def fetch_articles(query, page=1):
    logging.info(f"Starting fetch_articles job with query: {query}")
    params = {
        **DEFAULT_PARAMS,
        "q": query,
        "page": page,
        "apiKey": API_KEY,
    }
    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        articles = response.json().get("articles", [])
        logging.info(f"Successfully fetched {len(articles)} articles.")
        return [
            {
                "title": article.get("title"),
                "url": article.get("url"),
                "source": article.get("source", {}).get("name"),
                "published_at": article.get("publishedAt"),
            }
            for article in articles
        ]
    else:
        logging.error(f"Error fetching articles: {response.status_code} {response.text}")
        return []

if __name__ == "__main__":
    query = "world news"
    fetch_articles(query)
