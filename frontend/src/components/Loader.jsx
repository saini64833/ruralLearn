import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ message = "Loading RuralLearn..." }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 z-50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-6"
        ></motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-indigo-700 tracking-wide"
        >
          {message}
        </motion.p>

        <p className="text-sm text-gray-500 mt-2">Empowering Rural Education 🌾</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
