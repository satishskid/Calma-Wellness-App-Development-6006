import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { relaxationTechniques, categories } from '../../data/relaxationTechniques';
import TechniqueCard from '../../components/RelaxationTechniques/TechniqueCard';
import SessionInterface from '../../components/RelaxationTechniques/SessionInterface';
import EducationalModal from '../../components/RelaxationTechniques/EducationalModal';
import ProgressTracker from '../../components/RelaxationTechniques/ProgressTracker';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiSearch, FiTrendingUp, FiBookOpen, FiPlay, FiGrid, FiList } = FiIcons;

const RelaxationTechniques = () => {
  const dispatch = useDispatch();
  const { userProgress } = useSelector(state => state.relaxation);
  
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [showSession, setShowSession] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  const techniques = Object.values(relaxationTechniques);

  const filteredTechniques = techniques.filter(technique => {
    const matchesSearch = technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || technique.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || technique.difficulty.includes(selectedDifficulty);
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedTechniques = [...filteredTechniques].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'effectiveness':
        return b.clinicalEvidence.effectSize - a.clinicalEvidence.effectSize;
      case 'popularity':
        return b.clinicalEvidence.participants - a.clinicalEvidence.participants;
      case 'duration':
        return a.duration[0] - b.duration[0];
      default:
        return 0;
    }
  });

  const handleStartSession = (technique, level = null, duration = null) => {
    setSelectedTechnique(technique);
    setSelectedLevel(level || userProgress[technique.id]?.level || 'beginner');
    setSelectedDuration(duration || technique.duration[0]);
    setShowSession(true);
    setShowEducational(false);
  };

  const handleLearnMore = (technique) => {
    setSelectedTechnique(technique);
    setShowEducational(true);
  };

  const handleSessionComplete = () => {
    setShowSession(false);
    setSelectedTechnique(null);
  };

  const handleSessionExit = () => {
    setShowSession(false);
    setSelectedTechnique(null);
  };

  const getRecommendedTechniques = () => {
    // Simple recommendation based on user progress and preferences
    return techniques
      .filter(technique => {
        const progress = userProgress[technique.id];
        return !progress || progress.completedSessions < 5;
      })
      .sort((a, b) => b.clinicalEvidence.effectSize - a.clinicalEvidence.effectSize)
      .slice(0, 3);
  };

  if (showSession && selectedTechnique) {
    return (
      <SessionInterface
        technique={selectedTechnique}
        level={selectedLevel}
        duration={selectedDuration}
        onComplete={handleSessionComplete}
        onExit={handleSessionExit}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-800">Relaxation Techniques</h1>
        <p className="text-gray-600">17 evidence-based practices for stress reduction and well-being</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{techniques.length}</div>
          <div className="text-sm text-gray-600">Techniques</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(userProgress).reduce((acc, progress) => acc + progress.completedSessions, 0)}
          </div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Object.values(userProgress).reduce((acc, progress) => acc + progress.totalMinutes, 0)}
          </div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProgress(true)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
        >
          <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
          <span>View Progress</span>
        </motion.button>
      </div>

      {/* Recommended Techniques */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Recommended for You</h2>
        <div className="grid grid-cols-1 gap-4">
          {getRecommendedTechniques().map((technique) => (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{technique.name}</h3>
                  <p className="text-sm text-gray-600">{technique.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{technique.duration[0]}-{technique.duration[technique.duration.length-1]} min</span>
                    <span>{technique.clinicalEvidence.effectSize} effect size</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartSession(technique)}
                  className="bg-blue-500 text-white p-3 rounded-lg"
                >
                  <SafeIcon icon={FiPlay} className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <SafeIcon icon={viewMode === 'grid' ? FiList : FiGrid} className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          >
            <option value="all">All Categories</option>
            {Object.entries(categories).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="effectiveness">Sort by Effectiveness</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Techniques Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        <AnimatePresence>
          {sortedTechniques.map((technique) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              onSelect={handleStartSession}
              onLearnMore={handleLearnMore}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Educational Modal */}
      <EducationalModal
        technique={selectedTechnique}
        isOpen={showEducational}
        onClose={() => setShowEducational(false)}
        onStartSession={handleStartSession}
      />

      {/* Progress Modal */}
      <AnimatePresence>
        {showProgress && selectedTechnique && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProgress(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-50 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowProgress(false)}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <SafeIcon icon={FiFilter} className="w-6 h-6 text-gray-500" />
                  </motion.button>
                </div>
                <ProgressTracker technique={selectedTechnique} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelaxationTechniques;