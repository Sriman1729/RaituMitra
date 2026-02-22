import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// 🌿 Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import CropRecommendation from "./components/CropRecommendation";
import Weather from "./components/Weather";
import PlantingCalendar from "./components/PlantingCalendar";
import Resources from "./components/Resources";
import MarketInsights from "./components/MarketInsights";
import FertilizerCalculator from "./components/FertilizerCalculator";
import PestAlerts from "./components/PestAlerts";
import MarketUpdates from "./components/MarketUpdates";
import FloatingHomeButton from "./components/FloatingHomeButton";
import FarmersVoice from "./components/FarmersVoice";

// 👩‍💼 Admin
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import AdminLogin from "./components/AdminLogin";

// 👨‍🌾 Farmer
import FarmerLogin from "./components/FarmerLogin";
import Profile from "./components/Profile";
import ProtectedFarmerRoute from "./components/ProtectedFarmerRoute";

// 🌗 Context + Animations
import { DarkModeProvider } from "./context/DarkModeContext";
import PageTransition from "./components/PageTransition";

// 🌱 NEW AI Detection Component
import DiseaseDetect from "./components/DiseaseDetect";

/* -----------------------------
   ⚡ Custom 404 Page
------------------------------ */
function NotFound() {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setGlitch((g) => !g), 400 + Math.random() * 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#0b0b0f] text-center p-10 text-white">
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`relative text-8xl font-extrabold tracking-tight ${
          glitch ? "text-green-400 blur-[1.5px]" : "text-white"
        }`}
      >
        4<span className="text-emerald-400">0</span>4
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-white/70 mt-4"
      >
        Oops! Looks like you wandered off the digital farm 🌾
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-indigo-600 text-white shadow-lg hover:scale-[1.05]"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

/* -----------------------------
   🌾 Main App Component
------------------------------ */
export default function App() {
  const location = useLocation();

  // Remove Google Translate artifacts
  useEffect(() => {
    const clean = () => {
      [".skiptranslate", ".goog-te-gadget", ".goog-te-combo"].forEach((sel) =>
        document.querySelector(sel)?.remove()
      );
      document.body.style.top = "0px";
    };

    let tries = 0;
    const interval = setInterval(() => {
      clean();
      tries++;
      if (tries > 20) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Hide header/footer for login routes
  const noLayoutRoutes = ["/admin", "/farmer-login"];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {showLayout && <Header />}

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              {/* 🏠 Home */}
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />

              {/* 🌱 NEW — AI Disease/Pest Detection */}
              <Route
                path="/detect"
                element={
                  <PageTransition>
                    <DiseaseDetect />
                  </PageTransition>
                }
              />

              {/* 👨‍🌾 Farmers Feedback */}
              <Route
                path="/farmers"
                element={
                  <ProtectedFarmerRoute>
                    <PageTransition>
                      <FarmersVoice />
                    </PageTransition>
                  </ProtectedFarmerRoute>
                }
              />

              {/* 👩‍💼 Admin */}
              <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRouteAdmin>
                    <PageTransition>
                      <AdminDashboard />
                    </PageTransition>
                  </ProtectedRouteAdmin>
                }
              />

              {/* 👨‍🌾 Farmer Auth + Profile */}
              <Route path="/farmer-login" element={<PageTransition><FarmerLogin /></PageTransition>} />
              <Route
                path="/profile"
                element={
                  <ProtectedFarmerRoute>
                    <PageTransition>
                      <Profile />
                    </PageTransition>
                  </ProtectedFarmerRoute>
                }
              />


              {/* 🌿 Farmer Tools */}
              <Route path="/crop" element={<PageTransition><CropRecommendation /></PageTransition>} />
              <Route path="/weather" element={<PageTransition><Weather /></PageTransition>} />
              <Route path="/calendar" element={<PageTransition><PlantingCalendar /></PageTransition>} />
              <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
              <Route path="/market" element={<PageTransition><MarketInsights /></PageTransition>} />
              <Route path="/fertilizer" element={<PageTransition><FertilizerCalculator /></PageTransition>} />
              <Route path="/alerts" element={<PageTransition><PestAlerts /></PageTransition>} />
              <Route path="/updates" element={<PageTransition><MarketUpdates /></PageTransition>} />

              {/* ❌ 404 */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

            </Routes>
          </AnimatePresence>
        </main>

        {showLayout && <Footer />}
        <FloatingHomeButton />
      </div>
    </DarkModeProvider>
  );
}