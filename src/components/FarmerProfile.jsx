import React, { useState, useEffect } from "react";
import {
  User,
  Edit,
  Save,
  Settings,
  Bell,
  Bookmark,
  MapPin,
  Droplets,
  TestTube2,
  AlertCircle,
  Leaf,
  Loader2,
  LogOut,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import indiaDistricts from "../data/indiaDistricts.json";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function FarmerProfile() {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    state: "Telangana",
    district: "Sangareddy",
    farmSize: 0,
    createdAt: "",
    lastUpdated: "",
  });

  const [preferences, setPreferences] = useState({
    soilType: "Loamy",
    waterSources: [],
    favouriteCrops: [],
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (loadingAuth) return;
    if (!user) navigate("/farmer-login");
  }, [user, loadingAuth, navigate]);

  // 📄 Fetch or create profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const ref = doc(db, "farmers", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setProfileData({
            ...data.profile,
            createdAt: data.profile?.createdAt?.toDate?.() || new Date(),
            lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
          });
          setPreferences(data.preferences || {});
        } else {
          await setDoc(ref, {
            uid: user.uid,
            username: user.email.split("@")[0],
            role: "farmer",
            profile: profileData,
            preferences,
            lastUpdated: serverTimestamp(),
          });
          toast("👋 Welcome! Let’s set up your profile.");
          setIsEditingProfile(true);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // 💾 Save profile
  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const ref = doc(db, "farmers", user.uid);
    try {
      await updateDoc(ref, {
        profile: { ...profileData, farmSize: Number(profileData.farmSize) },
        preferences,
        lastUpdated: serverTimestamp(),
      });
      toast.success("✅ Profile saved successfully!");
      setIsEditingProfile(false);
      setIsEditingPrefs(false);
      setHasChanged(false);
    } catch (err) {
      toast.error("Save failed.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ⏳ Auto-save after 3s idle
  useEffect(() => {
    if (!hasChanged) return;
    const timer = setTimeout(saveProfile, 3000);
    return () => clearTimeout(timer);
  }, [hasChanged]);

  // 🧠 Detect changes
  useEffect(() => {
    if (isEditingProfile || isEditingPrefs) setHasChanged(true);
  }, [profileData, preferences]);

  // 🔔 Mock notifications
  useEffect(() => {
    if (!profileData.state || !profileData.district) return;
    setNotifications([
      `🌧️ Rain expected in ${profileData.district}, ${profileData.state} soon.`,
      `☀️ Dry spell ahead — irrigate fields properly.`,
      `🌿 Fertilizer subsidy available in ${profileData.state}.`,
    ]);
  }, [profileData]);

  const states = Object.keys(indiaDistricts);
  const districts = indiaDistricts[profileData.state] || [];

  const handleLogout = async () => {
    await auth.signOut();
    toast.success("👋 Logged out successfully");
    setTimeout(() => navigate("/farmer-login"), 500);
  };

  if (loading || loadingAuth)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading your profile...
      </div>
    );

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen relative">
      <Toaster position="bottom-center" />

      {/* 🏡 Floating Home Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md transition-all hover:scale-[1.05]"
        >
          <ArrowLeft size={18} />
          Home
        </Link>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-10 text-center relative">
          <button
            onClick={handleLogout}
            className="absolute right-0 top-0 flex items-center gap-1 text-sm text-red-500 hover:underline"
          >
            <LogOut size={16} /> Logout
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400 flex items-center justify-center gap-3">
            <User className="text-green-600 w-8 h-8" /> My Profile Dashboard
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
            Manage your farm’s details for personalized insights.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section — Profile & Preferences */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Details */}
            {/* (Same as before, unchanged) */}

            {/* Farm Preferences */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Settings /> Farm Preferences
                </h2>
                {!isEditingPrefs ? (
                  <button
                    onClick={() => setIsEditingPrefs(true)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <Edit size={16} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Save size={16} />
                    )}{" "}
                    Save
                  </button>
                )}
              </div>

              {/* ...Your Preferences UI stays same */}

              {/* 🌾 Farmer's Voice Section */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-300 dark:border-green-700 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 flex justify-center items-center gap-2 mb-2">
                  <MessageSquare /> Farmer’s Voice
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Share your thoughts and feedback with AgriAssist. You can edit your feedback anytime.
                </p>
                <button
                  onClick={() => navigate("/farmers")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:scale-[1.05] transition-all shadow-md"
                >
                  <MessageSquare size={18} />
                  Go to Farmer’s Voice
                </button>
              </div>
            </div>
          </div>

          {/* Right Section — Notifications & Saved Crops */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-orange-500">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Bell /> Alerts & Notifications
              </h2>
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className="text-sm p-3 mb-2 bg-gray-50 dark:bg-neutral-800 border-l-4 border-yellow-500 rounded-r-md"
                >
                  <AlertCircle size={14} className="inline text-yellow-500 mr-2" />
                  {n}
                </div>
              ))}
            </div>

            {/* Saved Crops */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-emerald-500">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Bookmark /> Saved Crops
              </h2>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {preferences.favouriteCrops.length ? (
                  preferences.favouriteCrops.map((crop) => <li key={crop}>🌿 {crop}</li>)
                ) : (
                  <li>No saved crops yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
