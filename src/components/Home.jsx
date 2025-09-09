import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, X } from "lucide-react";

const KEY = "f6cea0ca596890d54ef2cf3dde89c6e7";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tip, setTip] = useState("");
  const [highlight, setHighlight] = useState("");
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState(new Date());
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      text: "Heavy rainfall expected — ensure drainage.",
      color: "bg-yellow-100 dark:bg-yellow-800/60",
    },
    {
      id: 2,
      text: "Govt announced subsidy for drip irrigation systems.",
      color: "bg-green-100 dark:bg-green-800/60",
    },
  ]);

  const farmerNames = [
    "Annadaata",
    "Kshetrapalaka",
    "Bhoomiputra",
    "Krishika",
    "Jeevandata",
    "KshetraVeer",
    "JeevanRakshak",
  ];

  const tips = [
    "Rotate crops to maintain soil fertility.",
    "Use drip irrigation to save water.",
    "Add compost and manure for healthier soil.",
    "Watch for pests early to avoid crop loss.",
    "Sow seeds in the morning/evening to protect from heat.",
  ];

  const highlights = [
    "Paddy demand high in local mandis",
    "Maize prices stable this week",
    "Tomato prices rising in local mandis",
    "Potato supply increased — prices down",
  ];

  // 🌟 Greeting logic
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let prefix;

      if (hour < 12) prefix = "🌅 Suprabhaat,";
      else if (hour < 18) prefix = "🌞 Namaskar,";
      else prefix = "🌙 As the sun sets, may your heart stay light,";

      const randomName =
        farmerNames[Math.floor(Math.random() * farmerNames.length)];

      setGreeting(`${prefix} ${randomName}`);
    };

    updateGreeting(); // set initial
    const interval = setInterval(updateGreeting, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ⏰ Clock update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🌦 Weather fetch
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}&units=metric`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.cod === 200) {
                setWeather({
                  city: data.name,
                  temp: data.main.temp,
                  condition: data.weather[0].description,
                });
              } else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
        },
        () => {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=${KEY}&units=metric`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.cod === 200) {
                setWeather({
                  city: data.name,
                  temp: data.main.temp,
                  condition: data.weather[0].description,
                });
              } else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
        }
      );
    }
  }, []);

  // 🌱 Dynamic Tip + Highlight
  useEffect(() => {
    const updateTipAndHighlight = () => {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
      setHighlight(highlights[Math.floor(Math.random() * highlights.length)]);
    };

    updateTipAndHighlight(); // instant on load
    const interval = setInterval(updateTipAndHighlight, 5 * 60 * 1000); // every 5 min

    return () => clearInterval(interval);
  }, []);

  // Auto-expire alerts after 10 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timers = alerts.map((alert) =>
        setTimeout(() => handleFadeOut(alert.id), 10000)
      );
      return () => timers.forEach((t) => clearTimeout(t));
    }
  }, [alerts]);

  const handleFadeOut = (id) => {
    const el = document.getElementById(`alert-${id}`);
    if (el) {
      el.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 300);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 py-6 space-y-8 bg-background text-foreground transition-colors duration-500 ease-in-out">
        {/* Hero Section */}
        <div className="bg-card text-card-foreground p-6 sm:p-10 rounded-xl shadow-md dark:shadow-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">{greeting}</h2>
            <p className="text-sm sm:text-base font-mono text-muted-foreground">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>

          <h1 className="flex items-center gap-2 text-3xl sm:text-4xl font-bold mt-4 mb-2">
            <Sprout className="w-8 h-8 text-green-500" />
            Smart Farming Assistant
          </h1>
          <p className="text-base sm:text-lg mb-6 text-muted-foreground">
            AI-powered recommendations for crops, weather, and resources
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/crop"
              className="w-full sm:w-auto text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium shadow hover:shadow-lg"
            >
              Get Crop Recommendations
            </Link>
            <Link
              to="/weather"
              className="w-full sm:w-auto text-center bg-muted text-foreground px-6 py-3 rounded-lg font-medium shadow hover:shadow-lg"
            >
              Check Weather
            </Link>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: "Crop Recommendation",
              desc: "Best crops for your soil & season",
              link: "/crop",
            },
            {
              title: "Weather Dashboard",
              desc: "Live updates & forecasts",
              link: "/weather",
            },
            {
              title: "Market Insights",
              desc: "Mandi prices & demand trends",
              link: "/market",
            },
            {
              title: "Resource Centre",
              desc: "Schemes, training & support",
              link: "/resources",
            },
          ].map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className="bg-card text-card-foreground p-5 sm:p-6 rounded-xl shadow hover:shadow-lg dark:shadow-none dark:border border-border transition-all text-center"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                {card.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Snapshot Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-card text-card-foreground p-5 sm:p-6 rounded-xl shadow dark:shadow-none dark:border border-border">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Weather</h2>
            {loading ? (
              <p className="animate-pulse text-muted-foreground">
                Fetching weather...
              </p>
            ) : error ? (
              <p className="text-red-500">Weather data unavailable</p>
            ) : (
              weather && (
                <>
                  <p className="font-semibold">{weather.city}</p>
                  <p className="text-base sm:text-lg">{weather.temp}°C</p>
                  <p className="text-muted-foreground">{weather.condition}</p>
                </>
              )
            )}
          </div>
          <div className="bg-card text-card-foreground p-5 sm:p-6 rounded-xl shadow dark:shadow-none dark:border border-border">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Tip of the Day
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">{tip}</p>
          </div>
          <div className="bg-card text-card-foreground p-5 sm:p-6 rounded-xl shadow dark:shadow-none dark:border border-border">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Market Highlight
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {highlight}
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-card text-card-foreground p-5 sm:p-6 rounded-xl shadow dark:shadow-none dark:border border-border">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Alerts</h2>
            <ul className="space-y-2 text-sm sm:text-base">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  id={`alert-${alert.id}`}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${alert.color}`}
                >
                  <span>{alert.text}</span>
                  <button
                    onClick={() => handleFadeOut(alert.id)}
                    className="ml-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-sm sm:text-base pt-6 border-t bg-muted text-foreground dark:bg-slate-950 mt-8">
        <p className="mb-4 opacity-80">
          Empowering Farmers with AI & Knowledge
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center pb-4">
          <div>
            <p className="font-semibold">50+ Crops</p>
          </div>
          <div>
            <p className="font-semibold">620+ Districts</p>
          </div>
          <div>
            <p className="font-semibold">Real-Time Weather</p>
          </div>
        </div>
      </footer>
    </>
  );
}
