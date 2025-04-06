#!/usr/bin/env python3
import os
import tarfile
import csv
import requests
import xml.etree.ElementTree as ET

# --- Configuration ---
DOWNLOAD_URL = "https://download.freedict.org/dictionaries/rus-ita/2024.10.10/freedict-rus-ita-2024.10.10.src.tar.xz"
ARCHIVE_FILENAME = "freedict-rus-ita-2024.10.10.src.tar.xz"
EXTRACT_DIR = "dictionary_extracted"
TEI_SUBDIR = "rus-ita"       # Folder created upon extraction
TEI_FILENAME = "rus-ita.tei"  # Main TEI file
CSV_FILENAME = "russian_italian_dictionary.csv"

def download_archive():
    """Downloads the dictionary archive if it doesn't already exist."""
    if not os.path.exists(ARCHIVE_FILENAME):
        print("Downloading archive from:", DOWNLOAD_URL)
        response = requests.get(DOWNLOAD_URL, stream=True)
        if response.status_code == 200:
            with open(ARCHIVE_FILENAME, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            print("Download completed.")
        else:
            print("Error: Could not download file. HTTP status code:", response.status_code)
            exit(1)
    else:
        print("Archive already exists, skipping download.")

def extract_archive():
    """Extracts the tar.xz archive into the designated directory."""
    if not os.path.exists(EXTRACT_DIR):
        os.makedirs(EXTRACT_DIR)
    print("Extracting the archive...")
    try:
        with tarfile.open(ARCHIVE_FILENAME, "r:xz") as tar:
            tar.extractall(path=EXTRACT_DIR, filter=lambda *args: args[0])
        print("Extraction completed. Files extracted to:", EXTRACT_DIR)
    except Exception as e:
        print("Error during extraction:", e)
        exit(1)

def parse_tei_to_csv(tei_path, csv_path):
    """
    Parses a Freedict TEI file (rus-ita.tei) and writes a CSV with two columns:
    [Russian, Italian].
    """
    print(f"Parsing TEI file: {tei_path}")
    tree = ET.parse(tei_path)
    root = tree.getroot()

    # Remove namespaces for easier querying
    for elem in root.iter():
        if '}' in elem.tag:
            elem.tag = elem.tag.split('}', 1)[1]

    with open(csv_path, "w", encoding="utf-8", newline="") as outfile:
        writer = csv.writer(outfile)
        writer.writerow(["Russian", "Italian"])  # CSV header

        # Loop through all <entry> elements.
        for entry in root.findall(".//entry"):
            # Extract the Russian lemma: <form><orth>...</orth></form>
            lemma_elements = entry.findall(".//form/orth")
            if not lemma_elements:
                continue
            lemma_text = lemma_elements[0].text.strip() if lemma_elements[0].text else ""
            if not lemma_text:
                continue

            # Extract Italian translations: <sense><cit type="trans"><quote>...</quote></cit></sense>
            translation_elements = entry.findall(".//sense/cit[@type='trans']/quote")
            translations = [t.text.strip() for t in translation_elements if t is not None and t.text]
            if not translations:
                continue

            translations_str = "; ".join(translations)
            writer.writerow([lemma_text, translations_str])

    print(f"CSV conversion completed. File saved as: {csv_path}")

def main():
    download_archive()
    extract_archive()
    
    # Construct the path to the TEI file.
    tei_path = os.path.join(EXTRACT_DIR, TEI_SUBDIR, TEI_FILENAME)
    if not os.path.exists(tei_path):
        print(f"Error: Could not find TEI file at {tei_path}. Check your extraction path.")
        exit(1)
    
    parse_tei_to_csv(tei_path, CSV_FILENAME)
    
    # Display the resulting CSV content.
    print("\n--- CSV File Content ---")
    with open(CSV_FILENAME, "r", encoding="utf-8") as f:
        print(f.read())

if __name__ == "__main__":
    main()

