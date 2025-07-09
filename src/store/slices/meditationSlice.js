import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSession: null,
  sessions: [],
  isPlaying: false,
  progress: 0,
  duration: 600, // 10 minutes default
  type: 'balance',
  aiRecommendation: null,
};

const meditationSlice = createSlice({
  name: 'meditation',
  initialState,
  reducers: {
    startSession: (state, action) => {
      state.currentSession = {
        id: Date.now(),
        type: action.payload.type,
        duration: action.payload.duration,
        startTime: new Date().toISOString(),
      };
      state.isPlaying = true;
      state.progress = 0;
    },
    pauseSession: (state) => {
      state.isPlaying = false;
    },
    resumeSession: (state) => {
      state.isPlaying = true;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    completeSession: (state) => {
      if (state.currentSession) {
        const completedSession = {
          ...state.currentSession,
          endTime: new Date().toISOString(),
          completed: true,
        };
        state.sessions.push(completedSession);
        state.currentSession = null;
        state.isPlaying = false;
        state.progress = 0;
      }
    },
    setAiRecommendation: (state, action) => {
      state.aiRecommendation = action.payload;
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  updateProgress,
  completeSession,
  setAiRecommendation,
} = meditationSlice.actions;
export default meditationSlice.reducer;