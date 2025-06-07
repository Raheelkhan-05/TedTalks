import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Pages/firebase";

const AuthGuard = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>; // Prevents flashing incorrect content

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthGuard;
