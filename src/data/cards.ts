import { Card } from '../types';

export const ALL_PLAYERS: Card[] = [
  {
    id: "pele",
    name: "Pelé",
    country: "Brasil",
    countryFlag: "🇧🇷",
    position: "ATA",
    blackjackValue: 11,
    isGold: true,
    legendBio: "O Rei do Futebol, 3 Copas do Mundo, o maior de todos os tempos.",
    rating: 99
  },
  {
    id: "ronaldo",
    name: "Ronaldo Fenômeno",
    country: "Brasil",
    countryFlag: "🇧🇷",
    position: "ATA",
    blackjackValue: 11,
    isGold: true,
    legendBio: "Artilheiro implacável do Penta nacional em 2002.",
    rating: 97
  },
  {
    id: "messi",
    name: "Lionel Messi",
    country: "Argentina",
    countryFlag: "🇦🇷",
    position: "ATA",
    blackjackValue: 11,
    isGold: true,
    legendBio: "Campeão mundial de 2022 e vencedor de 8 Bolas de Ouro.",
    rating: 98
  },
  {
    id: "cr7",
    name: "Cristiano Ronaldo",
    country: "Portugal",
    countryFlag: "🇵🇹",
    position: "ATA",
    blackjackValue: 11,
    isGold: true,
    legendBio: "O maior artilheiro da história das seleções e recordista de gols.",
    rating: 98
  },
  {
    id: "maradona",
    name: "Diego Maradona",
    country: "Argentina",
    countryFlag: "🇦🇷",
    position: "MEI",
    blackjackValue: 11,
    isGold: true,
    legendBio: "Símbolo histórico da conquista de 1986 na Copa do México.",
    rating: 97
  },
  {
    id: "mbappe",
    name: "Mbappé",
    country: "França",
    countryFlag: "🇫🇷",
    position: "ATA",
    blackjackValue: 10,
    rating: 94
  },
  {
    id: "vinijr",
    name: "Vini Jr.",
    country: "Brasil",
    countryFlag: "🇧🇷",
    position: "ATA",
    blackjackValue: 9,
    rating: 93
  },
  {
    id: "bellingham",
    name: "Bellingham",
    country: "Inglaterra",
    countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    position: "MEI",
    blackjackValue: 8,
    rating: 91
  },
  {
    id: "haaland",
    name: "Haaland",
    country: "Noruega",
    countryFlag: "🇳🇴",
    position: "ATA",
    blackjackValue: 10,
    rating: 92
  },
  {
    id: "rodri",
    name: "Rodri",
    country: "Espanha",
    countryFlag: "🇪🇸",
    position: "MEI",
    blackjackValue: 7,
    rating: 91
  },
  {
    id: "vandijk",
    name: "Van Dijk",
    country: "Holanda",
    countryFlag: "🇳🇱",
    position: "DEF",
    blackjackValue: 7,
    rating: 90
  },
  {
    id: "kane",
    name: "Harry Kane",
    country: "Inglaterra",
    countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    position: "ATA",
    blackjackValue: 8,
    rating: 89
  },
  {
    id: "salah",
    name: "Salah",
    country: "Egito",
    countryFlag: "🇪🇬",
    position: "ATA",
    blackjackValue: 8,
    rating: 90
  },
  {
    id: "modric",
    name: "Modrić",
    country: "Croácia",
    countryFlag: "🇭🇷",
    position: "MEI",
    blackjackValue: 7,
    rating: 88
  },
  {
    id: "pedri",
    name: "Pedri",
    country: "Espanha",
    countryFlag: "🇪🇸",
    position: "MEI",
    blackjackValue: 5,
    rating: 86
  },
  {
    id: "rubendias",
    name: "Rúben Dias",
    country: "Portugal",
    countryFlag: "🇵🇹",
    position: "DEF",
    blackjackValue: 4,
    rating: 87
  },
  {
    id: "maignan",
    name: "Maignan",
    country: "França",
    countryFlag: "🇫🇷",
    position: "GOL",
    blackjackValue: 3,
    rating: 85
  }
];

// Helper to shuffle cards
export function getRandomDeck(): Card[] {
  return [...ALL_PLAYERS].sort(() => Math.random() - 0.5);
}
