import { motion } from "framer-motion";

const Offline = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-white flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="text-gray-600 text-xl font-medium"
      >
        You are offline
      </motion.div>

      <p className="text-gray-400 text-sm mt-2">
        Waiting for network connection...
      </p>
    </motion.div>
  );
};

export default Offline;
