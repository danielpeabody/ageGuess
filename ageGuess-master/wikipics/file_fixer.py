import os
from PIL import Image

path = "/Users/rohan/OneDrive/Documents/AAwikiphotos"

count = 0

for filename in os.listdir(path):
    if filename.endswith(".jpg") or filename.endswith(".jpeg"):
        try:
            with Image.open(os.path.join(path, filename)) as img:
                img.verify()
        except Exception as e:
            print(f"Corrupted file: {filename}")
            try:
                with Image.open(os.path.join(path, filename)) as img:
                    img.save(os.path.join(path, filename))
                    print(f"File {filename} fixed")
            except Exception as e:
                print(f"Failed to fix file: {filename}")
                count += 1
print(f"Total corrupted files: {count}")
