import { motion } from "framer-motion";
import { useNetworkSpeed } from "../hooks/useNetworkSpeed";

const Loader = ({ type = "route" }) => {
  const slowNet = useNetworkSpeed();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: slowNet ? 0.8 : 0.3,
      }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          repeat: Infinity,
          duration: slowNet ? 2.5 : 1.5,
        }}
        className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-gray-500"
      />
    </motion.div>
  );
};

export default Loader;
