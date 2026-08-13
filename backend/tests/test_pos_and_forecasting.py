from app.services.ai_service import calculate_urgency_score, calculate_match_score, haversine_distance
from app.services.forecasting_service import predict_product_demand, calculate_reorder_recommendations

def test_ai_urgency_score_calculation():
    score_expired = calculate_urgency_score(None, 10.0)
    assert score_expired == 20.0
    
    match_score = calculate_match_score(50.0, 100.0)
    assert match_score > 60.0

def test_haversine_distance():
    # Distance between Delhi and Gurgaon approx 25-30km
    dist = haversine_distance(28.6139, 77.2090, 28.4595, 77.0266)
    assert dist > 0
    assert dist < 50.0

def test_demand_forecasting_algorithm():
    forecast = predict_product_demand("Organic Whole Milk 1L", "Dairy", current_quantity=20.0)
    assert "predicted_daily_demand" in forecast
    assert forecast["predicted_7day_demand"] > 0
    assert forecast["days_to_stockout"] > 0

class DummyItem:
    def __init__(self, id, name, cat, qty, unit):
        self.id = id
        self.product_name = name
        self.category = cat
        self.quantity = qty
        self.unit = unit
        self.expiry_date = None

def test_smart_reorder_recommendation_engine():
    items = [
        DummyItem(1, "Whole Milk", "Dairy", 2.0, "litres"),
        DummyItem(2, "Wheat Flour", "Grains", 50.0, "kg")
    ]
    reorders = calculate_reorder_recommendations(items, storage_capacity_limit=500.0)
    assert len(reorders) == 2
    # Whole milk at 2.0 litres should trigger reorder
    milk_item = next(r for r in reorders if r["product_name"] == "Whole Milk")
    assert milk_item["reorder_required"] == True
    assert milk_item["suggested_reorder_qty"] > 0
