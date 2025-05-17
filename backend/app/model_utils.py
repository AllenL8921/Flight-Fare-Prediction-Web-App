import os
import boto3

MODEL_LOCAL_PATH = "model/flight_price_model.joblib"
FEATURE_NAMES_LOCAL_PATH = "model/model_features.joblib"


def download_model():
    # Create model directory if it doesn't exist
    os.makedirs(os.path.dirname(MODEL_LOCAL_PATH), exist_ok=True)

    s3 = boto3.client("s3")
    bucket_name = os.environ["S3_BUCKET_NAME"]
    model_key = os.environ["S3_MODEL_KEY"]
    feature_key = os.environ["S3_FEATURE_NAMES_KEY"]

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
