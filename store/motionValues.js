import { motion } from "framer-motion";

export const basicMotion = {
  as: motion.div,
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 },
};

// About Component
export const aboutMotionParent = {
  as: motion.div,
  hide: { opacity: 0 },
  show: {
    opacity: 1,

    transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.2 },
  },
  unmount: { opacity: 0 },
  initial: "hide",
  animate: "show",
  exist: "unmount",
};

export const aboutMotionChild = {
  as: motion.div,
  hide: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  unmount: { opacity: 0 },
};
