import requests
import time
import random
import os

def get_page(url):
    response = requests.get(url)
    while response.status_code == 403:
        time.sleep(500 + random.uniform(0, 500))
        response = requests.get(url)
    if response.status_code == 200:
        print("Successfully access " + url)
        return response.text
    return None

def download_pdf(pdf_url, pdf_name, output_dir):
    response = requests.get(pdf_url) 
    while response.status_code == 403:
        time.sleep(500 + random.uniform(0, 500))
        response = requests.get(pdf_url)
    if response.status_code == 200:
        print("Successfully download " + pdf_url)
    with open(os.path.join(output_dir, '%s'%(pdf_name)), "wb") as fw:    
        fw.write(response.content)
    print("Successfully write " + pdf_name)