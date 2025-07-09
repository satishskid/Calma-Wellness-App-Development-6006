import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
  currentWalk: null,
  walks: [],
  duration: 0,
  steps: 0,
  distance: 0,
  guidanceType: 'mindful', // mindful, nature, breathing
  audioEnabled: true,
};

const walkSlice = createSlice({
  name: 'walk',
  initialState,
  reducers: {
    startWalk: (state, action) => {
      state.isActive = true;
      state.currentWalk = {
        id: Date.now(),
        startTime: new Date().toISOString(),
        type: action.payload.type,
        targetDuration: action.payload.duration,
      };
      state.duration = 0;
      state.steps = 0;
      state.distance = 0;
    },
    pauseWalk: (state) => {
      state.isActive = false;
    },
    resumeWalk: (state) => {
      state.isActive = true;
    },
    updateWalkStats: (state, action) => {
      state.duration = action.payload.duration;
      state.steps = action.payload.steps;
      state.distance = action.payload.distance;
    },
    completeWalk: (state) => {
      if (state.currentWalk) {
        const completedWalk = {
          ...state.currentWalk,
          endTime: new Date().toISOString(),
          duration: state.duration,
          steps: state.steps,
          distance: state.distance,
        };
        state.walks.push(completedWalk);
        state.currentWalk = null;
        state.isActive = false;
      }
    },
    setGuidanceType: (state, action) => {
      state.guidanceType = action.payload;
    },
    toggleAudio: (state) => {
      state.audioEnabled = !state.audioEnabled;
    },
  },
});

export const {
  startWalk,
  pauseWalk,
  resumeWalk,
  updateWalkStats,
  completeWalk,
  setGuidanceType,
  toggleAudio,
} = walkSlice.actions;
export default walkSlice.reducer;