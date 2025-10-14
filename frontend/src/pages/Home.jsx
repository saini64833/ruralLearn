import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-gray-800">
      {/* 🌾 Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-indigpngo-800 leading-tight">
            Bridging the Digital Divide for Rural Students 🌾
          </h1>
          <p className="text-lg text-gray-600">
            RuralLearn empowers students in rural areas to access quality
            education — even offline. Learn anywhere, anytime, with engaging
            lessons, quizzes, and videos in your local language.
          </p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
            <Link
              to="/lessons"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition"
            >
              Explore Lessons
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="md:w-1/2 mt-10 md:mt-0"
        >
          <img
            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg "
            alt="Rural Learning"
            className="w-full max-w-lg mx-auto drop-shadow-xl rounded-2xl"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-10">
            Why Choose RuralLearn?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Learning */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Student"
                className="w-20 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                Interactive Learning
              </h3>
              <p className="text-gray-600">
                Videos, quizzes, and PDFs tailored for every student’s level,
                designed to make learning fun and engaging.
              </p>
            </motion.div>

            {/* Offline Mode */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
                alt="Offline"
                className="w-20 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                Works Offline
              </h3>
              <p className="text-gray-600">
                No internet? No problem. Lessons and progress sync automatically
                when you reconnect.
              </p>
            </motion.div>

            {/* Teacher Dashboard */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135719.png"
                alt="Teacher"
                className="w-20 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                Teacher Tools
              </h3>
              <p className="text-gray-600">
                Teachers can upload lessons, assign quizzes, and track each
                student’s progress in real-time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/*  How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-100 to-purple-50">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-indigo-700 mb-10">
            How RuralLearn Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { step: "1", title: "Sign Up", desc: "Register as a student or teacher." },
              { step: "2", title: "Access Lessons", desc: "Browse and view lessons online or offline." },
              { step: "3", title: "Take Quizzes", desc: "Attempt quizzes to test your understanding." },
              { step: "4", title: "Track Progress", desc: "View your performance dashboard anytime." },
            ].map(({ step, title, desc }) => (
              <motion.div
                key={step}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full mx-auto text-xl font-bold mb-4">
                  {step}
                </div>
                <h4 className="font-semibold text-indigo-700 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-indigo-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Empower Rural Education?
        </h2>
        <p className="text-lg mb-6">
          Join the movement to bring digital learning to every corner of India.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Get Started
          </Link>
          <Link
            to="/lessons"
            className="px-8 py-3 bg-transparent border border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition"
          >
            Explore Lessons
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
