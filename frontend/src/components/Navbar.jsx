import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          🌾 RuralLearn
        </Link>

        <div className="flex gap-5 items-center text-gray-700">
          {/* Common link for logged-in users */}
          {user && <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>}

          {/* Teacher Links */}
          {user && user.role === "Teacher" && (
            <>
              {/* <Link to="/lessons/upload-lesson" className="hover:text-indigo-600">Upload Lessons</Link>
              <Link to="/upload-quiz" className="hover:text-indigo-600">Upload Quiz</Link> */}
              <Link to="/lessons/get-all-lessons" className="hover:text-indigo-600">View Lessons</Link>
              <Link to="/view-quiz" className="hover:text-indigo-600">View Quiz</Link>
            </>
          )}

          {/* Student Links */}
          {user && user.role === "Student" && (
            <>
              <Link to="/lessons/get-all-lessons" className="hover:text-indigo-600">Lessons</Link>
              <Link to="/quizzes" className="hover:text-indigo-600">Quizzes</Link>
            </>
          )}

          {/* Login/Register for guests */}
          {!user && (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}

          {/* Logout button for logged-in users */}
          {user && (
            <button
              onClick={logout}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
