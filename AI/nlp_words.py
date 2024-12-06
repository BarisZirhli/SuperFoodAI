import csv
import re

csv_file_name = "recipes.csv"
txt_file_name = "nlpWords.txt"
nlpList = []

with open(csv_file_name, "r", encoding="utf-8") as file:
    csv_reader = csv.DictReader(file)

    for row in csv_reader:

        temp = row["RecipeIngredientParts"]
        results = re.findall(r'"(.*?)"', temp)
        for i in results:
            nlpList.append(i + " ")

nlpList = list(set(nlpList))

with open(txt_file_name, "w", encoding="utf-8") as file:
    for i in nlpList:
        a = str(i).replace(",", "").strip()
        file.write(a + "\n")
