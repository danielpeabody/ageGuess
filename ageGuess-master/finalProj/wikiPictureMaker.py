import requests
import os
from bs4 import BeautifulSoup
import time


with open('/Users/rohan/OneDrive/Desktop/CS_Projects/finalProj/wikiLinks.txt', 'r') as file:
    lines = file.readlines()



path_to_folder = '/Users/rohan/OneDrive/Documents/AAwikiphotos'

for wikilink in lines:
     time.sleep(1)
     url = 'https://en.wikipedia.org'+ wikilink.strip()
     response = requests.get(url)
     soup = BeautifulSoup(response.content, 'html.parser')
     image = soup.find('a', {'class': 'image'})
     if image == None:
         continue
     else:
         image = image.find('img')
        
     bday = soup.find('span', {'class': 'bday'})
     date_pic_taken = soup.find('div', {'class': 'infobox-caption'})

     if (image and bday and date_pic_taken):
        bday = bday.text.split('-')
        bday_year = bday[0]
        date_pic_taken = date_pic_taken.text
        image_url = 'https:' + image['src']
        response = requests.get(image_url)

        newDate = date_pic_taken.split(" ")

        for word in newDate:
            if word.isdigit() and len(word) == 4:
                newDate = word
        
        if isinstance(newDate, list):
            continue

        fullName = wikilink[5:].strip()
        
        filename = f"{path_to_folder}{fullName}-{bday_year}-{newDate}.jpeg"
        with open(os.path.join(path_to_folder, filename), 'wb') as f:
            f.write(response.content)
            print(f"{path_to_folder}{fullName}-{bday_year}-{newDate}.jpeg has been written!")
     

