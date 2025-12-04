import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBookOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-700 flex items-center gap-2"
        >
          🌾 RuralLearn
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-gray-700 font-medium">
          {user && (
            <Link
              to="/users/me"
              className="hover:text-indigo-600 flex items-center gap-1"
            >
              <FaUser /> Dashboard
            </Link>
          )}

          {user?.role === "Teacher" && (
            <>
              <Link
                to="/lessons/get-all-lessons"
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <FaBookOpen /> View Lessons
              </Link>
              <Link
                to="/quizzes/get-all-quizzes"
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <FaClipboardList /> View Quiz
              </Link>
            </>
          )}

          {user?.role === "Student" && (
            <>
              <Link
                to="/lessons/get-all-lessons"
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <FaBookOpen /> Lessons
              </Link>
              <Link
                to="/quizzes/get-all-quizzes"
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <FaClipboardList /> Quizzes
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
              >
                <FaUserPlus /> Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1"
            >
              <FaSignOutAlt /> Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-indigo-700 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu (Framer Motion Animated Drawer) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md border-t py-4 px-6 space-y-4 text-gray-700"
          >
            {user && (
              <Link
                to="/users/me"
                onClick={() => setMenuOpen(false)}
                className="block flex items-center gap-2 hover:text-indigo-600"
              >
                <FaUser /> Dashboard
              </Link>
            )}

            {user?.role === "Teacher" && (
              <>
                <Link
                  to="/lessons/get-all-lessons"
                  onClick={() => setMenuOpen(false)}
                  className="block flex items-center gap-2 hover:text-indigo-600"
                >
                  <FaBookOpen /> View Lessons
                </Link>
                <Link
                  to="/quizzes/get-all-quizzes"
                  onClick={() => setMenuOpen(false)}
                  className="block flex items-center gap-2 hover:text-indigo-600"
                >
                  <FaClipboardList /> View Quiz
                </Link>
              </>
            )}

            {user?.role === "Student" && (
              <>
                <Link
                  to="/lessons/get-all-lessons"
                  onClick={() => setMenuOpen(false)}
                  className="block flex items-center gap-2 hover:text-indigo-600"
                >
                  <FaBookOpen /> Lessons
                </Link>
                <Link
                  to="/quizzes/get-all-quizzes"
                  onClick={() => setMenuOpen(false)}
                  className="block flex items-center gap-2 hover:text-indigo-600"
                >
                  <FaClipboardList /> Quizzes
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block flex items-center gap-2 hover:text-indigo-600"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center flex items-center gap-2 justify-center"
                >
                  <FaUserPlus /> Register
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 justify-center"
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
