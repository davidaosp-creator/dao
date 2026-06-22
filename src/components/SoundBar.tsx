import React, { useState } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';

interface SoundBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function SoundBar({ isMuted, onToggleMute }: SoundBarProps) {
  return (
    <div id="sound-bar" className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-lg shadow-black/40">
      <div className="flex items-center gap-1">
        <Radio className={`w-3.5 h-3.5 ${isMuted ? 'text-slate-500' : 'text-emerald-400 animate-pulse'}`} />
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
          {isMuted ? 'MUDO' : 'ÁUDIO ATIVO'}
        </span>
      </div>
      
      {/* Dynamic graphic visualizer bars */}
      <div className="flex items-end gap-0.5 h-3.5 px-1">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${
              isMuted 
                ? 'bg-slate-700 h-[2px]' 
                : 'bg-emerald-400 h-1.5'
            }`}
            style={{
              animation: isMuted 
                ? 'none' 
                : `bounce ${0.5 + bar * 0.15}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      <button
        onClick={onToggleMute}
        className="text-yellow-400 hover:text-yellow-300 active:scale-90 transition-all p-1 hover:bg-slate-800 rounded-full cursor-pointer"
        title={isMuted ? 'Ativar som' : 'Desativar som'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-rose-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-emerald-400" />
        )}
      </button>

      {/* Styled animation keyframe injected directly */}
      <style>{`
        @keyframes bounce {
          0% { height: 3px; }
          100% { height: 14px; }
        }
      `}</style>
    </div>
  );
}
