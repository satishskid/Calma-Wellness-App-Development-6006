import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiTrendingUp, FiUsers, FiStar, FiPlay, FiBookOpen } = FiIcons;

const TechniqueCard = ({ technique, onSelect, onLearnMore }) => {
  const { userProgress } = useSelector(state => state.relaxation);
  const userLevel = userProgress[technique.id]?.level || 'beginner';
  const completedSessions = userProgress[technique.id]?.completedSessions || 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-50';
      case 'intermediate': return 'text-yellow-500 bg-yellow-50';
      case 'advanced': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      mindfulness: 'from-purple-400 to-purple-600',
      breathwork: 'from-blue-400 to-blue-600',
      body: 'from-green-400 to-green-600',
      meditation: 'from-indigo-400 to-indigo-600',
      compassion: 'from-pink-400 to-pink-600',
      imagery: 'from-orange-400 to-orange-600',
      nature: 'from-emerald-400 to-emerald-600',
      sound: 'from-cyan-400 to-cyan-600',
      'mind-body': 'from-violet-400 to-violet-600'
    };
    return colors[category] || 'from-gray-400 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getCategoryColor(technique.category)} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{technique.name}</h3>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiStar} className="w-4 h-4" />
            <span className="text-sm">{technique.clinicalEvidence.effectSize.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm opacity-90">{technique.description}</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiClock} className="w-4 h-4" />
            <span>{technique.duration[0]}-{technique.duration[technique.duration.length-1]}min</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>{technique.clinicalEvidence.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
            <span>{technique.clinicalEvidence.studies} studies</span>
          </div>
        </div>

        {/* Difficulty & Progress */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {technique.difficulty.map((level) => (
              <span
                key={level}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(level)} ${
                  userLevel === level ? 'ring-2 ring-blue-300' : ''
                }`}
              >
                {level}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {completedSessions} sessions completed
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800">Key Benefits:</h4>
          <div className="grid grid-cols-1 gap-1">
            {technique.benefits.slice(0, 2).map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(technique)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4" />
            <span>Start Session</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLearnMore(technique)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm flex items-center justify-center"
          >
            <SafeIcon icon={FiBookOpen} className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TechniqueCard;