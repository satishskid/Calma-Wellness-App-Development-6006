import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiEdit3, FiWind, FiMapPin, FiTrendingUp, FiAward } = FiIcons;

const Home = () => {
  const { profile, stats } = useSelector((state) => state.user);
  const { meditation, journal, breathwork, walk } = useSelector((state) => state);

  const quickActions = [
    {
      title: 'Quick Meditation',
      subtitle: '5 min balance',
      icon: FiHeart,
      path: '/meditation',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Journal Check-in',
      subtitle: 'How are you feeling?',
      icon: FiEdit3,
      path: '/journal',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Breathwork',
      subtitle: 'Box breathing',
      icon: FiWind,
      path: '/breathwork',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Mindful Walk',
      subtitle: '10 min nature',
      icon: FiMapPin,
      path: '/walk',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {profile.name || 'Friend'}
        </h1>
        <p className="text-indigo-100 mb-4">
          Take a moment to breathe and center yourself. You deserve this time.
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiAward} className="w-5 h-5 text-yellow-300" />
            <span className="text-sm">{stats.streak} day streak</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-300" />
            <span className="text-sm">Progress up 23%</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.path}
                className={`block p-4 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg`}
              >
                <SafeIcon icon={action.icon} className="w-8 h-8 mb-3" />
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm opacity-90">{action.subtitle}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalMeditations}</div>
            <div className="text-sm text-gray-500">Meditations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalJournalEntries}</div>
            <div className="text-sm text-gray-500">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalBreathworkSessions}</div>
            <div className="text-sm text-gray-500">Breathwork</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.totalWalkMinutes)}</div>
            <div className="text-sm text-gray-500">Walk Minutes</div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Insight</h2>
        <p className="text-gray-600">
          Based on your recent activity, you might benefit from a longer meditation session today. 
          Your stress levels seem elevated - would you like to try a 15-minute calming meditation?
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium"
        >
          Try Recommended Session
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;