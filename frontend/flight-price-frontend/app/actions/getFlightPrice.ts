"use server";

import {
    extractPredictionData,
    validateFormData,
    FormData
} from "../utils/predictionUtils";

import FlightFormData from "../types/FlightFormData";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getFlightPrice(formData: FormData) {
    const validationError = validateFormData(formData);
    if (validationError) {
        throw new Error(validationError);
    }

    const data = extractPredictionData(formData);

    const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch flight price");
    }

    const result = await response.json();
    return result.prediction;
}
