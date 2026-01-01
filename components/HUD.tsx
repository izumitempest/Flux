import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Wifi, RefreshCw, Layers, Zap } from 'lucide-react';
import { Theme, RenderMode } from '../types';
import { getSystemMessage } from '../services/geminiService';

interface HUDProps {
  theme: Theme;
  renderMode: RenderMode;
  onCycleTheme: () => void;
  onToggleMode: () => void;
}

const HUD: React.FC<HUDProps> = ({ theme, renderMode, onCycleTheme, onToggleMode }) => {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<string>("Initializing...");
  const [isThinking, setIsThinking] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date());
        // Mock FPS fluctuation for "realism"
        setFps(Math.floor(58 + Math.random() * 4));
    }, 1000);
    handleRefreshStatus();
    return () => clearInterval(timer);
  }, []);

  const handleRefreshStatus = async () => {
    if (isThinking) return;
    setIsThinking(true);
    setStatus("Deciphering...");
    const msg = await getSystemMessage();
    setStatus(msg);
    setIsThinking(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-20">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto cursor-pointer group" onClick={onCycleTheme}>
          <h1 className={`font-mono text-4xl font-bold tracking-tighter`} style={{ color: theme.primary }}>
            FLUX<span style={{ color: theme.secondary }}>OS</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="h-1 w-1 rounded-full bg-white animate-pulse"></div>
             <p className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">v3.1.0 // {theme.name}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
            <div className="flex gap-6 font-mono text-sm backdrop-blur-md bg-black/20 p-2 rounded-lg border border-white/5" style={{ color: theme.accent, borderColor: `${theme.primary}33` }}>
                <div className="flex items-center gap-2">
                    <Cpu size={14} />
                    <span>CPU: {fps} FPS</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wifi size={14} />
                    <span>NET: ONLINE</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" />
                    <span>LIVE</span>
                </div>
            </div>
            
            <button 
                onClick={onToggleMode}
                className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs font-bold uppercase transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}` }}
            >
                {renderMode === RenderMode.MESH ? <Layers size={14} /> : <Zap size={14} />}
                MODE: {renderMode}
            </button>
        </div>
      </div>

      {/* Center - Empty for wallpaper visibility */}

      {/* Bottom Bar */}
      <div className="flex items-end justify-between">
        
        {/* System Core Message */}
        <div className="pointer-events-auto max-w-md">
            <div 
                className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: theme.secondary }}
                onClick={handleRefreshStatus}
            >
                <RefreshCw size={12} className={isThinking ? "animate-spin" : ""} />
                System Core // Gemini
            </div>
            <div className="group relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r opacity-20 group-hover:opacity-40 transition duration-500 blur" style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}></div>
                <div className="relative border-l-2 pl-4 py-3 backdrop-blur-sm bg-black/40 rounded-r-lg" style={{ borderColor: theme.primary }}>
                    <p className="font-mono text-lg leading-tight text-white min-h-[3.5rem] flex items-center transition-all">
                        {status}
                    </p>
                </div>
            </div>
        </div>

        {/* Clock */}
        <div className="text-right">
            <div className="text-7xl font-light tracking-tighter text-white transition-all duration-1000" style={{ textShadow: `0 0 30px ${theme.primary}66` }}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center justify-end gap-3 text-xl font-mono uppercase tracking-widest" style={{ color: theme.secondary }}>
                <span>{time.toLocaleDateString([], { weekday: 'short' })}</span>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: theme.primary }}></span>
                <span>{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;