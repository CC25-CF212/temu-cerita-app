import { motion } from "framer-motion";

const AnimatedText = ({ text }) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl py-6 shadow-lg backdrop-blur-sm w-full">
      <h1 className="text-4xl font-bold text-center tracking-widest uppercase text-slate-800">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.5, // durasi animasi per huruf diperlambat
              delay: index * 0.15, // jeda antar huruf diperlambat
              ease: "linear",
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
};

export default AnimatedText;
