import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startBreathwork,
  stopBreathwork,
  nextPhase,
  updateCount,
  completeSession,
} from '../../store/slices/breathworkSlice';
import { incrementStat } from '../../store/slices/userSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiSquare, FiWind, FiCircle } = FiIcons;

const Breathwork = () => {
  const dispatch = useDispatch();
  const {
    isActive,
    pattern,
    phase,
    cycle,
    totalCycles,
    currentCount,
    phaseTime,
    patterns,
  } = useSelector((state) => state.breathwork);

  const [selectedPattern, setSelectedPattern] = useState('box');
  const [selectedCycles, setSelectedCycles] = useState(5);

  const patternOptions = [
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Equal counts for inhale, hold, exhale, pause',
      benefit: 'Reduces stress and anxiety',
    },
    {
      id: '478',
      name: '4-7-8 Breathing',
      description: 'Inhale 4, hold 7, exhale 8',
      benefit: 'Promotes relaxation and sleep',
    },
    {
      id: 'coherent',
      name: 'Coherent Breathing',
      description: 'Smooth 5-second inhale and exhale',
      benefit: 'Balances nervous system',
    },
  ];

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        dispatch(updateCount(currentCount + 1));
        if (currentCount + 1 >= phaseTime) {
          dispatch(nextPhase());
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentCount, phaseTime, dispatch]);

  useEffect(() => {
    if (cycle >= totalCycles && isActive) {
      dispatch(completeSession());
      dispatch(incrementStat({ stat: 'totalBreathworkSessions' }));
    }
  }, [cycle, totalCycles, isActive, dispatch]);

  const handleStart = () => {
    dispatch(startBreathwork({
      pattern: selectedPattern,
      cycles: selectedCycles,
    }));
  };

  const handleStop = () => {
    dispatch(stopBreathwork());
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'pause':
        return 'Pause';
      default:
        return 'Breathe';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-500';
      case 'hold':
        return 'from-yellow-400 to-orange-500';
      case 'exhale':
        return 'from-green-400 to-emerald-500';
      case 'pause':
        return 'from-purple-400 to-indigo-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCircleScale = () => {
    const progress = currentCount / phaseTime;
    switch (phase) {
      case 'inhale':
        return 0.5 + (progress * 0.5);
      case 'exhale':
        return 1 - (progress * 0.5);
      case 'hold':
      case 'pause':
        return phase === 'hold' ? 1 : 0.5;
      default:
        return 0.5;
    }
  };

  if (isActive) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center p-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{patternOptions.find(p => p.id === pattern)?.name}</h1>
            <p className="text-white/80">Cycle {cycle + 1} of {totalCycles}</p>
          </div>

          <div className="relative">
            <motion.div
              className="w-80 h-80 rounded-full border-4 border-white/30 flex items-center justify-center mx-auto"
              animate={{ scale: getCircleScale() }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ scale: getCircleScale() }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="text-center">
                  <div className="text-6xl font-light mb-2">
                    {phaseTime - currentCount}
                  </div>
                  <div className="text-2xl font-medium">
                    {getPhaseInstruction()}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-80 h-80 rounded-full border border-white/20"
                  animate={{
                    scale: [1, 1.2, 1.4],
                    opacity: [0.5, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStop}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <SafeIcon icon={FiSquare} className="w-8 h-8" />
          </motion.button>

          <div className="space-y-2">
            <div className="flex justify-center space-x-2">
              {[...Array(totalCycles)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < cycle ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/80 text-sm">
              {patterns[pattern].inhale}-{patterns[pattern].hold}-{patterns[pattern].exhale}
              {patterns[pattern].pause > 0 && `-${patterns[pattern].pause}`}
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
        <h1 className="text-3xl font-bold text-gray-800">Breathwork</h1>
        <p className="text-gray-600">Regulate your nervous system through breath</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Choose Your Pattern</h2>
        <div className="space-y-3">
          {patternOptions.map((patternOption) => (
            <motion.button
              key={patternOption.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPattern(patternOption.id)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedPattern === patternOption.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiWind} className="w-6 h-6" />
                <div className="flex-1">
                  <h3 className="font-semibold">{patternOption.name}</h3>
                  <p className={`text-sm ${
                    selectedPattern === patternOption.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {patternOption.description}
                  </p>
                  <p className={`text-xs mt-1 ${
                    selectedPattern === patternOption.id ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {patternOption.benefit}
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
        <h2 className="text-xl font-semibold text-gray-800">Number of Cycles</h2>
        <div className="flex space-x-3">
          {[3, 5, 8, 10].map((cycles) => (
            <motion.button
              key={cycles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCycles(cycles)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all ${
                selectedCycles === cycles
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-cyan-300'
              }`}
            >
              <SafeIcon icon={FiCircle} className="w-5 h-5" />
              <span className="font-medium">{cycles}</span>
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
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-3"
        >
          <SafeIcon icon={FiPlay} className="w-6 h-6" />
          <span>Start Breathwork</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Breathwork;