import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

//  Pages
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

//  Lesson Pages
import Lessons from "./pages/Lessons.jsx";
import LessonDetail from "./pages/LessonDetails.jsx";
import LessonUpload from "./pages/LessonUpload.jsx";
import LessonUpdate from "./pages/LessonUpdate.jsx";

//  Quiz Pages
import QuizePage from "./pages/QuizPage.jsx";
import QuizeUpload from "./pages/QuizeUpload.jsx";
import QuizeUpdate from "./pages/Quizeupdate.jsx";
import QuizeDetail from "./pages/QuizeDetail.jsx";
import AttemptQuiz from "./pages/AttemptQuiz.jsx";
import ResultQuiz from "./pages/ResultQuiz.jsx";
const AppWrapper = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // ✅ Show Loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <Routes>
        {/*  Public Routes */}
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

        {/*  Quiz Routes */}
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
          path="/quizzes/response/:id"
          element={
            <ProtectedRoute>
              <AttemptQuiz />
            </ProtectedRoute>
          }
        />
        <Route path="/quizzes/result/:id" element={
          <ProtectedRoute>
            <ResultQuiz/>
          </ProtectedRoute>
        } />

        {/* 👤 Dashboard */}
        <Route
          path="/users/me"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
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
