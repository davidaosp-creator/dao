/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Card, HandItem, GameMode, GameScreen } from './types';
import { ALL_PLAYERS, getRandomDeck } from './data/cards';
import { soundEffects } from './utils/audio';
import SoundBar from './components/SoundBar';
import InstructionBanner from './components/InstructionBanner';
import CoinFlip from './components/CoinFlip';
import SoccerCard from './components/SoccerCard';
import { 
  Trophy, 
  RefreshCw, 
  User, 
  Users, 
  Send, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  VolumeX, 
  Info,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';

export default function App() {
  // Navigation & Screens
  const [screen, setScreen] = useState<GameScreen>('HOME');
  
  // Game state
  const [mode, setMode] = useState<GameMode>('CPU');
  const [isLocalMp, setIsLocalMp] = useState<boolean>(false); // Same-screen 2P vs Whatsapp 2P
  
  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Banners & notifications
  const [bannerMessage, setBannerMessage] = useState<string>('');
  
  // Deck & Hands
  const [playerDeck, setPlayerDeck] = useState<Card[]>([]);
  const [opponentDeck, setOpponentDeck] = useState<Card[]>([]);
  
  const [playerHand, setPlayerHand] = useState<HandItem[]>([]);
  const [opponentHand, setOpponentHand] = useState<HandItem[]>([]);
  
  // Game scores (Match score - first to 2 rounds wins)
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  
  // Coin toss winner & active turn
  const [coinWinner, setCoinWinner] = useState<'player' | 'opponent' | null>(null);
  const [activeTurn, setActiveTurn] = useState<'player' | 'opponent' | null>(null);
  
  // State control
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [mpPhase, setMpPhase] = useState<'YOUR_TURN' | 'WAITING_TURN'>('YOUR_TURN');
  
  // Gold card modal selector
  const [goldCardToAssign, setGoldCardToAssign] = useState<{ card: Card; handIndex: number; target: 'player' | 'opponent' } | null>(null);
  
  // Share controls
  const [importCodeText, setImportCodeText] = useState<string>('');
  const [copiedCodeCode, setCopiedCodeCode] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Drafting / Alternating starting card selection states
  const [draftState, setDraftState] = useState<'P1_C1' | 'P2_C1' | 'P1_C2' | 'P2_C2' | 'PLAY_PHASE' | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<'player' | 'opponent'>('player');

  // Trigger system whistle on mount when the user clicks anywhere to start
  useEffect(() => {
    const triggerInitialGreeting = () => {
      if (!isMuted) {
        soundEffects.playRefereeWhistle();
      }
      setBannerMessage("Seja bem-vindo ao Black Jack da Copa 2026!");
      window.removeEventListener('click', triggerInitialGreeting);
    };
    window.addEventListener('click', triggerInitialGreeting);
    return () => window.removeEventListener('click', triggerInitialGreeting);
  }, []);

  // Show a message in the instruction banner
  const triggerNotification = (msg: string) => {
    setBannerMessage(msg);
  };

  // Sound triggers helper
  const playSoundCard = () => { if (!isMuted) soundEffects.playCardDraw(); };
  const playSoundWhistle = () => { if (!isMuted) soundEffects.playRefereeWhistle(); };
  const playSoundCheer = () => { if (!isMuted) soundEffects.playCrowdCheer(); };
  const playSoundOoh = () => { if (!isMuted) soundEffects.playCrowdOoh(); };

  // Calculate blackjack hand totals
  const getHandTotal = (hand: HandItem[]): number => {
    return hand.reduce((acc, item) => acc + item.assignedValue, 0);
  };

  // Determine standard card unique keys
  const getUniqueId = () => Math.random().toString(36).substring(2, 9);

  // Starts a new CPU Match
  const initVsCpuMode = () => {
    setMode('CPU');
    setIsLocalMp(false);
    setPlayerScore(0);
    setOpponentScore(0);
    setCoinWinner(null);
    setActiveTurn(null);
    playSoundWhistle();
    setScreen('COIN_FLIP');
    triggerNotification("Escolha cara ou coroa para o sorteio inicial!");
  };

  // Starts Multiplayer selector menu
  const initMpMenu = () => {
    playSoundCard();
    setScreen('MP_MENU');
  };

  // Plays a local same-device Pass & Play Game mode
  const initLocalAmigoMode = () => {
    setMode('MP');
    setIsLocalMp(true);
    setPlayerScore(0);
    setOpponentScore(0);
    setCoinWinner(null);
    setActiveTurn(null);
    playSoundWhistle();
    setScreen('COIN_FLIP');
    triggerNotification("Passando o sorteio Cara ou Coroa!");
  };

  // Plays a WhatsApp code async game
  const initWhatsappCodeMode = () => {
    setMode('MP');
    setIsLocalMp(false);
    setPlayerScore(0);
    setOpponentScore(0);
    setCoinWinner(null);
    setActiveTurn(null);
    playSoundWhistle();
    setScreen('COIN_FLIP');
    triggerNotification("Sorteie cara ou coroa!");
  };

  // Set the final outcome of the Cara ou Coroa initial spin
  const handleCoinFlipFinished = (winner: 'player' | 'opponent') => {
    setCoinWinner(winner);
    setActiveTurn(winner);
    startHand(winner);
  };

  // Prepares the decks and deals starting cards stage-by-stage
  const startHand = (startingPlayerVal: 'player' | 'opponent') => {
    const pDeck = getRandomDeck();
    const oDeck = getRandomDeck();
    
    setPlayerDeck(pDeck);
    setOpponentDeck(oDeck);
    setIsRevealed(false);
    setMpPhase('YOUR_TURN');

    // Dealt cards arrays start completely empty
    const pHand: HandItem[] = [];
    const oHand: HandItem[] = [];

    setPlayerHand(pHand);
    setOpponentHand(oHand);

    setStartingPlayer(startingPlayerVal);
    setDraftState('P1_C1');
    setActiveTurn(startingPlayerVal);
    setScreen('GAME');

    if (startingPlayerVal === 'player') {
      triggerNotification("Seu lance inicial! Escolha seu primeiro jogador para começar a escalação.");
    } else {
      triggerNotification(mode === 'CPU' ? "CPU venceu o sorteio de bola e escala primeiro jogador..." : "Sorteio deu bola do Amigo! Amigo faz o primeiro lance.");
      if (mode === 'CPU') {
        setTimeout(() => {
          handleDraftDraw('opponent', pDeck, oDeck, pHand, oHand, 'P1_C1');
        }, 1500);
      }
    }
  };

  // Draft Phase State Automaton to alternate choices step-by-step
  const advanceDraftPhase = (
    pHand: HandItem[], 
    oHand: HandItem[], 
    pDeckCur?: Card[], 
    oDeckCur?: Card[],
    overrideDraftState?: 'P1_C1' | 'P2_C1' | 'P1_C2' | 'P2_C2'
  ) => {
    const curDraftState = overrideDraftState || draftState;
    const p1 = startingPlayer;
    const p2 = startingPlayer === 'player' ? 'opponent' : 'player';

    const pD = pDeckCur || playerDeck;
    const oD = oDeckCur || opponentDeck;

    if (curDraftState === 'P1_C1') {
      setDraftState('P2_C1');
      setActiveTurn(p2);
      if (p2 === 'opponent') {
        triggerNotification(mode === 'CPU' ? "CPU escolhendo primeiro reforço..." : "Vez do Amigo escolher seu 1º jogador!");
        if (mode === 'CPU') {
          setTimeout(() => handleDraftDraw('opponent', pD, oD, pHand, oHand, 'P2_C1'), 1500);
        }
      } else {
        triggerNotification("Você escolheu seu primeiro craque! Agora o Amigo escolhe o dele.");
      }
    } else if (curDraftState === 'P2_C1') {
      setDraftState('P1_C2');
      setActiveTurn(p1);
      if (p1 === 'opponent') {
        triggerNotification(mode === 'CPU' ? "CPU selecionando segundo jogador..." : "Vez do Amigo escolher seu 2º jogador!");
        if (mode === 'CPU') {
          setTimeout(() => handleDraftDraw('opponent', pD, oD, pHand, oHand, 'P1_C2'), 1500);
        }
      } else {
        triggerNotification("Rival escolheu o primeiro craque! Sua vez de escolher o segundo.");
      }
    } else if (curDraftState === 'P1_C2') {
      setDraftState('P2_C2');
      setActiveTurn(p2);
      if (p2 === 'opponent') {
        triggerNotification(mode === 'CPU' ? "CPU escolhendo seu segundo jogador..." : "Vez do Amigo escolher seu 2º jogador!");
        if (mode === 'CPU') {
          setTimeout(() => handleDraftDraw('opponent', pD, oD, pHand, oHand, 'P2_C2'), 1500);
        }
      } else {
        triggerNotification("Você escalou seu segundo reforço! Amigo decide o dele agora.");
      }
    } else if (curDraftState === 'P2_C2') {
      setDraftState('PLAY_PHASE');
      setActiveTurn(p1);
      
      if (p1 === 'player') {
        triggerNotification("Escalações iniciais fechadas! Seu lance. Decida se quer puxar craque ou parar.");
      } else {
        triggerNotification("Escalações iniciais fechadas! CPU inicia o ataque...");
        if (mode === 'CPU') {
          setTimeout(() => {
            runCpuLogicWithStartingDeck(oHand, pHand, oD);
          }, 1500);
        }
      }
    }
  };

  // Draws a drafted starting card alternating turns
  const handleDraftDraw = (
    who: 'player' | 'opponent',
    pDeckParam?: Card[],
    oDeckParam?: Card[],
    pHandParam?: HandItem[],
    oHandParam?: HandItem[],
    overrideDraftState?: 'P1_C1' | 'P2_C1' | 'P1_C2' | 'P2_C2'
  ) => {
    const curDraftState = overrideDraftState || draftState;
    const curPHand = pHandParam || playerHand;
    const curOHand = oHandParam || opponentHand;
    const curPDeck = pDeckParam || playerDeck;
    const curODeck = oDeckParam || opponentDeck;

    if (who === 'player') {
      const deckCopy = [...curPDeck];
      const drawn = deckCopy.shift();
      if (!drawn) return;
      setPlayerDeck(deckCopy);
      playSoundCard();

      const newItem: HandItem = { id: getUniqueId(), card: drawn, assignedValue: drawn.blackjackValue };
      const nextHand = [...curPHand, newItem];
      setPlayerHand(nextHand);

      if (drawn.isGold) {
        setGoldCardToAssign({
          card: drawn,
          handIndex: nextHand.length - 1,
          target: 'player'
        });
        return;
      }

      advanceDraftPhase(nextHand, curOHand, deckCopy, curODeck, curDraftState || undefined);
    } else {
      const deckCopy = [...curODeck];
      const drawn = deckCopy.shift();
      if (!drawn) return;
      setOpponentDeck(deckCopy);
      playSoundCard();

      let assigned = drawn.blackjackValue;
      if (drawn.isGold) {
        assigned = 11; // AI defaults to 11
      }

      const newItem: HandItem = { id: getUniqueId(), card: drawn, assignedValue: assigned };
      const nextHand = [...curOHand, newItem];
      setOpponentHand(nextHand);

      advanceDraftPhase(curPHand, nextHand, curPDeck, deckCopy, curDraftState || undefined);
    }
  };

  // Assign the dynamic value of Gold cards (1 to 11 points) chosen in our interactive selector
  const handleAssignGoldValue = (value: number) => {
    if (!goldCardToAssign) return;
    const { handIndex, target } = goldCardToAssign;

    if (target === 'player') {
      const updated = [...playerHand];
      updated[handIndex].assignedValue = value;
      setPlayerHand(updated);
      playSoundCard();
      
      const newTotal = updated.reduce((sum, h) => sum + h.assignedValue, 0);
      setGoldCardToAssign(null);

      // If we are currently in the draft phase, progress the draft sequence
      if (draftState && draftState !== 'PLAY_PHASE') {
        const pStateAtAssign = draftState;
        setTimeout(() => {
          advanceDraftPhase(updated, opponentHand, undefined, undefined, pStateAtAssign);
        }, 500);
      } else {
        if (newTotal > 21) {
          triggerNotification(`Estourou com ${newTotal} pontos! Fim do seu lance.`);
          // Autopass if player busted
          setTimeout(() => handleStandAction(), 1000);
        }
      }
    } else {
      // Opponent auto resolves
      const updated = [...opponentHand];
      updated[handIndex].assignedValue = value;
      setOpponentHand(updated);
      setGoldCardToAssign(null);
    }
  };

  // Draws a card for active Player
  const handleHitCard = () => {
    if (activeTurn !== 'player' || isRevealed) return;

    const currentDeck = [...playerDeck];
    const drawn = currentDeck.shift();
    if (!drawn) {
      triggerNotification("Fim do baralho de reservas!");
      return;
    }

    setPlayerDeck(currentDeck);
    playSoundCard();

    const newItem: HandItem = { id: getUniqueId(), card: drawn, assignedValue: drawn.blackjackValue };
    const nextHand = [...playerHand, newItem];
    setPlayerHand(nextHand);

    // If drawn is a Gold card, show prompt immediately
    if (drawn.isGold) {
      setGoldCardToAssign({
        card: drawn,
        handIndex: nextHand.length - 1,
        target: 'player'
      });
      return;
    }

    const total = getHandTotal(nextHand);
    if (total > 21) {
      triggerNotification(`Bateu na trave! Estourou com ${total} pontos.`);
      playSoundOoh();
      setTimeout(() => {
        handleStandAction();
      }, 1400);
    } else {
      triggerNotification(`Puxou ${drawn.name}. Copa total: ${total} pontos.`);
    }
  };

  // Stand Action - passes turn or calculates final scores
  const handleStandAction = () => {
    if (isRevealed) return;

    if (mode === 'CPU') {
      // Reveal cards
      setIsRevealed(true);
      playSoundWhistle();
      triggerNotification("CPU controlando a posse de bola...");

      // CPU acts after player
      setTimeout(() => {
        let cpuDeckCopy = [...opponentDeck];
        let cpuHandCopy = [...opponentHand];
        let cpuTotal = getHandTotal(cpuHandCopy);
        
        const playerTotal = getHandTotal(playerHand);

        // CPU rules: hit if less than 17, and also draw if losing to standing player (if player hasn't busted)
        const playerBusted = playerTotal > 21;

        const interval = setInterval(() => {
          if (cpuTotal < 17 && !playerBusted && cpuTotal <= playerTotal) {
            const extra = cpuDeckCopy.shift();
            if (extra) {
              playSoundCard();
              // CPU automatically assigns optimal gold card values
              let assigned = extra.blackjackValue;
              if (extra.isGold) {
                assigned = (cpuTotal + 11 <= 21) ? 11 : 1;
              }
              cpuHandCopy.push({ id: getUniqueId(), card: extra, assignedValue: assigned });
              setOpponentHand([...cpuHandCopy]);
              cpuTotal = getHandTotal(cpuHandCopy);
            } else {
              clearInterval(interval);
              resolveHandScores(playerTotal, cpuTotal);
            }
          } else {
            clearInterval(interval);
            setOpponentDeck(cpuDeckCopy);
            resolveHandScores(playerTotal, cpuTotal);
          }
        }, 800);
      }, 800);

    } else if (mode === 'MP') {
      if (isLocalMp) {
        // Local pass mode: Toggle active turn to opponent
        if (activeTurn === 'player') {
          setActiveTurn('opponent');
          triggerNotification("Passe o celular para o Amigo! É a vez dele.");
        } else {
          // Both have stood, let's reveal!
          setIsRevealed(true);
          resolveHandScores(getHandTotal(playerHand), getHandTotal(opponentHand));
        }
      } else {
        // WhatsApp interactive code export mode
        setMpPhase('WAITING_TURN');
        triggerNotification("Sua jogada concluída! Envie o código de passe ao amigo.");
      }
    }
  };

  // Companion action: opponent (CPU) plays its strategy if it starts first
  const runCpuLogicWithStartingDeck = (startOppHand: HandItem[], targetPlayerHand: HandItem[], deck: Card[]) => {
    let cpuHandCopy = [...startOppHand];
    let cpuDeckCopy = [...deck];
    let cpuTotal = getHandTotal(cpuHandCopy);

    const interval = setInterval(() => {
      // When CPU starting, standard deal limit is 17 or higher
      if (cpuTotal < 17) {
        const extra = cpuDeckCopy.shift();
        if (extra) {
          playSoundCard();
          let assigned = extra.blackjackValue;
          if (extra.isGold) {
            assigned = (cpuTotal + 11 <= 21) ? 11 : 1;
          }
          cpuHandCopy.push({ id: getUniqueId(), card: extra, assignedValue: assigned });
          cpuTotal = getHandTotal(cpuHandCopy);
          setOpponentHand([...cpuHandCopy]);
        } else {
          clearInterval(interval);
          setOpponentDeck(cpuDeckCopy);
          passToPlayerTurn();
        }
      } else {
        clearInterval(interval);
        setOpponentDeck(cpuDeckCopy);
        passToPlayerTurn();
      }
    }, 850);
  };

  const passToPlayerTurn = () => {
    setActiveTurn('player');
    triggerNotification("A CPU parou o avanço! É a sua vez de atacar para superar os pontos.");
  };

  // Local Pass & Play opponent card action
  const handleLocalOpponentHit = () => {
    if (activeTurn !== 'opponent' || isRevealed) return;

    const currentDeck = [...opponentDeck];
    const drawn = currentDeck.shift();
    if (!drawn) return;

    setOpponentDeck(currentDeck);
    playSoundCard();

    const newItem: HandItem = { id: getUniqueId(), card: drawn, assignedValue: drawn.blackjackValue };
    const nextHand = [...opponentHand, newItem];
    setOpponentHand(nextHand);

    const total = getHandTotal(nextHand);
    if (total > 21) {
      triggerNotification(`Amigo isolou o chute! Estourou com ${total} pontos.`);
      playSoundOoh();
      setTimeout(() => {
        handleStandAction();
      }, 1400);
    } else {
      triggerNotification(`Amigo puxou ${drawn.name}. Total: ${total} pontos.`);
    }
  };

  // Resolve winner of the current round hand
  const resolveHandScores = (pTotal: number, oTotal: number) => {
    let winner: 'player' | 'opponent' | 'empate' = 'empate';

    if (pTotal > 21 && oTotal > 21) {
      // Both busted, closest to 21 wins
      winner = pTotal < oTotal ? 'player' : 'opponent';
    } else if (pTotal > 21) {
      winner = 'opponent';
    } else if (oTotal > 21) {
      winner = 'player';
    } else if (pTotal === oTotal) {
      winner = 'empate';
    } else {
      winner = pTotal > oTotal ? 'player' : 'opponent';
    }

    // Add points for match progression (best of 3 rounds, first to 2 pts)
    let outcomeText = '';
    if (winner === 'player') {
      setPlayerScore(prev => prev + 1);
      playSoundCheer();
      outcomeText = `Você venceu a rodada! (${pTotal} x ${oTotal})`;
    } else if (winner === 'opponent') {
      setOpponentScore(prev => prev + 1);
      playSoundOoh();
      outcomeText = `O adversário venceu a rodada! (${oTotal} x ${pTotal})`;
    } else {
      playSoundCheer(); 
      outcomeText = `Empate na grande área! (${pTotal} x ${oTotal})`;
    }

    triggerNotification(outcomeText);

    // Verify if overall match is completed (First to 2 points)
    setTimeout(() => {
      // Need updating with latest states
      const nextPlayerScore = winner === 'player' ? playerScore + 1 : playerScore;
      const nextOpponentScore = winner === 'opponent' ? opponentScore + 1 : opponentScore;

      if (nextPlayerScore >= 2 || nextOpponentScore >= 2) {
        playSoundWhistle();
        setScreen('END');
      } else {
        // Prepare next round
        triggerNotification(`Rodada seguinte! Próximo lance se preparando...`);
        setTimeout(() => {
          // Coin toss winner takes priority of next round setup
          startHand(coinWinner || 'player');
        }, 1200);
      }
    }, 2800);
  };

  // WhatsApp async code generator
  const getWhatsappShareLink = (): string => {
    const gameStatePayload = {
      mode: 'MP',
      score: [playerScore, opponentScore],
      playerHand: playerHand,
      opponentHand: opponentHand,
      playerDeck: playerDeck,
      opponentDeck: opponentDeck,
      coinWinner: coinWinner,
      isRevealed: false
    };

    const code = "COPA2026#" + btoa(JSON.stringify(gameStatePayload));
    const message = `Vamos jogar o Black Jack da Copa 2026! ⚽🏆\n\nEu fiz a minha jogada. Agora é a sua vez! Copie todo o código abaixo, abra o site e clique em "Importar e Jogar":\n\n${code}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const copyMpPayloadCode = () => {
    const gameStatePayload = {
      mode: 'MP',
      score: [playerScore, opponentScore],
      playerHand: playerHand,
      opponentHand: opponentHand,
      playerDeck: playerDeck,
      opponentDeck: opponentDeck,
      coinWinner: coinWinner,
      isRevealed: false
    };

    const code = "COPA2026#" + btoa(JSON.stringify(gameStatePayload));
    navigator.clipboard.writeText(code);
    setCopiedCodeCode(true);
    triggerNotification("Código copiado para a área de transferência!");
    setTimeout(() => setCopiedCodeCode(false), 2000);
  };

  // Import WhatsApp code
  const handleImportMpCode = () => {
    if (!importCodeText.trim()) {
      alert("Por favor, cole um código válido recebido.");
      return;
    }

    try {
      const parts = importCodeText.trim().split("COPA2026#");
      if (parts.length < 2) {
        alert("Formato inválido! Verifique se copiou todo o código iniciando com COPA2026#");
        return;
      }

      const decoded = JSON.parse(atob(parts[1]));
      
      // Load states
      setMode('MP');
      setIsLocalMp(false);
      setPlayerScore(decoded.score[0]);
      setOpponentScore(decoded.score[1]);
      
      // Swap hands so that the friend acts as 'player'
      // The current sender is now 'opponent', and the player import receiver is 'player'
      setPlayerHand(decoded.opponentHand);
      setOpponentHand(decoded.playerHand);
      
      setPlayerDeck(decoded.opponentDeck);
      setOpponentDeck(decoded.playerDeck);
      
      setCoinWinner(decoded.coinWinner);
      
      // Switch active turns
      setActiveTurn('player');
      setDraftState('PLAY_PHASE');
      setIsRevealed(false);
      setMpPhase('YOUR_TURN');
      
      playSoundWhistle();
      setScreen('GAME');
      triggerNotification("Seja bem-vindo de volta à partida! Faça o seu lance.");
    } catch (e) {
      alert("Falha ao descriptografar o jogo! Certifique-se de que copiou o código inteiro.");
      console.error(e);
    }
  };

  const handleRestartMatch = () => {
    if (mode === 'CPU') {
      initVsCpuMode();
    } else {
      if (isLocalMp) {
        initLocalAmigoMode();
      } else {
        initWhatsappCodeMode();
      }
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none pb-8 sm:pb-12">
      {/* Stadium Soccer Field Pitch background graphic patterns */}
      <div className="absolute inset-0 pitch-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950 pointer-events-none" />

      {/* Dynamic Instruction Banner */}
      <InstructionBanner message={bannerMessage} />

      {/* Header Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 py-4 filter drop-shadow flex items-center justify-between z-30">
        <button 
          onClick={() => {
            playSoundCard();
            setScreen('HOME');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 to-green-500 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg ring-2 ring-yellow-400">
            ⚽
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
              BLACK JACK
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#22C55E] leading-none">
              DA COPA 2026
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              playSoundCard();
              setShowHowToPlay(!showHowToPlay);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-yellow-400 flex items-center justify-center hover:bg-slate-800 cursor-pointer transition-all"
            title="Como jogar"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <SoundBar 
            isMuted={isMuted} 
            onToggleMute={() => {
              setIsMuted(!isMuted);
              // Simple sound triggers to test activation
              if (isMuted) {
                setTimeout(() => soundEffects.playRefereeWhistle(), 100);
              }
            }} 
          />
        </div>
      </header>

      {/* Rules Help Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border-2 border-yellow-500/40 rounded-3xl p-6 relative shadow-2xl">
            <h3 className="text-xl font-black text-yellow-400 flex items-center gap-2 mb-3">
              🏆 Regras da Copa do Blackjack
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-h-96 overflow-y-auto pr-1">
              <p>
                O objetivo é montar um time tático cuja pontuação chegue o mais próximo possível de <strong className="text-yellow-400">21 pontos</strong>, sem ultrapassar este valor!
              </p>
              
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  🛡️ Valor Tático dos Craques:
                </h4>
                <ul className="space-y-1 list-disc pl-4 text-xs">
                  <li><strong>Cartas Comuns:</strong> Valem a pontuação do jogador (Ex: Mbappé vale 10, Vini Jr vale 9, Rodri vale 7, Maignan vale 3).</li>
                  <li><strong>Cartas Lendárias Douradas (Pelé, Ronaldo, Messi, CR7, Maradona):</strong> São curingas de luxo e valem de <strong className="text-yellow-400">1 a 11 pontos</strong>! Você escolhe o valor tático que mais ajuda seu time no momento que compra a carta!</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-yellow-500/10">
                <h4 className="font-bold text-yellow-400 flex items-center gap-1.5 mb-1.5">
                  🪙 Sorteio do Campo (Cara ou Coroa):
                </h4>
                <p className="text-xs">
                  Quem vencer o Cara ou Coroa no início inicia a rodada com o <strong className="text-emerald-400">primeiro lance</strong>! Se for a CPU, ela puxará cartas primeiro.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-100">⚽ Dinâmica de Partida:</h4>
                <p className="text-xs">
                  Você joga contra a máquina ou passa para um amigo. Na modalidade WhatsApp, você executa o seu lance e envia o link gerado pelo aplicativo. Quando o amigo importar, ele tentará superar os seus pontos!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSoundCard();
                setShowHowToPlay(false);
              }}
              className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 font-extrabold text-slate-950 rounded-xl hover:from-green-400 tracking-wide text-xs uppercase cursor-pointer"
            >
              Entendido, Mandar Ver!
            </button>
          </div>
        </div>
      )}

      {/* MAIN GAME CONTAINER AND SCREENS */}
      <main className="w-full max-w-5xl mx-auto px-4 py-2 flex-grow flex items-center justify-center z-20">
        
        {/* TELA INICIAL (HOME SCREEN) */}
        {screen === 'HOME' && (
          <div id="screen-home" className="flex flex-col items-center text-center max-w-lg mx-auto">
            {/* World Cup Trophy glow container */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-125 animate-pulse" />
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-yellow-300 via-emerald-800 to-green-950 border-3 border-yellow-400 p-1 shadow-2xl flex items-center justify-center relative z-10 hover:rotate-12 transition-transform duration-300">
                <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-[0_4px_12px_rgba(234,179,8,0.7)]" />
              </div>
            </div>

            {/* Title display */}
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter leading-none bg-gradient-to-b from-yellow-100 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] uppercase select-none font-sans scale-y-110">
              BLACK JACK
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-[#22C55E] uppercase drop-shadow mt-1 select-none flex items-center gap-1.5 justify-center">
              <span>★</span> COPA 2026 <span>★</span>
            </h2>
            
            <p className="max-w-xs text-xs sm:text-sm text-slate-400 mt-3 font-mono">
              O lendário jogo de cartas de cassino com super craques táticos, vestindo a camisa verde e amarela!
            </p>

            {/* Action buttons with animated indicators */}
            <div className="mt-8 w-full space-y-3 px-4 sm:px-8">
              <button
                id="btn-vs-cpu"
                onClick={initVsCpuMode}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 font-black py-4 px-6 rounded-2xl text-sm sm:text-base tracking-widest border-b-4 border-emerald-800 hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer uppercase flex items-center justify-center gap-2.5"
              >
                <User className="w-5 h-5" />
                JOGAR VS CPU
              </button>

              <button
                id="btn-vs-amigo"
                onClick={initMpMenu}
                className="w-full bg-slate-900/90 text-yellow-400 font-black py-4 px-6 rounded-2xl text-sm sm:text-base tracking-widest border border-yellow-500/40 hover:bg-slate-800 hover:text-yellow-300 shadow-lg shadow-black/80 transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer uppercase flex items-center justify-center gap-2.5"
              >
                <Users className="w-5 h-5" />
                JOGAR VS AMIGO
              </button>
            </div>

            {/* Little aesthetic soccer lines credit */}
            <div className="mt-12 flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-mono tracking-widest bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/80">
              <span>🏟️</span> Estádio AI Studio Nacional
            </div>
          </div>
        )}

        {/* MULTIPLAYER SELECTOR (MP MENU SCREEN) */}
        {screen === 'MP_MENU' && (
          <div id="screen-mp-menu" className="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-2xl font-black text-yellow-400 text-center uppercase tracking-tight">
              Modo Multiplayer 👥
            </h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Escolha jogar localmente passando o aparelho ou envie desafios para os amigos via WhatsApp!
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={initLocalAmigoMode}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-widest cursor-pointer uppercase flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                1) No Mesmo Aparelho (Local)
              </button>

              <button
                onClick={initWhatsappCodeMode}
                className="w-full bg-slate-950 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-extrabold py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-widest cursor-pointer uppercase flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                2) Desafiar Via WhatsApp
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800">
              <label className="block text-xs font-bold text-yellow-500/90 uppercase tracking-widest mb-2 text-center">
                Já recebeu um código de desafio?
              </label>
              
              <textarea
                id="import-code"
                placeholder="Cole o código COPA2026#... recebido aqui para iniciar"
                value={importCodeText}
                onChange={(e) => setImportCodeText(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 text-slate-300 placeholder-slate-600 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none leading-relaxed"
              />

              <button
                onClick={handleImportMpCode}
                className="mt-2.5 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl text-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                Importar Código e Jogar!
              </button>
            </div>

            <button
              onClick={() => {
                playSoundCard();
                setScreen('HOME');
              }}
              className="mt-4 w-full text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider py-1 cursor-pointer"
            >
              Voltar ao Menu
            </button>
          </div>
        )}

        {/* TELA DE CARA OU COROA (COIN FLIP SCREEN) */}
        {screen === 'COIN_FLIP' && (
          <CoinFlip 
            onCoinFlipFinished={handleCoinFlipFinished}
            isMuted={isMuted}
          />
        )}

        {/* TELA DA PARTIDA (GAME MATCH SCREEN) */}
        {screen === 'GAME' && (
          <div id="screen-game" className="w-full flex flex-col items-center">
            
            {/* Header Score scoreboard Display */}
            <div className="w-full max-w-md bg-gradient-to-r from-emerald-950/90 via-slate-950/90 to-emerald-950/90 border border-yellow-500/30 rounded-2xl p-3 shadow-xl mb-4 flex items-center justify-between text-center select-none">
              <div className="flex-1">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">VOCÊ</div>
                <div className="text-3xl font-black text-white">{playerScore}</div>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-lg">
                <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-widest">
                  {mode === 'CPU' ? 'CPU' : 'AMIGO'}
                </span>
                <p className="text-[9px] font-mono text-slate-400">PLACAR DA COPA</p>
              </div>

              <div className="flex-1">
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                  {isLocalMp ? 'AMIGO' : mode === 'CPU' ? 'COMPUTADOR' : 'DESAFIANTE'}
                </div>
                <div className="text-3xl font-black text-white">{opponentScore}</div>
              </div>
            </div>

            {/* Display Active Turn Badge */}
            <div className="mb-4">
              {activeTurn === 'player' ? (
                <span className="bg-emerald-500 text-slate-950 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-pulse">
                  ⚽ Seu lance! Ajuste sua escalação
                </span>
              ) : (
                <span className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 flex items-center gap-1.5">
                  🛡️ {isLocalMp ? 'Lance do Amigo!' : 'Aguardando movimento adversário...'}
                </span>
              )}
            </div>

            {/* OPPONENT BOARD (At the top, represented by the rival lineup) */}
            <div className="w-full bg-slate-950/70 border border-slate-900 rounded-3xl p-4 mb-6 shadow-inner relative flex flex-col items-center">
              <div className="absolute top-2 left-4 text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1">
                <span>🛡️</span> {isLocalMp ? 'Elenco do Amigo' : 'Elenco da CPU / Rival'}
              </div>
              
              <div className="absolute top-2 right-4 text-[10px] font-mono font-bold text-amber-500">
                TOTAL: {isRevealed || (mode === 'MP' && mpPhase === 'WAITING_TURN') ? getHandTotal(opponentHand) : '?'} PTS
              </div>

              {/* Hand cards list */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 min-h-[225px] w-full px-2">
                {opponentHand.map((item, idx) => {
                  // Keep the first opponent card face up, or reveal all if isRevealed/waiting turn
                  const showFront = idx === 0 || isRevealed || (mode === 'MP' && mpPhase === 'WAITING_TURN');
                  return (
                    <div key={item.id} className="relative">
                      <SoccerCard 
                        card={item.card} 
                        assignedValue={item.assignedValue} 
                        showFront={showFront}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PLAYER BOARD (At the bottom, represented by the user's active hand) */}
            <div className="w-full bg-slate-950/70 border-2 border-emerald-500/15 rounded-3xl p-4 shadow-xl shadow-emerald-900/5 relative flex flex-col items-center">
              <div className="absolute top-2 left-4 text-[10px] font-black tracking-widest text-[#22C55E] uppercase flex items-center gap-1">
                <span>🏃</span> Seu Elenco Ativo
              </div>
              
              <div className="absolute top-2 right-4 text-xs font-mono font-bold text-yellow-400">
                PONTOS: <span className="bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded font-black text-sm">{getHandTotal(playerHand)}</span> / 21
              </div>

              {/* Hand cards list */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 min-h-[225px] w-full px-2">
                {playerHand.map((item) => (
                  <div key={item.id} className="relative">
                    <SoccerCard 
                      card={item.card} 
                      assignedValue={item.assignedValue} 
                      showFront={true}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* GAME ACTION CONTROLS */}
            <div className="mt-6 w-full max-w-md px-4 relative z-30">
              
              {/* Gold standard card chooser modal (relative inline container to prevent blocking the full app dialog if simple) */}
              {goldCardToAssign && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-sm bg-slate-950 border-2 border-yellow-400 rounded-3xl p-6 text-center shadow-2xl">
                    <span className="text-4xl animate-bounce inline-block mb-2">⭐</span>
                    <h4 className="text-xl font-black text-yellow-400 uppercase tracking-tight">Choice de Craque!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Escolha o valor tático de <strong>{goldCardToAssign.card.name}</strong> para o seu ataque (1 a 11):
                    </p>
                    
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAssignGoldValue(num)}
                          className="bg-yellow-400 hover:bg-yellow-300 active:scale-90 text-slate-950 font-black py-2.5 rounded-full text-xs transition-all cursor-pointer"
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono mt-4">
                      Super Trunfo: Você escolhe de acordo com sua proximidade do 21!
                    </p>
                  </div>
                </div>
              )}

              {/* Standard Active Buttons if inside Your Turn */}
              {mpPhase === 'YOUR_TURN' && !isRevealed && (
                <div className="flex flex-col gap-3">
                  
                  {/* DRAFT PHASE SELECTION BUTTONS */}
                  {draftState && draftState !== 'PLAY_PHASE' && (
                    <div className="w-full text-center">
                      {activeTurn === 'player' ? (
                        <button
                          onClick={() => handleDraftDraw('player')}
                          className="w-full bg-gradient-to-r from-yellow-400 via-green-500 to-emerald-600 hover:from-yellow-350 hover:to-emerald-500 text-slate-950 font-black py-4 px-6 rounded-2xl text-xs sm:text-sm tracking-widest border-b-4 border-emerald-850 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-center uppercase flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>🃏</span>
                          {draftState === 'P1_C1' || draftState === 'P2_C1' 
                            ? 'ESCOLHER REFORÇO 1 da escalação' 
                            : 'ESCOLHER REFORÇO 2 da escalação'}
                        </button>
                      ) : (
                        <div className="w-full text-center py-4 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-xs font-mono text-amber-500 animate-pulse uppercase tracking-widest block">
                            {isLocalMp 
                              ? '🛡️ AMIGO: É a sua vez de escolher seu jogador!' 
                              : mode === 'CPU' 
                                ? '🛡️ CPU decidindo tática de escala...' 
                                : '🛡️ Aguardando lance do Adversário...'}
                          </span>
                          
                          {isLocalMp && (
                            <button
                              onClick={() => handleDraftDraw('opponent')}
                              className="mt-3 mx-auto flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-350 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase cursor-pointer transition-all border-b-2 border-yellow-700"
                            >
                              <span>🃏</span> ESCOLHER REFORÇO (Amigo)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* GAMEPLAY PHASE BUTTONS */}
                  {draftState === 'PLAY_PHASE' && (
                    <div className="flex items-center gap-3 w-full">
                      {activeTurn === 'player' ? (
                        <>
                          <button
                            onClick={handleHitCard}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-black py-4 rounded-xl text-xs sm:text-sm tracking-wider shadow-lg active:scale-95 cursor-pointer border-b-4 border-emerald-850 uppercase flex items-center justify-center gap-1.5"
                          >
                            Pedir Carta 🃏 (HIT)
                          </button>

                          <button
                            onClick={handleStandAction}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-black py-4 rounded-xl text-xs sm:text-sm tracking-wider shadow-lg active:scale-95 cursor-pointer border-b-4 border-red-800 uppercase flex items-center justify-center gap-1.5"
                          >
                            Parar Avanço ✋ (STAND)
                          </button>
                        </>
                      ) : (
                        /* Local Pass friend turn button controls */
                        isLocalMp && activeTurn === 'opponent' ? (
                          <>
                            <button
                              onClick={handleLocalOpponentHit}
                              className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-3.5 rounded-xl text-xs tracking-wider shadow-lg active:scale-95 cursor-pointer uppercase border-b-4 border-amber-700"
                            >
                              (RIVAL) Carta 🃏
                            </button>

                            <button
                              onClick={handleStandAction}
                              className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 font-black py-3.5 rounded-xl text-xs tracking-wider shadow-lg active:scale-95 cursor-pointer uppercase"
                            >
                              (RIVAL) Parar ✋
                            </button>
                          </>
                        ) : (
                          /* Wait for CPU simulation label */
                          <div className="w-full text-center py-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                            <span className="text-xs font-mono text-amber-500 animate-pulse uppercase tracking-widest">
                              🛡️ O adversário está decidindo a tática...
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Waiting WhatsApp Turn phase options */}
              {mpPhase === 'WAITING_TURN' && mode === 'MP' && !isLocalMp && (
                <div className="bg-slate-900/90 border-2 border-green-500/30 p-4 rounded-2xl relative text-center">
                  <div className="flex justify-center mb-1">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h4 className="text-sm font-black text-green-400 uppercase tracking-tight">
                    Fim do Seu Lance!
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Você parou com <strong className="text-yellow-400">{getHandTotal(playerHand)} pontos</strong>. Envie o código abaixo para o seu amigo via WhatsApp para ele fazer o lance dele!
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 mt-4">
                    <button
                      onClick={copyMpPayloadCode}
                      className="bg-slate-950 hover:bg-slate-800 border border-yellow-500/20 text-yellow-400 text-xs font-extrabold py-3.5 px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      {copiedCodeCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCodeCode ? 'Copiado!' : 'Copiar Código'}
                    </button>

                    <a
                      href={getWhatsappShareLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-500 text-slate-950 text-xs font-black py-3.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar Amigo
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      playSoundCard();
                      setScreen('HOME');
                    }}
                    className="mt-4 text-xs font-bold text-slate-400 hover:text-white underline"
                  >
                    Encerrar e Voltar à Entrada
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TELA DE FIM DE CONFRONTO (GAME OVER SCREEN) */}
        {screen === 'END' && (
          <div id="screen-end" className="text-center max-w-md mx-auto bg-slate-900 border-2 border-yellow-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-center mb-1.5">
              <div className="w-16 h-16 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <Trophy className="w-9 h-9 text-yellow-400 animate-bounce" />
              </div>
            </div>

            <h2 className="text-3xl font-black italic tracking-tighter text-yellow-400 uppercase leading-none">
              APITO FINAL!
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
              Fim de Partida
            </p>

            <div className="my-6 bg-slate-950 py-4 px-6 rounded-2xl border border-slate-800 flex items-center justify-around">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">VOCÊ</p>
                <p className="text-3xl font-black text-white">{playerScore}</p>
              </div>

              <div className="text-xl font-bold font-mono text-yellow-400/40">X</div>

              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">ADVERSÁRIO</p>
                <p className="text-3xl font-black text-white">{opponentScore}</p>
              </div>
            </div>

            {/* Winner outcome declaration */}
            <h3 className={`text-xl font-black ${
              playerScore >= 2 ? 'text-green-400' : 'text-rose-500'
            }`}>
              {playerScore >= 2 ? '🏆 CAMPEÃO DO MUNDO!' : '🥈 ADVERSÁRIO VENCEU O CONFRONTO'}
            </h3>
            
            <p className="text-xs text-slate-400 mt-2">
              {playerScore >= 2 
                ? 'Seu time jogou um futebol de elite, goleando as cartas do oponente!' 
                : 'Faltou pontaria técnica! Treine mais as escolhas e tente novamente.'}
            </p>

            <div className="mt-8 space-y-2">
              <button
                onClick={handleRestartMatch}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 text-slate-950 font-black py-4 rounded-xl text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
              >
                ⚽ Jogar Novamente!
              </button>

              <button
                onClick={() => {
                  playSoundCard();
                  setScreen('HOME');
                }}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase cursor-pointer"
              >
                Voltar à Tela de Entrada
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Styled Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 mt-auto text-center relative z-20">
        <p className="text-[9px] text-slate-500/80 font-mono tracking-widest uppercase">
          Black Jack Copa Do Mundo de Futebol 2026 • Versão Premium 🥇
        </p>
      </footer>
    </div>
  );
}
