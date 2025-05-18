import os
import boto3

# Get the bucket name and model key from the environment variables
bucket_name = os.environ["S3_BUCKET_NAME"]
model_key = os.environ["S3_MODEL_KEY"]
feature_key = os.environ["S3_FEATURE_NAMES_KEY"]

# Create the local paths for the model and feature names
MODEL_LOCAL_PATH = os.path.join("model", os.path.basename(model_key))
FEATURE_NAMES_LOCAL_PATH = os.path.join("model", os.path.basename(feature_key))


def download_model():
    """
    Download the model and feature names from s3 and save them to the local directory.
    """
    # Create model directory if it doesn't exist
    os.makedirs(os.path.dirname(MODEL_LOCAL_PATH), exist_ok=True)

    s3 = boto3.client("s3")

    # Download model if not exists
    if os.path.exists(MODEL_LOCAL_PATH):
        print("Model already exists locally.")
    else:
        print(f"Downloading model from s3://{bucket_name}/{model_key}...")
        s3.download_file(Bucket=bucket_name, Key=model_key, Filename=MODEL_LOCAL_PATH)
        print("Model download complete.")

    # Download features if not exists
    if os.path.exists(FEATURE_NAMES_LOCAL_PATH):
        print("Feature names already exist locally.")
    else:
        print(f"Downloading feature names from s3://{bucket_name}/{feature_key}...")
        s3.download_file(
            Bucket=bucket_name, Key=feature_key, Filename=FEATURE_NAMES_LOCAL_PATH
        )
        print("Feature names download complete.")

    print("Download complete.")
