from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from multiprocessing import Pool
import csv

# List of URLs to scrape + college name
catalog_urls = [
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGLAS/", "UGLAS"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGACT/", "UGACT"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGAGL/", "UGAGL"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGART/", "UGART"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGBUS/", "UGBUS"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGCMN/", "UGCMN"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGDCP/", "UGDCP"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGEDU/", "UGEDU"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/", "UGENG"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGHHU/", "UGHHU"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGJRC/", "UGJRC"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGNTR/", "UGNTR"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGNUR/", "UGNUR"),
    ("https://catalog.ufl.edu/UGRD/colleges-schools/UGPBH/", "UGPBH")
]

def scrape_catalog_page(args):
    catalog_url, college_id = args
    driver = webdriver.Chrome()
    driver.get(catalog_url)
    wait = WebDriverWait(driver, 10)
    data = []

    wait.until(EC.presence_of_element_located((By.XPATH, "//aside")))
    sidebar = driver.find_element(By.XPATH, "//aside")
    majors = sidebar.find_elements(By.XPATH, ".//li/a")

    for i in range(len(majors)):
        sidebar = driver.find_element(By.XPATH, "//aside")
        majors = sidebar.find_elements(By.XPATH, ".//li/a")
        major = majors[i]

        if "Minor" in major.text or "Certificate" in major.text:
            continue

        try:
            program_name = major.text
            major_url = major.get_attribute("href")
            driver.get(major_url)

            # Check for subsections within the major page
            try:
                levelfour_nav = driver.find_elements(By.CSS_SELECTOR, ".nav.levelfour a")

                if levelfour_nav:
                    subsection_links = [(elem.get_attribute("href"), elem.text) for elem in levelfour_nav]

                    for subsection_url, subsection_name in subsection_links:
                        driver.get(subsection_url)

                        try:
                            model_plan_tab = driver.find_element(
                                By.XPATH, "//a[@href='#modelsemesterplantextcontainer' and text()='Model Semester Plan']"
                            )
                            ActionChains(driver).move_to_element(model_plan_tab).click(model_plan_tab).perform()
                            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "sc_plangrid")))

                            plan_grid = driver.find_element(By.CLASS_NAME, "sc_plangrid")
                            plan_html = plan_grid.get_attribute("outerHTML")

                        except:
                            plan_html = "<p>Model semester plan not available</p>"

                        data.append([college_id, f"{program_name} - {subsection_name}", plan_html])

                else:
                    # If no subsections exist
                    try:
                        model_plan_tab = driver.find_element(
                            By.XPATH, "//a[@href='#modelsemesterplantextcontainer' and text()='Model Semester Plan']"
                        )
                        ActionChains(driver).move_to_element(model_plan_tab).click(model_plan_tab).perform()
                        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "sc_plangrid")))

                        plan_grid = driver.find_element(By.CLASS_NAME, "sc_plangrid")
                        plan_html = plan_grid.get_attribute("outerHTML")

                    except:
                        plan_html = "<p>Model semester plan not available</p>"

                    data.append([college_id, program_name, plan_html])

            except Exception as e:
                print(f"Error accessing subsections for {program_name}: {e}")

        except Exception as e:
            print(f"Error accessing program {major.text}: {e}")

        driver.get(catalog_url)
        wait.until(EC.presence_of_element_located((By.XPATH, "//aside")))

    driver.quit()
    return data

# Write results to CSV
def write_results_to_csv(results):
    with open("uf_program_data.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["College", "Program", "Semester Plan HTML"])
        for result in results:
            for row in result:
                writer.writerow(row)

if __name__ == "__main__":
    # Scrape each catalog page in parallel to speed up process
    with Pool(processes=len(catalog_urls)) as pool:
        results = pool.map(scrape_catalog_page, catalog_urls)

    # Write all results to a single CSV file
    write_results_to_csv(results)
