import React, { useState, useEffect } from "react";
import indiaDistricts from "../data/indiaDistricts.json";
import districtCrops from "../data/districtCrops.json";
import cropData from "../data/cropLibrary.json";
import { CROPS } from "../data/cropMaster.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ✅ Alias Map (unifies crop names)
const cropAliasMap = {
  paddy: "paddy", rice: "paddy",
  jowar: "sorghum", sorghum: "sorghum",
  bajra: "pearl_millet", millet: "pearl_millet", millets: "pearl_millet",
  ragi: "ragi", maize: "maize", corn: "maize",
  wheat: "wheat",
  gram: "chickpea", chana: "chickpea", chickpea: "chickpea",
  tur: "pigeonpea", arhar: "pigeonpea", pigeonpea: "pigeonpea",
  moong: "moong", urad: "urad", masoor: "lentil",
  potato: "potato", onion: "onion", garlic: "garlic", tomato: "tomato",
  brinjal: "brinjal", eggplant: "brinjal",
  ladyfinger: "okra", okra: "okra", bhindi: "okra",
  chilli: "chillies", chillies: "chillies",
  cabbage: "cabbage", cauliflower: "cauliflower",
  spinach: "spinach", coriander: "coriander",
  fenugreek: "fenugreek", methi: "fenugreek",
  carrot: "carrot", beetroot: "beetroot", radish: "radish",
  capsicum: "capsicum", bellpepper: "capsicum",
  pumpkin: "pumpkin", bittergourd: "bitter_gourd",
  ridgegourd: "ridge_gourd", snakegourd: "snake_gourd",
  banana: "banana", mango: "mango", guava: "guava",
  papaya: "papaya", grapes: "grapes", apple: "apple",
  orange: "citrus", lemon: "citrus", citrus: "citrus",
  watermelon: "watermelon", muskmelon: "muskmelon",
  turmeric: "turmeric", ginger: "ginger",
  cotton: "cotton", sugarcane: "sugarcane",
};

const getCropKey = (name) => {
  if (!name) return null;
  const normalized = name.toLowerCase().replace(/\s+/g, "");
  return cropAliasMap[normalized] || normalized;
};

const getCropDetails = (name) => {
  const key = getCropKey(name);
  return key && CROPS[key] ? CROPS[key] : null;
};

