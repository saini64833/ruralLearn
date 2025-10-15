import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import LessonUpload from "./pages/LessonUpload"; // Teacher only

// Wrapper to handle route change loading
const AppWrapper = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setLoading(true);

    // Hide loader after a short delay (simulate page load)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {/* Show loader if loading */}
      {loading && <Loader />}

      {/* Navbar visible on all pages */}
      <Navbar />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Lessons */}
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/upload" element={<LessonUpload />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />

        {/* Future routes */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
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
