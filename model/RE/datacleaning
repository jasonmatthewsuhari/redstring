# Import necessary libraries
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Load the dataset from a CSV file
entities = pd.read_csv(r'C:\Users\Mandy\Downloads\entities.csv')
print(entities)  # Initial dataset: 19226 rows

# Step 1: Remove duplicate rows
df_1 = entities.drop_duplicates()
print(df_1)  # After removing duplicates: 19146 rows

# Step 2: Retain only the row with the highest Confidence for each pair of (Entity Name, Label)
df_2 = df_1.loc[df_1.groupby(['Entity Name', 'Label'])['Confidence'].idxmax()]
print(df_2)  # Rows reduced to 8194

# Check for duplicate 'Entity Name' rows
print(df_2[df_2.duplicated(subset=['Entity Name'])])

# Step 3: Remove duplicate 'Entity Name' rows by keeping the one with the highest Confidence
df_3 = df_2.loc[df_2.groupby(['Entity Name'])['Confidence'].idxmax()]
print(df_3)  # Rows reduced to 7861

# Step 4: Filter out rows with the label "MISC"
df_3 = df_3[df_3.Label != "MISC"]
print(df_3)  # Rows reduced to 6631

# Double-check for duplicates after filtering
print(df_3[df_3.duplicated(subset=['Entity Name'])])  # Check for duplicate 'Entity Name' rows
print(df_3[df_3.duplicated(subset=['Entity Name', 'Label'])])  # Check for duplicate combinations of 'Entity Name' and 'Label'

# Step 5: Plot a histogram of Confidence levels
# Filter rows with Confidence >= 0.5
plot_df_3 = df_3[df_3['Confidence'] >= 0.5]  # Confidence >= 0.5: 6514 rows

# Create the histogram plot
plt.figure(figsize=(8, 6))
sns.histplot(
    plot_df_3['Confidence'], bins=10, kde=True, color='indianred', edgecolor='black'
)
plt.xticks(np.arange(0.5, 1.05, 0.05))  # Set x-axis ticks from 0.5 to 1 in steps of 0.05
plt.axvline(
    plot_df_3['Confidence'].mean(), 
    color='red', linestyle='dashed', linewidth=1, label='Mean Confidence Level'
)
plt.title('Confidence Level Distribution')
plt.xlabel('Confidence')
plt.ylabel('Frequency')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.6)
plt.show()

# Step 6: Analyze the histogram to choose a suitable lower bound
# Observation: There is a slightly larger gap between 0.8 and 0.85.
# Decision: Set the lower bound for Confidence to 0.8 to ensure high precision and recall.

# Step 7: Filter rows based on the chosen lower bound for Confidence (>= 0.8)
final_df = df_3[df_3['Confidence'] >= 0.8]
print(final_df)  # Final dataset after applying the confidence threshold
