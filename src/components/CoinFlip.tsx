import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundEffects } from '../utils/audio';
import { Trophy, HelpCircle } from 'lucide-react';

interface CoinFlipProps {
  onCoinFlipFinished: (winner: 'player' | 'opponent') => void;
  isMuted: boolean;
}

export default function CoinFlip({ onCoinFlipFinished, isMuted }: CoinFlipProps) {
  const [playerChoice, setPlayerChoice] = useState<'cara' | 'coroa' | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [flipResult, setFlipResult] = useState<'cara' | 'coroa' | null>(null);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

  const startFlip = () => {
    if (!playerChoice || isSpinning) return;
    
    setIsSpinning(true);
    setFlipResult(null);
    setWinner(null);
    
    // Play procedurally synthesized coin sound ticks with precise synchronization
    if (!isMuted) {
      setTimeout(() => soundEffects.playCoin(), 0);
      setTimeout(() => soundEffects.playCoin(), 200);
      setTimeout(() => soundEffects.playCoin(), 450);
      setTimeout(() => soundEffects.playCoin(), 750);
      setTimeout(() => soundEffects.playCoin(), 1100);
      setTimeout(() => soundEffects.playCoin(), 1500);
      setTimeout(() => soundEffects.playCoin(), 1900);
      setTimeout(() => soundEffects.playCoin(), 2200);
    }

    // Determine result
    const options: ('cara' | 'coroa')[] = ['cara', 'coroa'];
    const result = options[Math.floor(Math.random() * 2)];

    setTimeout(() => {
      setFlipResult(result);
      const isPlayerWinner = playerChoice === result;
      const roundWinner = isPlayerWinner ? 'player' : 'opponent';
      setWinner(roundWinner);
      setIsSpinning(false);
      
      // Play crowd noises depending on outcome
      if (!isMuted) {
        if (isPlayerWinner) {
          soundEffects.playCrowdCheer();
          soundEffects.playRefereeWhistle();
        } else {
          soundEffects.playCrowdOoh();
        }
      }
    }, 2400); // Wait for the rotation of the 3D CSS animation
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-slate-900/90 border-2 border-yellow-500/30 rounded-3xl p-6 shadow-2xl shadow-black relative overflow-hidden"
    >
      {/* Visual background lines */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 via-slate-950 to-yellow-600/5 pointer-events-none" />
      
      <div className="text-center relative z-10">
        <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold px-3 py-1 rounded-full text-xs tracking-wider uppercase mb-3">
          Sorteio Inicial de Campo
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          Cara ou Coroa da Copa 🪙
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          Ao lançar a moeda de ouro, quem acertar o lado começa o jogo com o primeiro lance no Blackjack!
        </p>

        {/* Coin Selection Phase */}
        {!winner && !isSpinning && (
          <div className="mt-6">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
              Escolha seu lado:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setPlayerChoice('cara');
                  if (!isMuted) soundEffects.playCardDraw();
                }}
                className={`py-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  playerChoice === 'cara'
                    ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-lg shadow-yellow-500/5'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700/80 hover:text-slate-300'
                }`}
              >
                <span className="text-3xl filter drop-shadow">⚽</span>
                <span className="text-xs font-extrabold uppercase tracking-wide">
                  CARA (BOLA)
                </span>
              </button>

              <button
                onClick={() => {
                  setPlayerChoice('coroa');
                  if (!isMuted) soundEffects.playCardDraw();
                }}
                className={`py-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  playerChoice === 'coroa'
                    ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-lg shadow-yellow-500/5'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700/80 hover:text-slate-300'
                }`}
              >
                <Trophy className={`w-8 h-8 ${playerChoice === 'coroa' ? 'text-yellow-400' : 'text-slate-400'}`} />
                <span className="text-xs font-extrabold uppercase tracking-wide">
                  COROA (TAÇA)
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 3D Spinning Coin Simulation container */}
        <div className="my-8 flex justify-center items-center h-32 relative">
          <div className="absolute inset-0 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />
          
          <div 
            className={`w-[110px] h-[110px] rounded-full relative style-3d select-none ${
              isSpinning 
                ? (flipResult === 'cara' ? 'animate-coin-heads' : 'animate-coin-tails') 
                : ''
            }`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: !isSpinning && flipResult === 'coroa' ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: !isSpinning ? 'transform 0.4s ease' : 'none'
            }}
          >
            {/* Front Side of the Golden Coin (Heads/Cara = Bola) */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-full border-4 border-yellow-250 flex flex-col items-center justify-center shadow-xl shadow-black/80 font-sans cursor-default"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">⚽</span>
              <span className="text-[9px] font-black text-slate-950 tracking-widest uppercase mt-1">BOLA</span>
            </div>

            {/* Back Side of the Golden Coin (Tails/Coroa = Cup) */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-full border-4 border-yellow-250 flex flex-col items-center justify-center shadow-xl shadow-black/80 font-sans cursor-default"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <Trophy className="w-10 h-10 text-slate-950 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              <span className="text-[9px] font-black text-slate-950 tracking-widest uppercase mt-0.5">TAÇA</span>
            </div>
          </div>
        </div>

        {/* Action Button & Status Info */}
        {!winner && !isSpinning && playerChoice && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={startFlip}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 font-extrabold py-3.5 rounded-xl text-slate-950 tracking-wide text-sm border-b-4 border-emerald-800 shadow-lg shadow-emerald-500/10 active:border-b-2 active:translate-y-[2px] cursor-pointer"
          >
            GIAR MOEDA DE OURO 🪙
          </motion.button>
        )}

        {isSpinning && (
          <p className="text-xs font-mono text-yellow-500 tracking-wider animate-pulse">
            Sorteando o campo... segure o coração!
          </p>
        )}

        {/* Winner display */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 text-center"
          >
            <div className="bg-slate-950/80 p-4 border border-yellow-400/20 rounded-2xl">
              <div className="flex justify-center mb-1">
                {flipResult === 'cara' ? (
                  <span className="text-3xl animate-bounce">⚽ DEU CARA (BOLA)!</span>
                ) : (
                  <span className="text-3xl animate-bounce">🏆 DEU COROA (TAÇA)!</span>
                )}
              </div>
              
              <h4 className={`text-lg font-black mt-2 ${
                winner === 'player' ? 'text-green-400' : 'text-amber-500'
              }`}>
                {winner === 'player' ? 'VOCÊ GANHOU O SORTEIO!' : 'O ADVERSÁRIO GANHOU O SORTEIO!'}
              </h4>
              
              <p className="text-xs text-slate-400 mt-1">
                {winner === 'player' 
                  ? 'Você ganhou a vantagem e dará o pontapé inicial / primeiro lance!' 
                  : 'O adversário dará o pontapé inicial / primeiro lance do jogo!'}
              </p>
            </div>

            <button
              onClick={() => {
                if (!isMuted) soundEffects.playRefereeWhistle();
                onCoinFlipFinished(winner);
              }}
              className="mt-5 w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black py-4 rounded-xl text-xs sm:text-sm tracking-widest border-b-4 border-amber-700 shadow-xl shadow-yellow-500/20 active:border-b-2 active:translate-y-[2px] cursor-pointer uppercase"
            >
              Ir Para a Partida ⚽ START!
            </button>
          </motion.div>
        )}

        {!playerChoice && !isSpinning && !winner && (
          <p className="text-slate-500 text-[11px] font-mono mt-2">
            ⚠️ Selecione acima (BOLA) ou (TAÇA) para poder girar
          </p>
        )}
      </div>

      <style>{`
        .style-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
    </motion.div>
  );
}
