import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  type: 'TRIGGER' | 'ACTION' | 'CONDITION';
  label: string;
  icon: string;
  color: string;
  x: number;
  y: number;
}

const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'TRIGGER', label: 'Every Friday (12:00 PM)', icon: 'fa-clock', color: 'bg-amber-500', x: 50, y: 50 },
    { id: '2', type: 'ACTION', label: 'Scrape JAKIM Khutbah', icon: 'fa-globe', color: 'bg-blue-500', x: 50, y: 180 },
    { id: '3', type: 'ACTION', label: 'Summarize with AI', icon: 'fa-wand-magic-sparkles', color: 'bg-purple-500', x: 50, y: 310 },
    { id: '4', type: 'ACTION', label: 'Blast WhatsApp', icon: 'fa-whatsapp', color: 'bg-emerald-500', x: 50, y: 440 },
  ]);

  return (
    <div className="flex h-full gap-6">
      
      {/* 1. TOOLBOX */}
      <div className="w-64 bg-slate-900/50 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white mb-2">Pulse Automator</h3>
          
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl cursor-grab active:cursor-grabbing hover:bg-amber-500/20 transition-colors">
              <div className="flex items-center gap-3 text-amber-400">
                  <i className="fa-solid fa-bolt"></i>
                  <span className="text-xs font-bold uppercase">Trigger</span>
              </div>
          </div>
          
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl cursor-grab active:cursor-grabbing hover:bg-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 text-blue-400">
                  <i className="fa-solid fa-gear"></i>
                  <span className="text-xs font-bold uppercase">Action</span>
              </div>
          </div>

          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl cursor-grab active:cursor-grabbing hover:bg-purple-500/20 transition-colors">
              <div className="flex items-center gap-3 text-purple-400">
                  <i className="fa-solid fa-robot"></i>
                  <span className="text-xs font-bold uppercase">AI Agent</span>
              </div>
          </div>

          <div className="mt-auto p-4 bg-black/20 rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-500">
                  Drag and drop blocks to build automation pipelines. 
                  <br/><br/>Status: <span className="text-emerald-400">Active</span>
              </p>
          </div>
      </div>

      {/* 2. CANVAS */}
      <div className="flex-1 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90">
          <div className="absolute inset-0 bg-grid-slate-800/[0.2] [mask-image:linear-gradient(to_bottom_right,white,transparent)] pointer-events-none"></div>
          
          {/* Nodes */}
          <div className="relative w-full h-full p-8">
              {nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                      {/* Connection Line */}
                      {index < nodes.length - 1 && (
                          <div 
                            className="absolute w-0.5 bg-slate-700/50"
                            style={{ 
                                left: node.x + 24, // Center of icon
                                top: node.y + 48,  // Bottom of node
                                height: nodes[index+1].y - node.y - 48,
                                zIndex: 0
                            }}
                          ></div>
                      )}

                      {/* Node Card */}
                      <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`absolute w-64 p-4 rounded-xl border border-white/10 shadow-xl backdrop-blur-md flex items-center gap-4 group cursor-pointer hover:border-white/30 transition-colors z-10 bg-slate-900/80`}
                          style={{ left: node.x, top: node.y }}
                      >
                          <div className={`w-10 h-10 rounded-lg ${node.color} flex items-center justify-center text-black shadow-lg`}>
                              <i className={`fa-solid ${node.icon}`}></i>
                          </div>
                          <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{node.type}</p>
                              <p className="text-sm text-white font-bold">{node.label}</p>
                          </div>
                          
                          <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <i className="fa-solid fa-ellipsis-vertical text-slate-400"></i>
                          </div>
                      </motion.div>
                  </React.Fragment>
              ))}
          </div>

          {/* Floating Controls */}
          <div className="absolute bottom-6 right-6 flex gap-2">
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all">
                  <i className="fa-solid fa-play"></i> Run Workflow
              </button>
          </div>
      </div>

    </div>
  );
};

export default WorkflowEditor;
