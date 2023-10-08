import os
from requests import Session
import time
import logging

# Set the download directory where data will be saved
download_dir = "hls_data_F"

# Define the date range (start and end dates)
start_date = "2021-06-10"  # Replace with your start date
end_date = "2021-06-20"  # Replace with your end date

# Earthdata Login credentials (replace with your own Earthdata token)
earthdata_token = "eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imlkc2dyb3VwMSIsImV4cCI6MTcwMTEyNTc2NCwiaWF0IjoxNjk1OTQxNzY0LCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.2PmdKdzph2eqSNOsYzeG4UAI61wsDkEHDunhj9qqtcTscIdPR9BW0yyTtDv9XJ1OVqTWV0TIYy1cWpQsGBMLhf_9LEUSLoERiTvUxT4SynkMWxOlNps1K9A2ubUIPwVSwNOYEG2t4mJaUPbeci51e5nX6ybCyoieKVJN9zt7yI6674G-th1lptHAa_y0Va5brHJnxLU1Ki2a2efsrZ3tYuFMUl82rsmR6XgeK_YFVu1URsEe4B9HmMCxf8zHVE0dyuIPezD_JMmtwsj_prZBI3YdAOvevMHjyV0jTaG34G6ZFKaz1exTIEa2wDO2lAeV8n-2nIk_PTJJB6-9Ab6Yhw"

# Specify the collection short_names and versions in a list
HLS_col = [
    {"short_name": "HLSS30", "version": "2.0"},
    {"short_name": "HLSL30", "version": "2.0"},
]

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

# Set up logging
log_file = os.path.join(download_dir, "download_log.txt")
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Define the Earthdata Search API endpoint
search_url = "https://cmr.earthdata.nasa.gov/search/granules.json"

# Specify the maximum allowed cloud cover percentage (10%)
max_cloud_cover = 30
with Session() as session:
    session.headers = {"Authorization": f"Bearer {earthdata_token}"}

    # Loop through the HLS_col list
    for collection_info in HLS_col:
        collection_short_name = collection_info["short_name"]
        collection_version = collection_info["version"]

        # Define the data request parameters for the current collection
        request_params = {
            "short_name": collection_short_name,
            "version": collection_version,
            "temporal": f"{start_date}T00:00:00Z,{end_date}T23:59:59Z",
            "bounding_box": f"{min_lon},{min_lat},{max_lon},{max_lat}",
            "page_size": 200,  # Adjust as needed
            "page_num": 1,
            # "token": earthdata_token,
        }

        # Submit the data request to Earthdata Search API for the current collection
        response = session.get(search_url, params=request_params)

        if response.status_code == 200:
            granules = response.json().get("feed", {}).get("entry", [])

            if not granules:
                print(
                    f"No data granules found for {collection_short_name} {collection_version}."
                )
            else:
                # Create a list of download URLs for the granules with cloud cover condition
                download_urls = []
                for g in granules:
                    cloud_cover = int(g.get("cloud_cover", "0"))
                    print(f"cloud cover is {cloud_cover} for granule {g}")
                    if cloud_cover <= max_cloud_cover:
                        print(
                            f"not adding because cloud_cover {cloud_cover} < {max_cloud_cover}"
                        )
                    links = g.get("links", [])
                    for link in links:
                        download_url = link.get("href", "")
                        if any(
                            layer in download_url
                            for layer in sentinel_layers + landsat_layers
                        ):
                            download_urls.append(download_url)

                # Download the granules with a retry mechanism
                max_retries = 1  # Maximum number of retries
                retry_delay = 1  # Delay between retries in seconds

                for url in download_urls:
                    retry_count = 0
                    while retry_count < max_retries:
                        # the s3 urls don't work
                        if "s3" in url:
                            print("skipping", url)
                            break

                        try:
                            response = session.get(url)
                            if response.status_code == 200:
                                # Save the file directly to the download directory
                                filename = os.path.join(
                                    download_dir, os.path.basename(url)
                                )
                                with open(filename, "wb") as f:
                                    f.write(response.content)
                                print(f"Downloaded: {filename}")
                                logging.info(f"Downloaded: {filename}")
                                break
                            else:
                                print("response is", response)
                                print(f"Failed to download {url}. Retrying...")
                                logging.warning(
                                    f"Failed to download {url}. Retrying..."
                                )
                                retry_count += 1
                                time.sleep(retry_delay)
                        except Exception as e:
                            print(f"Failed to download {url}. Retrying...")
                            logging.warning(f"Failed to download {url}. Retrying...")
                            retry_count += 1
                            time.sleep(retry_delay)
                    else:
                        # Max retries reached, give up on this granule
                        print(f"Failed to download {url} after {max_retries} retries.")
                        logging.error(
                            f"Failed to download {url} after {max_retries} retries."
                        )
        else:
            print(
                f"Data request for {collection_short_name} {collection_version} failed. Status code: {response.status_code}"
            )
            print(f"Response content: {response.content.decode('utf-8')}")
            logging.error(
                f"Data request for {collection_short_name} {collection_version} failed. Status code: {response.status_code}"
            )

    print("All downloads completed.")
