const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          🌾 Login to RuralLearn
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;  // <-- THIS LINE IS ESSENTIAL ✅