// ✅ Crop Card
function CropCard({ crop }) {
  const details = getCropDetails(crop.name);
  const [expanded, setExpanded] = useState(false);

  if (!details) return null;

  return (
    <Card className="rounded-2xl shadow hover:shadow-lg transition p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{crop.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Soil:</strong> {details.soil?.join(", ")}</p>
        <p><strong>Water:</strong> {details.water}</p>
        <p><strong>Yield:</strong> {details.avgYieldKgPerAcre} kg/acre</p>
        <p><strong>Cost:</strong> ₹{details.investmentPerAcre} /acre</p>
        <p><strong>Profit:</strong> ₹{details.avgProfitPerAcre} /acre</p>

        {/* Profit Bar */}
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full flex overflow-hidden">
          <div
            className="bg-red-500"
            style={{
              width: `${Math.min(
                100,
                (details.investmentPerAcre /
                  (details.investmentPerAcre + details.avgProfitPerAcre)) *
                  100
              )}%`,
            }}
          />
          <div
            className="bg-green-500"
            style={{
              width: `${Math.min(
                100,
                (details.avgProfitPerAcre /
                  (details.investmentPerAcre + details.avgProfitPerAcre)) *
                  100
              )}%`,
            }}
          />
        </div>

        {/* Expandable */}
        <button
          className="mt-3 text-blue-600 text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide details ▲" : "Show more ▼"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {details.fertilizers && (
              <div>
                <p className="font-semibold">Fertilizers:</p>
                {typeof details.fertilizers === "object" ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(details.fertilizers).map(
                      ([stage, ferts], idx) => (
                        <li key={idx}>
                          <strong>{stage}:</strong>{" "}
                          {Array.isArray(ferts) ? ferts.join(", ") : ferts}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>{details.fertilizers}</p>
                )}
              </div>
            )}

            {details.pests && (
              <div>
                <p className="font-semibold">Common Pests:</p>
                {Array.isArray(details.pests) ? (
                  <ul className="list-disc list-inside">
                    {details.pests.map((pest, idx) => (
                      <li key={idx}>{pest}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{String(details.pests)}</p>
                )}
              </div>
            )}

            {details.tips && (
              <div>
                <p className="font-semibold">Tips:</p>
                {Array.isArray(details.tips) ? (
                  <ul className="list-disc list-inside">
                    {details.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{details.tips}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ✅ Main Component
export default function CropRecommendation() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [season, setSeason] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const inRange = (val, [min, max]) => val >= min && val <= max;

  const seededRandom = (seed, min, max) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    const rand = (h >>> 0) / 4294967295;
    return parseFloat((rand * (max - min) + min).toFixed(2));
  };

  useEffect(() => {
    if (state && district && season && waterSource) {
      const seed = `${state}-${district}-${season}-${waterSource}`;
      let v = seededRandom(seed + "vldi", 0.1, 1.0);
      let s = seededRandom(seed + "smi", 0.35, 1.0);
      let m = seededRandom(seed + "mhi", 0.4, 1.0);

      if (season === "Kharif") { v += 0.05; s += 0.1; }
      else if (season === "Rabi") { m += 0.05; }
      else if (season === "Zaid") { v += 0.1; s -= 0.05; }

      if (waterSource === "Canal") s += 0.1;
      else if (waterSource === "Borewell") s += 0.05;
      else if (waterSource === "Rainfed") s -= 0.05;

      v = Math.min(1, Math.max(0, v));
      s = Math.min(1, Math.max(0, s));
      m = Math.min(1, Math.max(0, m));

      const possibleCrops = districtCrops[district] || [];
      let crops = cropData.crop_library.filter((crop) => {
        const cropKey = getCropKey(crop.name);
        const inDistrict = possibleCrops.some((dCrop) => getCropKey(dCrop) === cropKey);

        const matches =
          (inRange(v, crop.vdli) ? 1 : 0) +
          (inRange(s, crop.smi) ? 1 : 0) +
          (inRange(m, crop.mhi) ? 1 : 0);

        return inDistrict && matches >= 2;
      });

      crops.sort((a, b) => {
        const profitA = getCropDetails(a.name)?.avgProfitPerAcre || 0;
        const profitB = getCropDetails(b.name)?.avgProfitPerAcre || 0;
        return profitB - profitA;
      });

      setRecommendations(crops);
    } else {
      setRecommendations([]);
    }
  }, [state, district, season, waterSource]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">🌱 Crop Recommendation</h1>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* State */}
        <div>
          <label className="block mb-2 font-medium flex items-center gap-2">📍 State</label>
          <select
            className="border rounded-xl p-2 w-full shadow-sm focus:ring-2 focus:ring-green-400"
            value={state}
            onChange={(e) => { setState(e.target.value); setDistrict(""); }}
          >
            <option value="">-- Select State --</option>
            {Object.keys(indiaDistricts).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 font-medium flex items-center gap-2">🏙️ District</label>
          <select
            className="border rounded-xl p-2 w-full shadow-sm focus:ring-2 focus:ring-green-400"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!state}
          >
            <option value="">-- Select District --</option>
            {state && indiaDistricts[state].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="block mb-2 font-medium flex items-center gap-2">🗓️ Season</label>
          <select
            className="border rounded-xl p-2 w-full shadow-sm focus:ring-2 focus:ring-green-400"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="">-- Select Season --</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Zaid">Zaid</option>
          </select>
        </div>

        {/* Water Source */}
        <div>
          <label className="block mb-2 font-medium flex items-center gap-2">💧 Water Source</label>
          <select
            className="border rounded-xl p-2 w-full shadow-sm focus:ring-2 focus:ring-green-400"
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
          >
            <option value="">-- Select Water Source --</option>
            <option value="Canal">Canal</option>
            <option value="Borewell">Borewell</option>
            <option value="Rainfed">Rainfed</option>
            <option value="Tank">Tank</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {state && district && season && waterSource && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended Crops:</h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((crop, i) => (
                <CropCard key={i} crop={crop} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No suitable crops found for this combination.</p>
          )}
        </div>
      )}
    </div>
  );
}
