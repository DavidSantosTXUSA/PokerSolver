export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type Rank = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
export type Card = { rank: Rank; suit: Suit };
export type Hand = [Card, Card];
export type BoardCards = [Card?, Card?, Card?, Card?, Card?];
export type Position = "BTN" | "SB" | "BB" | "UTG" | "MP" | "CO";

export const RANKS: Rank[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
export const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];

export const HAND_CATEGORIES = [
  "Royal Flush",
  "Straight Flush",
  "Four of a Kind",
  "Full House",
  "Flush",
  "Straight",
  "Three of a Kind",
  "Two Pair",
  "One Pair",
  "High Card",
];

export const POSITION_NAMES: Position[] = [
  "BTN",
  "SB",
  "BB",
  "UTG",
  "MP",
  "CO",
];

export const ACTIONS = [
  "Fold",
  "Check",
  "Call",
  "Bet",
  "Raise",
  "All-In",
];

// Starting hand combinations (169 total)
export const generateStartingHands = (): string[] => {
  const hands: string[] = [];
  
  // Pocket pairs (AA, KK, QQ, etc.)
  for (const rank of RANKS) {
    hands.push(`${rank}${rank}`);
  }
  
  // Suited hands (AKs, AQs, etc.)
  for (let i = 0; i < RANKS.length; i++) {
    for (let j = i + 1; j < RANKS.length; j++) {
      hands.push(`${RANKS[i]}${RANKS[j]}s`);
    }
  }
  
  // Offsuit hands (AKo, AQo, etc.)
  for (let i = 0; i < RANKS.length; i++) {
    for (let j = i + 1; j < RANKS.length; j++) {
      hands.push(`${RANKS[i]}${RANKS[j]}o`);
    }
  }
  
  return hands;
};

// Default hand ranges
export const DEFAULT_RANGES = {
  UTG: [
    "AA", "KK", "QQ", "JJ", "TT", "99", "88", 
    "AKs", "AQs", "AJs", "ATs", "KQs", "KJs",
    "AKo", "AQo"
  ],
  MP: [
    "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77",
    "AKs", "AQs", "AJs", "ATs", "A9s", "KQs", "KJs", "KTs", "QJs", "QTs", "JTs",
    "AKo", "AQo", "AJo", "KQo"
  ],
  CO: [
    "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55",
    "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
    "KQs", "KJs", "KTs", "K9s", "QJs", "QTs", "Q9s", "JTs", "J9s", "T9s", "98s", "87s", "76s",
    "AKo", "AQo", "AJo", "ATo", "A9o", "KQo", "KJo", "QJo"
  ],
  BTN: [
    "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
    "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
    "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
    "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "JTs", "J9s", "J8s", "T9s", "T8s", "98s", "87s", "76s", "65s", "54s",
    "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "A7o", "A6o", "A5o", "A4o", "A3o", "A2o",
    "KQo", "KJo", "KTo", "K9o", "QJo", "QTo", "JTo"
  ],
  SB: [
    "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
    "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
    "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
    "QJs", "QTs", "Q9s", "Q8s", "Q7s", "JTs", "J9s", "T9s", "98s", "87s", "76s", "65s",
    "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "KQo", "KJo", "KTo", "QJo", "QTo", "JTo"
  ],
  BB: [
    "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
    "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
    "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "QJs", "QTs", "JTs",
    "AKo", "AQo", "AJo", "ATo", "KQo"
  ],
};

// Hand strength categories
export const HAND_STRENGTH = {
  PREMIUM: ["AA", "KK", "QQ", "AKs"],
  STRONG: ["JJ", "TT", "99", "AQs", "AJs", "AKo", "AQo"],
  MEDIUM: ["88", "77", "66", "ATs", "A9s", "A8s", "KQs", "KJs", "AJo", "KQo"],
  PLAYABLE: ["55", "44", "33", "22", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KTs", "QJs", "JTs", "ATo", "KJo"],
  SPECULATIVE: ["K9s", "Q9s", "J9s", "T9s", "98s", "87s", "76s", "65s", "54s", "A9o", "KTo", "QJo"],
  WEAK: ["K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "J8s", "T8s", "97s", "A8o", "A7o", "A6o", "A5o", "A4o", "A3o", "A2o", "K9o", "Q9o", "J9o"],
};

// Get hand category (pair, suited, offsuit)
export const getHandCategory = (hand: string): string => {
  if (hand.length === 2) {
    return "Pair";
  } else if (hand.endsWith("s")) {
    return "Suited";
  } else {
    return "Offsuit";
  }
};

// Get hand strength category
export const getHandStrengthCategory = (hand: string): string => {
  if (HAND_STRENGTH.PREMIUM.includes(hand)) {
    return "Premium";
  } else if (HAND_STRENGTH.STRONG.includes(hand)) {
    return "Strong";
  } else if (HAND_STRENGTH.MEDIUM.includes(hand)) {
    return "Medium";
  } else if (HAND_STRENGTH.PLAYABLE.includes(hand)) {
    return "Playable";
  } else if (HAND_STRENGTH.SPECULATIVE.includes(hand)) {
    return "Speculative";
  } else {
    return "Weak";
  }
};

// Format cards as a hand string (e.g., "AKs" or "TT")
export const formatHand = (cards: Card[]): string => {
  if (cards.length !== 2) return "";
  
  const [card1, card2] = cards;
  if (card1.rank === card2.rank) {
    return `${card1.rank}${card2.rank}`;
  } else {
    const isSuited = card1.suit === card2.suit;
    // Ensure higher rank comes first
    const rankOrder = RANKS.indexOf(card1.rank) < RANKS.indexOf(card2.rank) 
      ? [card1.rank, card2.rank] 
      : [card2.rank, card1.rank];
    return `${rankOrder[0]}${rankOrder[1]}${isSuited ? 's' : 'o'}`;
  }
};