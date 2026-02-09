"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Art","Music", "Drawings", "Project", "Photos", "Designs"];

export function WordRotate() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

 return (
  <span className="relative inline-flex flex-col h-[1.1em] overflow-hidden text-left align-top">
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="whitespace-nowrap text-primary"
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  </span>
);
}