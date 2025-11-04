import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

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
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          🌾 RuralLearn
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-5 items-center text-gray-700">
          {user && <Link to="/users/me" className="hover:text-indigo-600">Dashboard</Link>}

          {user && user.role === "Teacher" && (
            <>
              <Link to="/lessons/get-all-lessons" className="hover:text-indigo-600">View Lessons</Link>
              <Link to="/quizzes/get-all-quizzes" className="hover:text-indigo-600">View Quiz</Link>
            </>
          )}

          {user && user.role === "Student" && (
            <>
              <Link to="/lessons/get-all-lessons" className="hover:text-indigo-600">Lessons</Link>
              <Link to="/quizzes/get-all-quizzes" className="hover:text-indigo-600">Quizzes</Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-indigo-700 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t py-4 px-6 space-y-4 text-gray-700">
          {user && (
            <Link
              to="/users/me"
              className="block hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user && user.role === "Teacher" && (
            <>
              <Link to="/lessons/get-all-lessons" className="block hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                View Lessons
              </Link>
              <Link to="/quizzes/get-all-quizzes" className="block hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                View Quiz
              </Link>
            </>
          )}

          {user && user.role === "Student" && (
            <>
              <Link to="/lessons/get-all-lessons" className="block hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Lessons
              </Link>
              <Link to="/quizzes/get-all-quizzes" className="block hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Quizzes
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="block hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
