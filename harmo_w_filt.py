import argparse, os, sys
from requests import Session

# Set the download directory where data will be saved
download_dir = "hls_data"

# Define the date range (start and end dates)
start_date = "2020-06-01"  # Replace with your start date
end_date = "2020-06-30"  # Replace with your end date

# Earthdata Login credentials
earthdata_token = "eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imlkc2dyb3VwMSIsImV4cCI6MTcwMTEyNTc2NCwiaWF0IjoxNjk1OTQxNzY0LCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.2PmdKdzph2eqSNOsYzeG4UAI61wsDkEHDunhj9qqtcTscIdPR9BW0yyTtDv9XJ1OVqTWV0TIYy1cWpQsGBMLhf_9LEUSLoERiTvUxT4SynkMWxOlNps1K9A2ubUIPwVSwNOYEG2t4mJaUPbeci51e5nX6ybCyoieKVJN9zt7yI6674G-th1lptHAa_y0Va5brHJnxLU1Ki2a2efsrZ3tYuFMUl82rsmR6XgeK_YFVu1URsEe4B9HmMCxf8zHVE0dyuIPezD_JMmtwsj_prZBI3YdAOvevMHjyV0jTaG34G6ZFKaz1exTIEa2wDO2lAeV8n-2nIk_PTJJB6-9Ab6Yhw"

# Specify the collection short_name and version
collection_short_name = "HLSS30"  # Sentinel
# collection_short_name = "HLSL30"  # Landsat
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

# Specify the maximum allowed cloud cover percentage (10% in this example)
max_cloud_cover_percentage = 75

# Create the download directory if it doesn't exist
os.makedirs(download_dir, exist_ok=True)

# Define the Earthdata Search API endpoint
search_url = "https://cmr.earthdata.nasa.gov/search/granules.json"


def download(layer_types, verbose=True, overwrite=False):
    layers = []
    if "HLSL" in layer_types:
        layers.extend(landsat_layers)
    if "HLSS" in layer_types:
        layers.extend(sentinel_layers)

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
                    f"Earthdata Login responded with Unauthorized, did you enter a valid token?"
                )
                exit()
            if response.status_code == 400:
                print(
                    f"The top-level URL does not exist, select a URL within https://asdc.larc.nasa.gov/data/"
                )
                exit()

        if response.status_code == 200:
            granules = response.json().get("feed", {}).get("entry", [])

            if not granules:
                print("No data granules found for the specified bounding box.")
            else:
                # Create a list of download URLs for the granules with the desired layers and cloud cover condition
                download_urls = []
                for g in granules:
                    cloud_cover = int(g.get("cloud_cover", 0))
                    links = g.get("links", [])
                    for link in links:
                        if (
                            any(layer in link.get("title", "") for layer in layers)
                            and cloud_cover <= max_cloud_cover_percentage
                        ):
                            download_urls.append(link["href"])

                # Download the granules
                for url in download_urls:
                    fname = url.split("/")[-1]
                    fpath = os.path.join(download_dir, fname)
                    if overwrite or not os.path.exists(fpath):
                        response = session.get(url)
                        if response.status_code == 200:
                            with open(fpath, "wb") as f:
                                f.write(response.content)
                            print(f"Downloaded: {url} to {fpath}")
                        else:
                            print(f"Failed to download: {url}")
                            if verbose:
                                print(
                                    f"Response content: {response.content.decode('utf-8')}"
                                )
                    elif verbose:
                        print(f"Skipping {fname}")
        else:
            print(f"Data request failed. Status code: {response.status_code}")
            if verbose:
                print(f"Response content: {response.content.decode('utf-8')}")

        print("All downloads completed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Download layers from one or more collections, HLSL or HLSS",
    )
    parser.add_argument(
        "collection_name",
        nargs="+",
        help="One or more collections, HLSL for LANDSAT or HLSS for SENTINEL",
    )
    parser.add_argument(
        "--overwrite",
        action=argparse.BooleanOptionalAction,
        help="Always download layers",
    )
    parser.add_argument(
        "--verbose",
        action=argparse.BooleanOptionalAction,
        help="increased output messages",
    )
    args = parser.parse_args()

    # check that the collection names are valid
    for c in args.collection_name:
        assert c in ["HLSL", "HLSS"], f"Invalid collection name: {c}"

    download(args.collection_name, overwrite=args.overwrite, verbose=args.verbose)
