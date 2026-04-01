import React from 'react';
import { motion } from 'framer-motion';

const phases = [
  "Lexical Analysis",
  "Syntax Parsing",
  "AST Builder",
  "Postfix Conversion",
  "Intermediate Code"
];

export default function CompilerPipeline({ currentPhase, setCurrentPhase }) {
  return (
    <div className="flex w-full overflow-x-auto gap-4 py-4 mb-4 z-10">
      {phases.map((phase, idx) => (
        <motion.div
          key={phase}
          onClick={() => setCurrentPhase(idx)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer min-w-max px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            currentPhase === idx
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              : 'glass-panel text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentPhase === idx ? 'bg-white text-blue-600' : 'bg-gray-700 text-gray-300'
            }`}>
              {idx + 1}
            </div>
            {phase}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
