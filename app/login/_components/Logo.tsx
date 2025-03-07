"use client";

import { motion } from "framer-motion";

import { AcmeIcon } from "../../_components/acme";

export default function Logo() {
  return (
    <div className="w-full flex items-center gap-2 py-4 justify-center sm:justify-start sticky top-0 z-10 bg-background">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white transition-all duration-300`}
      >
        <AcmeIcon className="sm:w-8 sm:h-8" size={28} />
      </div>
      <motion.p
        animate={{ opacity: 1, x: 0 }}
        className="font-bold text-inherit hidden xl:block"
        initial={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.5 }}
      >
        STAR AI
      </motion.p>
    </div>
  );
}
