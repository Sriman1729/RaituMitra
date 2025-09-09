const staticMarketData = [
  { crop: "Paddy", price: "₹1,950/quintal", location: "Andhra Pradesh" },
  { crop: "Wheat", price: "₹2,125/quintal", location: "Punjab" },
  { crop: "Cotton", price: "₹5,800/quintal", location: "Telangana" },
  { crop: "Soybean", price: "₹4,000/quintal", location: "Madhya Pradesh" }
]

export async function fetchMarketInsights() {
  try {
    const url = import.meta.env.VITE_MARKET_API_URL
    if (!url) throw new Error("No API URL")
    const res = await fetch(url)
    if (!res.ok) throw new Error("API failed")
    const data = await res.json()
    return data
  } catch (err) {
    console.warn("Market API failed, using demo data(Sry for that it is not in our hands):", err.message)
    return staticMarketData
  }
}

export default staticMarketData
