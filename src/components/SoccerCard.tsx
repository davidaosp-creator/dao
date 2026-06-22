import React from 'react';
import { Card } from '../types';
import { motion } from 'motion/react';
import { Star, Shield, Trophy } from 'lucide-react';

interface SoccerCardProps {
  card: Card;
  assignedValue?: number;
  showFront?: boolean;
  highlight?: boolean;
}

// Function to map country to kit colors for beautifully vector-designed jerseys
function getCountryKit(country: string): { primary: string; secondary: string; numberColor: string } {
  const norm = country.toLowerCase();
  if (norm.includes('brasil')) {
    return { primary: '#EAB308', secondary: '#16A34A', numberColor: '#1E3A8A' }; // Amarelo e Verde
  }
  if (norm.includes('argentina')) {
    return { primary: '#38BDF8', secondary: '#FFFFFF', numberColor: '#1E293B' }; // Celeste e Branco
  }
  if (norm.includes('portugal')) {
    return { primary: '#DC2626', secondary: '#16A34A', numberColor: '#FEF08A' }; // Vermelho e Verde
  }
  if (norm.includes('frança')) {
    return { primary: '#1D4ED8', secondary: '#FFFFFF', numberColor: '#E11D48' }; // Azul e Branco
  }
  if (norm.includes('inglaterra')) {
    return { primary: '#F8FAFC', secondary: '#1E3A8A', numberColor: '#E11D48' }; // Branco e Azul
  }
  if (norm.includes('noruega')) {
    return { primary: '#E11D48', secondary: '#1D4ED8', numberColor: '#FFFFFF' }; // Vermelho e Azul
  }
  if (norm.includes('espanha')) {
    return { primary: '#DC2626', secondary: '#EAB308', numberColor: '#FFFFFF' }; // Vermelho e Amarelo
  }
  if (norm.includes('holanda')) {
    return { primary: '#F97316', secondary: '#FFFFFF', numberColor: '#1E293B' }; // Laranja e Branco
  }
  if (norm.includes('croácia')) {
    return { primary: '#EA580C', secondary: '#FFFFFF', numberColor: '#1E293B' }; // Xadrez Vermelho/Branco
  }
  if (norm.includes('egito')) {
    return { primary: '#991B1B', secondary: '#000000', numberColor: '#FFFFFF' }; // Vermelho e Preto
  }
  return { primary: '#475569', secondary: '#94A3B8', numberColor: '#FFFFFF' }; // Padrão Cinza
}

