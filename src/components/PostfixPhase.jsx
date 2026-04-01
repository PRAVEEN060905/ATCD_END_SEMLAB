import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

export default function PostfixPhase({ postfix, steps }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  if (!steps || steps.length === 0) return <div className="text-gray-400 text-center p-8">No postfix steps available.</div>;

  const step = steps[currentStep] || { stack: [], queue: [], action: '', current_token: null };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-mono">Shunting Yard Algorithm</h2>
          <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            <SkipBack size={20} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
        <p className="text-blue-200 font-mono text-lg">{step.action}</p>
        {step.current_token && (
          <p className="text-sm text-gray-400 mt-1">Current Token: <strong className="text-white">{step.current_token.value}</strong></p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operator Stack */}
        <div className="glass-panel p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 font-mono text-purple-400">Operator Stack</h3>
          <div className="w-32 h-64 border-x-2 border-b-2 border-purple-500/30 rounded-b-xl flex flex-col-reverse justify-start p-2 gap-2 overflow-y-auto bg-purple-900/10">
            <AnimatePresence>
              {step.stack.map((item, idx) => (
                <motion.div
                  key={`${idx}-${item}`}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded text-center font-bold shadow-lg text-white"
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
            {step.stack.length === 0 && <div className="text-gray-500 text-center m-auto">Empty</div>}
          </div>
        </div>

        {/* Output Queue */}
        <div className="glass-panel p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 font-mono text-green-400">Output Queue</h3>
          <div className="w-full flex flex-wrap gap-2 p-4 bg-green-900/10 border border-green-500/30 rounded-xl min-h-[100px] items-center">
            <AnimatePresence>
              {step.queue.map((item, idx) => (
                <motion.div
                  key={`${idx}-${item}`}
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 rounded text-center font-bold shadow-lg text-white"
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
            {step.queue.length === 0 && <div className="text-gray-500 m-auto">Empty</div>}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center p-4 border border-gray-700 rounded-xl bg-gray-800/50">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Final Postfix Result</h3>
        <p className={`text-2xl font-mono ${currentStep === steps.length - 1 ? 'gradient-text font-bold' : 'text-gray-500 blur-[2px]'}`}>
          {postfix || "..."}
        </p>
      </div>
    </motion.div>
  );
}
