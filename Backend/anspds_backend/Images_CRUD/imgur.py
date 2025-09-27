import requests

IMGUR_CLIENT_ID = 'b4f339706bb7962'

def upload_image_to_imgur(image_file):
    headers = {
        'Authorization': f'Client-ID {IMGUR_CLIENT_ID}'
    }
    
    files = {
        'image': image_file
    }

    response = requests.post("https://api.imgur.com/3/image", headers=headers, files=files)
    
    if response.status_code == 200:
        return response.json()['data']['link']
    else:
        print(response.text)
        raise Exception(f"Failed to upload image: {response.status_code}, {response.text}")
    

def validateImage(path):
    return True