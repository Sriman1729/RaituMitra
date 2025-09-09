import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Sprout,
  CloudSun,
  CalendarDays,
  BookOpen,
  User,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10 relative">
      {/* Gradient border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-lime-400 to-green-600"></div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <Home size={16} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/crop-recommendation"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <Sprout size={16} /> Crop Recommendation
              </Link>
            </li>
            <li>
              <Link
                to="/weather"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <CloudSun size={16} /> Weather
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <CalendarDays size={16} /> PlantingCalendar
              </Link>
            </li>
            <li>
              <Link
                to="/resources"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <BookOpen size={16} /> Resources
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <User size={16} /> Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">
            Contact
          </h4>
          <p className="text-sm text-gray-400">
            📧 Email:{" "}
            <span className="text-gray-300">farmer.assist@example.com</span>
          </p>
          <p className="text-sm text-gray-400">
            📞 Helpline:{" "}
            <a
              href="tel:1800-XXXXX"
              className="text-gray-300 hover:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              1800-XXXXX
            </a>
          </p>
        </div>

        {/* Government Helplines */}
        <div>
          <h4 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">
            Government Helplines
          </h4>
          <p className="text-sm text-gray-400">
            Kisan Call Center:{" "}
            <a
              href="tel:011-23382292"
              className="text-gray-300 hover:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              011-23382292
            </a>
            <span className="block text-xs text-gray-500">⏰ 6AM - 10PM</span>
          </p>
          <p className="text-sm text-gray-400">
            Weather Alert:{" "}
            <a
              href="tel:1800-180-1717"
              className="text-gray-300 hover:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              1800-180-1717
            </a>
            <span className="block text-xs text-gray-500">⏰ 24/7</span>
          </p>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-800 py-4">
        © 2025{" "}
        <span className="text-green-400 font-semibold">Farmer Assistant</span> |
        Empowering Farmers 🌱
      </div>
    </footer>
  );
}
