import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function SyntaxPhase({ parseTreeImage }) {
  const [scale, setScale] = useState(1);

  if (!parseTreeImage) {
    return (
      <div className="text-gray-400 text-center p-8 glass-panel animate-pulse flex flex-col items-center justify-center min-h-[400px]">
        No Parse Tree image available. Ensure the expression is valid and Graphviz is installed.
      </div>
    );
  }

  const imageUrl = `http://127.0.0.1:8001${parseTreeImage}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full glass-panel flex flex-col items-stretch overflow-hidden relative"
      style={{ minHeight: '500px' }}
    >
      <div className="flex justify-between items-center bg-black/40 px-6 py-4 border-b border-gray-700 backdrop-blur z-10 w-full mb-0">
        <div>
          <h2 className="text-xl font-bold font-mono text-white tracking-widest uppercase">Syntax Parse Tree</h2>
          <div className="text-xs text-blue-400 font-bold mt-1 tracking-wider">GRAPHVIZ AUTO-LAYOUT</div>
        </div>
        
        <div className="flex gap-2">
           <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600 shadow-lg">
             <ZoomOut size={18} className="text-gray-300" />
           </button>
           <button onClick={() => setScale(1)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600 shadow-lg">
             <Maximize size={18} className="text-gray-300" />
           </button>
           <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors border border-blue-400 shadow-lg shadow-blue-500/30">
             <ZoomIn size={18} className="text-white" />
           </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-auto bg-[#e0f2fe]/5 flex items-center justify-center p-12 min-h-[500px]">
         <motion.img 
            src={imageUrl} 
            alt="Parse Tree Visualization" 
            animate={{ scale }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="origin-center shadow-2xl shadow-blue-500/10 rounded-xl bg-[#0f172a] border-4 border-gray-800 p-4 max-w-none"
         />
      </div>
    </motion.div>
  );
}
