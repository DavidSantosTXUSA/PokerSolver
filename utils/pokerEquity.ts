import { Card, Rank, Suit, RANKS, SUITS } from '@/constants/poker';

// Convert card to numeric value for comparison
export const getCardValue = (card: Card): number => {
  const rankValues: Record<Rank, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
  };
  return rankValues[card.rank];
};

// Check if cards form a flush
export const isFlush = (cards: Card[]): boolean => {
  if (cards.length < 5) return false;
  const suits = cards.map(card => card.suit);
  return SUITS.some(suit => suits.filter(s => s === suit).length >= 5);
};

// Check if cards form a straight
export const isStraight = (cards: Card[]): boolean => {
  if (cards.length < 5) return false;
  
  // Get unique ranks and sort by value
  const values = [...new Set(cards.map(card => getCardValue(card)))].sort((a, b) => a - b);
  
  // Check for A-5 straight
  if (values.includes(14) && values.includes(2) && values.includes(3) && 
      values.includes(4) && values.includes(5)) {
    return true;
  }
  
  // Check for regular straights
  for (let i = 0; i <= values.length - 5; i++) {
    if (values[i + 4] - values[i] === 4) {
      return true;
    }
  }
  
  return false;
};

// Get counts of each rank
export const getRankCounts = (cards: Card[]): Record<number, number> => {
  const counts: Record<number, number> = {};
  cards.forEach(card => {
    const value = getCardValue(card);
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
};

// Hand evaluator - returns a score for the hand (higher is better)
export const evaluateHand = (cards: Card[]): { score: number, name: string } => {
  if (cards.length < 5) return { score: 0, name: "Incomplete Hand" };
  
  const allCards = [...cards];
  const rankCounts = getRankCounts(allCards);
  const rankValues = Object.keys(rankCounts).map(Number).sort((a, b) => b - a);
  
  // Check for straight flush
  const flushSuit = SUITS.find(suit => 
    allCards.filter(card => card.suit === suit).length >= 5
  );
  
  if (flushSuit) {
    const flushCards = allCards.filter(card => card.suit === flushSuit);
    const flushValues = [...new Set(flushCards.map(card => getCardValue(card)))].sort((a, b) => b - a);
    
    // Check for royal flush
    if (flushValues.includes(14) && flushValues.includes(13) && flushValues.includes(12) && 
        flushValues.includes(11) && flushValues.includes(10)) {
      return { score: 9000000, name: "Royal Flush" };
    }
    
    // Check for straight flush
    for (let i = 0; i <= flushValues.length - 5; i++) {
      if (flushValues[i] - flushValues[i + 4] === 4) {
        return { score: 8000000 + flushValues[i], name: "Straight Flush" };
      }
    }
    
    // Check for A-5 straight flush
    if (flushValues.includes(14) && flushValues.includes(5) && flushValues.includes(4) && 
        flushValues.includes(3) && flushValues.includes(2)) {
      return { score: 8000000 + 5, name: "Straight Flush" };
    }
  }
  
  // Check for four of a kind
  for (const value of rankValues) {
    if (rankCounts[value] === 4) {
      const kicker = rankValues.find(v => v !== value) || 0;
      return { score: 7000000 + value * 100 + kicker, name: "Four of a Kind" };
    }
  }
  
  // Check for full house
  const threeOfAKind = rankValues.find(value => rankCounts[value] === 3);
  if (threeOfAKind !== undefined) {
    const pair = rankValues.find(value => value !== threeOfAKind && rankCounts[value] >= 2);
    if (pair !== undefined) {
      return { score: 6000000 + threeOfAKind * 100 + pair, name: "Full House" };
    }
  }
  
  // Check for flush
  if (flushSuit) {
    const flushCards = allCards.filter(card => card.suit === flushSuit)
      .sort((a, b) => getCardValue(b) - getCardValue(a))
      .slice(0, 5);
    const flushValues = flushCards.map(card => getCardValue(card));
    return { 
      score: 5000000 + flushValues[0] * 10000 + flushValues[1] * 1000 + 
             flushValues[2] * 100 + flushValues[3] * 10 + flushValues[4], 
      name: "Flush" 
    };
  }
  
  // Check for straight
  if (isStraight(allCards)) {
    // Find the highest straight
    const values = [...new Set(allCards.map(card => getCardValue(card)))].sort((a, b) => b - a);
    
    // Check for A-5 straight
    if (values.includes(14) && values.includes(5) && values.includes(4) && 
        values.includes(3) && values.includes(2)) {
      return { score: 4000000 + 5, name: "Straight" };
    }
    
    // Check for regular straights
    for (let i = 0; i <= values.length - 5; i++) {
      if (values[i] - values[i + 4] === 4) {
        return { score: 4000000 + values[i], name: "Straight" };
      }
    }
  }
  
  // Check for three of a kind
  if (threeOfAKind !== undefined) {
    const kickers = rankValues.filter(v => v !== threeOfAKind).slice(0, 2);
    return { 
      score: 3000000 + threeOfAKind * 1000 + (kickers[0] || 0) * 10 + (kickers[1] || 0), 
      name: "Three of a Kind" 
    };
  }
  
  // Check for two pair
  const pairs = rankValues.filter(value => rankCounts[value] === 2);
  if (pairs.length >= 2) {
    const kicker = rankValues.find(v => rankCounts[v] === 1) || 0;
    return { 
      score: 2000000 + pairs[0] * 1000 + pairs[1] * 10 + kicker, 
      name: "Two Pair" 
    };
  }
  
  // Check for one pair
  if (pairs.length === 1) {
    const kickers = rankValues.filter(v => rankCounts[v] === 1).slice(0, 3);
    return { 
      score: 1000000 + pairs[0] * 10000 + (kickers[0] || 0) * 100 + 
             (kickers[1] || 0) * 10 + (kickers[2] || 0), 
      name: "One Pair" 
    };
  }
  
  // High card
  const highCards = rankValues.slice(0, 5);
  return { 
    score: highCards[0] * 10000 + (highCards[1] || 0) * 1000 + 
           (highCards[2] || 0) * 100 + (highCards[3] || 0) * 10 + (highCards[4] || 0), 
    name: "High Card" 
  };
};

// Create a deck without the cards already in play
export const createDeckWithoutCards = (usedCards: Card[]): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      if (!usedCards.some(card => card.rank === rank && card.suit === suit)) {
        deck.push({ rank, suit });
      }
    }
  }
  return deck;
};

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Monte Carlo simulation for equity calculation
export const calculateEquity = (
  playerCards: Card[], 
  opponentCards: Card[], 
  communityCards: Card[],
  iterations: number = 1000
): { playerEquity: number, opponentEquity: number, tie: number } => {
  // If we don't have enough cards, return default values
  if (playerCards.length !== 2) {
    return { playerEquity: 0, opponentEquity: 0, tie: 0 };
  }
  
  let playerWins = 0;
  let opponentWins = 0;
  let ties = 0;
  
  // All cards that are already in play
  const usedCards = [...playerCards, ...communityCards];
  
  // If opponent cards are specified, use them
  let knownOpponentCards = false;
  if (opponentCards.length === 2) {
    usedCards.push(...opponentCards);
    knownOpponentCards = true;
  }
  
  // Create a deck without the used cards
  const remainingDeck = createDeckWithoutCards(usedCards);
  
  // Run the simulation
  for (let i = 0; i < iterations; i++) {
    // Shuffle the deck
    const shuffledDeck = shuffleArray(remainingDeck);
    
    // Generate random opponent cards if not specified
    const currentOpponentCards = knownOpponentCards 
      ? opponentCards 
      : [shuffledDeck[0], shuffledDeck[1]];
    
    // Generate remaining community cards if needed
    const remainingCommunityCount = 5 - communityCards.length;
    const currentCommunityCards = [
      ...communityCards,
      ...shuffledDeck.slice(knownOpponentCards ? 0 : 2, (knownOpponentCards ? 0 : 2) + remainingCommunityCount)
    ];
    
    // Evaluate both hands
    const playerHand = evaluateHand([...playerCards, ...currentCommunityCards]);
    const opponentHand = evaluateHand([...currentOpponentCards, ...currentCommunityCards]);
    
    // Compare hand strengths
    if (playerHand.score > opponentHand.score) {
      playerWins++;
    } else if (opponentHand.score > playerHand.score) {
      opponentWins++;
    } else {
      ties++;
    }
  }
  
  // Calculate equity percentages
  return {
    playerEquity: playerWins / iterations,
    opponentEquity: opponentWins / iterations,
    tie: ties / iterations
  };
};

// Get the best 5-card hand from 7 cards
export const getBestHand = (cards: Card[]): Card[] => {
  if (cards.length <= 5) return cards;
  
  // Generate all possible 5-card combinations
  const combinations: Card[][] = [];
  
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        for (let l = k + 1; l < cards.length; l++) {
          for (let m = l + 1; m < cards.length; m++) {
            combinations.push([cards[i], cards[j], cards[k], cards[l], cards[m]]);
          }
        }
      }
    }
  }
  
  // Evaluate each combination
  let bestScore = -1;
  let bestHand: Card[] = [];
  
  for (const combo of combinations) {
    const { score } = evaluateHand(combo);
    if (score > bestScore) {
      bestScore = score;
      bestHand = combo;
    }
  }
  
  return bestHand;
};

// Get hand category name
export const getHandCategoryName = (cards: Card[]): string => {
  if (cards.length < 5) return "Incomplete Hand";
  return evaluateHand(cards).name;
};