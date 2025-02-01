import pandas as pd

df = pd.read_csv('output/news_excerpts_with_dates.csv')
df = df[df["published_date"].notna()]
df.to_csv("output/news_excerpts_final.csv", index=False)