import httpx
from typing import Optional

OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
HEADERS = {"User-Agent": "AnnaSetu - Food Redistribution Platform - Version 1.0"}

async def lookup_barcode(barcode: str) -> Optional[dict]:
    """Look up product info from OpenFoodFacts API using barcode."""
    clean_barcode = barcode.strip()
    if not clean_barcode:
        return {"barcode": barcode, "found": False, "product_name": "", "category": ""}

    try:
        async with httpx.AsyncClient(timeout=10.0, headers=HEADERS, follow_redirects=True) as client:
            response = await client.get(OPENFOODFACTS_URL.format(barcode=clean_barcode))
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == 1:
                    product = data.get("product", {})
                    return {
                        "barcode": clean_barcode,
                        "product_name": product.get("product_name") or product.get("product_name_en", "Scanned Product"),
                        "category": _extract_category(product),
                        "brand": product.get("brands", ""),
                        "image_url": product.get("image_url", ""),
                        "quantity": 1,
                        "unit": "kg",
                        "found": True,
                        "source": "openfoodfacts"
                    }
        return {"barcode": clean_barcode, "found": False, "product_name": "", "category": ""}
    except Exception as e:
        print(f"Barcode lookup error: {e}")
        return {"barcode": clean_barcode, "found": False, "product_name": "", "category": ""}

def _extract_category(product: dict) -> str:
    cats = product.get("categories", "")
    if cats:
        parts = [c.strip() for c in cats.split(",") if not c.strip().startswith("en:")]
        if parts:
            return parts[0]
    return product.get("food_groups", "") or "General"
