from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils.db import get_scan_status

def check_scan_status(request, image_id):
    result = get_scan_status(image_id)
    if result["status"] == "error":
        return JsonResponse(result, status=404)
    return JsonResponse(result)



def get_data(request):
    data = {"message": "This is a GET request"}
    return JsonResponse(data)

@csrf_exempt
def post_data(request):
    if request.method == "POST":
        received_data = json.loads(request.body)
        response_data = {"message": "Data received", "data": received_data}
        return JsonResponse(response_data)
    return JsonResponse({"error": "Invalid request method"}, status=400)