import requests
from bs4 import BeautifulSoup

url = 'https://en.wikipedia.org/wiki/List_of_The_Simpsons_guest_stars_(seasons_21%E2%80%93present)'
response = requests.get(url)

soup = BeautifulSoup(response.content, 'html.parser')
fn_elements = soup.find_all(class_='fn')
print('made it')

link_checked = []

with open('finalProj\wikiLinks.txt', 'w') as f:
    for fn in fn_elements:
        a_elements = fn.find_all('a')
        for a in a_elements:
            href = a.get('href')
            if (type(href) == str and href not in link_checked):
                f.write(href + '\n')
                link_checked.append(href)
                f.flush()

print('links written')



