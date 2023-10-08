import os
from requests import Session

# Set the download directory where data will be saved
download_dir = "hls_data"

# Define the date range (start and end dates)
start_date = "2020-06-01"  # Replace with your start date
end_date = "2020-06-30"  # Replace with your end date

# Earthdata Login credentials
earthdata_token = "eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imlkc2dyb3VwMSIsImV4cCI6MTcwMTI5MTU1MiwiaWF0IjoxNjk2MTA3NTUyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.OYk9BsWiHb-U-pDii3R7glPViqks1ZPMruWOBb2YPvQbutdKMPIxPvXoy3WMHRD5YOvTPU8vmdM0O5HOuVvxIer6m7TIE6wfgaf4wQAX8Tpqcl3eUkVeggzY6KE8p2ZkA_KGnos2Qp_0-FTKtK_a7naM1WeAvgJsOkqiAiIPlkcKavpFAR5lCLJHU58z8U6vCUtGkYd8rYcsHvUjbpdhC8txTe1lNywmZZ9cRfo11S4gLyXqlmguq8u8j7jELVMIzCFi1hkNhhBgI8l5Hak4uTs_XgNqI-RzjSgGVT43KRTNa3eKTQfW1yS1eUVs7gWBHHF9U7o8WA6fuShwzTQNgA"

# Specify the collection short_name and version
collection_short_name = "HLSS30"
collection_version = "2.0"

# Define the bounding box coordinates (10 km by 10 km around a specific location in California)
# Replace with the actual coordinates you want to use
min_lon = -120.0  # Minimum longitude
max_lon = -119.9  # Maximum longitude
min_lat = 36.5  # Minimum latitude
max_lat = 36.6  # Maximum latitude

# Specify the desired layers (bands) for Sentinel-2 and Landsat 8
# Sentinel 2 layers
sentinel_layers = ["B8A", "B04", "Fmask"]
# Landsat 8 layers
landsat_layers = ["B05", "B04", "Fmask"]

# Create the download directory if it doesn't exist
os.makedirs(download_dir, exist_ok=True)

# Define the Earthdata Search API endpoint
search_url = "https://cmr.earthdata.nasa.gov/search/granules.json"

# Define the data request parameters, including short_name and version
request_params = {
    "short_name": collection_short_name,
    "version": collection_version,
    "temporal": f"{start_date}T00:00:00Z,{end_date}T23:59:59Z",
    "bounding_box": f"{min_lon},{min_lat},{max_lon},{max_lat}",
    "page_size": 200,  # Adjust as needed
    "page_num": 1,
}


with Session() as session:
    session.headers = {"Authorization": f"Bearer {earthdata_token}"}

    # Submit the data request to Earthdata Search API
    response = session.get(search_url, params=request_params)

    if not response.ok:
        print("Got response code", response.status_code)
        if response.status_code == 401:
            print(
                f"Earthdata Login reponded with Unauthorized, did you enter a valid token?"
            )
            exit()
        if response.status_code == 400:
            print(
                f"The top level URL does not exist, select a URL within https://asdc.larc.nasa.gov/data/"
            )
            exit()

    if response.status_code == 200:
        granules = response.json().get("feed", {}).get("entry", [])

        if not granules:
            print("No data granules found for the specified bounding box.")
        else:
            # Create a list of download URLs for the granules with the desired layers
            download_urls = []
            for g in granules:
                links = g.get("links", [])
                for link in links:
                    if any(
                        layer in link.get("title", "")
                        for layer in sentinel_layers + landsat_layers
                    ):
                        download_urls.append(link["href"])

            # Download the granules
            for url in download_urls:
                response = session.get(url)
                if response.status_code == 200:
                    with open(
                        os.path.join(download_dir, url.split("/")[-1]), "wb"
                    ) as f:
                        f.write(response.content)
                    print(f"Downloaded: {url}")
                else:
                    print(f"Failed to download: {url}")
                    print(f"Response content: {response.content.decode('utf-8')}")
    else:
        print(f"Data request failed. Status code: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")

    print("All downloads completed.")
