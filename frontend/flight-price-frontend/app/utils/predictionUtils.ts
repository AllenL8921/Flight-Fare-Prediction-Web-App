interface FormData {
    stops: number;
    class: number;
    airline: string;
    source: string;
    destination: string;
    departure: string;
    arrival: string;
    duration: number;
    days_left: number;
} export type { FormData };

interface PredictionData {
    stops: number;
    class: number;
    duration: number;
    days_left: number;
    [key: string]: number;
} export type { PredictionData };

interface FlightInfo {
    source: string;
    destination: string;
    airline: string;
    class: number;
    duration: number;
    stops: number;
    departure: string;
    arrival: string;
} export type { FlightInfo };

export const AIRLINES = ["AirAsia", "Air_India", "GO_FIRST", "Indigo", "SpiceJet", "Vistara"] as const;
export const CITIES = ["Bangalore", "Chennai", "Delhi", "Hyderabad", "Kolkata", "Mumbai"] as const;
export const TIMES = ["Early_Morning", "Morning", "Afternoon", "Evening", "Night", "Late_Night"] as const;

const AIRPORT_CODES: { [key: string]: string } = {
    'Bangalore': 'BLR',
    'Chennai': 'MAA',
    'Delhi': 'DEL',
    'Hyderabad': 'HYD',
    'Kolkata': 'CCU',
    'Mumbai': 'BOM'
};

export function getAirportCode(city: string): string {
    return AIRPORT_CODES[city] || city;
}

export const CURRENCY_RATES = {
    INR: 1,
    USD: 0.012, // 1 INR = 0.012 USD
    EUR: 0.011, // 1 INR = 0.011 EUR
    GBP: 0.0095, // 1 INR = 0.0095 GBP
    AUD: 0.018, // 1 INR = 0.018 AUD
    CAD: 0.016, // 1 INR = 0.016 CAD
} as const;

export const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
} as const;

export type Currency = keyof typeof CURRENCY_RATES;

// Mapping of airline codes to full names
const AIRLINE_CODES: { [key: string]: string } = {
    '6E': 'Indigo',
    'SG': 'SpiceJet',
    'UK': 'Vistara',
    'AI': 'Air_India',
    'G8': 'GO_FIRST',
    'AK': 'AirAsia'
};

// Mapping of city codes to full names
const CITY_CODES: { [key: string]: string } = {
    'BLR': 'Bangalore',
    'MAA': 'Chennai',
    'DEL': 'Delhi',
    'HYD': 'Hyderabad',
    'CCU': 'Kolkata',
    'BOM': 'Mumbai'
};

export function extractPredictionData(formData: FormData): PredictionData {
    const data: PredictionData = {
        stops: formData.stops,
        class: formData.class,
        duration: formData.duration,
        days_left: formData.days_left
    };

    // Add airline features
    AIRLINES.forEach(airline => {
        data[`airline_${airline}`] = (airline === formData.airline) ? 1 : 0;
    });

    // Add city features
    CITIES.forEach(city => {
        data[`source_${city}`] = (city === formData.source) ? 1 : 0;
        data[`destination_${city}`] = (city === formData.destination) ? 1 : 0;
    });

    // Add time features
    TIMES.forEach(time => {
        data[`departure_${time}`] = (time === formData.departure) ? 1 : 0;
        data[`arrival_${time}`] = (time === formData.arrival) ? 1 : 0;
    });

    return data;
}

export function convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
    const inrAmount = amount / CURRENCY_RATES[fromCurrency];
    return inrAmount * CURRENCY_RATES[toCurrency];
}

export function formatPrice(amount: number, currency: Currency): string {
    const convertedAmount = convertCurrency(amount, 'INR', currency);
    return `${CURRENCY_SYMBOLS[currency]}${convertedAmount.toFixed(2)}`;
}

export function validateFormData(formData: FormData): string | null {
    if (formData.source === formData.destination) {
        return 'Source and destination cities cannot be the same';
    }

    if (formData.duration <= 0) {
        return 'Duration must be greater than 0';
    }

    if (formData.days_left < 0) {
        return 'Days left cannot be negative';
    }

    return null;
}

export function getDefaultFormData(): FormData {
    return {
        stops: 3,
        class: 0,
        airline: 'AirAsia',
        source: 'Bangalore',
        destination: 'Delhi',
        departure: 'Morning',
        arrival: 'Evening',
        duration: 120,
        days_left: 10
    };
} 