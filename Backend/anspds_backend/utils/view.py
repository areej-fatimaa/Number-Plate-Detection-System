from datetime import datetime
import requests
import json
from io import BytesIO
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image, UnidentifiedImageError
from anspds_backend.firebase_config import db
import logging

from anspds_backend.utils.yolov8_ocr_utils import detect_number_plates, perform_ocr

logger = logging.getLogger(__name__)

@csrf_exempt
def scan_image(request):
    if request.method == "POST":
        try:
            image = None
            image_id = None

            if 'image' in request.FILES:
                logger.info("Image file uploaded via form data")
                image_file = request.FILES['image']
                image = Image.open(image_file)
                image_id = request.POST.get("imageid")

            else:
                data = json.loads(request.body)
                img_url = data.get("imgUrl")
                image_id = data.get("imageId")

                if not img_url or not image_id:
                    logger.error("Missing imgUrl or imageId in the request")
                    return JsonResponse({"status": "error", "message": "Missing imgUrl or imageId"}, status=400)

                image_ref = db.collection('images').document(image_id)
                image_doc = image_ref.get()

                if not image_doc.exists:
                    return JsonResponse({"status": "error", "message": "Image with the provided ID does not exist"}, status=404)

                image_data = image_doc.to_dict()

                if image_data.get("scanned"):
                    scan_data_ref = db.collection('scan_data')
                    scan_data = scan_data_ref.where("image_id", "==", image_id).get()

                    if scan_data:
                        results = [doc.to_dict() for doc in scan_data]
                        return JsonResponse({"status": "success", "data": results}, status=200)
                    else:
                        return JsonResponse({"status": "error", "message": "Scan data not found in the database"}, status=404)

                logger.info(f"Fetching image from URL: {img_url}")
                response = requests.get(img_url, timeout=10)
                if response.status_code != 200 or "image" not in response.headers.get("Content-Type", ""):
                    logger.error(f"Failed to fetch image. HTTP Status: {response.status_code}")
                    return JsonResponse({"status": "error", "message": "Failed to fetch image from URL"}, status=500)

                image = Image.open(BytesIO(response.content))

            if not image_id:
                logger.error("Missing imageId in the request")
                return JsonResponse({"status": "error", "message": "Missing imageId"}, status=400)

            if image.mode != "RGB":
                image = image.convert("RGB")

            logger.info("Performing object detection and OCR")
            image_ref = db.collection('images').document(image_id)
            image_doc = image_ref.get()
            image_data = image_doc.to_dict()

            if image_data.get("scanned"):
                return JsonResponse({"status": "success", "message": "Image is already scanned"}, status=200)

            bounding_boxes = detect_number_plates(image)

            if not bounding_boxes:
                logger.warning("No number plates detected in image")
                return JsonResponse({
                    "status": "fail",
                    "message": "This image does not appear to contain a number plate."
                }, status=200)  # Still return 200 to indicate successful processing

            detected_texts = perform_ocr(image, bounding_boxes)

            if not detected_texts:
                logger.warning("OCR could not detect any text")
                return JsonResponse({
                    "status": "fail",
                    "message": "Text could not be detected in the identified regions."
                }, status=200)

            results = [{"bbox": bbox, "text": text} for bbox, text in zip(bounding_boxes, detected_texts)]

            logger.info(f"Updating image record in the database: {image_id}")
            image_ref.update({
                "scanned": True,
            })

            logger.info("Saving scan data in `scan_data` collection")
            scan_data_ref = db.collection('scan_data')
            scan_entry = {
                "image_id": image_id,
                "scan_timestamp": datetime.now().isoformat(),
                "results": results
            }
            scan_data_ref.add(scan_entry)

            return JsonResponse({"status": "success", "data": results}, status=200)

        except json.JSONDecodeError:
            logger.error("Invalid JSON format received")
            return JsonResponse({"status": "error", "message": "Invalid JSON format"}, status=400)
        except UnidentifiedImageError:
            logger.error("Uploaded file is not a valid image")
            return JsonResponse({"status": "error", "message": "Uploaded file is not a valid image"}, status=400)
        except Exception as e:
            logger.exception("Unexpected error during scan_image processing")
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": "error", "message": "Invalid HTTP method"}, status=405)
