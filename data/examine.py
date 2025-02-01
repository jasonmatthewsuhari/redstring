import pandas as pd


df = pd.read_csv("output/relationships.csv")
print(df["Relationship"].unique())