import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import meditationReducer from './slices/meditationSlice';
import journalReducer from './slices/journalSlice';
import breathworkReducer from './slices/breathworkSlice';
import walkReducer from './slices/walkSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    meditation: meditationReducer,
    journal: journalReducer,
    breathwork: breathworkReducer,
    walk: walkReducer,
  },
});