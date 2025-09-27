from ..firebase_config import db

def get_scan_status(image_id):
    # Query Firebase for the image document
    image_ref = db.collection('images').document(image_id)
    image_doc = image_ref.get()

    if not image_doc.exists:
        return {"status": "error", "message": "Image not found"}

    image_data = image_doc.to_dict()
    if image_data.get("scanned"):
        # Optionally fetch additional scan data if needed
        scan_data_ref = db.collection('scan_data').where("image_id", "==", image_id)
        scan_data = [doc.to_dict() for doc in scan_data_ref.stream()]
        return {"status": "success", "scanned": True, "scan_data": scan_data}
    else:
        return {"status": "success", "scanned": False}
