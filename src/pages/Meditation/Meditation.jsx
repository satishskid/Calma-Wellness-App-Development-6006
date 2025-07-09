import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startSession,
  pauseSession,
  resumeSession,
  updateProgress,
  completeSession,
} from '../../store/slices/meditationSlice';
import { incrementStat } from '../../store/slices/userSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiSquare, FiClock, FiHeart } = FiIcons;

const Meditation = () => {
  const dispatch = useDispatch();
  const { currentSession, isPlaying, progress, duration } = useSelector((state) => state.meditation);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedType, setSelectedType] = useState('balance');

  const meditationTypes = [
    { id: 'balance', name: 'Balance', description: 'Restore your inner equilibrium' },
    { id: 'stress', name: 'Stress Relief', description: 'Release tension and anxiety' },
    { id: 'sleep', name: 'Sleep', description: 'Prepare for restful sleep' },
    { id: 'focus', name: 'Focus', description: 'Enhance concentration and clarity' },
  ];

  const durations = [5, 10, 15, 20, 30];

  useEffect(() => {
    let interval;
    if (isPlaying && currentSession) {
      interval = setInterval(() => {
        const newProgress = progress + (1000 / (selectedDuration * 60 * 1000)) * 100;
        if (newProgress >= 100) {
          dispatch(completeSession());
          dispatch(incrementStat({ stat: 'totalMeditations' }));
        } else {
          dispatch(updateProgress(newProgress));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, currentSession, selectedDuration, dispatch]);

  const handleStart = () => {
    dispatch(startSession({
      type: selectedType,
      duration: selectedDuration * 60,
    }));
  };

  const handlePause = () => {
    dispatch(pauseSession());
  };

  const handleResume = () => {
    dispatch(resumeSession());
  };

  const handleStop = () => {
    dispatch(completeSession());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = selectedDuration * 60 - Math.floor((progress / 100) * selectedDuration * 60);

  if (currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white space-y-8"
        >
          <h1 className="text-3xl font-bold">{meditationTypes.find(t => t.id === selectedType)?.name}</h1>
          
          <div className="relative">
            <motion.div
              className="w-64 h-64 rounded-full border-4 border-white/20 flex items-center justify-center mx-auto"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center breathing-animation"
                animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-6xl font-light">
                  {formatTime(remainingTime)}
                </div>
              </motion.div>
            </motion.div>
            
            <svg className="absolute inset-0 w-64 h-64 mx-auto -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isPlaying ? handlePause : handleResume}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-8 h-8" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleStop}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <SafeIcon icon={FiSquare} className="w-8 h-8" />
            </motion.button>
          </div>

          <p className="text-white/80 text-lg">
            {isPlaying ? 'Breathe deeply and let go...' : 'Meditation paused'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-800">Meditation</h1>
        <p className="text-gray-600">Find your center and restore balance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Choose Your Practice</h2>
        <div className="grid grid-cols-1 gap-3">
          {meditationTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedType === type.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiHeart} className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className={`text-sm ${selectedType === type.id ? 'text-purple-100' : 'text-gray-500'}`}>
                    {type.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Duration</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {durations.map((duration) => (
            <motion.button
              key={duration}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDuration(duration)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                selectedDuration === duration
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-indigo-300'
              }`}
            >
              <SafeIcon icon={FiClock} className="w-5 h-5" />
              <span className="font-medium">{duration} min</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
        >
          Start Meditation
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Meditation;