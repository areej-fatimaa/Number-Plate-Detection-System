import firebase_admin
from firebase_admin import credentials, firestore

# Initialize the Firebase Admin SDK with the service account credentials
cred = credentials.Certificate('automated-number-plate-firebase-adminsdk-j9vf4-41e8921252.json')
firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

img_id = "affan-5"
doc_ref = db.collection("images").document(img_id)
doc = doc_ref.get()

if doc.exists:
    print("Document data:", doc.to_dict())
else:
    print(f"Document with imgId {img_id} not found.")
