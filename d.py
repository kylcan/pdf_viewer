import pandas as pd
import re
import requests
import os
import csv
from urllib.parse import quote
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from utils import download_pdf
import atexit
import logging
import time
import random

def cleanup(logger):
    for handler in logger.handlers:
        handler.flush()
        handler.close()

def extract_title(line):
    """从一行中提取标题"""
    return re.sub(r'^.*?\](?!.*\])\s*', '', line)

def process_title(title):
    """处理单个标题：查询 arXiv、下载 PDF"""
    title_clean = title.strip().lower()
    search_query = quote(title_clean)
    search_url = f"https://arxiv.org/search/?query={search_query}&searchtype=all&abstracts=show&order=-announced_date_first&size=25"

    try:
        response = requests.get(search_url, timeout=300)  # 设置超时时间
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            result_list = soup.find_all("li", class_="arxiv-result")

            delay = random.uniform(2, 5)  # 随机暂停 2~5 秒
            time.sleep(delay)

            if result_list:
                for result in result_list:
                    pdf_link = result.find("a", attrs={"href": re.compile(r"\/pdf")})["href"]
                    pdf_name = pdf_link.split("/")[-1].replace(".", "_") + ".pdf"
                    pdf_path = os.path.join(download_dir, pdf_name)

                    # 只有当 PDF 不存在时才下载
                    if not os.path.exists(pdf_path):
                        download_pdf(pdf_link, pdf_name, download_dir)
                    else:
                        print(f"{pdf_name} 已存在")
                    return

            else:
                logger.error(title_clean)
        else:
            logger.error(title_clean)
    except Exception as e:
        print(f"错误: {e}")
        logger.error(title_clean)

if __name__ == "__main__":
    # 文件路径
    file_path = "/Users/mima0000/Desktop/Graduation_design/target_pdf_result_" + input(f"batch:") + ".csv"
    download_dir = "/Users/mima0000/Desktop/Graduation_design/" + input(f"download_dir: /Users/mima0000/Desktop/Graduation_design/")
    failed_file = "/Users/mima0000/Desktop/Graduation_design/" + input(f"failed_file: /Users/mima0000/Desktop/Graduation_design/")
    numworkers = int(input("numworkers: "))
    start = int(input("start: "))
    
    print(file_path)
    print(download_dir)
    print(failed_file)

    # 读取数据
    df = pd.read_csv(file_path, usecols=["IntroRefer"])
    df = df.iloc[start:]

    # 确保下载目录存在
    os.makedirs(download_dir, exist_ok=True)

    logging.basicConfig(filename=failed_file, level=logging.INFO, format="%(message)s")
    logger = logging.getLogger(__name__)

    atexit.register(cleanup, logger)

    # 使用多线程
    with ThreadPoolExecutor(max_workers=numworkers) as executor:
        futures = []

        for index, row in df.iterrows():
            text = str(row["IntroRefer"])

            # 先按换行拆分
            lines = text.split("\n")
            # 使用 extract_title 解析每一行的标题
            titles = [extract_title(line) for line in lines if "]" in line]

            for title in titles:
                # print(title)
                futures.append(executor.submit(process_title, title))

        # 等待所有任务完成
        for future in as_completed(futures):
            future.result()  # 捕获异常，确保不影响其他任务

#2747