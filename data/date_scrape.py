import pandas as pd
import re
import os
import requests
from bs4 import BeautifulSoup

# File paths
raw_news_csv = "raw/news_excerpts_parsed.csv"
output_news_csv = "output/news_excerpts_with_dates.csv"
wikileaks_csv = "raw/wikileaks_parsed.csv"

# Column names
url_column = "Link"
date_column = "published_date"

# Load from output CSV if it exists; otherwise, use raw
news_csv = output_news_csv if os.path.exists(output_news_csv) else raw_news_csv
print(f"📂 Using data from: {news_csv}")

# Load data and ensure "NA" is treated as a real string
df_news = pd.read_csv(news_csv, dtype={date_column: str})

# Ensure expected columns exist
if url_column not in df_news.columns:
    raise KeyError(f"❌ Column '{url_column}' not found in {news_csv}!")
if date_column not in df_news.columns:
    df_news[date_column] = "NA"  # Create it if missing

# Comprehensive regex patterns for extracting dates
DATE_PATTERNS = [
    r"(\d{4})[-_/](\d{2})[-_/](\d{2})",  # YYYY-MM-DD, YYYY/MM/DD, YYYY_MM_DD
    r"(\d{4})(\d{2})(\d{2})",            # YYYYMMDD (e.g., 20240311)
    r"(\d{2})[-_/](\d{2})[-_/](\d{4})",  # DD-MM-YYYY, DD/MM/YYYY, DD_MM_YYYY
    r"(\d{2})[-_/](\d{2})[-_/](\d{2})",  # DD-MM-YY, DD/MM/YY (e.g., 01/02/23)
    r"(\d{4})[-_/](\d{1})[-_/](\d{2})",  # YYYY-M-DD (single-digit month)
    r"(\d{4})[-_/](\d{2})[-_/](\d{1})",  # YYYY-MM-D (single-digit day)
    r"(\d{4})[-_/](\d{1})[-_/](\d{1})",  # YYYY-M-D (single-digit month & day)
    r"(\d{4})/week(\d{2})",              # YYYY/weekNN (e.g., 2024/week06)
    r"(\d{4})[-_/](\d{3})",              # YYYY-DDD (day of year, e.g., 2024-045)
    r"(\d{4})[-_/]q(\d)",                # YYYY-QN (quarter, e.g., 2024-Q1)
    r"(\d{4})[-_/]h(\d)",                # YYYY-HN (half-year, e.g., 2024-H2)
    r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[-_](\d{1,2})[-_](\d{4})",  # MMM-DD-YYYY
    r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[-_](\d{4})",               # MMM-YYYY
    r"(\d{4})-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-(\d{1,2})",       # YYYY-MMM-DD
    r"(\d{4})-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)",                 # YYYY-MMM
]

# Function to extract date from URL
def extract_date_from_url(url):
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, url, re.IGNORECASE)  # Ignore case for month names
        if match:
            groups = match.groups()
            return "-".join(groups)  # Join detected groups with "-"
    return None

# Function to scrape a webpage and extract the first date
def extract_date_from_page(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            print(f"⚠️ Skipping {url} (Status: {response.status_code})")
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text()  # Extract all text

        # Try to find a date in the page text
        for pattern in DATE_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                groups = match.groups()
                extracted_date = "-".join(groups)
                print(f"🌐 Scraped date from {url}: {extracted_date}")
                return extracted_date

        print(f"❌ No date found in {url}")
        return None
    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
        return None

# Process only rows where 'published_date' is NA
def process_row(row):
    if pd.notna(row[date_column]) and row[date_column] != "NA" and row[date_column] != "":
        return row[date_column]  # Keep manually filled values
    
    # Try extracting date from URL
    date_from_url = extract_date_from_url(row[url_column])
    if date_from_url:
        print(f"🔍 Extracted date from URL: {row[url_column]} → {date_from_url}")
        return date_from_url
    
    # If URL fails, try scraping
    date_from_page = extract_date_from_page(row[url_column])
    if date_from_page:
        return date_from_page

    return "NA"  # If no date found, keep it as NA

df_news[date_column] = df_news.apply(process_row, axis=1)

# Save output (force non-overwriting behavior)
df_news.to_csv(output_news_csv, index=False)
print(f"✅ Processed {news_csv} and saved to {output_news_csv}")

# Find the first 5 URLs that are still NA
na_urls = df_news[df_news[date_column] == "NA"][url_column].head(5).tolist()

if na_urls:
    print("\n⚠️ First 5 URLs that are still NA after processing:")
    for url in na_urls:
        print(f"- {url}")
else:
    print("\n✅ All URLs have a date!")

# Count non-NA dates
num_non_na = df_news[df_news[date_column] != "NA"].shape[0]
print(f"\n✅ Total articles with extracted dates: {num_non_na}/{len(df_news)}")

print("🎉 Done! Everything is processed successfully.")
