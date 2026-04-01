import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Wand2, FlaskConical, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import CompilerPipeline from './components/CompilerPipeline';
import LexicalPhase from './components/LexicalPhase';
import SyntaxPhase from './components/SyntaxPhase';
import ASTPhase from './components/ASTPhase';
import PostfixPhase from './components/PostfixPhase';
import CodeGenPhase from './components/CodeGenPhase';
import './App.css';

const API_BASE = 'http://127.0.0.1:8001';

function App() {
  const [expression, setExpression] = useState('(a + b) * c');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (data && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [data]);

  const handleReset = () => {
    setExpression('');
    setData(null);
    setCurrentPhase(0);
  };

  const handleAnalyze = async (expToAnalyze = expression) => {
    if (!expToAnalyze.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/analyze`, { expression: expToAnalyze });
      setData(response.data);
      if (response && response.data && response.data.errors && response.data.errors.length > 0) {
        setCurrentPhase(0);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || error.message || "Unknown server error";
      setData({
        tokens: [],
        errors: [`Backend Error: ${errorMsg}`],
        suggestions: [],
        parse_tree: null,
        ast: null,
        postfix: "",
        steps: [],
        intermediate_code: [],
        token_summary: null
      });
      setCurrentPhase(0);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
    setExpression(suggestion);
    handleAnalyze(suggestion);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      
      {/* Academic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl text-center mb-10 pt-2 pb-6 border-b border-gray-800/60"
      >
        <h2 className="text-xl md:text-2xl font-black text-gray-200 tracking-widest mb-2 uppercase">
          Automata Theory and Compiler Design
        </h2>
        <h3 className="text-lg md:text-xl text-blue-400 font-medium mb-4">
          End Semester Lab Evaluation
        </h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 text-sm">
          <span className="text-gray-400 font-mono bg-[#0d0d12]/80 px-4 py-1.5 rounded-md border border-gray-800 shadow-sm">
            Course Code: <span className="text-white font-bold">20CYS315</span>
          </span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold tracking-wide text-base">
            Amrita Vishwa Vidyapeetham
          </span>
        </div>
      </motion.div>

      {/* Main Project Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 mt-6"
      >
        <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-4">
          <FlaskConical className="text-blue-400" size={20} />
          <span className="text-blue-300 font-semibold tracking-wide text-sm uppercase">Interactive Visual Compiler</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
          Infix to Postfix <br/> <span className="gradient-text">Intelligent Engine</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          A full-stack visualizing compiler demonstrating lexical analysis, syntax parsing, AST construction, code generation, and intelligent error recovery.
        </p>
      </motion.div>

      {/* Main Input Control */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-4xl glass-panel p-3 md:p-4 flex flex-col gap-2 mb-8 shadow-2xl z-20 relative"
      >
        <div className="flex flex-col md:flex-row w-full items-center gap-2 md:gap-3">
          <div className="flex-1 flex items-center bg-[#0d0d12]/50 rounded-xl px-4 py-3 border border-gray-700/50 focus-within:border-blue-500/50 transition-colors w-full">
            <Code2 className="text-gray-500 mr-3" />
            <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter mathematical expression e.g. a + b * (c - d)"
              className="bg-transparent border-none outline-none text-white w-full font-mono text-lg placeholder:text-gray-700"
              spellCheck="false"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
              ) : (
                <><Wand2 size={20} /> Analyze</>
              )}
            </button>
            <button 
              onClick={handleReset}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-5 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
              title="Reset configuration"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>
        </div>

        <AnimatePresence>
          {data && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }} 
               animate={{ opacity: 1, height: 'auto' }} 
               exit={{ opacity: 0, height: 0 }} 
               className="px-2 overflow-hidden"
             >
               {data.errors && data.errors.length > 0 ? (
                 <span className="text-red-400 font-medium text-sm flex items-center gap-1.5 py-1">
                   <XCircle size={16}/> Syntax error detected
                 </span>
               ) : (
                 <span className="text-green-400 font-medium text-sm flex items-center gap-1.5 py-1">
                   <CheckCircle2 size={16}/> Expression is valid
                 </span>
               )}
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll Anchor */}
      <div ref={resultsRef} className="scroll-mt-10 w-full" />

      {/* Error & Suggestion Panel */}
      <AnimatePresence>
        {data && data.errors && data.errors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-4xl glass-panel border-red-500/30 bg-red-950/20 p-6 mb-8 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-2">Syntax Errors Detected</h3>
                <ul className="list-disc pl-5 mb-4 text-red-200 space-y-1 font-mono text-sm">
                  {data.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
                
                {data.suggestions && data.suggestions.length > 0 && (
                  <div className="mt-4 border-t border-red-500/20 pt-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <ShieldCheck size={16} className="text-green-400" /> Auto-Recovery Suggestions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.suggestions.map((sugg, idx) => (
                        <button 
                          key={idx}
                          onClick={() => applySuggestion(sugg)}
                          className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg font-mono text-sm transition-all"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visualizer Areas */}
      {data && (!data.errors || data.errors.length === 0) && (
        <div className="w-full max-w-5xl flex flex-col items-center">
          <CompilerPipeline currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} />
          
          <div className="w-full mt-4 min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentPhase === 0 && <LexicalPhase key="lex" tokens={data.tokens} tokenSummary={data.token_summary} />}
              {currentPhase === 1 && <SyntaxPhase key="syn" parseTreeImage={data.parse_tree_image} />}
              {currentPhase === 2 && <ASTPhase key="ast" astImage={data.ast_image} />}
              {currentPhase === 3 && <PostfixPhase key="pos" postfix={data.postfix} steps={data.steps} />}
              {currentPhase === 4 && <CodeGenPhase key="cod" intermediateCode={data.intermediate_code} />}
            </AnimatePresence>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
