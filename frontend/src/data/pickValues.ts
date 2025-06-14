// Dynasty Draft Pick Trade Values
// Based on consensus dynasty trade value charts and adjusted for superflex

export interface PickValue {
  pick: number;
  round: number;
  pickInRound: number;
  value: number; // Base trade value
  dynastyValue: number; // Dynasty premium adjustment
  superflexValue: number; // Superflex premium adjustment
}

// Generate pick values for 26-round, 12-team draft (312 total picks)
export const generatePickValues = (): PickValue[] => {
  const picks: PickValue[] = [];
  
  for (let round = 1; round <= 26; round++) {
    for (let pickInRound = 1; pickInRound <= 12; pickInRound++) {
      const overallPick = (round - 1) * 12 + pickInRound;
      
      // Base value calculation with diminishing returns
      let baseValue = 1000;
      if (round <= 2) {
        baseValue = 1000 - (overallPick - 1) * 40; // First 2 rounds: high value
      } else if (round <= 5) {
        baseValue = 920 - (overallPick - 24) * 25; // Rounds 3-5: good value
      } else if (round <= 10) {
        baseValue = 695 - (overallPick - 60) * 15; // Rounds 6-10: decent value
      } else if (round <= 15) {
        baseValue = 395 - (overallPick - 120) * 8; // Rounds 11-15: moderate value
      } else if (round <= 20) {
        baseValue = 155 - (overallPick - 180) * 3; // Rounds 16-20: low value
      } else {
        baseValue = Math.max(10, 95 - (overallPick - 240) * 1); // Rounds 21-26: minimal value
      }
      
      // Dynasty premium (younger players valued higher)
      const dynastyMultiplier = round <= 3 ? 1.2 : round <= 8 ? 1.1 : 1.0;
      const dynastyValue = baseValue * dynastyMultiplier;
      
      // Superflex premium (QB positions more valuable)
      const superflexMultiplier = round <= 5 ? 1.15 : round <= 12 ? 1.05 : 1.0;
      const superflexValue = dynastyValue * superflexMultiplier;
      
      picks.push({
        pick: overallPick,
        round,
        pickInRound,
        value: Math.round(baseValue),
        dynastyValue: Math.round(dynastyValue),
        superflexValue: Math.round(superflexValue)
      });
    }
  }
  
  return picks;
};

export const pickValues = generatePickValues();

export const getPickValue = (pick: number, useSuperflex: boolean = true): number => {
  const pickData = pickValues.find(p => p.pick === pick);
  if (!pickData) return 0;
  
  return useSuperflex ? pickData.superflexValue : pickData.dynastyValue;
};

export const getPicksByValue = (minValue: number, maxValue: number): PickValue[] => {
  return pickValues.filter(pick => 
    pick.superflexValue >= minValue && pick.superflexValue <= maxValue
  );
};

// Trade evaluation helpers
export const evaluateTrade = (
  givenPicks: number[], 
  receivedPicks: number[], 
  useSuperflex: boolean = true
): {
  givenValue: number;
  receivedValue: number;
  difference: number;
  recommendation: 'accept' | 'reject' | 'neutral';
  analysis: string;
} => {
  const givenValue = givenPicks.reduce((sum, pick) => sum + getPickValue(pick, useSuperflex), 0);
  const receivedValue = receivedPicks.reduce((sum, pick) => sum + getPickValue(pick, useSuperflex), 0);
  const difference = receivedValue - givenValue;
  const percentDifference = (difference / givenValue) * 100;
  
  let recommendation: 'accept' | 'reject' | 'neutral';
  let analysis: string;
  
  if (percentDifference >= 15) {
    recommendation = 'accept';
    analysis = 'Strong value gain - consider accepting';
  } else if (percentDifference >= 5) {
    recommendation = 'accept';
    analysis = 'Slight value gain - likely worth it';
  } else if (percentDifference >= -5) {
    recommendation = 'neutral';
    analysis = 'Fair trade - depends on team needs';
  } else if (percentDifference >= -15) {
    recommendation = 'reject';
    analysis = 'Slight value loss - probably not worth it';
  } else {
    recommendation = 'reject';
    analysis = 'Significant value loss - avoid this trade';
  }
  
  return {
    givenValue,
    receivedValue,
    difference,
    recommendation,
    analysis
  };
};

// Common trade scenarios
export const getTradeEquivalents = (targetPick: number): { picks: number[]; value: number }[] => {
  const targetValue = getPickValue(targetPick);
  const equivalents: { picks: number[]; value: number }[] = [];
  
  // Single pick equivalents (within 10% value)
  const singleEquivalents = pickValues.filter(pick => {
    const diff = Math.abs(pick.superflexValue - targetValue);
    return diff <= targetValue * 0.1 && pick.pick !== targetPick;
  });
  
  singleEquivalents.forEach(pick => {
    equivalents.push({ picks: [pick.pick], value: pick.superflexValue });
  });
  
  // Two pick combinations
  for (let i = 0; i < pickValues.length - 1; i++) {
    for (let j = i + 1; j < pickValues.length; j++) {
      const combinedValue = pickValues[i].superflexValue + pickValues[j].superflexValue;
      const diff = Math.abs(combinedValue - targetValue);
      
      if (diff <= targetValue * 0.15 && equivalents.length < 10) {
        equivalents.push({ 
          picks: [pickValues[i].pick, pickValues[j].pick], 
          value: combinedValue 
        });
      }
    }
  }
  
  return equivalents.sort((a, b) => Math.abs(a.value - targetValue) - Math.abs(b.value - targetValue)).slice(0, 8);
};

export const formatPickName = (pick: number): string => {
  const pickData = pickValues.find(p => p.pick === pick);
  if (!pickData) return `Pick ${pick}`;
  
  return `${pickData.round}.${pickData.pickInRound.toString().padStart(2, '0')}`;
};