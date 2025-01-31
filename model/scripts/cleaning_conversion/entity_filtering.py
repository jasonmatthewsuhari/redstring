import pandas as pd
import numpy as np
# import seaborn as sns
# import matplotlib.pyplot as plt

def process_entities(entity_list):
    # Convert list of strings into a DataFrame
    data = [line.split(',') for line in entity_list]
    df = pd.DataFrame(data, columns=['Entity Name', 'Label', 'Confidence'])
    df['Confidence'] = df['Confidence'].astype(float)  # Convert Confidence column to float
    
    # Step 1: Remove duplicate rows
    df = df.drop_duplicates()
    
    # Step 2: Retain only the row with the highest Confidence for each (Entity Name, Label) pair
    df = df.loc[df.groupby(['Entity Name', 'Label'])['Confidence'].idxmax()]
    
    # Step 3: Retain only the row with the highest Confidence for each Entity Name
    df = df.loc[df.groupby(['Entity Name'])['Confidence'].idxmax()]
    
    # Step 4: Filter out rows with the label "MISC"
    df = df[df['Label'] != "MISC"]
    
    # Step 5: Plot histogram (commented out)
    # plot_df = df[df['Confidence'] >= 0.5]
    # plt.figure(figsize=(8, 6))
    # sns.histplot(
    #     plot_df['Confidence'], bins=10, kde=True, color='indianred', edgecolor='black'
    # )
    # plt.xticks(np.arange(0.5, 1.05, 0.05))
    # plt.axvline(
    #     plot_df['Confidence'].mean(), 
    #     color='red', linestyle='dashed', linewidth=1, label='Mean Confidence Level'
    # )
    # plt.title('Confidence Level Distribution')
    # plt.xlabel('Confidence')
    # plt.ylabel('Frequency')
    # plt.legend()
    # plt.grid(True, linestyle='--', alpha=0.6)
    # plt.show()
    
    # Step 6: Apply confidence threshold of 0.8
    df = df[df['Confidence'] >= 0.8]
    
    return df