import math
import requests
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Beach
from .serializers import BeachSerializer


def parse_coordinates(lat, lon):
    try:
        return float(lat), float(lon)
    except (TypeError, ValueError):
        return None, None


@api_view(["GET"])
def get_weather(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if not lat or not lon:
        return Response({"error": "Latitude and longitude required"}, status=400)

    latitude, longitude = parse_coordinates(lat, lon)

    if latitude is None or longitude is None:
        return Response({"error": "Invalid latitude or longitude"}, status=400)

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        return Response({"error": "Unable to fetch weather data right now"}, status=502)

    return Response(data)


@api_view(["GET"])
def get_beaches(request):
    beaches = Beach.objects.all()
    serializer = BeachSerializer(beaches, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_beach_detail(request, id):
    beach = get_object_or_404(Beach, id=id)
    serializer = BeachSerializer(beach)
    return Response(serializer.data)


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


@api_view(["GET"])
def nearest_beaches(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if not lat or not lon:
        return Response({"error": "Latitude and longitude required"}, status=400)

    lat, lon = parse_coordinates(lat, lon)

    if lat is None or lon is None:
        return Response({"error": "Invalid latitude or longitude"}, status=400)

    beaches = Beach.objects.all()

    beach_distances = []

    for beach in beaches:
        distance = calculate_distance(
            lat, lon, beach.latitude, beach.longitude
        )

        beach_distances.append({
            "id": beach.id,
            "name": beach.name,
            "latitude": beach.latitude,
            "longitude": beach.longitude,
            "city": beach.city,
            "state": beach.state,
            "water_quality": beach.water_quality,
            "crowd_density": beach.crowd_density,
            "distance_km": round(distance, 2)
        })

    beach_distances.sort(key=lambda x: x["distance_km"])

    return Response(beach_distances[:5])
