export interface Card {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  position: 'ATA' | 'MEI' | 'DEF' | 'GOL';
  blackjackValue: number;
  isGold?: boolean;
  legendBio?: string;
  rating: number; // e.g. 99, 97
}

export interface HandItem {
  id: string; // unique instance ID for React loops
  card: Card;
  assignedValue: number;
}

export type GameMode = 'CPU' | 'MP';

export type GameScreen = 'HOME' | 'COIN_FLIP' | 'GAME' | 'END' | 'MP_MENU';

export interface GameState {
  mode: GameMode;
  playerScore: number;
  opponentScore: number;
  playerHand: HandItem[];
  opponentHand: HandItem[];
  isRevealed: boolean;
  mpPhase: 'YOUR_TURN' | 'WAITING_TURN';
  coinWinner: 'player' | 'opponent' | null;
  turn: 'player' | 'opponent' | null;
}
