import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  updateCurrentEntry,
  saveEntry,
  setCurrentPrompt,
  deleteEntry,
} from '../../store/slices/journalSlice';
import { incrementStat } from '../../store/slices/userSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiSave, FiRefreshCw, FiTrash2, FiHeart, FiSun, FiMoon } = FiIcons;

const Journal = () => {
  const dispatch = useDispatch();
  const { entries, currentEntry, prompts, currentPrompt } = useSelector((state) => state.journal);
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [showEntries, setShowEntries] = useState(false);

  const moods = [
    { id: 'great', emoji: '😊', label: 'Great', color: 'text-green-500' },
    { id: 'good', emoji: '🙂', label: 'Good', color: 'text-blue-500' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    { id: 'low', emoji: '😔', label: 'Low', color: 'text-yellow-500' },
    { id: 'difficult', emoji: '😰', label: 'Difficult', color: 'text-red-500' },
  ];

  const handleSaveEntry = () => {
    if (currentEntry.trim()) {
      dispatch(saveEntry({
        content: currentEntry,
        prompt: prompts[currentPrompt],
        mood: selectedMood,
        sentiment: analyzeSentiment(currentEntry),
      }));
      dispatch(incrementStat({ stat: 'totalJournalEntries' }));
      setSelectedMood('neutral');
    }
  };

  const analyzeSentiment = (text) => {
    // Simple sentiment analysis - in real app, use AI service
    const positiveWords = ['good', 'great', 'happy', 'love', 'grateful', 'joy', 'peace'];
    const negativeWords = ['bad', 'sad', 'angry', 'hate', 'stress', 'worry', 'fear'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const nextPrompt = () => {
    dispatch(setCurrentPrompt((currentPrompt + 1) % prompts.length));
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return FiSun;
      case 'negative': return FiMoon;
      default: return FiHeart;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-800">Journal</h1>
        <p className="text-gray-600">Express your thoughts and feelings</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showEntries ? (
          <motion.div
            key="write"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Mood Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">How are you feeling?</h2>
              <div className="flex justify-between">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      selectedMood === mood.id
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-white border border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className={`text-xs font-medium ${mood.color}`}>{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Writing Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Today's Prompt</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextPrompt}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-blue-600" />
                </motion.button>
              </div>
              <p className="text-gray-700 italic">{prompts[currentPrompt]}</p>
            </motion.div>

            {/* Text Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <textarea
                value={currentEntry}
                onChange={(e) => dispatch(updateCurrentEntry(e.target.value))}
                placeholder="Start writing your thoughts..."
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none outline-none"
              />
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-5 h-5" />
                  <span>Save Entry</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEntries(true)}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-indigo-300 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                  <span>View Entries</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="entries"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Your Entries</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEntries(false)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium"
              >
                New Entry
              </motion.button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiEdit3} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No entries yet. Start writing!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <SafeIcon
                          icon={getSentimentIcon(entry.sentiment)}
                          className={`w-5 h-5 ${getSentimentColor(entry.sentiment)}`}
                        />
                        <span className="text-sm text-gray-500">
                          {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {entry.mood}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(deleteEntry(entry.id))}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    {entry.prompt && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 italic">{entry.prompt}</p>
                      </div>
                    )}
                    
                    <p className="text-gray-700 leading-relaxed">{entry.content}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;