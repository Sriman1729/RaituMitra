import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import indiaDistricts from "../data/indiaDistricts.json";

// --- Simulated Price History ---
const generateSimulatedHistory = (basePrice, seed = 1) => {
  const data = [];
  let price = basePrice;
  let random = seed;

  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const fluctuation = (seededRandom() - 0.5) * (basePrice * 0.1);
    price = Math.max(basePrice * 0.8, price + fluctuation);

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
    });
  }
  return data;
};

export default function MarketInsights() {
  const [marketData, setMarketData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [sortType, setSortType] = useState("price_desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Fetch Data whenever state/district changes ---
  useEffect(() => {
    if (!selectedState) return;

    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);

      const apiKey =
        "579b464db66ec23bdd000001a01bd4f6a7ee42406f291a4a3b3e5726";

      let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=500&filters[state]=${encodeURIComponent(
        selectedState
      )}`;

      if (selectedDistrict) {
        url += `&filters[district]=${encodeURIComponent(selectedDistrict)}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const processedData = data.records
          .map((item) => ({
            ...item,
            modal_price: parseInt(item.modal_price, 10),
          }))
          .filter((item) => !isNaN(item.modal_price) && item.modal_price > 0);

        setMarketData(processedData);
      } catch (e) {
        setError("Failed to fetch market data. Please check your network or API key.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedState, selectedDistrict]);

  // --- Process & Sort ---
  const processedAndSortedData = useMemo(() => {
    if (!marketData.length) return [];

    const uniqueCommodities = [
      ...new Map(marketData.map((item) => [item.commodity, item])).values(),
    ];

    const analyzedData = uniqueCommodities.map((crop) => {
      const simulatedHistory = generateSimulatedHistory(
        crop.modal_price,
        (crop.commodity + crop.market).length
      );
      const last7Days = simulatedHistory.slice(-8, -1);
      const avgPrice =
        last7Days.reduce((sum, d) => sum + d.price, 0) / last7Days.length;
      const change = ((crop.modal_price - avgPrice) / avgPrice) * 100;
      return { ...crop, avgPrice, change };
    });

    return analyzedData.sort((a, b) => {
      switch (sortType) {
        case "price_asc":
          return a.modal_price - b.modal_price;
        case "name_asc":
          return a.commodity.localeCompare(b.commodity);
        case "name_desc":
          return b.commodity.localeCompare(a.commodity);
        case "price_desc":
        default:
          return b.modal_price - a.modal_price;
      }
    });
  }, [marketData, sortType]);

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
    setHistoricalData(
      generateSimulatedHistory(crop.modal_price, (crop.commodity + crop.market).length)
    );
  };

  // --- Render ---
  if (loading) return <div className="text-center py-10">Loading Market Insights...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Market Insights (India)</h1>
        <div className="flex items-center gap-4">
          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict("");
              setSelectedCrop(null);
            }}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select State</option>
            {Object.keys(indiaDistricts).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* District Dropdown */}
          {selectedState && (
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedCrop(null);
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select District</option>
              {indiaDistricts[selectedState].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          )}

          {/* Sorting */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="price_desc">Sort: Price High-Low</option>
            <option value="price_asc">Sort: Price Low-High</option>
            <option value="name_asc">Sort: Name A-Z</option>
            <option value="name_desc">Sort: Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crop Cards */}
        <div className="lg:col-span-1 space-y-4 h-[70vh] overflow-y-auto pr-2">
          {processedAndSortedData.length > 0 ? (
            processedAndSortedData.map((crop) => (
              <div
                key={`${crop.market}-${crop.commodity}`}
                onClick={() => handleCropClick(crop)}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedCrop?.commodity === crop.commodity
                    ? "bg-green-50 border-green-500 shadow-lg"
                    : "bg-white hover:shadow-md hover:border-green-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold truncate">{crop.commodity}</h2>
                    <p className="text-xs text-gray-500">{crop.market}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">₹{crop.modal_price}</p>
                    <p
                      className={`text-xs font-semibold ${
                        crop.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {crop.change >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(crop.change).toFixed(1)}% vs 7d avg
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>
              No data available for {selectedDistrict || "selected district"},{" "}
              {selectedState}.
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border">
          {selectedCrop ? (
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Price Trend: {selectedCrop.commodity}
              </h2>
              <p className="text-gray-600 mb-4">
                Simulated 30-day price history for {selectedCrop.market}
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={["dataMin - 100", "dataMax + 100"]}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <p className="text-2xl font-semibold text-gray-700">
                Select a crop to see its details
              </p>
              <p className="text-gray-500 mt-2">
                Choose a state and district, then click on a crop card to view its
                price trend analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
