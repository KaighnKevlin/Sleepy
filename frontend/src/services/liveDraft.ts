import { apiService } from './api';
import { LEAGUE_CONFIG } from '../config/league';

export interface LiveDraftPick {
  pick_no: number;
  round: number;
  roster_id: number;
  player_id: string;
  picked_by?: string;
  is_keeper?: boolean;
  metadata?: Record<string, any>;
  player?: {
    name: string;
    position: string;
    team: string;
    age?: number;
    injury_status?: string;
  };
}

export interface LiveDraftState {
  status: 'pre_draft' | 'drafting' | 'complete' | 'paused';
  currentPick: number;
  picks: LiveDraftPick[];
  draftOrder: Record<string, number>; // user_id -> draft_slot
  slotToRosterId: Record<string, number>; // slot -> roster_id
  yourTurn: boolean;
  nextPickTime?: number;
}

class LiveDraftService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private callbacks: Array<(state: LiveDraftState) => void> = [];
  private lastState: LiveDraftState | null = null;

  async getCurrentDraftState(): Promise<LiveDraftState | null> {
    try {
      const draftData = await apiService.getLiveDraft(LEAGUE_CONFIG.league_id);
      
      if (!draftData.draft) {
        console.warn('No draft data available');
        return null;
      }

      const { draft, picks } = draftData;
      
      // Calculate current pick
      const currentPick = picks.length + 1;
      
      // Determine whose turn it is
      const currentSlot = this.getCurrentDraftSlot(currentPick, draft.settings?.teams || 12);
      const currentRosterId = draft.slot_to_roster_id?.[currentSlot.toString()];
      const yourRosterId = LEAGUE_CONFIG.roster_id;
      const yourTurn = currentRosterId === yourRosterId;

      // Map picks to our format
      const formattedPicks: LiveDraftPick[] = picks.map(pick => ({
        pick_no: pick.pick_no,
        round: pick.round,
        roster_id: pick.roster_id,
        player_id: pick.player_id || '',
        picked_by: pick.picked_by,
        is_keeper: pick.is_keeper,
        metadata: pick.metadata,
        player: pick.player
      }));

      const state: LiveDraftState = {
        status: draft.status as LiveDraftState['status'],
        currentPick,
        picks: formattedPicks,
        draftOrder: draft.draft_order || {},
        slotToRosterId: draft.slot_to_roster_id || {},
        yourTurn,
        nextPickTime: draft.start_time
      };

      return state;
    } catch (error) {
      console.error('Error fetching live draft state:', error);
      return null;
    }
  }

  private getCurrentDraftSlot(pickNumber: number, totalTeams: number): number {
    const round = Math.ceil(pickNumber / totalTeams);
    const pickInRound = ((pickNumber - 1) % totalTeams) + 1;
    
    // Snake draft logic
    if (round % 2 === 1) {
      // Odd rounds: 1, 2, 3, ..., 12
      return pickInRound;
    } else {
      // Even rounds: 12, 11, 10, ..., 1
      return totalTeams - pickInRound + 1;
    }
  }

  startPolling(intervalMs: number = 3000) {
    if (this.pollingInterval) {
      this.stopPolling();
    }

    this.pollingInterval = setInterval(async () => {
      const newState = await this.getCurrentDraftState();
      
      if (newState && this.hasStateChanged(newState)) {
        console.log('Draft state updated:', {
          status: newState.status,
          currentPick: newState.currentPick,
          yourTurn: newState.yourTurn,
          totalPicks: newState.picks.length
        });
        
        this.lastState = newState;
        this.notifyCallbacks(newState);
      }
    }, intervalMs);

    // Also fetch initial state
    this.getCurrentDraftState().then(state => {
      if (state) {
        this.lastState = state;
        this.notifyCallbacks(state);
      }
    });
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  onStateChange(callback: (state: LiveDraftState) => void) {
    this.callbacks.push(callback);
    
    // If we already have state, notify immediately
    if (this.lastState) {
      callback(this.lastState);
    }
  }

  removeCallback(callback: (state: LiveDraftState) => void) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  private hasStateChanged(newState: LiveDraftState): boolean {
    if (!this.lastState) return true;
    
    return (
      this.lastState.status !== newState.status ||
      this.lastState.currentPick !== newState.currentPick ||
      this.lastState.picks.length !== newState.picks.length ||
      this.lastState.yourTurn !== newState.yourTurn
    );
  }

  private notifyCallbacks(state: LiveDraftState) {
    this.callbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in draft state callback:', error);
      }
    });
  }

  // Get your picks from the draft
  getYourPicks(state: LiveDraftState): LiveDraftPick[] {
    const yourRosterId = LEAGUE_CONFIG.roster_id;
    return state.picks.filter(pick => pick.roster_id === yourRosterId);
  }

  // Get picks by team/roster
  getPicksByRoster(state: LiveDraftState, rosterId: number): LiveDraftPick[] {
    return state.picks.filter(pick => pick.roster_id === rosterId);
  }

  // Calculate time until your next pick
  getTimeToYourPick(state: LiveDraftState): { 
    picksAway: number; 
    estimatedMinutes: number;
    isNext: boolean;
  } {
    if (state.yourTurn) {
      return { picksAway: 0, estimatedMinutes: 0, isNext: true };
    }

    const yourRosterId = LEAGUE_CONFIG.roster_id;
    const totalTeams = Object.keys(state.slotToRosterId).length;
    let picksAway = 0;
    let currentPick = state.currentPick;

    // Find next pick where it's your turn
    while (picksAway < totalTeams * 2) { // Max 2 rounds ahead
      currentPick++;
      picksAway++;
      
      const slot = this.getCurrentDraftSlot(currentPick, totalTeams);
      const rosterId = state.slotToRosterId[slot.toString()];
      
      if (rosterId === yourRosterId) {
        break;
      }
    }

    // Estimate time (assuming 2 minutes per pick average)
    const estimatedMinutes = picksAway * 2;

    return {
      picksAway,
      estimatedMinutes,
      isNext: picksAway === 1
    };
  }
}

export const liveDraftService = new LiveDraftService();