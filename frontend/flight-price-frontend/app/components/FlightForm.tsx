'use client';

import { useState } from 'react';
import {
    AIRLINES,
    CITIES,
    TIMES,
    CURRENCY_SYMBOLS,
    type Currency,
    extractPredictionData,
    formatPrice,
    validateFormData,
    getDefaultFormData,
    getAirportCode
} from '../utils/predictionUtils';
import { getFlightPrice } from '../actions/getFlightPrice';

export default function FlightForm() {
    const [formData, setFormData] = useState(getDefaultFormData());
    const [prediction, setPrediction] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const prediction = await getFlightPrice(formData);
            setPrediction(prediction);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCurrency(e.target.value as Currency);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4 rounded-lg">
            <div className="bg-white/15 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-white/30">
                <h2 className="text-2xl font-bold text-center mb-6 text-black">Flight Price Prediction</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="stops" className="block text-sm font-semibold text-white mb-1">Number of Stops:</label>
                        <select
                            id="stops"
                            name="stops"
                            value={formData.stops}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            <option value={3}>Non-stop</option>
                            <option value={2}>1 Stop</option>
                            <option value={1}>2 Stops</option>
                            <option value={0}>3 Stops</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="class" className="block text-sm font-semibold text-white mb-1">Class:</label>
                        <select
                            id="class"
                            name="class"
                            value={formData.class}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            <option value={0}>Economy</option>
                            <option value={1}>Business</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="airline" className="block text-sm font-semibold text-white mb-1">Airline:</label>
                        <select
                            id="airline"
                            name="airline"
                            value={formData.airline}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            {AIRLINES.map(airline => (
                                <option key={airline} value={airline}>
                                    {airline.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="source" className="block text-sm font-semibold text-white mb-1">Source City:</label>
                        <select
                            id="source"
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            {CITIES.map(city => (
                                <option key={city} value={city}>
                                    {city} ({getAirportCode(city)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="destination" className="block text-sm font-semibold text-white mb-1">Destination City:</label>
                        <select
                            id="destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            {CITIES.map(city => (
                                <option key={city} value={city}>
                                    {city} ({getAirportCode(city)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="departure" className="block text-sm font-semibold text-white mb-1">Departure Time:</label>
                        <select
                            id="departure"
                            name="departure"
                            value={formData.departure}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            {TIMES.map(time => (
                                <option key={time} value={time}>
                                    {time.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="arrival" className="block text-sm font-semibold text-white mb-1">Arrival Time:</label>
                        <select
                            id="arrival"
                            name="arrival"
                            value={formData.arrival}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                        >
                            {TIMES.map(time => (
                                <option key={time} value={time}>
                                    {time.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-sm font-semibold text-white mb-1">Flight Duration (minutes):</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            min="1"
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                duration: Math.max(1, parseInt(e.target.value) || 1)
                            }))}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                            placeholder="Enter flight duration in minutes"
                        />
                    </div>

                    <div>
                        <label htmlFor="days_left" className="block text-sm font-semibold text-white mb-1">Days Until Flight:</label>
                        <input
                            type="number"
                            id="days_left"
                            name="days_left"
                            min="0"
                            value={formData.days_left}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                days_left: Math.max(0, parseInt(e.target.value) || 0)
                            }))}
                            className="w-full p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                            placeholder="Enter number of days"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-[#9f7eff] to-[#764ba2] text-black font-bold rounded-lg shadow-lg hover:from-[#764ba2] hover:to-[#9f7eff] transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Predicting...' : 'Predict Price'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {prediction !== null && (
                    <div className="mt-4 space-y-4">
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center text-xl font-bold">
                            <div className="flex items-center justify-center space-x-2">
                                <span>Predicted Price:</span>
                                <span>{formatPrice(prediction, selectedCurrency)}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <label htmlFor="currency" className="text-white font-semibold">Convert to:</label>
                            <select
                                id="currency"
                                value={selectedCurrency}
                                onChange={handleCurrencyChange}
                                className="p-2 rounded-lg bg-white/25 text-gray-800 font-semibold focus:bg-white/45 focus:shadow-lg focus:shadow-purple-500/50 outline-none"
                            >
                                {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                                    <option key={code} value={code}>
                                        {code} ({symbol})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 