import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Code, Calculator, Brackets, HelpCircle, Equal, GitCompare, Network } from 'lucide-react';

export default function LexicalPhase({ tokens, tokenSummary }) {
  if (!tokens || tokens.length === 0) return <div className="text-gray-400 text-center p-8">No tokens to display. Enter an expression.</div>;

  const getColor = (type) => {
    switch(type) {
      case 'IDENTIFIER': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'NUMBER': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'OPERATOR': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PARENTHESIS': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ASSIGN': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'RELATIONAL_OPERATOR': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'LOGICAL_OPERATOR': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'UNKNOWN': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'IDENTIFIER': return <Code size={14} className="inline mr-1" />;
      case 'NUMBER': return <Hash size={14} className="inline mr-1" />;
      case 'OPERATOR': return <Calculator size={14} className="inline mr-1" />;
      case 'PARENTHESIS': return <Brackets size={14} className="inline mr-1" />;
      case 'ASSIGN': return <Equal size={14} className="inline mr-1" />;
      case 'RELATIONAL_OPERATOR': return <GitCompare size={14} className="inline mr-1" />;
      case 'LOGICAL_OPERATOR': return <Network size={14} className="inline mr-1" />;
      default: return <HelpCircle size={14} className="inline mr-1" />;
    }
  };

  const totalTokens = tokens.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full glass-panel p-6"
    >
      <h2 className="text-xl font-bold mb-4 font-mono select-none">Token Stream</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono">
          <thead className="border-b border-gray-700/50">
            <tr>
              <th className="py-3 px-4 text-gray-400 font-medium">Position</th>
              <th className="py-3 px-4 text-gray-400 font-medium">Type</th>
              <th className="py-3 px-4 text-gray-400 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-800/30 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4 text-gray-500">{token.position}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-md border text-sm flex items-center w-max ${getColor(token.type)}`}>
                    {getIcon(token.type)}
                    {token.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-gray-200">
                  {token.value}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {tokenSummary && Object.keys(tokenSummary).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 pt-6 border-t border-gray-800/50"
        >
          <h3 className="text-lg font-bold mb-4 font-mono select-none text-blue-300">Token Classification Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono bg-black/20 rounded-lg overflow-hidden border border-gray-800/50">
              <thead className="bg-[#1a1a24] border-b border-gray-700/50">
                <tr>
                  <th className="py-3 px-4 text-gray-400 font-medium">Token Type</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Count</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">%</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Unique Values</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tokenSummary).map(([type, data], idx) => {
                  const percentage = ((data.count / totalTokens) * 100).toFixed(1);
                  return (
                    <motion.tr 
                      key={type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.05) }}
                      className="border-b border-gray-800/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-md border text-sm flex items-center w-max ${getColor(type)}`}>
                          {getIcon(type)}
                          {type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-blue-200 font-bold">{data.count}</td>
                      <td className="py-3 px-4 text-gray-500">{percentage}%</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          {data.values.map((v, vIdx) => (
                            <span key={vIdx} className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-300 text-xs shadow-sm">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
