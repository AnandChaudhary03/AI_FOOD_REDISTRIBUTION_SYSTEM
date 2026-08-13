import random
from locust import HttpUser, task, between

class AnnaSetuLoadTestUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_landing_and_health(self):
        self.client.get("/")

    @task(2)
    def test_pos_sync_sale_simulation(self):
        headers = {"X-API-Key": "pos_live_demo_test_key_12345"}
        payload = {
            "pos_provider": "Square",
            "register_id": "REG-LOADTEST",
            "items": [
                {
                    "barcode": "8901030800012",
                    "product_name": "Organic Milk",
                    "quantity_sold": random.choice([1, 2, 5])
                }
            ]
        }
        self.client.post("/api/v1/pos/sync-sale", json=payload, headers=headers)

    @task(1)
    def test_pos_inventory_sync(self):
        headers = {"X-API-Key": "pos_live_demo_test_key_12345"}
        payload = {
            "pos_provider": "Toast",
            "items": [
                {
                    "product_name": f"Batch Item #{random.randint(100, 999)}",
                    "category": "Bakery",
                    "quantity": random.randint(10, 100),
                    "unit": "pieces"
                }
            ]
        }
        self.client.post("/api/v1/pos/sync-inventory", json=payload, headers=headers)
