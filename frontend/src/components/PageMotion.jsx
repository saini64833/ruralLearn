import { motion } from "framer-motion";

const PageMotion = ({ children }) => {
  const isMobile = window.innerWidth < 640;

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 8 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: isMobile ? 0.3 : 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageMotion;
