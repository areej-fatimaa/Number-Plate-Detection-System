from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..firebase_config import db

class ItemList(APIView):
    def get(self, request):
        items_ref = db.collection('items')
        docs = items_ref.stream()

        items = []
        for doc in docs:
            items.append(doc.to_dict())

        return Response(items)

    def post(self, request):
        data = request.data
        if 'name' in data and 'description' in data:
            item_ref = db.collection('items').add({
                'name': data['name'],
                'description': data['description']
            })
            return Response({"id": item_ref.id}, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
