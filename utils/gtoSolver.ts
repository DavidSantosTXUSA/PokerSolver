import { Card, ACTIONS } from '@/constants/poker';
import { calculateEquity, evaluateHand } from './pokerEquity';

// Define position types
export type Position = 'BTN' | 'SB' | 'BB' | 'UTG' | 'MP' | 'CO';

// Define game state
export interface GameState {
  playerCards: Card[];
  communityCards: Card[];
  position: Position;
  potSize: number;
  betSize: number;
  stackSize: number;
  isPreflop: boolean;
}

// Define action recommendation
export interface ActionRecommendation {
  action: string;
  frequency: number;
  ev: number;
}

// Simple GTO solver based on equity and pot odds
export const solveForGTO = (
  gameState: GameState,
  iterations: number = 1000
): ActionRecommendation[] => {
  const { 
    playerCards, 
    communityCards, 
    position, 
    potSize, 
    betSize, 
    stackSize,
    isPreflop
  } = gameState;
  
  // If we don't have player cards, return empty recommendations
  if (playerCards.length !== 2) {
    return [];
  }
  
  // Calculate equity against random hands
  const { playerEquity } = calculateEquity(
    playerCards,
    [],
    communityCards,
    iterations
  );
  
  // Calculate pot odds
  const potOdds = betSize / (potSize + betSize);
  
  // Calculate minimum defense frequency (MDF)
  const mdf = 1 - (betSize / (potSize + betSize));
  
  // Calculate expected value for each action
  const recommendations: ActionRecommendation[] = [];
  
  // Preflop strategy is more position-dependent
  if (isPreflop) {
    // Adjust equity based on position
    let positionAdjustment = 0;
    switch (position) {
      case 'BTN':
        positionAdjustment = 0.1;
        break;
      case 'CO':
        positionAdjustment = 0.05;
        break;
      case 'MP':
        positionAdjustment = 0;
        break;
      case 'UTG':
        positionAdjustment = -0.05;
        break;
      case 'SB':
        positionAdjustment = -0.02;
        break;
      case 'BB':
        positionAdjustment = 0.02;
        break;
    }
    
    const adjustedEquity = Math.min(1, Math.max(0, playerEquity + positionAdjustment));
    
    // Calculate action frequencies
    if (adjustedEquity > 0.7) {
      // Premium hands
      recommendations.push({ 
        action: 'Raise', 
        frequency: 0.8, 
        ev: (potSize * adjustedEquity) - ((1 - adjustedEquity) * betSize)
      });
      recommendations.push({ 
        action: 'Call', 
        frequency: 0.2, 
        ev: (potSize * adjustedEquity) - ((1 - adjustedEquity) * betSize * 0.5)
      });
    } else if (adjustedEquity > 0.5) {
      // Strong hands
      recommendations.push({ 
        action: 'Raise', 
        frequency: 0.5, 
        ev: (potSize * adjustedEquity) - ((1 - adjustedEquity) * betSize)
      });
      recommendations.push({ 
        action: 'Call', 
        frequency: 0.3, 
        ev: (potSize * adjustedEquity) - ((1 - adjustedEquity) * betSize * 0.5)
      });
      recommendations.push({ 
        action: 'Fold', 
        frequency: 0.2, 
        ev: 0
      });
    } else if (adjustedEquity > 0.3) {
      // Medium hands
      recommendations.push({ 
        action: 'Call', 
        frequency: 0.6, 
        ev: (potSize * adjustedEquity) - ((1 - adjustedEquity) * betSize * 0.5)
      });
      recommendations.push({ 
        action: 'Fold', 
        frequency: 0.4, 
        ev: 0
      });
    } else {
      // Weak hands
      recommendations.push({ 
        action: 'Call', 
        frequency: 0.2, 
        ev: (potSize * adjustedEquity) - ((1 - adjustedEquity) * betSize * 0.5)
      });
      recommendations.push({ 
        action: 'Fold', 
        frequency: 0.8, 
        ev: 0
      });
    }
  } else {
    // Postflop strategy is more equity-dependent
    
    // Calculate hand strength
    const handStrength = evaluateHand([...playerCards, ...communityCards]).score;
    const normalizedStrength = Math.min(1, handStrength / 9000000); // Normalize to 0-1
    
    // Calculate action frequencies based on equity and hand strength
    const combinedStrength = (playerEquity * 0.7) + (normalizedStrength * 0.3);
    
    if (combinedStrength > potOdds * 1.5) {
      // Strong hands - value betting range
      recommendations.push({ 
        action: 'Bet', 
        frequency: 0.7, 
        ev: potSize * combinedStrength
      });
      recommendations.push({ 
        action: 'Check', 
        frequency: 0.3, 
        ev: potSize * combinedStrength * 0.8
      });
    } else if (combinedStrength > potOdds) {
      // Medium hands - mixed strategy
      recommendations.push({ 
        action: 'Bet', 
        frequency: 0.4, 
        ev: potSize * combinedStrength
      });
      recommendations.push({ 
        action: 'Check', 
        frequency: 0.6, 
        ev: potSize * combinedStrength * 0.8
      });
    } else if (combinedStrength > potOdds * 0.7) {
      // Bluffing range
      recommendations.push({ 
        action: 'Bet', 
        frequency: 0.2, 
        ev: (potSize * combinedStrength) - ((1 - combinedStrength) * betSize)
      });
      recommendations.push({ 
        action: 'Check', 
        frequency: 0.8, 
        ev: potSize * combinedStrength * 0.8
      });
    } else {
      // Weak hands
      recommendations.push({ 
        action: 'Bet', 
        frequency: 0.1, 
        ev: (potSize * combinedStrength) - ((1 - combinedStrength) * betSize)
      });
      recommendations.push({ 
        action: 'Check', 
        frequency: 0.9, 
        ev: potSize * combinedStrength * 0.8
      });
    }
  }
  
  // Normalize frequencies to sum to 100%
  const totalFrequency = recommendations.reduce((sum, rec) => sum + rec.frequency, 0);
  recommendations.forEach(rec => {
    rec.frequency = Math.round((rec.frequency / totalFrequency) * 100);
  });
  
  // Sort by frequency (highest first)
  return recommendations.sort((a, b) => b.frequency - a.frequency);
};