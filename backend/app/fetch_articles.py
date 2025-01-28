import requests
import logging
from .config import API_KEY, BASE_URL, DEFAULT_PARAMS

# Configure logging
logging.basicConfig(
    filename="job_execution.log",  # Logs will be saved here
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# Set to track URLs of already processed articles
processed_articles = set()

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

        new_articles = []
        for article in articles:
            url = article.get("url")
            if url and url not in processed_articles:
                # Add the new article to the list and mark it as processed
                new_articles.append({
                    "title": article.get("title"),
                    "url": url,
                    "source": article.get("source", {}).get("name"),
                    "published_at": article.get("publishedAt"),
                })
                processed_articles.add(url)  # Mark as processed

        logging.info(f"Found {len(new_articles)} new articles.")
        return new_articles
    else:
        logging.error(f"Error fetching articles: {response.status_code} {response.text}")
        return []

if __name__ == "__main__":
    query = "world news"
    new_articles = fetch_articles(query)
    print(f"New Articles: {new_articles}")
