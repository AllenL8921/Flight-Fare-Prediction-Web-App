from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .model_utils import download_model, MODEL_LOCAL_PATH, FEATURE_NAMES_LOCAL_PATH
from pydantic import BaseModel, Field


import xgboost as xgb
import joblib
import os
import io
import requests
import pandas as pd
import uvicorn


class FlightFeatures(BaseModel):
    stops: int
    class_: int = Field(..., alias="class")
    duration: float
    days_left: int
    airline_AirAsia: int
    airline_Air_India: int
    airline_GO_FIRST: int
    airline_Indigo: int
    airline_SpiceJet: int
    airline_Vistara: int
    source_Bangalore: int
    source_Chennai: int
    source_Delhi: int
    source_Hyderabad: int
    source_Kolkata: int
    source_Mumbai: int
    destination_Bangalore: int
    destination_Chennai: int
    destination_Delhi: int
    destination_Hyderabad: int
    destination_Kolkata: int
    destination_Mumbai: int
    departure_Afternoon: int
    departure_Early_Morning: int
    departure_Evening: int
    departure_Late_Night: int
    departure_Morning: int
    departure_Night: int
    arrival_Afternoon: int
    arrival_Early_Morning: int
    arrival_Evening: int
    arrival_Late_Night: int
    arrival_Morning: int
    arrival_Night: int


load_dotenv()
download_model()

feature_names = joblib.load(FEATURE_NAMES_LOCAL_PATH)

model = xgb.Booster()
model.load_model(MODEL_LOCAL_PATH)

app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "API is up and running!"}


def preprocess_input(data: FlightFeatures) -> pd.DataFrame:
    """
    Preprocess the input data to match the model's expected format.
    """
    data_dict = data.model_dump(by_alias=True)
    df = pd.DataFrame([data_dict])
    df = df[feature_names]
    return df


@app.post("/predict")
async def predict(features: FlightFeatures):
    """
    Predict flight prices based on the provided features.
    """
    print(features)

    try:
        input_df = preprocess_input(features)
        dmatrix = xgb.DMatrix(input_df)
        prediction = model.predict(dmatrix)

        pred_value = float(prediction[0])
        return JSONResponse(content={"prediction": pred_value}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
