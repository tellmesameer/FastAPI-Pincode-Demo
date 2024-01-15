# fastapi_views.py
from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

@router.get("/get_details/{input}", response_model=dict)
async def get_pincode_details(input: str):
    api_url = ''

    if input.isdigit():  # Check if the input is a number (PIN code)
        api_url = f'https://api.postalpincode.in/pincode/{input}'
    else:
        api_url = f'https://api.postalpincode.in/postoffice/{input}'

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        print(type(data))
        print(data)
        return data[0]  # Assuming that the response structure is a list, and we take the first item
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data from API: {str(e)}")
