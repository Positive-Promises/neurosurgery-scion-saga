import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameLevel {
  id: number;
  title: string;
  completed: boolean;
  score: number;
  bestTime: number;
  achievements: string[];
}

interface PlayerState {
  totalXP: number;
  level: number;
  completedLevels: number;
  surgicalRank: string;
  achievements: string[];
  unlockedLevels: number[];
}

interface GameState {
  player: PlayerState;
  levels: GameLevel[];
  currentLevel: number | null;
  gameSession: {
    score: number;
    startTime: number;
    objectives: string[];
    completedObjectives: string[];
  } | null;
}

const initialState: GameState = {
  player: {
    totalXP: 0,
    level: 1,
    completedLevels: 0,
    surgicalRank: "Medical Student",
    achievements: [],
    unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // All levels unlocked for development
  },
  levels: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Level ${i + 1}`,
    completed: false,
    score: 0,
    bestTime: 0,
    achievements: []
  })),
  currentLevel: null,
  gameSession: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startLevel: (state, action: PayloadAction<{ levelId: number; objectives: string[] }>) => {
      state.currentLevel = action.payload.levelId;
      state.gameSession = {
        score: 0,
        startTime: Date.now(),
        objectives: action.payload.objectives,
        completedObjectives: []
      };
    },
    
    completeObjective: (state, action: PayloadAction<{ objective: string; points: number }>) => {
      if (state.gameSession) {
        state.gameSession.completedObjectives.push(action.payload.objective);
        state.gameSession.score += action.payload.points;
      }
    },
    
    completeLevel: (state, action: PayloadAction<{ levelId: number; finalScore: number; time: number }>) => {
      const level = state.levels.find(l => l.id === action.payload.levelId);
      if (level) {
        level.completed = true;
        level.score = Math.max(level.score, action.payload.finalScore);
        level.bestTime = level.bestTime === 0 ? action.payload.time : Math.min(level.bestTime, action.payload.time);
      }
      
      state.player.completedLevels += 1;
      state.player.totalXP += action.payload.finalScore;
      
      // Update surgical rank based on XP
      if (state.player.totalXP >= 5000) state.player.surgicalRank = "Attending Surgeon";
      else if (state.player.totalXP >= 3000) state.player.surgicalRank = "Chief Resident";
      else if (state.player.totalXP >= 1500) state.player.surgicalRank = "Fellow";
      else if (state.player.totalXP >= 500) state.player.surgicalRank = "Resident";
      
      state.gameSession = null;
      state.currentLevel = null;
    },
    
    addAchievement: (state, action: PayloadAction<string>) => {
      if (!state.player.achievements.includes(action.payload)) {
        state.player.achievements.push(action.payload);
      }
    },
    
    resetGame: (state) => {
      return initialState;
    }
  }
});

export const { 
  startLevel, 
  completeObjective, 
  completeLevel, 
  addAchievement, 
  resetGame 
} = gameSlice.actions;

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;