import requests
from PIL import Image, ImageEnhance, ImageFilter
from ultralytics import YOLO
import pytesseract
import cv2
import numpy as np
import os
import matplotlib.pyplot as plt

model = YOLO("anspds_backend/model/d1-40e.pt")

if os.name == 'nt': 
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
else:  
    pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

def preprocess_image_for_ocr(image):
    """
    Preprocess the image to enhance text for better OCR recognition.
    """
    gray = image.convert('L')
    enhancer = ImageEnhance.Contrast(gray)
    gray = enhancer.enhance(2)
    gray = gray.filter(ImageFilter.MedianFilter(3))
    np_image = np.array(gray)
    _, binary_image = cv2.threshold(np_image, 150, 255, cv2.THRESH_BINARY)
    processed_image = Image.fromarray(binary_image)
    
    return processed_image

def visualize_bounding_boxes(image, bounding_boxes):
    """
    Visualize the bounding boxes on the original image.
    """
    np_image = np.array(image)
    np_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)

    for box in bounding_boxes:
        x, y, w, h = box
        cv2.rectangle(np_image, (x, y), (x + w, y + h), (0, 255, 0), 4)

    np_image = cv2.cvtColor(np_image, cv2.COLOR_BGR2RGB)
    plt.imshow(np_image)
    plt.axis('off')
    plt.show()
    cv2.imwrite("debug_bounding_boxes.jpg", np_image)

def detect_number_plates(image):
    """
    Detect number plates using YOLOv8 and return bounding boxes.
    """
    try:
        # Run YOLO detection
        img_cv = np.array(image)
        results = model(img_cv)[0]  # Get the prediction results

        bounding_boxes = []
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            if score > 0.8:  # Confidence threshold
                # Draw bounding boxes with cv2 on the image
                cv2.rectangle(img_cv, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
                cv2.putText(img_cv, f"{results.names[int(class_id)]} {score:.2f}", (int(x1), int(y1 - 10)),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)
                # Append bounding box info to the list
                bounding_boxes.append([int(x1), int(y1), int(x2 - x1), int(y2 - y1)])  # (x, y, w, h)

        # Visualize bounding boxes on the image
        visualize_bounding_boxes(image, bounding_boxes)
        return bounding_boxes

    except Exception as e:
        raise Exception(f"Error detecting number plates: {e}")

def perform_ocr(image, bounding_boxes):
    """
    Perform OCR on detected bounding boxes to extract the text from the number plates.
    """
    detected_texts = []
    for x, y, w, h in bounding_boxes:
        cropped_image = image.crop((x, y, x + w, y + h))
        #preprocessed_image = preprocess_image_for_ocr(cropped_image)
        cropped_image.save(f"debug_cropped_{x}_{y}.jpg")
        text = pytesseract.image_to_string(cropped_image, lang="eng")
        detected_texts.append(text.strip())
    return detected_texts