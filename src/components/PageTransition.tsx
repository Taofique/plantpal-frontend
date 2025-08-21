// import { motion } from "framer-motion";
// import type { ReactNode } from "react";

// type PageTransitionProps = {
//   children: ReactNode;
//   direction?: "left" | "right";
// };

// export default function PageTransition({
//   children,
//   direction = "right",
// }: PageTransitionProps) {
//   const variants = {
//     initial: { opacity: 0, x: direction === "right" ? 100 : -100 },
//     animate: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: direction === "right" ? -100 : 100 },
//   };

//   return (
//     <motion.div
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       variants={variants}
//       transition={{ duration: 0.6, ease: "easeInOut" }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// PageTransition.tsx
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 200, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -200, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
