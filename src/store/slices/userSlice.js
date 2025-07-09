import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: '',
    stressLevel: 5,
    sleepQuality: 5,
    isOnline: navigator.onLine,
    preferences: {
      meditationDuration: 10,
      breathworkType: 'box',
      walkReminders: true,
    }
  },
  stats: {
    totalMeditations: 0,
    totalJournalEntries: 0,
    totalBreathworkSessions: 0,
    totalWalkMinutes: 0,
    streak: 0,
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setOnlineStatus: (state, action) => {
      state.profile.isOnline = action.payload;
    },
    incrementStat: (state, action) => {
      const { stat, value = 1 } = action.payload;
      state.stats[stat] += value;
    }
  },
});

export const { updateProfile, updateStats, setOnlineStatus, incrementStat } = userSlice.actions;
export default userSlice.reducer;