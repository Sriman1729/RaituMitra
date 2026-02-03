import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function GovernmentSchemes() {
  const [search, setSearch] = useState("");

  const schemes = [
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
      link: "https://www.nabard.org/content.aspx?id=0,22",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      color: "text-purple-600",
      tags: ["credit", "loan"],
    },
    {
      category: "Income & Credit",
      name: "Pradhan Mantri Shram Yogi Maan-Dhan (PM-SYM)",
      desc: "Pension scheme for unorganized workers in agriculture & allied sectors.",
      link: "https://www.pmsym.nic.in/",
      bg: "bg-lime-50 dark:bg-lime-900/30",
      color: "text-lime-600",
      tags: ["pension", "support", "farmers"],
    },
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
      category: "Sustainable & Climate",
      name: "National Mission on Sustainable Agriculture (NMSA)",
      desc: "Schemes for climate-resilient farming and sustainable practices.",
      link: "https://nmsa.dac.gov.in/",
      bg: "bg-orange-50 dark:bg-orange-900/30",
      color: "text-orange-600",
      tags: ["sustainable", "climate"],
    },
    {
      category: "Sustainable & Climate",
      name: "Paramparagat Krishi Vikas Yojana (PKVY)",
      desc: "Promotes organic farming and eco-friendly practices.",
      link: "https://pgsindia-ncof.gov.in/",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      color: "text-amber-600",
      tags: ["organic", "sustainable", "climate"],
    },
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
      category: "Soil & Research",
      name: "Soil Health Card Scheme",
      desc: "Check soil nutrients and get advice on fertilizer use for higher yields.",
      link: "https://soilhealth.dac.gov.in/",
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      color: "text-yellow-600",
      tags: ["soil", "fertilizer"],
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
    <div className="relative p-4 md:p-10">
      {/* ✨ Aurora Glow Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[50rem] w-[50rem] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-green-400 via-violet-400 to-fuchsia-400 dark:from-fuchsia-600/30 dark:via-violet-600/30 dark:to-indigo-600/30 animate-pulse" />
      </div>

      {/* 🏷 Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 relative z-10"
      >
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-violet-500 to-fuchsia-500 dark:from-fuchsia-400 dark:via-violet-400 dark:to-indigo-400 mb-3">
          🌿 Government Schemes for Farmers
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore verified central and state government schemes that empower farmers through funding, insurance, and innovation.
        </p>
      </motion.div>

      {/* 🔍 Search Bar */}
      <div className="mb-8 relative z-10">
        <input
          type="text"
          placeholder="🔍 Search schemes (e.g., insurance, credit, skill)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 text-base border rounded-lg shadow-sm bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-400 dark:focus:ring-fuchsia-400 outline-none transition"
        />
      </div>

      {/* 📋 Schemes Grid */}
      <div className="relative z-10">
        {Object.keys(groupedSchemes).length > 0 ? (
          Object.keys(groupedSchemes).map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h3 className="text-2xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-violet-500 dark:from-fuchsia-400 dark:to-violet-400">
                {category}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedSchemes[category].map((scheme, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all ${scheme.bg}`}
                    >
                      <CardContent className="space-y-3 p-5">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                          {scheme.name}
                        </h3>
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
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-lg text-center mt-10">
            ❌ No schemes found. Try another keyword.
          </p>
        )}
      </div>
    </div>
  );
}
