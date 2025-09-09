import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function GovernmentSchemes() {
  const [search, setSearch] = useState("");

  const schemes = [
    // 💰 Income & Credit
    {
      category: "Income & Credit",
      name: "PM-Kisan Samman Nidhi",
      desc: "Direct income support of ₹6,000/year for all eligible farmer families.",
      link: "https://pmkisan.gov.in/",
      bg: "bg-green-50 dark:bg-green-900/30",
      color: "text-green-600",
      tags: ["income", "support"],
    },
    {
      category: "Income & Credit",
      name: "Kisan Credit Card (KCC)",
      desc: "Low-interest credit facility for farmers to cover cultivation costs.",
      link: "https://www.nabard.org/",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      color: "text-purple-600",
      tags: ["credit", "loan"],
    },

    // 🌾 Crop Insurance & Risk
    {
      category: "Crop Insurance & Risk",
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      desc: "Crop insurance against natural calamities, pests, and diseases.",
      link: "https://pmfby.gov.in/",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      color: "text-blue-600",
      tags: ["insurance", "crop", "risk"],
    },
    {
      category: "Crop Insurance & Risk",
      name: "Restructured Weather Based Crop Insurance Scheme (RWBCIS)",
      desc: "Provides insurance against adverse weather events affecting crops.",
      link: "https://pmfby.gov.in/",
      bg: "bg-sky-50 dark:bg-sky-900/30",
      color: "text-sky-600",
      tags: ["insurance", "weather", "risk"],
    },

    // 🌍 Sustainable & Climate
    {
      category: "Sustainable & Climate",
      name: "National Mission on Sustainable Agriculture (NMSA)",
      desc: "Schemes for climate-resilient farming and sustainable practices.",
      link: "https://nmsa.dac.gov.in/",
      bg: "bg-orange-50 dark:bg-orange-900/30",
      color: "text-orange-600",
      tags: ["sustainable", "climate"],
    },

    // 💧 Irrigation & Water
    {
      category: "Irrigation & Water",
      name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      desc: "Improved irrigation facilities and efficient water management.",
      link: "https://pmksy.gov.in/",
      bg: "bg-teal-50 dark:bg-teal-900/30",
      color: "text-teal-600",
      tags: ["irrigation", "water"],
    },
    {
      category: "Irrigation & Water",
      name: "Per Drop More Crop (PDMC)",
      desc: "Promotes micro-irrigation to save water and increase productivity.",
      link: "https://pmksy.gov.in/",
      bg: "bg-cyan-50 dark:bg-cyan-900/30",
      color: "text-cyan-600",
      tags: ["micro", "irrigation", "water"],
    },

    // 🔬 Soil & Research
    {
      category: "Soil & Research",
      name: "Soil Health Card Scheme",
      desc: "Check soil nutrients and get advice on fertilizer use for higher yields.",
      link: "https://soilhealth.dac.gov.in/",
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      color: "text-yellow-600",
      tags: ["soil", "fertilizer"],
    },
    {
      category: "Soil & Research",
      name: "National Agricultural Innovation Project (NAIP)",
      desc: "Supports research & technology development for farming.",
      link: "https://icar.org.in/",
      bg: "bg-stone-50 dark:bg-stone-900/30",
      color: "text-stone-600",
      tags: ["research", "innovation"],
    },

    // 🛠 Skill & Infrastructure
    {
      category: "Skill & Infrastructure",
      name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY) – Agriculture Skill Development",
      desc: "Training and skill development for farmers to improve agricultural practices.",
      link: "https://www.pmkvyofficial.org/",
      bg: "bg-pink-50 dark:bg-pink-900/30",
      color: "text-pink-600",
      tags: ["skill", "training", "development"],
    },
    {
      category: "Skill & Infrastructure",
      name: "Agriculture Infrastructure Fund (AIF)",
      desc: "Financial support for building post-harvest and farmgate infrastructure.",
      link: "https://agricoop.nic.in/en/Agriculture-Infrastructure-Fund",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
      color: "text-indigo-600",
      tags: ["infrastructure", "funding", "agriculture"],
    },
    {
      category: "Skill & Infrastructure",
      name: "e-NAM Expansion Scheme",
      desc: "Improves market access and transparency for farmers through online trading.",
      link: "https://enam.gov.in/",
      bg: "bg-rose-50 dark:bg-rose-900/30",
      color: "text-rose-600",
      tags: ["market", "trade", "transparency"],
    },
  ];

  const filteredSchemes = schemes.filter(
    (scheme) =>
      scheme.name.toLowerCase().includes(search.toLowerCase()) ||
      scheme.desc.toLowerCase().includes(search.toLowerCase()) ||
      scheme.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
  );

  const groupedSchemes = filteredSchemes.reduce((groups, scheme) => {
    if (!groups[scheme.category]) groups[scheme.category] = [];
    groups[scheme.category].push(scheme);
    return groups;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌿 Government Schemes</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search schemes (e.g., insurance, credit, skill)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 text-base border rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-green-500 focus:outline-none 
                     dark:bg-gray-800 dark:text-white"
        />
      </div>

      {Object.keys(groupedSchemes).length > 0 ? (
        Object.keys(groupedSchemes).map((category) => (
          <div key={category} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedSchemes[category].map((scheme, idx) => (
                <Card
                  key={idx}
                  className={`rounded-xl shadow hover:shadow-xl hover:scale-[1.02] transition ${scheme.bg}`}
                >
                  <CardContent className="space-y-3 p-5">
                    <h3 className="font-semibold text-lg">{scheme.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {scheme.desc}
                    </p>
                    <a
                      href={scheme.link}
                      className={`block w-full text-center font-medium ${scheme.color} hover:underline`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          ❌ No schemes found. Try another keyword.
        </p>
      )}
    </div>
  );
}
