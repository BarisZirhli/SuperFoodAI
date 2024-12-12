import requests
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time


csv_file_name = "recipes_eng.csv"
new_csv = "newRecipe.csv"
image_list = []

# Function to search for images using Google Images
def search_photos(query: str) -> str:
    # Create Chrome options to run headless
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    
    # Initialize the WebDriver with the specified options
    driver = webdriver.Chrome(options=chrome_options)
    
    # Google search URL for images
    search_url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"
    driver.get(search_url)

    try:
        # Find the first image thumbnail and click on it
        first_thumbnail = driver.find_element(
            By.CSS_SELECTOR,
            "#hdtb-sc > div > div.qogDvd > div.crJ18e > div > div:nth-child(2) > a > div",
        )
        first_thumbnail.click()
        time.sleep(3)  # Wait for the image to load

        # Click on the full-size image to open it
        full_image = driver.find_element(
            By.XPATH,
            "/html/body/div[3]/div/div[15]/div/div[2]/div[2]/div/div/div/div/div[1]/div/div/div[1]/div[2]/h3/a/div/div/div/g-img/img",
        )
        full_image.click()
        time.sleep(3)  # Wait for the full-size image to load

        # Locate the image URL and extract the src attribute
        img_url = driver.find_element(
            By.CSS_SELECTOR,
            "#Sva75c > div.A8mJGd.NDuZHe > div.LrPjRb > div > div.BIB1wf.EIehLd.fHE6De.Emjfjd > c-wiz > div > div.v6bUne > div.p7sI2.PUxBg > a > img.sFlh5c.FyHeAf.iPVvYb",
        )
       
        src = img_url.get_attribute("src")
        return src if src else "No image found."

    except Exception as e:
        return f"Error: {e}"

    finally:
        driver.quit()  # Close the browser after scraping

# Open and process the CSV file with the recipe data
with open(csv_file_name, mode="r", encoding="utf-8") as file:
    csv_reader = csv.DictReader(file)
    fieldnames = csv_reader.fieldnames

    for row in csv_reader:
        # If there's no image URL, scrape one using the recipe name
        if row["Images"] == "character(0)" or not row["Images"]:
            photo_url = search_photos(row["Name"])
            if photo_url:
                row["Images"] = photo_url
                print(f"Image URL added for {row['Name']}: {photo_url}")
            else:
                print(f"No image found for {row['Name']}.")
        image_list.append(row)  # Add the updated row to the image list

# Save the updated CSV file with the new image URLs
try:
    with open(new_csv, mode="w", encoding="utf-8-sig", newline="") as csv_file:
        csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        csv_writer.writeheader()  # Write the header
        csv_writer.writerows(image_list)  # Write all the rows with updated image URLs

    print(f"Image URLs added successfully to '{new_csv}'.")

except Exception as e:
    print(f"An error occurred while writing to the file: {e}")
