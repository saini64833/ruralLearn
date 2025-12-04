import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ message = "Loading RuralLearn..." }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 z-50"
      >
        {/* Spinner */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1], // subtle pulsing effect
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-6 shadow-lg"
        ></motion.div>

        {/* Main Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl font-bold text-indigo-700 tracking-wide mb-2 text-center"
        >
          {message}
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-gray-500 text-center"
        >
          Empowering Rural Education 🌾
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
