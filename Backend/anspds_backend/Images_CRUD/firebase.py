from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .imgur import upload_image_to_imgur
from ..firebase_config import db
from ..utils import imageVerifier
import time

class ImageDBFunction(APIView):
    
    parser_classes = [MultiPartParser, FormParser]  
    def get(self, request):
        if 'filter' in request.path:  
            username = request.query_params.get('username', None)

            if not username:
                return Response({"error": "Username query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

            image_ref = db.collection('images')
            query = image_ref.where('uploaded_by_username', '==', username)
            docs = query.stream()

            items = [doc.to_dict() for doc in docs]
            return Response(items, status=status.HTTP_200_OK)
        
        image_ref = db.collection('images')
        docs = image_ref.stream()

        items = [doc.to_dict() for doc in docs]
        return Response(items, status=status.HTTP_200_OK)


    
    def getByUsername(self, request):
        username = request.query_params.get('username', None)

        if not username:
            return Response({"error": "Username query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        image_ref = db.collection('images')
        query = image_ref.where('uploaded_by_username', '==', username)
        docs = query.stream()

        items = [doc.to_dict() for doc in docs]

        return Response(items, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.data.get('username')
        image_file = request.FILES.get('image')  

        print("starting")
        
        if not username or not image_file:
            return Response({"error": "Username and image are required"}, status=status.HTTP_400_BAD_REQUEST)

        print("starting2")
        if not imageVerifier.validate_image_file(image_file):
            return Response({"error": "Invalid image"}, status=400)

        print("starting3")

        try:
            id = self.gen_id(username)
            url = upload_image_to_imgur(image_file)
            print("uploaded")

            item_ref = db.collection('images').document(id).set({
                'id': id,
                'uploaded_by_username': username,
                'url': url,
                'uploaded_on': datetime.now().isoformat(),
                'scanned': False
            })

            print("responding", id)
            return Response({"id": id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def gen_id(self, username):
        time.sleep(1)
        print('generating id')
        image_ref = db.collection('images')
        try:
            docs = image_ref.where('uploaded_by_username', '==', username).stream()
        except Exception as e:
            print(f"Error: {e}")
            return None
        print('generating id 2')

        ids = [int(doc.to_dict().get("id", "0")[len(username) + 1:]) for doc in docs]
        if ids:
            highest_id = sorted(ids, reverse=True)[0]
        else:
            highest_id = 0

        new_id = highest_id + 1
        print('generated id')
        return username + '-' + str(new_id)
