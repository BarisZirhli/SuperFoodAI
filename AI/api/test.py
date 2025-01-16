import os
import pandas as pd

file_path = r"C:\Users\pc\Desktop\SuperFoodAI-main\SuperFoodAI\AI\api\recipes.csv"
if os.path.exists(file_path):
    recipedf = pd.read_csv(file_path, encoding="utf-8")
    print("File found and loaded successfully.")
    # print(recipedf)
else:
    print(f"File not found: {file_path}")
    recipedf = pd.DataFrame()
