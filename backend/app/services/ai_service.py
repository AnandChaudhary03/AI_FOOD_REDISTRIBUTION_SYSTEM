from datetime import datetime
from typing import List, Optional
import math

def calculate_urgency_score(expiry_date: Optional[datetime], quantity: float) -> float:
    """AI urgency score: 0-100. Higher = needs donation sooner."""
    if not expiry_date:
        return 20.0
    now = datetime.utcnow()
    days_to_expiry = (expiry_date - now).days
    if days_to_expiry < 0:
        return 100.0  # Already expired
    elif days_to_expiry <= 1:
        return 95.0
    elif days_to_expiry <= 3:
        return 85.0
    elif days_to_expiry <= 7:
        return 70.0
    elif days_to_expiry <= 14:
        return 50.0
    elif days_to_expiry <= 30:
        return 30.0
    else:
        score = max(5.0, 30.0 - (days_to_expiry - 30) * 0.5)
        return round(score, 2)

def calculate_match_score(donation_quantity: float, ngo_capacity: float = 100.0) -> float:
    """Match score between donation and NGO capacity."""
    if ngo_capacity <= 0:
        return 50.0
    ratio = donation_quantity / ngo_capacity
    if ratio <= 1.0:
        return round(min(95.0, 60.0 + ratio * 35.0), 2)
    else:
        return round(max(20.0, 95.0 - (ratio - 1) * 30.0), 2)

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in km between two coordinates."""
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return round(2 * R * math.asin(math.sqrt(a)), 2)

def get_surplus_predictions(inventory_items: list) -> list:
    """Return items sorted by urgency with AI recommendations."""
    for item in inventory_items:
        if hasattr(item, 'expiry_date'):
            item.ai_urgency_score = calculate_urgency_score(item.expiry_date, item.quantity)
    return sorted(inventory_items, key=lambda x: getattr(x, 'ai_urgency_score', 0), reverse=True)

def get_waste_saved_kg(delivered_donations: list) -> float:
    return sum(d.quantity for d in delivered_donations if d.status == "delivered")

def co2_saved_kg(food_kg: float) -> float:
    """Approximate CO2 saved: 2.5 kg CO2 per kg food saved."""
    return round(food_kg * 2.5, 2)
