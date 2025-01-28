import requests
from config import API_KEY, BASE_URL, DEFAULT_PARAMS


def fetch_articles(query, page=1):
    # Prepare request parameters
    params = {
        **DEFAULT_PARAMS,
        "q": query,  # Search term
        "page": page,  # Pagination
        "apiKey": API_KEY,  # API key from .env
    }

    # Make the API request
    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        articles = response.json().get("articles", [])
        # Extract relevant fields
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
        # Handle errors gracefully
        print(f"Error {response.status_code}: {response.text}")
        return []


if __name__ == "__main__":
    # Test the function with a sample query
    query = "world news"
    articles = fetch_articles(query)
    print(articles[0].keys())
    for article in articles:
        print(f"{article['published_at']} | {article['source']} | {article['title']} | {article['url']}")
