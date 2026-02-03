// 🌾 Raitu Mitra — Farming Calendar (Dark Mode Supported)
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Thermometer,
  Info,
  Leaf,
  Bug,
  Droplets,
  Scissors,
  Warehouse,
  CalendarCheck2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import cropsData from "../data/crops.json";
import MonthGrid from "./MonthGrid";

/* ---------- utils ---------- */
const fmt = (d) =>
  d instanceof Date && !isNaN(d)
    ? d.toLocaleDateString(undefined, { day: "2-digit", month: "short" })
    : "--";

const ICON_MAP = { Leaf, CalendarCheck2, Droplets, Scissors, Bug, Warehouse };
const resolveIcon = (iconName) => ICON_MAP[iconName] || Leaf;

/* ---------- geo ---------- */
function useGeo() {
  const [geo, setGeo] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setGeo(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);
  return geo;
}

/* ---------- weather ---------- */
async function fetchWeatherFromOpenWeather({ lat, lon }) {
  const API_KEY = "f438baf46e45d28234c799897dc72268";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();

    const dayMap = {};
    json.list.forEach((item) => {
      const dateKey = item.dt_txt.split(" ")[0];
      const tmax = item.main.temp_max;
      const tmin = item.main.temp_min;
      const rain = item.rain?.["3h"] || 0;
      if (!dayMap[dateKey]) dayMap[dateKey] = { date: dateKey, tmax, tmin, rain };
      else {
        dayMap[dateKey].tmax = Math.max(dayMap[dateKey].tmax, tmax);
        dayMap[dateKey].tmin = Math.min(dayMap[dateKey].tmin, tmin);
        dayMap[dateKey].rain += rain;
      }
    });
    const today = new Date().toISOString().split("T")[0];
    return Object.values(dayMap).filter((d) => d.date >= today).slice(0, 5);
  } catch {
    return [];
  }
}

/* ---------- sowing date helper ---------- */
function midSowingDateFromWindow(sowingWindow) {
  const now = new Date();
  const y = now.getFullYear();
  const fromDate = new Date(y, (sowingWindow.from?.m ?? 1) - 1, sowingWindow.from?.d ?? 1);
  const toDate = new Date(y, (sowingWindow.to?.m ?? 1) - 1, sowingWindow.to?.d ?? 1);
  const mid = new Date((fromDate.getTime() + toDate.getTime()) / 2);
  return mid;
}

export default function FarmingCalendar({ defaultCropId = "paddy" }) {
  const geo = useGeo();
  const CROPS = cropsData;

  const [cropId, setCropId] = useState(defaultCropId);
  const crop = useMemo(() => CROPS.find((c) => c.id === cropId) ?? CROPS[0], [cropId, CROPS]);

  const sowingDate = useMemo(() => midSowingDateFromWindow(crop.sowingWindow), [crop]);

  const [weather, setWeather] = useState([]);
  useEffect(() => {
    if (!geo) return;
    (async () => setWeather(await fetchWeatherFromOpenWeather(geo)))();
  }, [geo]);

  const gdd = useMemo(() => {
    if (!weather.length) return 0;
    const base = crop.gddBase ?? 10;
    return weather.reduce((acc, d) => {
      const avg = ((d.tmax ?? 0) + (d.tmin ?? 0)) / 2;
      return acc + Math.max(0, avg - base);
    }, 0);
  }, [weather, crop]);

  const maturityGDD = crop.gddTarget ?? crop.durationDays * 12;
  const progressPct = Math.min(100, Math.max(0, Number(((gdd / maturityGDD) * 100).toFixed(1))));

  const weeklyInsight = useMemo(() => {
    if (!weather.length) return "Fetching weather...";
    const totalRain = weather.reduce((s, d) => s + (d.rain ?? 0), 0);
    const avgRain = totalRain / weather.length;
    const hotDays = weather.filter((d) => (d.tmax ?? 0) >= (crop.weather?.idealTempMax ?? 999)).length;

    let msg = `Next 5 days: ${totalRain.toFixed(1)}mm total (${avgRain.toFixed(1)}mm/day). `;
    msg += hotDays > 2 ? "🔥 Heat stress possible. " : "🌤️ Temps are near-optimal. ";
    msg += totalRain > 10 ? "💧 Irrigation can be reduced." : "💧 Maintain regular irrigation.";
    return msg;
  }, [weather, crop]);

  const [selectedPhase, setSelectedPhase] = useState(null);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-white dark:bg-[#0b0b0f] text-gray-800 dark:text-gray-100 transition-colors duration-500">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800">
            <CalendarDays className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Farming Calendar</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Smart schedule for {crop.name} • {crop.season}
            </p>
          </div>
        </div>

        <select
          value={cropId}
          onChange={(e) => setCropId(e.target.value)}
          className="border dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 shadow-sm"
        >
          {CROPS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Weather + GDD + Insight */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Weather Chart */}
        <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-700 transition-colors duration-500">
          <b className="text-sm text-neutral-700 dark:text-neutral-200">Weather Summary</b>
          {weather.length ? (
            <div className="h-24 mt-2 dark:bg-neutral-800/50 rounded-lg p-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weather}>
                  <XAxis dataKey="date" tickFormatter={(d) => (d ? d.slice(5) : "")} stroke="gray" />
                  <YAxis hide />
                  <Tooltip labelFormatter={(l) => `Date: ${l}`} />
                  <Area type="monotone" dataKey="tmax" stroke="#ff7c43" fill="#ff7c4320" />
                  <Area type="monotone" dataKey="rain" stroke="#2f8fff" fill="#2f8fff30" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-neutral-500 mt-2">Fetching weather...</div>
          )}
        </div>

        {/* GDD */}
        <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-700 transition-colors duration-500">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <b className="text-neutral-700 dark:text-neutral-200">GDD Progress</b>
          </div>
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            🌡️ {Math.round(gdd)} degree-days accumulated
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Base temperature: {crop.gddBase ?? 10}°C
          </div>
          <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{progressPct}% of maturity</div>
        </div>

        {/* Insight */}
        <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-700 transition-colors duration-500">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <b className="text-neutral-700 dark:text-neutral-200">Weekly Insight</b>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{weeklyInsight}</p>
        </div>
      </div>

      {/* Timeline */}
      <MonthGrid startDate={sowingDate} phases={crop.phases} weather={weather} onPhaseClick={setSelectedPhase} />

      {/* Phase Modal */}
      <AnimatePresence>
        {selectedPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedPhase(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl w-full max-w-md relative"
            >
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const Icon = resolveIcon(selectedPhase.icon);
                  return (
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg">
                      <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  );
                })()}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{selectedPhase.label}</h3>
              </div>

              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3 leading-relaxed">
                {selectedPhase.notes}
              </p>

              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                <span>📅 {fmt(selectedPhase.s)} → {fmt(selectedPhase.e)}</span>
                <span>⏱️ {selectedPhase.duration} days</span>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-sm text-emerald-800 dark:text-emerald-300">
                🌿 <b>Tip:</b> Ensure field conditions are optimal before this stage.
              </div>

              <button
                onClick={() => setSelectedPhase(null)}
                className="w-full mt-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-medium transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}