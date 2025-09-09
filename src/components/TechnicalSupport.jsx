import React from "react";
import { Phone, Link as LinkIcon } from "lucide-react";

export default function TechnicalSupport() {
  const technicalSupport = [
    {
      category: "ICAR Support",
      provider: "Indian Council of Agricultural Research (ICAR)",
      service: "Nationwide agricultural research, training, and farmer advisory services.",
      contact: "91-11-25843301",
      tel: "911125843301", // cleaned number for tel link
      link: "https://icar.org.in/",
    },
    {
      category: "Soil Health Card Scheme",
      provider: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
      service: "Soil testing & Soil Health Cards to promote balanced fertilizer use.",
      contact: "Visit nearest District Agriculture Office",
      link: "https://soilhealth.dac.gov.in/",
    },
    {
      category: "Agmarknet Portal",
      provider: "Directorate of Marketing & Inspection (Govt. of India)",
      service: "Nationwide market prices, arrivals, and mandi information.",
      contact: "Online support only",
      link: "https://agmarknet.gov.in/",
    },
    {
      category: "Weather Advisory (IMD Agromet)",
      provider: "India Meteorological Department",
      service: "District-specific weather forecasts and agro-advisories.",
      contact: "Check IMD website or nearest Agromet unit",
      link: "https://mausam.imd.gov.in/",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Technical Support</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicalSupport.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-900 rounded-lg p-6 
                       border border-neutral-200 dark:border-neutral-800 
                       shadow-sm hover:shadow-md 
                       border-l-4 border-l-purple-500 
                       transition"
          >
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {item.category}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {item.service}
            </p>
            <div className="text-sm text-neutral-500 mb-4">
              <strong>Provider:</strong> {item.provider}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              {item.tel ? (
                <a
                  href={`tel:${item.tel}`}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:underline"
                >
                  <Phone size={14} /> {item.contact}
                </a>
              ) : (
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Phone size={14} /> {item.contact}
                </span>
              )}

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-purple-600 hover:underline flex items-center gap-1"
              >
                Learn More <LinkIcon size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
