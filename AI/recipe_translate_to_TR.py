import csv
import time
from googletrans import Translator

csv_file_name = "recipes.csv"
translator = Translator()
keys = ["Name", "Description", "RecipeCategory", "Keywords", "RecipeIngredientParts", "RecipeInstructions"]

translated_rows = []

try:
    # Read the CSV file
    with open(csv_file_name, mode="r", encoding="utf-8") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        fieldnames = csv_reader.fieldnames  

        for row in csv_reader:
            # Translate specified keys
            for key in keys:
                if key in row and row[key]:  # Check if key exists and is not empty
                    attempts = 3
                    for attempt in range(attempts):
                        try:
                            # Translate the text
                            translated_text = translator.translate(row[key], dest="tr").text
                            row[key] = translated_text
                            print(f"Translated {row[key]}")
                            break  # Exit retry loop if successful
                        except Exception as e:
                            print(f"Translation error for '{key}' in row '{row.get('Name', 'Unknown')}' "
                                  f"on attempt {attempt + 1}: {e}")
                            time.sleep(1)  # Longer delay between retries
                    else:
                        print(f"Failed to translate '{key}' in row '{row.get('Name', 'Unknown')}' "
                              f"after {attempts} attempts.")
            translated_rows.append({k: row[k] for k in fieldnames})  # Keep only valid fields

except FileNotFoundError:
    print(f"Error: The file {csv_file_name} was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

# Write the updated rows to a new CSV file
try:
    with open(csv_file_name, mode="w", encoding="utf-8-sig", newline="") as csv_file:
        csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        csv_writer.writeheader()
        csv_writer.writerows(translated_rows)

    print(f"Translation complete! Translated data saved to '{csv_file_name}'.")

except Exception as e:
    print(f"An error occurred while writing to the file: {e}")
