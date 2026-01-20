import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const PageMotion = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const variants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : isMobile ? 12 : 20,
      scale: isMobile ? 1 : 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -10,
      scale: 0.98,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageMotion;
