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

// Lazy Loaded Pages (Performance Boost)
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

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 350); // smooth illusion timing

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {/* Navbar stays stable */}
      <Navbar />

      {/* Global Loader */}
      {loading && <Loader type="route" />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
        theme="light"
      />

      {/* Smooth Page Transition */}
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
