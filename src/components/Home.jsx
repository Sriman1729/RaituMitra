import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Sparkles, ArrowRight, ChevronRight,Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import MagicBento from "../components/MagicBento"; // ✅ Ignore styling from here
import RotatingText from "../components/RotatingText";

/* -----------------------------
   Motion Variants
------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.21, 1, 0.21, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.21, 1, 0.21, 1] },
  },
};

/* -----------------------------
   Background FX – Aurora Glow
------------------------------ */
function AuroraBG() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(139,92,246,0.25),transparent_60%)] dark:bg-[radial-gradient(70%_50%_at_50%_0%,rgba(139,92,246,0.25),transparent_60%)]" />
      <div className="absolute -top-40 -left-20 h-[60rem] w-[60rem] rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-fuchsia-400/30 via-violet-400/20 to-indigo-400/20 dark:from-fuchsia-600/40 dark:via-violet-500/30 dark:to-indigo-600/30 animate-pulse" />
      <div
        className="absolute -bottom-40 -right-20 h-[55rem] w-[55rem] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-indigo-400/20 via-violet-400/20 to-fuchsia-400/30 dark:from-indigo-600/30 dark:via-violet-500/30 dark:to-fuchsia-600/40 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
    </div>
  );
}

/* -----------------------------
   Reusable UI Elements
------------------------------ */
function GlowButton({ children, as: As = "button", className = "", ...props }) {
  return (
    <As
      className={
        "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] " +
        "text-white dark:text-white " +
        "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_25px_-8px_rgba(139,92,246,0.6)] dark:shadow-[0_0_30px_-8px_rgba(139,92,246,0.9)] " +
        className
      }
      {...props}
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </As>
  );
}

