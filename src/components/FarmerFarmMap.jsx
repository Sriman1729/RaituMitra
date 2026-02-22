// 🌾 FarmerFarmMap.jsx — FINAL VITE COMPATIBLE VERSION

import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ⭐ Leaflet Draw (correct working imports for Vite)
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-draw/dist/leaflet.draw.css";

// Utilities
import "leaflet-geometryutil";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// UI + Icons
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Ruler, MapPin, TestTube2 } from "lucide-react";

/* 🔍 Search Control */
function SearchControl() {
  const map = useMap();
  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: "🔍 Search a place...",
    })
      .on("markgeocode", (e) => {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest(),
        ]);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map]);
  return null;
}

export default function FarmerFarmMap() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [farmBoundary, setFarmBoundary] = useState(null);
  const [activity, setActivity] = useState("Idle");
  const [fetching, setFetching] = useState(false);
  const [farmArea, setFarmArea] = useState(null);
  const [soilData, setSoilData] = useState(null);

  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);

  /* 🧭 Load saved farm */
  useEffect(() => {
    const fetchFarm = async () => {
      if (!user) return setLoading(false);
      try {
        const ref = doc(db, "farmers", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const d = snap.data();

          if (Array.isArray(d.farmBoundary)) {
            const converted = d.farmBoundary.map((p) => [p.lat, p.lng]);
            setFarmBoundary(converted);
          }

          setActivity(d.currentActivity || "Idle");
          setFarmArea(d.farmArea || null);
          setSoilData(d.soilData || null);
        }
      } catch (e) {
        console.error("Error loading farm:", e);
      }
      setLoading(false);
    };
    fetchFarm();
  }, [user]);

  /* 🗺️ Render saved polygon */
  useEffect(() => {
    if (!farmBoundary || !featureGroupRef.current) return;

    const fg = featureGroupRef.current;
    fg.clearLayers();

    const poly = L.polygon(farmBoundary, {
      color: "#7c3aed",
      fillColor: "#a78bfa",
      fillOpacity: 0.4,
    });

    fg.addLayer(poly);
  }, [farmBoundary]);

  /* ✏️ Leaflet Draw Setup */
  useEffect(() => {
    if (!mapRef.current || !featureGroupRef.current) return;

    const map = mapRef.current;
    const drawnItems = featureGroupRef.current;

    // Remove old draw control if re-rendered
    if (map._customDrawControl) {
      map.removeControl(map._customDrawControl);
    }

    // Create Draw Control
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: "#7c3aed",
            fillColor: "#a78bfa",
            fillOpacity: 0.4,
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    drawControl.addTo(map);
    map._customDrawControl = drawControl;

    // On Created
    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers();
      const layer = e.layer;
      drawnItems.addLayer(layer);

      const coords = layer.getLatLngs()[0].map((c) => [c.lat, c.lng]);
      setFarmBoundary(coords);

      const areaSqM = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      const acres = areaSqM / 4046.856;
      setFarmArea(acres);

      layer.bindPopup(`📏 Area: ${acres.toFixed(2)} acres`).openPopup();
    });

    // On Delete
    map.on(L.Draw.Event.DELETED, () => {
      drawnItems.clearLayers();
      setFarmBoundary(null);
      setFarmArea(null);
      setSoilData(null);
    });
  }, []);

  /* 📍 Helpers */
  const centroid = (coords) => {
    try {
      return L.polygon(coords).getBounds().getCenter();
    } catch {
      const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      const lon = coords.reduce((s, c) => s + c[1], 0) / coords.length;
      return { lat, lng: lon };
    }
  };

  /* 🧪 Soil Data */
  const fetchSoil = async (lat, lon) => {
    try {
      const url = `http://127.0.0.1:5001/agriassistdashboard/us-central1/getSoilData?lat=${lat}&lon=${lon}`;
      const { data } = await axios.get(url);
      return data.soil;
    } catch (e) {
      console.error("Soil fetch failed:", e);
      return { pH: "N/A", SOC: "N/A", clay: "N/A" };
    }
  };

  /* 💾 Save Farm */
  const saveFarm = async () => {
    if (!user) return toast.error("Please log in to save your farm.");
    if (!farmBoundary) return toast.error("Draw your farm first!");

    setFetching(true);
    try {
      const safeBoundary = farmBoundary.map(([lat, lng]) => ({ lat, lng }));
      const { lat, lng } = centroid(farmBoundary);
      const soil = await fetchSoil(lat, lng);

      await setDoc(
        doc(db, "farmers", user.uid),
        {
          farmBoundary: safeBoundary,
          currentActivity: activity,
          farmArea: farmArea || null,
          soilData: soil,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSoilData(soil);
      toast.success("✅ Farm & Soil Data saved successfully!");
    } catch (e) {
      console.error("Firestore save error:", e);
      toast.error("❌ Failed to save.");
    } finally {
      setFetching(false);
    }
  };

  /* 📍 Locate Me */
  const locateUser = () => {
    const map = mapRef.current;
    if (!map) return toast.error("Map not ready");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 15);

        if (map._userMarker) map.removeLayer(map._userMarker);

        const marker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("📍 You are here")
          .openPopup();

        map._userMarker = marker;
      },
      () => toast.error("Location access denied."),
      { enableHighAccuracy: true }
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading Farm Map...
      </div>
    );

  const center = farmBoundary
    ? centroid(farmBoundary)
    : { lat: 20.5937, lng: 78.9629 };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="bottom-right" />

      {/* Top Buttons */}
      <div className="flex justify-between mb-4">
        <Link
          to="/profile"
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          ← Back to Profile
        </Link>
        <button
          onClick={locateUser}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow"
        >
          📍 Locate Me
        </button>
      </div>

      <h1 className="text-3xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
        <MapPin className="text-emerald-600" /> My Smart Farm Map
      </h1>

      <MapContainer
        whenCreated={(map) => (mapRef.current = map)}
        center={[center.lat, center.lng]}
        zoom={farmBoundary ? 12 : 5}
        style={{ height: "500px", borderRadius: "1rem" }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© Esri, Earthstar Geographics"
        />

        <FeatureGroup ref={featureGroupRef}></FeatureGroup>
        <SearchControl />

        {farmBoundary && (
          <Marker position={[center.lat, center.lng]}>
            <Popup>Farm Center</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="mt-4 bg-white p-5 rounded-xl shadow">
        {farmBoundary ? (
          <>
            {farmArea && (
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Ruler size={16} /> <b>Area:</b> {farmArea.toFixed(2)} acres
              </div>
            )}

            <label className="block font-medium mb-1">Current Activity</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option>Idle</option>
              <option>Ploughing</option>
              <option>Sowing</option>
              <option>Irrigating</option>
              <option>Weeding</option>
              <option>Harvesting</option>
            </select>

            <button
              onClick={saveFarm}
              disabled={fetching}
              className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
            >
              {fetching ? "Saving..." : "💾 Save Farm + Analyze Soil"}
            </button>

            {soilData && (
              <div className="mt-4 bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TestTube2 /> Soil Data
                </h4>
                <p>pH: {soilData.pH}</p>
                <p>Organic Carbon: {soilData.SOC}</p>
                <p>Clay %: {soilData.clay}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">
            🪄 Use the draw tool (top-left of map) to mark your farm boundary.
          </p>
        )}
      </div>
    </div>
  );
}