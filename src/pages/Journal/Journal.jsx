import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { updateCurrentEntry, saveEntry, setCurrentPrompt, deleteEntry } from '../../store/slices/journalSlice';
import { incrementStat } from '../../store/slices/userSlice';
import VoiceRecorder from '../../components/Journal/VoiceRecorder';
import SmartTextInput from '../../components/Journal/SmartTextInput';
import ConversationalAgent from '../../components/Journal/ConversationalAgent';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiMic, FiMessageCircle, FiBook, FiTrash2, FiHeart, FiSun, FiMoon, FiRefreshCw } = FiIcons;

const Journal = () => {
  const dispatch = useDispatch();
  const { entries, currentEntry, prompts, currentPrompt } = useSelector((state) => state.journal);
  const [mode, setMode] = useState('choice'); // choice, voice, text, conversational, entries
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);

  const moods = [
    { id: 'great', emoji: '😊', label: 'Great', color: 'text-green-500' },
    { id: 'good', emoji: '🙂', label: 'Good', color: 'text-blue-500' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    { id: 'low', emoji: '😔', label: 'Low', color: 'text-yellow-500' },
    { id: 'difficult', emoji: '😰', label: 'Difficult', color: 'text-red-500' },
  ];

  const journalModes = [
    {
      id: 'voice',
      title: 'Voice Journal',
      description: 'Speak your thoughts naturally',
      icon: FiMic,
      color: 'from-blue-500 to-cyan-600',
      benefits: ['Hands-free', 'Natural expression', 'Real-time transcription']
    },
    {
      id: 'text',
      title: 'Smart Writing',
      description: 'AI-assisted text input',
      icon: FiEdit3,
      color: 'from-purple-500 to-pink-600',
      benefits: ['Auto-complete', 'Smart suggestions', 'Reflection prompts']
    },
    {
      id: 'conversational',
      title: 'Chat with Sage',
      description: 'Conversational journaling',
      icon: FiMessageCircle,
      color: 'from-green-500 to-emerald-600',
      benefits: ['Guided reflection', 'Empathetic responses', 'Deeper insights']
    }
  ];

  const handleSaveEntry = (content, audioBlob = null) => {
    if (content.trim()) {
      dispatch(saveEntry({
        content,
        prompt: prompts[currentPrompt],
        mood: selectedMood,
        sentiment: analyzeSentiment(content),
        audioBlob: audioBlob ? URL.createObjectURL(audioBlob) : null,
        sessionType: mode
      }));
      dispatch(incrementStat({ stat: 'totalJournalEntries' }));
      setSelectedMood('neutral');
      dispatch(updateCurrentEntry(''));
      setMode('choice');
    }
  };

  const handleVoiceTranscription = (transcription) => {
    dispatch(updateCurrentEntry(transcription));
  };

  const handleTextChange = (text) => {
    dispatch(updateCurrentEntry(text));
  };

  const handleTextSave = () => {
    handleSaveEntry(currentEntry);
  };

  const handlePromptChange = () => {
    dispatch(setCurrentPrompt((currentPrompt + 1) % prompts.length));
  };

  const handleConversationComplete = (summary) => {
    setConversationComplete(true);
    setTimeout(() => {
      setMode('choice');
      setConversationComplete(false);
    }, 2000);
  };

  const analyzeSentiment = (text) => {
    const positiveWords = ['good', 'great', 'happy', 'love', 'grateful', 'joy', 'peace', 'excited', 'wonderful', 'amazing'];
    const negativeWords = ['bad', 'sad', 'angry', 'hate', 'stress', 'worry', 'fear', 'frustrated', 'overwhelmed', 'disappointed'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
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

  const renderModeChoice = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Journal</h1>
        <p className="text-gray-600">Choose your preferred way to express yourself</p>
      </div>

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

      {/* Mode Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Choose Your Style</h2>
        <div className="space-y-4">
          {journalModes.map((journalMode, index) => (
            <motion.button
              key={journalMode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(journalMode.id)}
              className={`w-full p-6 rounded-xl bg-gradient-to-r ${journalMode.color} text-white shadow-lg`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <SafeIcon icon={journalMode.icon} className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold">{journalMode.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{journalMode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {journalMode.benefits.map((benefit, i) => (
                      <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* View Entries Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMode('entries')}
        className="w-full p-4 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-indigo-300 flex items-center justify-center space-x-2"
      >
        <SafeIcon icon={FiBook} className="w-5 h-5" />
        <span>View Past Entries</span>
      </motion.button>
    </motion.div>
  );

  const renderVoiceMode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Voice Journal</h2>
          <p className="text-gray-600">Express yourself naturally through speech</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('choice')}
          className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
        >
          Back
        </motion.button>
      </div>

      <VoiceRecorder
        onTranscription={handleVoiceTranscription}
        onSave={handleSaveEntry}
        isActive={isVoiceActive}
        setIsActive={setIsVoiceActive}
      />
    </motion.div>
  );

  const renderTextMode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Smart Writing</h2>
          <p className="text-gray-600">AI-assisted journaling with intelligent suggestions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('choice')}
          className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
        >
          Back
        </motion.button>
      </div>

      {/* Current Prompt */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Today's Prompt</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePromptChange}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-blue-600" />
          </motion.button>
        </div>
        <p className="text-gray-700 italic">{prompts[currentPrompt]}</p>
      </div>

      <SmartTextInput
        value={currentEntry}
        onChange={handleTextChange}
        onSave={handleTextSave}
        placeholder="Start writing your thoughts..."
        currentPrompt={prompts[currentPrompt]}
        onPromptChange={handlePromptChange}
      />
    </motion.div>
  );

  const renderConversationalMode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Conversational Journal</h2>
          <p className="text-gray-600">Have a meaningful conversation with Sage</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('choice')}
          className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
        >
          Back
        </motion.button>
      </div>

      <ConversationalAgent
        initialPrompt={prompts[currentPrompt]}
        onComplete={handleConversationComplete}
      />

      {conversationComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-green-50 rounded-xl border border-green-200"
        >
          <SafeIcon icon={FiHeart} className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Session Complete!</h3>
          <p className="text-green-600">Your conversation has been saved to your journal.</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderEntries = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Your Entries</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('choice')}
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
                  {entry.sessionType && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      {entry.sessionType}
                    </span>
                  )}
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
              
              {entry.audioBlob && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMic} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">Audio recording available</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="p-4 space-y-6">
      <AnimatePresence mode="wait">
        {mode === 'choice' && renderModeChoice()}
        {mode === 'voice' && renderVoiceMode()}
        {mode === 'text' && renderTextMode()}
        {mode === 'conversational' && renderConversationalMode()}
        {mode === 'entries' && renderEntries()}
      </AnimatePresence>
    </div>
  );
};

export default Journal;