function Chip({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-3 py-1 text-xs text-gray-700 dark:text-white/80">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

/* -----------------------------
   Hero Section
------------------------------ */
function Hero() {
  const sentence ="RAITU MITRA";
  const chars = sentence.split("");

  return (
    <section id="home" className="relative">
      <AuroraBG />
      <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-32 flex flex-col justify-center min-h-[80vh]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6 text-center"
        >
          <motion.div variants={fadeUp}>
            <Chip>Sri Raamaya Namaha..Bringing AI to Every Indian Farm </Chip>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl flex flex-wrap justify-center gap-y-1 text-gray-900 dark:text-white"
          >
            {chars.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: i * 0.04,
                  duration: 0.5,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className={`${
                  "RAITU MITRA".includes(char)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 animate-glow"
                    : ""
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* 🔁 Rotating Keyword Text */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-2xl text-base text-gray-700 dark:text-white/70 md:text-lg flex flex-wrap justify-center items-center gap-2"
          >
            Empowering farmers with{" "}
            <RotatingText
              texts={[
                "Real-time weather ⛅",
                "Market Prices $",
                "Crop Advisory 🌱",
                "Fertilizer Calculator 🧪",
                "Pest and Disease Alerts 🐛",
                "Government Schemes 🏛️",
              ]}
              rotationInterval={2500}
              splitBy="words"
              staggerDuration={0.05}
              mainClassName="inline-block font-semibold"
              elementLevelClassName="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500"
            />
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex justify-center gap-3 pt-2">
            <GlowButton as={Link} to="/crop">
              Get Crop Advisory
            </GlowButton>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-5 py-2.5 text-sm text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
            >
              Admin Portal <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-20 w-full max-w-6xl"
        >
          <MagicBento enableSpotlight enableStars enableTilt glowColor="132, 0, 255" particleCount={10} />
        </motion.div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 0 0 8px rgba(217, 70, 239, 0.6),
                         0 0 20px rgba(167, 139, 250, 0.4),
                         0 0 30px rgba(99, 102, 241, 0.3);
          }
          50% {
            text-shadow: 0 0 12px rgba(217, 70, 239, 0.9),
                         0 0 25px rgba(167, 139, 250, 0.6),
                         0 0 40px rgba(99, 102, 241, 0.5);
          }
        }
        .animate-glow {
          animation: glowPulse 3s ease-in-out infinite;
        }
        .text-rotate-element {
          text-shadow: 0 0 6px rgba(139, 92, 246, 0.4),
                       0 0 12px rgba(167, 139, 250, 0.3),
                       0 0 18px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </section>
  );
}

/* -----------------------------
   Stats Section
------------------------------ */
function Stats() {
const items = [
    { kpi: "🚀Calculator", label: "Multi Crop Fertilizer Calculator ", link: "/fertilizer" },
    { kpi: "🐛", label: "Pests and Disease", link: "/alerts" },
    { kpi: "99.9%", label: "Accurate Weather API", link: "/weather" },
    { kpi: "Market Prices", label: "30 days Market price trends", link: "/market" },
  ];

  return (
    <section className="relative py-12 sm:py-14 lg:py-16 overflow-hidden">
      {/* Subtle gradient glow in background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-100/10 to-transparent dark:via-violet-900/10 blur-3xl pointer-events-none"></div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 relative z-10">
        {items.map((it) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
          >
            <Link
              to={it.link}
              className="group relative block overflow-hidden rounded-2xl border border-violet-200/30 dark:border-violet-500/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-lg shadow-md transition-all duration-700 hover:border-violet-400/50 hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.4)]"
            >
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-violet-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

              <div className="relative z-10 flex flex-col items-center justify-center text-center py-6">
                {/* KPI Text with gradient shimmer */}
                <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                  {it.kpi}
                </h3>

                {/* Label below KPI */}
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-violet-600 dark:group-hover:text-violet-300">
                  {it.label}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Infinite shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }

        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

/* -----------------------------
   Testimonials Section
------------------------------ */
function Testimonials() {
  const testimonials = [
    { quote: "Raitu Mitra helped me choose the right fertilizer — saved money and improved yield!", name: "Suresh • Andhra Pradesh" },
    { quote: "Accurate weather predictions helped me plan irrigation better.", name: "Kiran • Telangana" },
    { quote: "Clean UI and easy to use even in rural areas. Feels futuristic!", name: "Meena • Agri Student" },
    { quote: "A true digital friend for farmers. Love how simple it is!", name: "Rajesh • Maharashtra" },
    { quote: "Real-time alerts saved my crop from a pest outbreak!", name: "Chandra • Karnataka" },
    { quote: "Our entire farmer group uses it now — best community app ever!", name: "Anita • Tamil Nadu" },
  ];

  const loopTestimonials = [...testimonials, ...testimonials];
  const controls = useAnimation();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: { ease: "linear", duration: 25, repeat: Infinity },
    });
  }, [controls]);

  const toggleScroll = () => {
    if (paused) {
      controls.start({
        x: ["0%", "-50%"],
        transition: { ease: "linear", duration: 25, repeat: Infinity },
      });
    } else {
      controls.stop();
    }
    setPaused(!paused);
  };

  return (
    <section id="farmers" className="relative py-20 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 mb-12"
        >
          Loved by Farmers Across India
        </motion.h2>

        <div className="relative flex overflow-hidden cursor-pointer" onClick={toggleScroll}>
          <motion.div className="flex gap-4" animate={controls} initial={{ x: "0%" }}>
            {loopTestimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-[320px] rounded-3xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-6 shadow-[0_0_30px_-12px_rgba(139,92,246,0.3)] dark:shadow-[0_0_40px_-12px_rgba(139,92,246,0.4)] transition-all duration-300"
              >
                <p className="text-gray-800 dark:text-white/90 text-sm leading-relaxed italic">
                  “{t.quote}”
                </p>
                <div className="mt-4 text-xs text-violet-600 dark:text-violet-300">
                  {t.name}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------
   Final CTA
------------------------------ */
function FinalCTA() {
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

  return (
    <section className="relative py-20 overflow-hidden">
      {/* 🌌 Subtle background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative rounded-[2rem] border border-violet-400/20 shadow-[0_0_60px_-20px_rgba(139,92,246,0.5)] overflow-hidden"
        >
          {/* ✨ Sparkly Noise Layer (like ReactBits) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-40 mix-blend-soft-light pointer-events-none" />

          {/* 💜 Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-700 animate-gradientMove opacity-90" />

          {/* 🌾 Content */}
          <div className="relative z-10 p-12 sm:p-16">
            <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Grow Smarter with <span className="text-violet-200">Raitu Mitra</span>
            </h3>
            <p className="text-lg text-violet-100/90 max-w-2xl mx-auto mb-8">
              Personalized crop insights, weather intelligence, and AI-powered decisions — all in one click.
            </p>

            <div className="flex justify-center">
              <Link
                to="/crop"
                className="inline-flex items-center justify-center rounded-full bg-white text-violet-700 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-violet-400/30 hover:scale-105 transition-all duration-500"
              >
                Get Crop Advisory
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 🌈 Animations */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

/* -----------------------------
   Page Export
------------------------------ */
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-[#0b0b0f] dark:text-white transition-colors duration-500">
      <Hero />
      <Stats />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
