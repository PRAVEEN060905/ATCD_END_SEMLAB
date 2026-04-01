import React from 'react';
import { motion } from 'framer-motion';

export default function CodeGenPhase({ intermediateCode }) {
  if (!intermediateCode || intermediateCode.length === 0) return <div className="text-gray-400 text-center p-8">No intermediate code generated.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full glass-panel p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-mono text-blue-400">Three-Address Code</h2>
          <p className="text-gray-400 text-sm">Intermediate Representation Optimization</p>
        </div>
      </div>

      <div className="bg-[#1e1e24] p-6 rounded-xl border border-gray-700 shadow-inner font-mono text-sm leading-relaxed overflow-x-auto relative group">
        <div className="absolute top-2 right-2 flex gap-1 cursor-pointer opacity-0 group-hover:opacity-100 transition">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {intermediateCode.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 hover:bg-white/5 px-2 rounded -mx-2 transition"
          >
            <span className="text-gray-600 block min-w-[20px] select-none">{idx + 1}</span>
            <span className="text-green-400">{line.split(' = ')[0]}</span>
            <span className="text-gray-400">=</span>
            {/* simple syntax highlighting */}
            <span className="text-purple-300">
              {line.split(' = ')[1].split(' ').map((token, i) => {
                if (['+', '-', '*', '/'].includes(token)) return <span key={i} className="text-blue-400 font-bold mx-1">{token}</span>;
                if (token.startsWith('t')) return <span key={i} className="text-green-400">{token}</span>;
                return <span key={i} className="text-orange-300">{token}</span>;
              })}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
