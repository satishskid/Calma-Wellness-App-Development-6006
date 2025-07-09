import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startWalk,
  pauseWalk,
  resumeWalk,
  updateWalkStats,
  completeWalk,
  setGuidanceType,
  toggleAudio,
} from '../../store/slices/walkSlice';
import { incrementStat } from '../../store/slices/userSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiSquare, FiMapPin, FiHeadphones, FiVolume2, FiVolumeX } = FiIcons;

const Walk = () => {
  const dispatch = useDispatch();
  const {
    isActive,
    currentWalk,
    duration,
    steps,
    distance,
    guidanceType,
    audioEnabled,
  } = useSelector((state) => state.walk);

  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedType, setSelectedType] = useState('mindful');

  const walkTypes = [
    {
      id: 'mindful',
      name: 'Mindful Walk',
      description: 'Focus on the present moment',
      icon: FiMapPin,
    },
    {
      id: 'nature',
      name: 'Nature Connection',
      description: 'Connect with natural surroundings',
      icon: FiMapPin,
    },
    {
      id: 'breathing',
      name: 'Walking Meditation',
      description: 'Synchronized breathing and steps',
      icon: FiMapPin,
    },
  ];

  const durations = [5, 10, 15, 20, 30];

  useEffect(() => {
    let interval;
    if (isActive && currentWalk) {
      interval = setInterval(() => {
        // Simulate walk progress
        const newDuration = duration + 1;
        const newSteps = steps + Math.floor(Math.random() * 3) + 1;
        const newDistance = newSteps * 0.0008; // Approximate distance per step

        dispatch(updateWalkStats({
          duration: newDuration,
          steps: newSteps,
          distance: newDistance,
        }));

        if (newDuration >= selectedDuration * 60) {
          dispatch(completeWalk());
          dispatch(incrementStat({ stat: 'totalWalkMinutes', value: selectedDuration }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentWalk, duration, steps, selectedDuration, dispatch]);

  const handleStart = () => {
    dispatch(startWalk({
      type: selectedType,
      duration: selectedDuration,
    }));
  };

  const handlePause = () => {
    dispatch(pauseWalk());
  };

  const handleResume = () => {
    dispatch(resumeWalk());
  };

  const handleStop = () => {
    dispatch(completeWalk());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (km) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(2)}km`;
  };

  const getGuidanceText = () => {
    const phrases = {
      mindful: [
        "Feel your feet connecting with the ground...",
        "Notice the rhythm of your steps...",
        "Observe the world around you with fresh eyes...",
        "Let your thoughts flow like clouds in the sky...",
      ],
      nature: [
        "Listen to the sounds of nature around you...",
        "Feel the breeze on your skin...",
        "Notice the colors and textures in your environment...",
        "Breathe in the fresh air deeply...",
      ],
      breathing: [
        "Inhale for 4 steps, exhale for 4 steps...",
        "Let your breath guide your pace...",
        "Feel the harmony between breath and movement...",
        "Each step is a meditation in motion...",
      ],
    };

    const typePhases = phrases[selectedType] || phrases.mindful;
    const index = Math.floor(duration / 30) % typePhases.length;
    return typePhases[index];
  };

  if (currentWalk) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600 flex flex-col justify-between p-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 pt-8"
        >
          <h1 className="text-2xl font-bold">
            {walkTypes.find(t => t.id === selectedType)?.name}
          </h1>
          <p className="text-green-100">{formatTime(duration)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="text-center space-y-8">
            <motion.div
              className="w-48 h-48 rounded-full border-4 border-white/30 flex items-center justify-center mx-auto"
              animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ rotate: isActive ? 360 : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <SafeIcon icon={FiMapPin} className="w-16 h-16" />
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{steps}</div>
                  <div className="text-sm text-green-100">Steps</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatDistance(distance)}</div>
                  <div className="text-sm text-green-100">Distance</div>
                </div>
              </div>

              {audioEnabled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mx-4"
                >
                  <p className="text-sm text-center italic">
                    {getGuidanceText()}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleAudio())}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <SafeIcon icon={audioEnabled ? FiVolume2 : FiVolumeX} className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isActive ? handlePause : handleResume}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <SafeIcon icon={isActive ? FiPause : FiPlay} className="w-8 h-8" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleStop}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <SafeIcon icon={FiSquare} className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-green-100 text-sm">
              {isActive ? 'Walking in progress...' : 'Walk paused'}
            </p>
          </div>
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
        <h1 className="text-3xl font-bold text-gray-800">Mindful Walk</h1>
        <p className="text-gray-600">Move your body, calm your mind</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Choose Your Walk Type</h2>
        <div className="space-y-3">
          {walkTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedType === type.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={type.icon} className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className={`text-sm ${
                    selectedType === type.id ? 'text-green-100' : 'text-gray-500'
                  }`}>
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
              className={`flex-shrink-0 px-4 py-3 rounded-lg transition-all ${
                selectedDuration === duration
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span className="font-medium">{duration} min</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
      >
        <div className="flex items-center space-x-3 mb-3">
          <SafeIcon icon={FiHeadphones} className="w-6 h-6 text-green-600" />
          <h3 className="font-semibold text-gray-800">Audio Guidance</h3>
        </div>
        <p className="text-gray-600 text-sm mb-3">
          Get gentle reminders and mindfulness cues during your walk
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch(toggleAudio())}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            audioEnabled
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700'
          }`}
        >
          {audioEnabled ? 'Audio Enabled' : 'Audio Disabled'}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-3"
        >
          <SafeIcon icon={FiPlay} className="w-6 h-6" />
          <span>Start Walking</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Walk;