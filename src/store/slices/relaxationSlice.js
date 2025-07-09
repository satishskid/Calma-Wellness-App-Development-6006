import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userProgress: {},
  currentSession: null,
  sessionHistory: [],
  preferences: {
    defaultLevel: 'beginner',
    defaultDuration: 10,
    audioEnabled: true,
    visualEnabled: true,
    reminderEnabled: true,
    reminderTime: '19:00'
  },
  recommendations: [],
  achievements: []
};

const relaxationSlice = createSlice({
  name: 'relaxation',
  initialState,
  reducers: {
    updateProgress: (state, action) => {
      const { techniqueId, progress, currentPhase } = action.payload;
      
      if (!state.userProgress[techniqueId]) {
        state.userProgress[techniqueId] = {
          level: 'beginner',
          completedSessions: 0,
          totalMinutes: 0,
          streak: 0,
          lastSessionDate: null,
          achievements: [],
          weeklyGoal: 3,
          weeklyProgress: 0
        };
      }
      
      if (state.currentSession) {
        state.currentSession.progress = progress;
        state.currentSession.currentPhase = currentPhase;
      }
    },
    
    startSession: (state, action) => {
      const { techniqueId, level, duration } = action.payload;
      
      state.currentSession = {
        id: Date.now(),
        techniqueId,
        level,
        duration,
        startTime: new Date().toISOString(),
        progress: 0,
        currentPhase: 'preparation'
      };
    },
    
    completeSession: (state, action) => {
      const { techniqueId, level, duration, completedAt } = action.payload;
      
      if (!state.userProgress[techniqueId]) {
        state.userProgress[techniqueId] = {
          level: 'beginner',
          completedSessions: 0,
          totalMinutes: 0,
          streak: 0,
          lastSessionDate: null,
          achievements: [],
          weeklyGoal: 3,
          weeklyProgress: 0
        };
      }
      
      const progress = state.userProgress[techniqueId];
      progress.completedSessions += 1;
      progress.totalMinutes += duration;
      progress.lastSessionDate = completedAt;
      
      // Update streak
      const today = new Date().toDateString();
      const lastSession = progress.lastSessionDate ? new Date(progress.lastSessionDate).toDateString() : null;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastSession === yesterday || !lastSession) {
        progress.streak += 1;
      } else if (lastSession !== today) {
        progress.streak = 1;
      }
      
      // Update weekly progress
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const sessionDate = new Date(completedAt);
      
      if (sessionDate >= weekStart) {
        progress.weeklyProgress += 1;
      }
      
      // Level progression
      if (progress.level === 'beginner' && progress.completedSessions >= 10) {
        progress.level = 'intermediate';
      } else if (progress.level === 'intermediate' && progress.completedSessions >= 25) {
        progress.level = 'advanced';
      }
      
      // Add to session history
      state.sessionHistory.unshift({
        id: Date.now(),
        techniqueId,
        level,
        duration,
        completedAt,
        progress: 100
      });
      
      // Keep only last 100 sessions
      if (state.sessionHistory.length > 100) {
        state.sessionHistory = state.sessionHistory.slice(0, 100);
      }
      
      state.currentSession = null;
    },
    
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    addAchievement: (state, action) => {
      const achievement = {
        id: Date.now(),
        ...action.payload,
        earnedAt: new Date().toISOString()
      };
      
      state.achievements.push(achievement);
    },
    
    updateWeeklyGoal: (state, action) => {
      const { techniqueId, goal } = action.payload;
      
      if (state.userProgress[techniqueId]) {
        state.userProgress[techniqueId].weeklyGoal = goal;
      }
    },
    
    resetWeeklyProgress: (state) => {
      Object.values(state.userProgress).forEach(progress => {
        progress.weeklyProgress = 0;
      });
    },
    
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    }
  }
});

export const {
  updateProgress,
  startSession,
  completeSession,
  updatePreferences,
  addAchievement,
  updateWeeklyGoal,
  resetWeeklyProgress,
  setRecommendations
} = relaxationSlice.actions;

export default relaxationSlice.reducer;