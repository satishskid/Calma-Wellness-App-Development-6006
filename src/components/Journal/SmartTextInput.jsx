import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiLightbulb, FiArrowRight, FiRefreshCw, FiZap } = FiIcons;

const SmartTextInput = ({ value, onChange, placeholder, onSave, currentPrompt, onPromptChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [metaPrompts, setMetaPrompts] = useState([]);
  const [showMetaPrompts, setShowMetaPrompts] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emotionWords = [
    'happy', 'sad', 'anxious', 'excited', 'frustrated', 'grateful', 'overwhelmed', 
    'peaceful', 'angry', 'hopeful', 'disappointed', 'content', 'nervous', 'proud',
    'confused', 'relieved', 'inspired', 'worried', 'joyful', 'stressed'
  ];

  const feelingPhrases = [
    'I feel like', 'I\'m experiencing', 'Today I noticed', 'I\'m grateful for',
    'I\'m struggling with', 'I accomplished', 'I learned that', 'I realized',
    'I\'m excited about', 'I\'m concerned about', 'I appreciate', 'I wish'
  ];

  const reflectionPrompts = [
    'What triggered this feeling?',
    'How did I handle this situation?',
    'What would I tell a friend in this situation?',
    'What am I most grateful for right now?',
    'What pattern do I notice in my thoughts?',
    'How has this experience changed me?',
    'What would make tomorrow better?',
    'What am I avoiding or not addressing?'
  ];

  const contextualPrompts = {
    emotions: [
      'Can you describe what this emotion feels like in your body?',
      'When did you first notice feeling this way?',
      'What thoughts are connected to this feeling?'
    ],
    relationships: [
      'How did this interaction affect you?',
      'What would you like to say to this person?',
      'What boundaries might be helpful here?'
    ],
    work: [
      'What aspects of work energize you most?',
      'How do you handle workplace stress?',
      'What would your ideal work day look like?'
    ],
    growth: [
      'What did you learn about yourself today?',
      'How have you grown recently?',
      'What challenge are you ready to tackle?'
    ]
  };

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      generateSuggestions();
      generateMetaPrompts();
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [value, cursorPosition]);

  const generateSuggestions = () => {
    if (!value.trim()) {
      setSuggestions(feelingPhrases.slice(0, 4));
      return;
    }

    const words = value.toLowerCase().split(' ');
    const currentWord = words[words.length - 1];
    const suggestions = [];

    // Emotion-based suggestions
    if (currentWord.length > 1) {
      const matchingEmotions = emotionWords.filter(emotion => 
        emotion.startsWith(currentWord) && emotion !== currentWord
      );
      suggestions.push(...matchingEmotions.slice(0, 3));
    }

    // Context-based phrase suggestions
    if (words.includes('feel') || words.includes('feeling')) {
      suggestions.push('overwhelmed by', 'grateful for', 'excited about', 'worried about');
    }

    if (words.includes('today')) {
      suggestions.push('I accomplished', 'I learned', 'I noticed', 'I struggled with');
    }

    if (words.includes('relationship') || words.includes('friend') || words.includes('family')) {
      suggestions.push('made me feel', 'helped me understand', 'challenged me to', 'supported me when');
    }

    setSuggestions([...new Set(suggestions)].slice(0, 6));
    setShowSuggestions(suggestions.length > 0);
  };

  const generateMetaPrompts = () => {
    const content = value.toLowerCase();
    const prompts = [];

    // Detect context and suggest relevant prompts
    if (content.includes('feel') || content.includes('emotion')) {
      prompts.push(...contextualPrompts.emotions);
    }
    
    if (content.includes('work') || content.includes('job') || content.includes('career')) {
      prompts.push(...contextualPrompts.work);
    }
    
    if (content.includes('friend') || content.includes('family') || content.includes('relationship')) {
      prompts.push(...contextualPrompts.relationships);
    }
    
    if (content.includes('learn') || content.includes('grow') || content.includes('change')) {
      prompts.push(...contextualPrompts.growth);
    }

    // Add general reflection prompts
    if (prompts.length < 3) {
      prompts.push(...reflectionPrompts.slice(0, 3 - prompts.length));
    }

    setMetaPrompts([...new Set(prompts)].slice(0, 4));
  };

  const handleSuggestionClick = (suggestion) => {
    const words = value.split(' ');
    const currentWord = words[words.length - 1];
    
    if (currentWord && emotionWords.includes(suggestion)) {
      // Replace the current word
      words[words.length - 1] = suggestion;
      onChange(words.join(' ') + ' ');
    } else {
      // Add the suggestion
      onChange(value + (value.endsWith(' ') ? '' : ' ') + suggestion + ' ');
    }
    
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleMetaPromptClick = (prompt) => {
    const addition = value.trim() ? '\n\n' + prompt + '\n' : prompt + '\n';
    onChange(value + addition);
    setShowMetaPrompts(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleCursorChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const getWritingStats = () => {
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = value.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const readingTime = Math.ceil(words.length / 200); // Average reading speed
    
    return {
      words: words.length,
      sentences: sentences.length,
      readingTime
    };
  };

  const stats = getWritingStats();

  return (
    <div className="space-y-4">
      {/* Smart Text Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onSelect={handleCursorChange}
          onClick={handleCursorChange}
          placeholder={placeholder}
          className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none outline-none text-gray-700 leading-relaxed"
        />
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full"
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-blue-600">Analyzing...</span>
          </motion.div>
        )}
      </div>

      {/* Writing Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{stats.words} words</span>
          <span>{stats.sentences} sentences</span>
          <span>{stats.readingTime} min read</span>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
          <span>Smart suggestions active</span>
        </div>
      </div>

      {/* Auto-complete Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiLightbulb} className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Suggestions</span>
              <span className="text-xs text-gray-500">(Press Tab for first suggestion)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta Prompts */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMetaPrompts(!showMetaPrompts)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <SafeIcon icon={FiZap} className="w-4 h-4" />
          <span>Reflection Prompts</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPromptChange}
          className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
          <span>New Prompt</span>
        </motion.button>
      </div>

      {/* Meta Prompts Expansion */}
      <AnimatePresence>
        {showMetaPrompts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-50 rounded-xl border border-purple-200 p-4 space-y-3"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Deepen Your Reflection</span>
            </div>
            <div className="space-y-2">
              {metaPrompts.map((prompt, index) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleMetaPromptClick(prompt)}
                  className="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiArrowRight} className="w-3 h-3 text-purple-500" />
                    <span className="text-sm text-gray-700">{prompt}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        disabled={!value.trim()}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <SafeIcon icon={FiEdit3} className="w-5 h-5" />
        <span>Save Journal Entry</span>
      </motion.button>
    </div>
  );
};

export default SmartTextInput;