// 🌾 Raitu Mitra — Smart Weather Dashboard (Clean & Fixed)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Settings,
  LineChart as LineChartIcon,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import indiaDistricts from "../data/indiaDistricts.json";
import { saveWeatherCache, getWeatherCache } from "@/utils/weatherCache";

/* ===========================
   ENV CONFIG
=========================== */

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!WEATHER_API_KEY) {
  console.error("OpenWeather API key missing.");
}

/* ===========================
   LocalStorage Hook
=========================== */

const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
};

/* ===========================
   Geocoding
=========================== */

const geocodeLocation = async (city, state) => {
  try {
    const query = `${city}, ${state}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data?.[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch {
    return null;
  }
};

/* ===========================
   Leaflet Helpers
=========================== */

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

function MapAutoCenter({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lon], 10, { duration: 1.2 });
    }
  }, [coords, map]);

  return null;
}

/* ===========================
   MAIN COMPONENT
=========================== */

export default function WeatherDashboard() {
  const [loc, setLoc] = useLocalStorage("rm.location", {
    state: "Telangana",
    city: "Hyderabad",
  });

  const [coords, setCoords] = useLocalStorage("rm.coords", null);
  const [unit, setUnit] = useLocalStorage("rm.unit", "C");

  const [data, setData] = useState({
    current: null,
    forecast: null,
  });

  const [status, setStatus] = useState("idle");

  /* ---------------------------
     Fetch Weather
  ---------------------------- */

  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      if (!lat || !lon) return;

      setStatus("loading");

      const apiUnit = unit === "C" ? "metric" : "imperial";

      try {
        const [cur, fc] = await Promise.all([
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${apiUnit}&appid=${WEATHER_API_KEY}`
          ),
          axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${apiUnit}&appid=${WEATHER_API_KEY}`
          ),
        ]);

        const payload = {
          coords: { lat, lon },
          current: cur.data,
          forecast: fc.data,
        };

        setCoords({ lat, lon });
        setData({
          current: cur.data,
          forecast: fc.data,
        });

        setStatus("success");
        saveWeatherCache(lat, lon, payload);
      } catch {
        const cached = getWeatherCache(lat, lon);

        if (cached) {
          setCoords(cached.data.coords);
          setData({
            current: cached.data.current,
            forecast: cached.data.forecast,
          });
          setStatus("offline");
        } else {
          setStatus("error");
        }
      }
    },
    [unit]
  );

  /* ---------------------------
     Refetch on Unit Change
  ---------------------------- */

  useEffect(() => {
    if (coords) {
      fetchWeatherByCoords(coords.lat, coords.lon);
    }
  }, [unit]);

  /* ---------------------------
     Auto Fetch on Location Change
  ---------------------------- */

  useEffect(() => {
    if (!loc.state || !loc.city) return;

    const timer = setTimeout(async () => {
      const newCoords = await geocodeLocation(loc.city, loc.state);
      if (newCoords) {
        fetchWeatherByCoords(newCoords.lat, newCoords.lon);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [loc.state, loc.city, fetchWeatherByCoords]);

  /* ---------------------------
     Memo Values
  ---------------------------- */

  const states = useMemo(() => Object.keys(indiaDistricts), []);
  const districts = indiaDistricts[loc.state] || [];

  const rainProbability = useMemo(() => {
    if (!data.forecast?.list) return 0;

    const next24h = data.forecast.list.slice(0, 8);
    const rainyCount = next24h.filter((item) =>
      item.weather?.[0]?.main?.toLowerCase().includes("rain")
    ).length;

    return Math.round((rainyCount / next24h.length) * 100);
  }, [data.forecast]);

  const alerts = useMemo(() => {
    if (!data.current) return [];

    const temp = data.current.main.temp;
    const humidity = data.current.main.humidity;
    const wind = data.current.wind.speed;

    const a = [];

    if (temp > (unit === "C" ? 35 : 95)) {
      a.push({
        msg: "High temperature — irrigate crops early morning or late evening.",
        level: "high",
      });
    }

    if (humidity > 85) {
      a.push({
        msg: "High humidity — fungal infection risk. Monitor crops.",
        level: "medium",
      });
    }

    if (rainProbability > 60) {
      a.push({
        msg: "Rain expected — avoid spraying fertilizers today.",
        level: "medium",
      });
    }

    if (wind > (unit === "C" ? 10 : 22)) {
      a.push({
        msg: "Strong winds — protect tender or tall plants.",
        level: "medium",
      });
    }

    if (!a.length) {
      a.push({
        msg: "Weather is favorable for crops today.",
        level: "low",
      });
    }

    return a;
  }, [data.current, rainProbability, unit]);

  /* ===========================
     UI
  =========================== */

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-[#0b0b0f] dark:to-[#0b0b0f] text-gray-800 dark:text-white p-6 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Settings */}
        <div className="flex justify-between items-center bg-white/70 dark:bg-white/10 p-3 rounded-xl border">
          <div className="flex items-center gap-2 font-semibold">
            <Settings size={18} /> Settings
          </div>

          <button
            onClick={() => setUnit(unit === "C" ? "F" : "C")}
            className="px-3 py-1 rounded-lg bg-green-500 text-white"
          >
            °{unit}
          </button>
        </div>

        {/* Location Select */}
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={loc.state}
            onChange={(e) =>
              setLoc({
                state: e.target.value,
                city: indiaDistricts[e.target.value]?.[0] || "",
              })
            }
            className="w-full md:w-1/3 rounded-lg px-4 py-3 border"
          >
            {states.map((st) => (
              <option key={st}>{st}</option>
            ))}
          </select>

          <select
            value={loc.city}
            onChange={(e) =>
              setLoc((p) => ({ ...p, city: e.target.value }))
            }
            className="w-full md:w-1/3 rounded-lg px-4 py-3 border"
          >
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}