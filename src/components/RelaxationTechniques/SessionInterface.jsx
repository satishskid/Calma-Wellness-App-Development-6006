import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateProgress, completeSession } from '../../store/slices/relaxationSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiSquare, FiVolume2, FiVolumeX, FiEye, FiEyeOff, FiBook } = FiIcons;

const SessionInterface = ({ technique, level, duration, onComplete, onExit }) => {
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [instructionMode, setInstructionMode] = useState('audio'); // audio, visual, text
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [visualEnabled, setVisualEnabled] = useState(true);

  const phases = technique.phases || [
    { name: 'Preparation', duration: 2, instruction: 'Get comfortable and centered' },
    { name: 'Main Practice', duration: duration - 4, instruction: 'Follow the guidance' },
    { name: 'Integration', duration: 2, instruction: 'Prepare to return' }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentPhaseDuration = phases[currentPhase].duration * 60; // Convert to seconds
        const newPhaseProgress = phaseProgress + 1;
        
        if (newPhaseProgress >= currentPhaseDuration) {
          if (currentPhase < phases.length - 1) {
            setCurrentPhase(currentPhase + 1);
            setPhaseProgress(0);
          } else {
            // Session complete
            handleComplete();
          }
        } else {
          setPhaseProgress(newPhaseProgress);
        }
        
        // Update total progress
        const totalSeconds = duration * 60;
        const completedSeconds = phases.slice(0, currentPhase).reduce((acc, phase) => 
          acc + (phase.duration * 60), 0) + newPhaseProgress;
        const newTotalProgress = (completedSeconds / totalSeconds) * 100;
        setTotalProgress(newTotalProgress);
        
        dispatch(updateProgress({
          techniqueId: technique.id,
          progress: newTotalProgress,
          currentPhase: phases[currentPhase].name
        }));
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentPhase, phaseProgress, technique.id, duration, phases, dispatch]);

  const handleComplete = () => {
    setIsPlaying(false);
    dispatch(completeSession({
      techniqueId: technique.id,
      level,
      duration,
      completedAt: new Date().toISOString()
    }));
    onComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInstructionContent = () => {
    const instructions = technique.instructions?.[level];
    if (!instructions) return phases[currentPhase].instruction;
    
    switch (instructionMode) {
      case 'audio':
        return instructions.audio || phases[currentPhase].instruction;
      case 'visual':
        return instructions.visual || phases[currentPhase].instruction;
      case 'text':
        return instructions.text || phases[currentPhase].instruction;
      default:
        return phases[currentPhase].instruction;
    }
  };

  const getVisualizationComponent = () => {
    const visualType = technique.instructions?.[level]?.visual;
    
    switch (visualType) {
      case 'breathing-circle':
        return <BreathingCircle isPlaying={isPlaying} />;
      case 'body-scan':
        return <BodyScanVisual currentPhase={currentPhase} />;
      case 'wave-breathing':
        return <WaveBreathing isPlaying={isPlaying} />;
      default:
        return <DefaultVisualization technique={technique} isPlaying={isPlaying} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{technique.name}</h1>
          <p className="text-indigo-200 text-sm">{level} • {duration} min</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onExit}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <SafeIcon icon={FiSquare} className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
            style={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-white/80">
          <span>{phases[currentPhase].name}</span>
          <span>{formatTime(Math.floor((duration * 60) - (phases.slice(0, currentPhase).reduce((acc, phase) => acc + (phase.duration * 60), 0) + phaseProgress)))}</span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 flex items-center justify-center px-4 mb-8">
        <AnimatePresence mode="wait">
          {visualEnabled && (
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-md"
            >
              {getVisualizationComponent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instruction Area */}
      <div className="px-4 mb-8">
        <motion.div
          key={`${currentPhase}-${instructionMode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
        >
          <p className="text-lg leading-relaxed">{getInstructionContent()}</p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Mode Controls */}
        <div className="flex items-center justify-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInstructionMode('audio')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              instructionMode === 'audio' 
                ? 'bg-white/20 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            Audio
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInstructionMode('visual')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              instructionMode === 'visual' 
                ? 'bg-white/20 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            Visual
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInstructionMode('text')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              instructionMode === 'text' 
                ? 'bg-white/20 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            Text
          </motion.button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <SafeIcon icon={audioEnabled ? FiVolume2 : FiVolumeX} className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setVisualEnabled(!visualEnabled)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <SafeIcon icon={visualEnabled ? FiEye : FiEyeOff} className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Visualization Components
const BreathingCircle = ({ isPlaying }) => (
  <motion.div
    className="w-64 h-64 rounded-full border-4 border-white/30 flex items-center justify-center mx-auto"
    animate={{
      scale: isPlaying ? [1, 1.2, 1] : 1,
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <motion.div
      className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
      animate={{
        opacity: isPlaying ? [0.5, 1, 0.5] : 0.5,
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <span className="text-2xl font-light">Breathe</span>
    </motion.div>
  </motion.div>
);

const BodyScanVisual = ({ currentPhase }) => (
  <div className="w-64 h-80 mx-auto relative">
    <svg viewBox="0 0 100 120" className="w-full h-full">
      {/* Simple body outline */}
      <path
        d="M50 10 C45 10, 40 15, 40 20 L40 40 C35 40, 30 45, 30 50 L30 80 C30 85, 35 90, 40 90 L40 110 L45 110 L45 90 L55 90 L55 110 L60 110 L60 90 C65 90, 70 85, 70 80 L70 50 C70 45, 65 40, 60 40 L60 20 C60 15, 55 10, 50 10 Z"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* Highlighted region based on current phase */}
      <motion.circle
        cx="50"
        cy={currentPhase * 20 + 20}
        r="8"
        fill="rgba(59, 130, 246, 0.6)"
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </svg>
  </div>
);

const WaveBreathing = ({ isPlaying }) => (
  <div className="w-full h-32 relative overflow-hidden">
    <svg viewBox="0 0 400 100" className="w-full h-full">
      <motion.path
        d="M0,50 Q100,20 200,50 T400,50"
        fill="none"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="3"
        animate={{
          d: isPlaying 
            ? ["M0,50 Q100,20 200,50 T400,50", "M0,50 Q100,80 200,50 T400,50", "M0,50 Q100,20 200,50 T400,50"]
            : "M0,50 Q100,50 200,50 T400,50"
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </svg>
  </div>
);

const DefaultVisualization = ({ technique, isPlaying }) => (
  <motion.div
    className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm flex items-center justify-center mx-auto"
    animate={{
      scale: isPlaying ? [1, 1.1, 1] : 1,
      rotate: isPlaying ? [0, 360] : 0,
    }}
    transition={{
      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
    }}
  >
    <div className="text-center">
      <div className="text-4xl mb-2">🧘</div>
      <div className="text-sm font-medium">{technique.name}</div>
    </div>
  </motion.div>
);

export default SessionInterface;