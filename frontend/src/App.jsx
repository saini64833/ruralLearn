import React, { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

const Lessons = lazy(() => import("./pages/Lessons.jsx"));
const LessonDetail = lazy(() => import("./pages/LessonDetails.jsx"));
const LessonUpload = lazy(() => import("./pages/LessonUpload.jsx"));
const LessonUpdate = lazy(() => import("./pages/LessonUpdate.jsx"));

const QuizePage = lazy(() => import("./pages/QuizPage.jsx"));
const QuizeUpload = lazy(() => import("./pages/QuizeUpload.jsx"));
const QuizeUpdate = lazy(() => import("./pages/Quizeupdate.jsx"));
const QuizeDetail = lazy(() => import("./pages/QuizeDetail.jsx"));
const AttemptQuiz = lazy(() => import("./pages/AttemptQuiz.jsx"));
const ResultQuiz = lazy(() => import("./pages/ResultQuiz.jsx"));

const AppWrapper = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  // Page transition loader
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [location]);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setShowInstall(false);
      console.log("PWA Installed Successfully");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Install Button Click
  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User accepted install");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <>
      {/* Install App Button */}
      {showInstall && (
        <button
          onClick={installApp}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "12px 18px",
            borderRadius: "10px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          Install App
        </button>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Route Loader */}
      {loading && <Loader type="route" />}

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
        theme="light"
      />

      {/* Page Animation */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<Loader />}>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Lesson Routes */}
            <Route
              path="/lessons/get-all-lessons"
              element={
                <ProtectedRoute>
                  <Lessons />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lessons/upload-lesson"
              element={
                <ProtectedRoute>
                  <LessonUpload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lessons/:id"
              element={
                <ProtectedRoute>
                  <LessonDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lessons/update/:id"
              element={
                <ProtectedRoute>
                  <LessonUpdate />
                </ProtectedRoute>
              }
            />

            {/* Quiz Routes */}
            <Route
              path="/quizzes/get-all-quizzes"
              element={
                <ProtectedRoute>
                  <QuizePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes/upload-quize"
              element={
                <ProtectedRoute>
                  <QuizeUpload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes/update-quize/:id"
              element={
                <ProtectedRoute>
                  <QuizeUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes/quize/:id"
              element={
                <ProtectedRoute>
                  <QuizeDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes/attempt/:id"
              element={
                <ProtectedRoute>
                  <AttemptQuiz />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes/result/:id"
              element={
                <ProtectedRoute>
                  <ResultQuiz />
                </ProtectedRoute>
              }
            />

            {/* Dashboard */}
            <Route
              path="/users/me"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

          </Routes>
        </Suspense>
      </motion.div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
