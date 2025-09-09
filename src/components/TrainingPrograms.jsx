import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function TrainingPrograms() {
  const programs = [
    {
      title: "Online Training: Impactful AI Tools in Agriculture",
      date: "Sep 15–19, 2025",
      link: "https://naarm.org.in/ongoing-training-programs/",
      provider: "NAARM (ICAR)",
    },
    {
      title: "Precision Agriculture Using Drones & Remote Sensing",
      date: "Dec 1–5, 2025",
      link: "https://naarm.org.in/ongoing-training-programs/",
      provider: "NAARM (ICAR)",
    },
    {
      title: "30-Day International Training on Natural Farming & AI",
      date: "Aug 16–Sep 16, 2025",
      link: "#",
      provider: "Gujarat Natural Farming Science University / ICAR",
    },
    {
      title: "Organic Farming Certificate Course – 21 Days",
      date: "Ongoing",
      link: "https://nconf.dac.gov.in/21DaysCertificateCourse",
      provider: "NCOF",
    },
    {
      title: "Short-duration Skill Programs via STRY / ATMA",
      date: "Ongoing",
      link: "#",
      provider: "KVKs / ATMA / STRY",
    },
    {
      title: "Climate-Smart Agriculture & Water Management",
      date: "Feb 2026",
      link: "https://icar.org.in/",
      provider: "ICAR Institutes & State Agriculture Universities",
    },
    {
      title: "Agri-Entrepreneurship & Rural Innovation Bootcamp",
      date: "Ongoing",
      link: "#",
      provider: "MANAGE (Hyderabad)",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🎓 Training Programs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program, idx) => (
          <Card
            key={idx}
            className="bg-white dark:bg-neutral-900 rounded-lg 
                       border border-neutral-200 dark:border-neutral-800 
                       shadow-sm hover:shadow-md 
                       border-l-4 border-l-green-500 
                       transition"
          >
            <CardContent className="p-5 space-y-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {program.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {program.provider}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {program.date}
              </p>
              <a
                href={program.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
              >
                Register / Learn More →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
