from datetime import datetime
from ..firebase_config import db

class Image:
    def __init__(self, url, username):
        self.url = url
        self.username = username
        self.id = self.gen_id(username)
        self.uploaded_on = datetime.now().strftime("%Y%m%d%H%M%S")