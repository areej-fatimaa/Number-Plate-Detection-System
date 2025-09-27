from PIL import Image
from io import BytesIO
import magic

ALLOWED_FORMATS = ['JPEG', 'PNG', 'WEBP']

def validate_image_file(image_file):
    try:
        file_copy = BytesIO(image_file.read())
        image_file.seek(0)

        mime = magic.from_buffer(file_copy.getbuffer()[:2048], mime=True)
        if not mime.startswith('image/'):
            print("Magic error")
            return False, None

        img = Image.open(file_copy)
        img.verify()
        if img.format not in ALLOWED_FORMATS:
            print("format error")
            return False, None

        file_copy.seek(0)
        return True, file_copy
    except Exception:
        return False, None
