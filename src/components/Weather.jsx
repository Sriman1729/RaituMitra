// 🌾 Raitu Mitra — Smart Weather Dashboard (Compact Card + Smart Alerts + Chart + Map + Voice)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Thermometer,
  Wind,
  Droplet,
  CloudRain,
  MapPin,
  Mic,
  MicOff,
  Settings,
  LocateFixed,
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
import {
  saveWeatherCache,
  getWeatherCache,
} from "@/utils/weatherCache";
/* ---------------------------
   Utilities & LocalStorage Hook
---------------------------- */
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

/* ---------------------------
   Geocoding (state + district → lat/lon)
---------------------------- */
const geocodeLocation = async (city, state) => {
  try {
    const query = `${city}, ${state}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
};

/* ---------------------------
   Weather Icon (Emoji)
---------------------------- */
const getWeatherEmoji = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("drizzle")) return "🌦️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("clear")) return "☀️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "🌫️";
  if (c.includes("dust") || c.includes("sand")) return "🌪️";
  return "🌤️";
};

/* ---------------------------
   Custom Map Marker
---------------------------- */
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

/* ---------------------------
   Auto Center Helper
---------------------------- */
function MapAutoCenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lon], 10, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

/* ---------------------------
   Main Weather Component
---------------------------- */
export default function WeatherDashboard() {
  const [loc, setLoc] = useLocalStorage("rm.location", {
    state: "Telangana",
    city: "Hyderabad",
  });
  const [coords, setCoords] = useLocalStorage("rm.coords", null);
  const [unit, setUnit] = useLocalStorage("rm.unit", "C");
  const [voiceOn, setVoiceOn] = useLocalStorage("rm.voice", true);
  const [data, setData] = useState({ current: null, forecast: null });
  const [status, setStatus] = useState("idle");

  /* ---------------------------
     Voice Function
  ---------------------------- */
  const speak = useCallback(
    (msg) => {
      if (!voiceOn || typeof window === "undefined") return;
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(msg);
        u.lang = "en-IN";
        try {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch {}
      }
    },
    [voiceOn]
  );

  /* ---------------------------
     Fetch Weather Data
  ---------------------------- */
  const fetchWeatherByCoords = useCallback(
  async (lat, lon) => {
    if (!lat || !lon) return;
    setStatus("loading");

    const key = "f438baf46e45d28234c799897dc72268";

    // 1️⃣ ONLINE → fetch fresh
    if (navigator.onLine) {
      try {
        const [cur, fc] = await Promise.all([
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
          ),
          axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
          ),
        ]);

        const payload = {
          coords: { lat, lon },
          current: cur.data,
          forecast: fc.data,
        };

        setCoords({ lat, lon });
        setData({ current: cur.data, forecast: fc.data });
        setStatus("success");

        // 🔒 SAVE CACHE
        saveWeatherCache(lat, lon, payload);

        speak(
          `${getWeatherEmoji(cur.data.weather[0].main)} It’s ${Math.round(
            cur.data.main.temp
          )} degrees and ${cur.data.weather[0].description} in ${
            cur.data.name
          }.`
        );
        return;
      } catch {
        // fall through to cache
      }
    }

    // 2️⃣ OFFLINE OR FETCH FAILED → use cache
    const cached = getWeatherCache(lat, lon);

    if (cached) {
      setCoords(cached.data.coords);
      setData({
        current: cached.data.current,
        forecast: cached.data.forecast,
      });
      setStatus("offline");
      speak("You are offline. Showing last saved weather.");
    } else {
      setStatus("error");
      speak("Weather unavailable. Please connect to the internet.");
    }
  },
  [speak]
);

  /* ---------------------------
     Auto Fetch on Location Change
  ---------------------------- */
  useEffect(() => {
    if (!loc.state || !loc.city) return;
    const timer = setTimeout(async () => {
      const newCoords = await geocodeLocation(loc.city, loc.state);
      if (newCoords) fetchWeatherByCoords(newCoords.lat, newCoords.lon);
    }, 600);
    return () => clearTimeout(timer);
  }, [loc.state, loc.city]);

  /* ---------------------------
     Derived Values
  ---------------------------- */
  const temp = (tC) =>
    unit === "C" ? Math.round(tC) : Math.round((tC * 9) / 5 + 32);

  const rainProbability = useMemo(() => {
    if (!data.forecast?.list) return 0;
    const rainy = data.forecast.list
      .slice(0, 8)
      .filter((i) =>
        i.weather?.[0]?.main?.toLowerCase().includes("rain")
      ).length;
    return Math.round((rainy / 8) * 100);
  }, [data]);

  /* ---------------------------
     Smart Crop Alerts
  ---------------------------- */
  const alerts = useMemo(() => {
    if (!data.current) return [];
    const t = data.current.main.temp;
    const h = data.current.main.humidity;
    const w = data.current.wind.speed;
    const r = rainProbability;
    const a = [];
    if (t > 35)
      a.push({
        msg: "High temperature — irrigate crops early morning or late evening.",
        level: "high",
      });
    if (h > 85)
      a.push({
        msg: "High humidity — fungal infection risk, monitor crops.",
        level: "medium",
      });
    if (r > 60)
      a.push({
        msg: "Rain expected — avoid spraying fertilizers today.",
        level: "medium",
      });
    if (w > 10)
      a.push({
        msg: "Strong winds — protect tender or tall plants.",
        level: "medium",
      });
    if (!a.length)
      a.push({ msg: "Weather is favorable for crops today 🌿", level: "low" });
    return a;
  }, [data, rainProbability]);

  /* ---------------------------
     Use My Location
  ---------------------------- */
  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => setStatus("error")
    );
  };

  const states = Object.keys(indiaDistricts);
  const districts = indiaDistricts[loc.state] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-[#0b0b0f] dark:to-[#0b0b0f] text-gray-800 dark:text-white p-6 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Settings */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/20">
          <div className="flex items-center gap-2 font-semibold">
            <Settings size={18} /> Settings
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnit(unit === "C" ? "F" : "C")}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow hover:opacity-90"
            >
              {unit === "C" ? "°C" : "°F"}
            </button>
            <button
              onClick={() => setVoiceOn(!voiceOn)}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                voiceOn
                  ? "bg-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {voiceOn ? <Mic size={16} /> : <MicOff size={16} />} Voice
            </button>
          </div>
        </div>

        {/* Location Selection */}
        <div className="flex flex-col md:flex-row gap-4">
          <select
  value={loc.state}
  onChange={(e) =>
    setLoc({
      state: e.target.value,
      city: indiaDistricts[e.target.value]?.[0] || "",
    })
  }
  className="w-full md:w-1/3 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700 
             bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm 
             text-gray-800 dark:text-gray-200 shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-violet-400 
             transition-all duration-200"
>
  {states.map((st) => (
    <option key={st}>{st}</option>
  ))}
</select>

<select
  value={loc.city}
  onChange={(e) => setLoc((p) => ({ ...p, city: e.target.value }))}
  className="w-full md:w-1/3 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700 
             bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm 
             text-gray-800 dark:text-gray-200 shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-violet-400 
             transition-all duration-200"
>
  {districts.map((d) => (
    <option key={d}>{d}</option>
  ))}
</select>

          <button
            onClick={handleUseMyLocation}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/70 dark:bg-white/10 border border-white/20 shadow font-medium hover:opacity-90"
          >
            <LocateFixed size={18} /> Use My Location
          </button>
        </div>

        {/* Map */}
        {coords && (
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg">
            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={10}
              style={{ height: "300px", width: "100%" }}
              scrollWheelZoom={true}
            >
              <MapAutoCenter coords={coords} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lon]} icon={customIcon}>
                <Popup>
                  <b>{loc.city}</b>
                  <br />
                  Lat: {coords.lat.toFixed(3)}, Lon: {coords.lon.toFixed(3)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {status === "offline" && (
  <div className="px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 
                  text-yellow-800 dark:text-yellow-200 text-sm font-medium">
    📴 Offline — showing last updated weather (cached)
  </div>
)}

        {/* Weather Card */}
        {(status === "success" || status === "offline") && data.current && (
          <>
            {/* Compact Weather Card */}
{/* 🌦️ Main Weather Card — Professional UI */}
<motion.div
  whileHover={{ scale: 1.005 }}
  transition={{ type: "spring", stiffness: 120 }}
  className="rounded-xl border border-gray-200 dark:border-gray-700 
             bg-white dark:bg-[#101214] 
             shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] 
             p-6 sm:p-7 transition-all duration-300"
>
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
    <div className="flex items-center gap-3">
      <MapPin className="text-blue-600 dark:text-teal-400" size={22} />
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
          {getWeatherEmoji(data.current.weather[0].main)} {data.current.name}, {data.current.sys.country}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>

    <div className="text-right">
      <h3 className="text-4xl sm:text-5xl font-bold text-blue-700 dark:text-teal-300 leading-tight">
        {Math.round(data.current.main.temp)}°{unit}
      </h3>
      <p className="capitalize text-sm sm:text-base text-gray-600 dark:text-gray-300">
        {data.current.weather[0].description}
      </p>
    </div>
  </div>

  {/* Divider Line */}
  <div className="border-t border-gray-200 dark:border-gray-700 mt-5 mb-5" />

  {/* Stats Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm sm:text-base">
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <Thermometer size={18} className="text-red-500" />
      <span className="font-medium">Feels Like:</span> {Math.round(data.current.main.feels_like)}°{unit}
    </div>
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <Wind size={18} className="text-blue-500" />
      <span className="font-medium">Wind:</span> {data.current.wind.speed} m/s
    </div>
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <Droplet size={18} className="text-cyan-500" />
      <span className="font-medium">Humidity:</span> {data.current.main.humidity}%
    </div>
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <CloudRain size={18} className="text-indigo-500" />
      <span className="font-medium">Pressure:</span> {data.current.main.pressure} hPa
    </div>
  </div>

  {/* Sunrise / Sunset */}
  <div className="flex justify-center sm:justify-end gap-6 mt-5 text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
    <div className="flex items-center gap-1.5">
      🌅{" "}
      {new Date(data.current.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
    <div className="flex items-center gap-1.5">
      🌇{" "}
      {new Date(data.current.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  </div>
</motion.div>
            {/* ⚠️ Smart Crop Alerts */}
<motion.div
  whileHover={{ scale: 1.005 }}
  transition={{ type: "spring", stiffness: 120 }}
  className="rounded-xl border border-gray-200 dark:border-gray-700 
             bg-white dark:bg-[#101214] 
             shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] 
             p-6 sm:p-7 transition-all duration-300"
>
  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
    ⚠️ Smart Crop Alerts
  </h3>

  <div className="space-y-3">
    {alerts.map((a, i) => (
      <div
        key={i}
        className={`p-3 rounded-lg border-l-4 flex items-start gap-2 ${
          a.level === "high"
            ? "border-red-500 bg-red-50 dark:bg-red-900/10"
            : a.level === "medium"
            ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"
            : "border-green-500 bg-green-50 dark:bg-green-900/10"
        }`}
      >
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {a.msg}
        </div>
      </div>
    ))}
  </div>
</motion.div>


           {/* Hourly Chart */}
<motion.div
  whileHover={{ scale: 1.01 }}
  className="bg-white/70 dark:bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg"
>
  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-violet-500">
    <LineChartIcon /> Temperature & Humidity (Next 12h)
  </h3>
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={(data.forecast?.list || [])
          .slice(0, 4)
          .map((i) => ({
            time: new Date(i.dt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
            }),
            temp: Math.round(i.main.temp),
            humidity: i.main.humidity,
          }))}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="time"
          tick={{ fill: "#8884d8", fontSize: 12 }}
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -5,
            fill: "#666",
            fontSize: 12,
          }}
        />
        <YAxis
          tick={{ fill: "#666", fontSize: 12 }}
          label={{
            value: `Temp (°${unit}) / Humidity (%)`,
            angle: -90,
            position: "insideLeft",
            fill: "#666",
            fontSize: 12,
          }}
          domain={[0, 100]}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "temp") {
              return [`${value}°${unit}`, "Temperature"];
            }
            if (name === "humidity") {
              return [`${value}%`, "Humidity"];
            }
            return value;
          }}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#f97316"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          name="Temperature"
        />
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 2 }}
          name="Humidity"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</motion.div>

{/* 🌤️ 5-Day Forecast */}
<motion.div
  whileHover={{ scale: 1.005 }}
  transition={{ type: "spring", stiffness: 120 }}
  className="rounded-xl border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-[#101214] 
          shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] 
          p-6 sm:p-7 transition-all duration-300"
>
  <h3 className="text-lg font-semibold mb-5 text-gray-800 dark:text-gray-100">
    ☀️ 5-Day Forecast
  </h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {data.forecast.list
      .filter((_, i) => i % 8 === 0)
      .slice(0, 5)
      .map((d, i) => {
        const date = new Date(d.dt * 1000);
        const day = date.toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const icon = d.weather[0].icon;
        const desc = d.weather[0].description;
        const tempMin = Math.round(d.main.temp_min);
        const tempMax = Math.round(d.main.temp_max);

        return (
          <div
            key={i}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-800 
                flex flex-col items-center justify-center text-center hover:shadow-sm transition-all duration-200"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{day}</p>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={desc}
              className="w-12 h-12"
            />
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{desc}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
              {tempMin}° / {tempMax}°
            </p>
          </div>
        );
      })}
  </div>
</motion.div>


          </>
        )}
      </div>
    </div>
  );
}
