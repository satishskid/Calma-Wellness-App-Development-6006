import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
  pattern: 'box', // box, 478, coherent
  phase: 'inhale', // inhale, hold, exhale, pause
  cycle: 0,
  totalCycles: 5,
  currentCount: 0,
  phaseTime: 4,
  patterns: {
    box: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    '478': { inhale: 4, hold: 7, exhale: 8, pause: 0 },
    coherent: { inhale: 5, hold: 0, exhale: 5, pause: 0 },
  },
  sessions: [],
};

const breathworkSlice = createSlice({
  name: 'breathwork',
  initialState,
  reducers: {
    startBreathwork: (state, action) => {
      state.isActive = true;
      state.pattern = action.payload.pattern;
      state.totalCycles = action.payload.cycles;
      state.cycle = 0;
      state.phase = 'inhale';
      state.currentCount = 0;
      state.phaseTime = state.patterns[state.pattern].inhale;
    },
    stopBreathwork: (state) => {
      state.isActive = false;
      state.cycle = 0;
      state.phase = 'inhale';
      state.currentCount = 0;
    },
    nextPhase: (state) => {
      const pattern = state.patterns[state.pattern];
      switch (state.phase) {
        case 'inhale':
          state.phase = pattern.hold > 0 ? 'hold' : 'exhale';
          state.phaseTime = pattern.hold > 0 ? pattern.hold : pattern.exhale;
          break;
        case 'hold':
          state.phase = 'exhale';
          state.phaseTime = pattern.exhale;
          break;
        case 'exhale':
          state.phase = pattern.pause > 0 ? 'pause' : 'inhale';
          state.phaseTime = pattern.pause > 0 ? pattern.pause : pattern.inhale;
          if (pattern.pause === 0) {
            state.cycle += 1;
          }
          break;
        case 'pause':
          state.phase = 'inhale';
          state.phaseTime = pattern.inhale;
          state.cycle += 1;
          break;
      }
      state.currentCount = 0;
    },
    updateCount: (state, action) => {
      state.currentCount = action.payload;
    },
    completeSession: (state) => {
      const session = {
        id: Date.now(),
        pattern: state.pattern,
        cycles: state.totalCycles,
        timestamp: new Date().toISOString(),
        duration: state.totalCycles * 16, // approximate
      };
      state.sessions.push(session);
      state.isActive = false;
    },
  },
});

export const {
  startBreathwork,
  stopBreathwork,
  nextPhase,
  updateCount,
  completeSession,
} = breathworkSlice.actions;
export default breathworkSlice.reducer;