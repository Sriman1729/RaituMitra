import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function ProtectedFarmerRoute({ children }) {
  const [user, loadingAuth] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      try {
        const farmerRef = doc(db, "farmers", user.uid);
        const farmerSnap = await getDoc(farmerRef);
        if (farmerSnap.exists() && farmerSnap.data().role === "farmer") {
          setRole("farmer");
        } else {
          setRole("other");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    checkRole();
  }, [user]);

  if (loadingAuth || checking)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Checking access...
      </div>
    );

  // ⭐ Pass where user came from
  if (!user || role !== "farmer")
    return (
      <Navigate
        to="/farmer-login"
        replace
        state={{ from: location.pathname }}
      />
    );

  return children;
}