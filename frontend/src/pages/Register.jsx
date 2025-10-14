import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    role: "Student",
    grade: "",
    school: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await axios.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          🌾 Register for RuralLearn
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
            </select>
          </div>

          {/* Grade (only for Students) */}
          {form.role === "Student" && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Grade</label>
              <input
                type="text"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          )}

          {/* School (for Students and Teachers) */}
          {form.role !== "Parent" && (
            <div>
              <label className="block text-sm font-medium text-gray-600">School</label>
              <input
                type="text"
                name="school"
                value={form.school}
                onChange={handleChange}
                required={form.role !== "Parent"}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          )}

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Profile Picture (Avatar)</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