export default function SoccerCard({ card, assignedValue, showFront = true, highlight = false }: SoccerCardProps) {
  const kit = getCountryKit(card.country);
  const displayVal = assignedValue !== undefined ? assignedValue : card.blackjackValue;

  // Image loading failover states
  const [imgUrl, setImgUrl] = React.useState<string | null>(null);
  const [imgStatus, setImgStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  React.useEffect(() => {
    // Standard android raw drawable assets path on user's GitHub repo
    const pngUrl = `https://raw.githubusercontent.com/davidaosp-creator/copa2026-super-trunfo/main/app/src/main/res/drawable/img_card_${card.id}.png`;
    setImgUrl(pngUrl);
    setImgStatus('loading');
  }, [card.id]);

  const handleImageError = () => {
    if (imgUrl && imgUrl.endsWith('.png')) {
      const jpgUrl = `https://raw.githubusercontent.com/davidaosp-creator/copa2026-super-trunfo/main/app/src/main/res/drawable/img_card_${card.id}.jpg`;
      setImgUrl(jpgUrl);
    } else if (imgUrl && imgUrl.endsWith('.jpg')) {
      const jpegUrl = `https://raw.githubusercontent.com/davidaosp-creator/copa2026-super-trunfo/main/app/src/main/res/drawable/img_card_${card.id}.jpeg`;
      setImgUrl(jpegUrl);
    } else {
      setImgStatus('error');
    }
  };

  const handleImageLoad = () => {
    setImgStatus('success');
  };

  // Render Card Back
  if (!showFront) {
    return (
      <motion.div
        initial={{ scale: 0.8, rotateY: 180, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-[135px] h-[225px] sm:w-[150px] sm:h-[245px] rounded-xl border-3 border-yellow-400 bg-gradient-to-br from-slate-950 via-green-950 to-emerald-900 shadow-xl shadow-black/80 flex flex-col items-center justify-between p-3 relative overflow-hidden select-none"
      >
        {/* Shiny background overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-yellow-500/10 to-transparent pointer-events-none" />
        
        {/* Stadium line markings in background */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-yellow-400/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-yellow-400/25" />

        <div className="text-[10px] font-mono font-bold tracking-widest text-yellow-400/60 uppercase">
          COPA 2026
        </div>

        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/90 border border-yellow-400/40 flex items-center justify-center shadow-inner shadow-yellow-500/20 z-10 animate-pulse">
          <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400 drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)]" />
        </div>

        <div className="flex flex-col items-center gap-1 z-10">
          <span className="text-[11px] font-extrabold tracking-wider text-green-400 drop-shadow">BLACK JACK</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Render Card Front (Player Details)
  return (
    <motion.div
      initial={{ scale: 0.3, rotate: -15, y: 80, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
      whileHover={{ y: -6, scale: 1.04, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, type: 'spring', damping: 14 }}
      className={`w-[135px] h-[225px] sm:w-[150px] sm:h-[245px] rounded-xl flex flex-col justify-between p-2 relative overflow-hidden select-none shadow-lg transition-shadow duration-300 ${
        card.isGold
          ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border-2.5 border-yellow-200 shadow-yellow-500/20'
          : 'bg-slate-900 border-2 border-emerald-500/40 shadow-emerald-500/5'
      } ${highlight ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
    >
      {/* Glossy top-left sheen */}
      <div className="absolute -inset-y-4 -inset-x-12 rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Flag Emoji + Rating + Position Badge Header */}
      <div className="flex items-center justify-between text-xs font-bold leading-none z-10">
        <div className="flex flex-col items-center">
          <span className={`text-[13px] font-extrabold tracking-tight ${card.isGold ? 'text-slate-950' : 'text-slate-100'}`}>
            {card.rating}
          </span>
          <span className={`text-[8px] uppercase tracking-wider font-semibold ${card.isGold ? 'text-slate-900/70' : 'text-emerald-400'}`}>
            {card.position}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/25 px-1.5 py-0.5 rounded-md">
          <span className="text-xs transition-transform duration-300 hover:scale-125" title={card.country}>
            {card.countryFlag}
          </span>
          <span className={`text-[9px] font-mono tracking-tighter ${card.isGold ? 'text-yellow-100' : 'text-slate-400'}`}>
            {card.id.substring(0, 3).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Central Interactive Player Vector Portrait (Jersey shirt or Player Photo on stadium pitch) */}
      <div className="mt-1 flex-grow h-[115px] relative bg-slate-950/90 rounded-lg overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner">
        {/* Mini Stadium grass guidelines in background */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-slate-950 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-10 border-t border-emerald-500/20 pointer-events-none z-0" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border border-emerald-500/15 pointer-events-none z-0" />

        {/* Player Image from GitHub */}
        {imgUrl && imgStatus !== 'error' && (
          <img 
            src={imgUrl} 
            alt={card.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-300 ${
              imgStatus === 'loading' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          />
        )}

        {/* Dynamic Vector Shirt Design (Fallback/Loading indicator) */}
        {(imgStatus === 'loading' || imgStatus === 'error') && (
          <div className="relative w-11 h-11 flex items-center justify-center transition-transform hover:scale-110 duration-200 z-0">
            {/* Jersey Main Body */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
              {/* Left Sleeve */}
              <path d="M 15 25 L 30 15 L 38 27 L 27 38 Z" fill={kit.primary} stroke={kit.secondary} strokeWidth="3" />
              {/* Right Sleeve */}
              <path d="M 85 25 L 70 15 L 62 27 L 73 38 Z" fill={kit.primary} stroke={kit.secondary} strokeWidth="3" />
              {/* Main Jersey Torso */}
              <path d="M 30 15 L 70 15 L 75 80 L 25 80 Z" fill={kit.primary} stroke={kit.secondary} strokeWidth="3" />
              {/* Collar Trim */}
              <path d="M 40 15 A 10 10 0 0 0 60 15" fill={kit.secondary} />
              {/* Center Stripes (decorative) */}
              <rect x="46" y="20" width="8" height="60" fill={kit.secondary} opacity="0.6" />
              {/* Decorative Legend Badge Star */}
              {card.isGold && (
                <circle cx="50" cy="35" r="5" fill="#FACC15" />
              )}
            </svg>
            
            {/* Shirt Number */}
            <span 
              className="absolute top-[16px] text-[10px] font-black pointer-events-none"
              style={{ color: kit.numberColor }}
            >
              {card.position === 'ATA' ? '9' : card.position === 'MEI' ? '10' : card.position === 'DEF' ? '4' : '1'}
            </span>
          </div>
        )}

        {/* Card Game Blackjack Point Value Bubble */}
        <div className="absolute -bottom-1 -right-1 bg-yellow-400 hover:bg-yellow-300 border-2 border-slate-950 text-slate-950 font-black rounded-full w-9 h-9 flex items-center justify-center text-xs shadow-md shadow-black/80 transition-transform active:scale-95 z-20">
          <span className="text-[10px] uppercase font-mono mr-0.5">PTS</span>
          <span className="text-sm font-extrabold">{displayVal}</span>
        </div>

        {/* Little interactive overlay for position */}
        <div className="absolute bottom-1 left-1.5 flex flex-col z-20 bg-slate-950/70 px-1 rounded">
          <span className="text-[7.5px] font-mono text-slate-400 font-extrabold">COORD</span>
          <span className="text-[8px] text-emerald-400 font-bold tracking-widest">{card.position}-{card.rating}</span>
        </div>
      </div>

      {/* Footballer Name Container */}
      <div className="mt-1.5 z-10 flex flex-col">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-black uppercase tracking-tight truncate max-w-[90px] ${
            card.isGold ? 'text-slate-950' : 'text-slate-100'
          }`}>
            {card.name}
          </span>
          {card.isGold && <Star className="w-3 h-3 text-slate-950 fill-slate-950 shrink-0" />}
        </div>

        {/* Legend Bio label or Country info */}
        {card.isGold && card.legendBio ? (
          <p className="text-[6.5px] leading-[7.5px] text-slate-900/80 font-medium italic mt-0.5 truncate-3-lines">
            {card.legendBio}
          </p>
        ) : (
          <p className="text-[7.5px] leading-tight text-slate-400 mt-0.5">
            {card.country} • {card.position === 'ATA' ? 'Atacante' : card.position === 'MEI' ? 'Meio-Campo' : card.position === 'DEF' ? 'Zagueiro' : 'Goleiro'}
          </p>
        )}
      </div>

      {/* Card Footer Code & Trunfo Badge */}
      <div className={`mt-1 flex items-center justify-between text-[7px] border-t pt-1 ${
        card.isGold 
          ? 'border-slate-950/20 text-slate-950' 
          : 'border-slate-800 text-slate-500'
      }`}>
        <span className="font-bold tracking-widest uppercase">
          {card.isGold ? 'Lenda ★' : 'Seleção'}
        </span>
        <span className="font-mono">
          #{card.id.substring(0, 3).padEnd(3, '0')}
        </span>
      </div>

      {/* Tailwind utility selector injector */}
      <style>{`
        .truncate-3-lines {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
