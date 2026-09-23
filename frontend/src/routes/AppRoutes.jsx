import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyEmail from "../pages/VerifyEmail";

import Dashboard from "../pages/Dashboard";
import Chats from "../pages/Chats";
import Documents from "../pages/Documents";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Notfound from "../pages/Notfound";

import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* PROTECTED WORKSPACE ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 404 NOT FOUND */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default AppRoutes;