import React, { useState, useRef, useEffect } from "react";
import demoLeaf from "../assets/demo-leaf.jpeg";

const API_URL = "https://raitumitra-backend.onrender.com/predict";

export default function DiseaseDetect() {
  const [file, setFile] = useState(null);
  const [origPreview, setOrigPreview] = useState(null);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGradcam, setShowGradcam] = useState(false);

  const fileInputRef = useRef();

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (origPreview) URL.revokeObjectURL(origPreview);
    };
  }, [origPreview]);

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    setOrigPreview(URL.createObjectURL(f));
    setResp(null);
    setError(null);
    setShowGradcam(false);
  }

  async function analyze() {
    if (!file) return setError("Upload image first.");

    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const r = await fetch(API_URL, {
        method: "POST",
        body: fd,
      });

      if (!r.ok) {
        const text = await r.text();
        throw new Error(text);
      }

      const data = await r.json();
      setResp(data);
    } catch (err) {
      setError("Backend error. Check server.");
      setResp(null);
    } finally {
      setLoading(false);
    }
  }

  const pct = (v) => `${(v * 100).toFixed(2)}%`;
  const isHealthy =
    resp?.best?.label?.toLowerCase().includes("healthy") ?? false;

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h2 className="text-2xl font-bold text-center mb-8">
        Pest & Disease Detector
      </h2>

      {/* ================= UPLOAD SECTION ================= */}
      {!resp && (
        <div className="text-center space-y-6">

          <div
            className="border-2 border-dashed p-10 rounded-xl cursor-pointer hover:bg-gray-50 transition"
            onClick={() => fileInputRef.current.click()}
          >
            Drag & Drop or Click to Upload
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) =>
                handleFile(e.target.files?.[0])
              }
            />
          </div>

          {origPreview && (
            <img
              src={origPreview}
              alt="preview"
              className="mx-auto max-h-72 rounded-lg shadow-md"
            />
          )}

          <button
            onClick={analyze}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

          {error && (
            <div className="text-red-600">{error}</div>
          )}
        </div>
      )}

      {/* ================= RESULT SECTION ================= */}
      {resp && (
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <div>
              <h4 className="font-semibold mb-2">
                Uploaded Image
              </h4>
              <img
                src={`data:image/jpeg;base64,${resp.leaf_preview}`}
                alt="leaf"
                className="rounded-xl shadow-md"
              />
            </div>

            {resp.gradcam && (
              <div>
                <button
                  onClick={() =>
                    setShowGradcam(!showGradcam)
                  }
                  className="mb-3 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
                >
                  {showGradcam
                    ? "Hide Model Attention"
                    : "Show Model Attention (Grad-CAM)"}
                </button>

                {showGradcam && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      Model Attention
                    </h4>
                    <img
                      src={`data:image/jpeg;base64,${resp.gradcam}`}
                      alt="gradcam"
                      className="rounded-xl shadow-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT RESULT CARD */}
          <div
            className={`rounded-xl shadow-lg p-6 border-t-4 ${
              isHealthy
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="text-center mb-6">
              {isHealthy ? (
                <>
                  <div className="text-green-600 text-sm font-semibold mb-2">
                    HEALTHY PLANT
                  </div>
                  <div className="text-green-600 text-5xl">
                    ✔
                  </div>
                </>
              ) : (
                <>
                  <div className="text-red-600 text-sm font-semibold mb-2">
                    DISEASE DETECTED
                  </div>
                  <div className="text-red-600 text-5xl">
                    ✖
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
              <div className="text-xs text-gray-500">
                PLANT TYPE
              </div>
              <div className="text-lg font-semibold">
                {resp.best.crop}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
              <div className="text-xs text-gray-500">
                CONDITION
              </div>
              <div
                className={`font-semibold ${
                  isHealthy
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {resp.best.friendly}
              </div>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${
                isHealthy
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "bg-red-50 border-l-4 border-red-500"
              }`}
            >
              <h4 className="font-semibold mb-2">
                Recommended Actions
              </h4>

              <ul className="text-sm space-y-1">
                {(resp.best.suggested_actions || []).map(
                  (a, i) => (
                    <li key={i}>• {a}</li>
                  )
                )}
              </ul>
            </div>

            {/* TOP 3 WITH PROGRESS BARS */}
            <div>
              <h4 className="font-semibold mb-2">
                Top 3 Predictions
              </h4>

              <div className="space-y-3 text-sm">
                {resp.top3.map((t, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span>
                        {t.label
                          .replace(/__/g, " - ")
                          .replace(/_/g, " ")}
                      </span>
                      <span>{pct(t.confidence)}</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-green-500 h-2 rounded"
                        style={{
                          width: `${t.confidence * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setResp(null);
                setFile(null);
                setOrigPreview(null);
                setShowGradcam(false);
              }}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      )}

      {/* ================= TIPS SECTION ================= */}
      <div className="mt-16 bg-gray-50 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-center">
          Tips for Best Results
        </h3>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <Tip text="Take photos in good lighting" />
          <Tip text="Focus on affected area" />
          <Tip text="Keep camera steady" />
          <Tip text="Avoid blurry images" />
        </div>

        <img
          src={demoLeaf}
          alt="demo"
          className="mx-auto mt-6 w-56 rounded-md shadow-md"
        />
      </div>
    </div>
  );
}

function Tip({ text }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm text-gray-700">
      ✔ {text}
    </div>
  );
}
