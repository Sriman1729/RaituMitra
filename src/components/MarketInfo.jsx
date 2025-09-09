import React from "react";
import CardShell from "./CardShell";

export default function MarketInfo() {
  const prices = [
    { crop: "Tomato", price: "₹2,800 / quintal", trend: "Rising" },
    { crop: "Paddy", price: "₹2,400 / quintal", trend: "Falling" },
    { crop: "Wheat", price: "₹2,000 / quintal", trend: "Stable" },
    { crop: "Onion", price: "₹3,200 / quintal", trend: "Rising" },
    { crop: "Maize", price: "₹1,850 / quintal", trend: "Falling" },
  ];

  const dot = {
    Rising: "bg-emerald-500",
    Falling: "bg-rose-500",
    Stable: "bg-neutral-400",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight mb-4">Market Prices</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((item, idx) => (
          <CardShell key={idx}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium">{item.crop}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                  {item.price}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                <span className={`h-2 w-2 rounded-full ${dot[item.trend]}`} />
                {item.trend}
              </span>
            </div>
          </CardShell>
        ))}
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Demo data (DIdn't get API's related to Market)
      </p>
    </div>
  );
}
