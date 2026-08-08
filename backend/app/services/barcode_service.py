import httpx
from typing import Optional

OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"

HEADERS = {
    "User-Agent": "AnnaSetu-Food-Redistribution-Platform/1.0"
}


async def lookup_barcode(barcode: str) -> Optional[dict]:
    """
    Look up product information from OpenFoodFacts using barcode.
    """

    clean_barcode = barcode.strip().replace("\n", "").replace("\r", "")

    if not clean_barcode or not clean_barcode.isdigit():
        return {
            "barcode": barcode,
            "found": False,
            "product_name": "",
            "category": ""
        }

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            headers=HEADERS,
            follow_redirects=True
        ) as client:

            url = OPENFOODFACTS_URL.format(barcode=clean_barcode)
            response = await client.get(url)

            print("Request URL:", url)
            print("Status Code:", response.status_code)

            if response.status_code != 200:
                return {
                    "barcode": clean_barcode,
                    "found": False,
                    "product_name": "",
                    "category": ""
                }

            data = response.json()

            print("API Response:", data)

            if data.get("status") != 1:
                return {
                    "barcode": clean_barcode,
                    "found": False,
                    "product_name": "",
                    "category": ""
                }

            product = data.get("product", {})

            return {
                "barcode": clean_barcode,
                "product_name": (
                    product.get("product_name")
                    or product.get("product_name_en")
                    or "Scanned Product"
                ),
                "category": extract_category(product),
                "brand": product.get("brands", ""),
                "image_url": product.get("image_url", ""),
                "quantity": 1,
                "unit": "kg",
                "found": True,
                "source": "openfoodfacts"
            }

    except httpx.RequestError as e:
        print("HTTP Error:", e)

    except Exception as e:
        print("Barcode lookup error:", e)

    return {
        "barcode": clean_barcode,
        "found": False,
        "product_name": "",
        "category": ""
    }


def extract_category(product: dict) -> str:
    """
    Extract first readable category from OpenFoodFacts response.
    """

    categories = product.get("categories", "")

    if categories:
        for category in categories.split(","):
            category = category.strip()

            if not category.startswith("en:"):
                return category

    return (
        product.get("food_groups")
        or product.get("food_groups_en")
        or "General"
    )