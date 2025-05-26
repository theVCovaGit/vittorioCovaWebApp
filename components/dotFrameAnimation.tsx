import { motion } from "framer-motion";
import DotFrame from "@/components/dotFrame";

export default function AnimatedDotFrame({
  animate,
  onComplete,
}: {
  animate: boolean;
  onComplete: () => void;
}) {
  return (
    <motion.div
      className="absolute z-[20] w-[300vw] h-[350px]" // 🟢 force the size you want
      style={{
        width: "6000px", 
        height: "clamp(300px, 50vw, 400px)",
        top: "250px",
        right: "-215vw", // starts off to the right
      }}
      animate={animate ? { x: "-250vw" } : { x: 0 }}
      transition={{ duration: 5, onComplete }}
    >
      <DotFrame />
    </motion.div>
  );
}
