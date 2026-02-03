import React, { useState } from "react";

/**
 * DiseaseDetect.jsx
 * - Expects backend at http://127.0.0.1:8000/predict
 * - Response format:
 *   {
 *     leaf_preview: "<base64 jpeg>",
 *     best: { label, friendly, crop, confidence, remedies: [...] },
 *     top3: [{label, confidence}, ...],
 *     severity: "High"|"Moderate"|"Low"|"None"|"Unknown",
 *     is_unknown: false
 *   }
 */

const API_URL = "http://127.0.0.1:8000/predict";

export default function DiseaseDetect() {
  const [file, setFile] = useState(null);
  const [origPreview, setOrigPreview] = useState(null);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      setOrigPreview(null);
      setResp(null);
      setError(null);
      return;
    }
    setFile(f);
    setOrigPreview(URL.createObjectURL(f));
    setResp(null);
    setError(null);
  }

  async function analyze() {
    if (!file) return setError("Please choose an image first.");
    setError(null);
    setLoading(true);
    setResp(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const r = await fetch(API_URL, { method: "POST", body: fd });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`Server ${r.status}: ${txt}`);
      }
      const data = await r.json();

      if (data.error) {
        setError(data.error);
        setResp(null);
      } else {
        setResp(data);
      }
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Check backend or CORS. " + (err.message || ""));
      setResp(null);
    } finally {
      setLoading(false);
    }
  }

  const pct = (v) => `${(v * 100).toFixed(2)}%`;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🌿 Pest & Disease Detector</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload column */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:bg-green-600 file:text-white rounded-md"
          />

          {origPreview && (
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-1">Original preview</div>
              <img src={origPreview} alt="orig" className="rounded-md shadow-sm w-full object-cover" />
            </div>
          )}

          <button
            onClick={analyze}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded-md font-semibold text-white ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {error && (
            <div className="mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            Tip: take a clear photo of a single leaf on a plain background for best results.
          </div>
        </div>

        {/* Results column */}
        <div className="md:col-span-2 space-y-4">
          {!resp && !error && (
            <div className="p-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm">
              Upload a leaf photo and press <strong>Analyze</strong>. The app will detect the leaf, run the model, and show results.
            </div>
          )}

          {resp && (
            <div className="space-y-4">
              {/* Top card */}
              <div className="p-4 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Crop</div>
                    <div className="text-lg font-semibold">{resp.best.crop}</div>

                    <div className="mt-3 text-xs text-gray-500">Diagnosis</div>
                    <div className="text-xl font-bold">{resp.best.friendly || resp.best.label}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Severity</div>
                    <SeverityBadge severity={resp.severity} />

                    <div className="mt-4 text-xs text-gray-500">Confidence</div>
                    <div className="text-lg font-semibold">{pct(resp.best.confidence)}</div>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-3 transition-all ${progressColorClass(resp.best.confidence)}`}
                    style={{ width: `${resp.best.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Leaf preview + remedies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="col-span-1">
                  <div className="text-xs text-gray-500 mb-1">Detected leaf (cropped)</div>
                  {resp.leaf_preview ? (
                    <img
                      src={`data:image/jpeg;base64,${resp.leaf_preview}`}
                      alt="leaf"
                      className="rounded-md shadow-sm w-full object-cover"
                    />
                  ) : (
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 h-40 flex items-center justify-center text-sm text-gray-500">
                      No leaf preview
                    </div>
                  )}
                </div>

                <div className="col-span-2 space-y-3">
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <h4 className="font-semibold mb-2">Suggested actions</h4>
                    {resp.best.remedies && resp.best.remedies.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                        {resp.best.remedies.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-600">No specific remedies available.</div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg border bg-white dark:bg-gray-800">
                    <h4 className="font-semibold mb-2">Top 3 predictions</h4>
                    <ul className="space-y-2">
                      {resp.top3.map((t, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <div>
                            <div className={`text-sm font-medium ${i === 0 ? "text-green-700 dark:text-green-300" : ""}`}>
                              {i === 0 ? "✓ " : ""}{prettyLabel(t.label)}
                            </div>
                            <div className="text-xs text-gray-500">{t.label}</div>
                          </div>
                          <div className="text-sm font-semibold">{pct(t.confidence)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Small helper components
   ------------------------- */

function SeverityBadge({ severity }) {
  const map = {
    High: "bg-red-600 text-white",
    Moderate: "bg-orange-500 text-white",
    Low: "bg-yellow-400 text-black",
    None: "bg-green-500 text-white",
    Unknown: "bg-gray-400 text-white",
  };
  return <div className={`px-3 py-1 rounded-full text-sm ${map[severity] || map.Unknown}`}>{severity}</div>;
}

function progressColorClass(conf) {
  if (conf >= 0.9) return "bg-red-600"; // high = red (danger)
  if (conf >= 0.7) return "bg-orange-400";
  if (conf >= 0.4) return "bg-yellow-400";
  return "bg-gray-400";
}

function prettyLabel(label) {
  // convert underscores to spaces & fix common double-underscores
  return label.replace(/__/g, " - ").replace(/_/g, " ");
}