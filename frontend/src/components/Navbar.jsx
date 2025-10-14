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
          <Link to="/lessons" className="hover:text-indigo-600">
            Lessons
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-indigo-600">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
