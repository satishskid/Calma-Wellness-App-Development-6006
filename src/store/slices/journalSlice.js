import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entries: [],
  currentEntry: '',
  prompts: [
    "What are three things you're grateful for today?",
    "How are you feeling right now? What's behind that feeling?",
    "What's one small thing that brought you joy today?",
    "What challenge are you facing, and how can you approach it with kindness?",
    "What would you tell a friend going through what you're experiencing?",
  ],
  currentPrompt: 0,
  sentiment: null,
  insights: [],
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    updateCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
    saveEntry: (state, action) => {
      const entry = {
        id: Date.now(),
        content: action.payload.content,
        prompt: action.payload.prompt,
        timestamp: new Date().toISOString(),
        sentiment: action.payload.sentiment,
        mood: action.payload.mood,
      };
      state.entries.unshift(entry);
      state.currentEntry = '';
    },
    setCurrentPrompt: (state, action) => {
      state.currentPrompt = action.payload;
    },
    setSentiment: (state, action) => {
      state.sentiment = action.payload;
    },
    addInsight: (state, action) => {
      state.insights.push(action.payload);
    },
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
  },
});

export const {
  updateCurrentEntry,
  saveEntry,
  setCurrentPrompt,
  setSentiment,
  addInsight,
  deleteEntry,
} = journalSlice.actions;
export default journalSlice.reducer;