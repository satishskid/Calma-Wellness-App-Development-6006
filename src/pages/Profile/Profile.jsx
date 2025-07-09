import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateProfile } from '../../store/slices/userSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiSettings, FiTrendingUp, FiAward, FiHeart, FiActivity } = FiIcons;

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, stats } = useSelector((state) => state.user);

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed your first meditation', icon: FiHeart, earned: stats.totalMeditations > 0 },
    { id: 2, title: 'Mindful Writer', description: 'Wrote 5 journal entries', icon: FiActivity, earned: stats.totalJournalEntries >= 5 },
    { id: 3, title: 'Breath Master', description: 'Completed 10 breathwork sessions', icon: FiActivity, earned: stats.totalBreathworkSessions >= 10 },
    { id: 4, title: 'Weekly Warrior', description: 'Maintained a 7-day streak', icon: FiAward, earned: stats.streak >= 7 },
  ];

  const handleProfileUpdate = (field, value) => {
    dispatch(updateProfile({ [field]: value }));
  };

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">Track your wellness journey</p>
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.name || 'Welcome, Friend'}
            </h2>
            <p className="text-gray-500">Wellness Journey Member</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalMeditations + stats.totalJournalEntries + stats.totalBreathworkSessions}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiHeart} className="w-5 h-5 text-purple-500" />
              <span className="text-gray-700">Meditations</span>
            </div>
            <span className="font-semibold text-purple-600">{stats.totalMeditations}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiActivity} className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700">Journal Entries</span>
            </div>
            <span className="font-semibold text-blue-600">{stats.totalJournalEntries}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiActivity} className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Breathwork Sessions</span>
            </div>
            <span className="font-semibold text-green-600">{stats.totalBreathworkSessions}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Walk Minutes</span>
            </div>
            <span className="font-semibold text-orange-600">{Math.round(stats.totalWalkMinutes)}</span>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: achievement.id * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                achievement.earned
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <SafeIcon
                icon={achievement.icon}
                className={`w-8 h-8 ${
                  achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                }`}
              />
              <div className="flex-1">
                <h4 className={`font-medium ${
                  achievement.earned ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.earned ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
              </div>
              {achievement.earned && (
                <SafeIcon icon={FiAward} className="w-6 h-6 text-yellow-500" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Meditation Duration
            </label>
            <select
              value={profile.preferences.meditationDuration}
              onChange={(e) => handleProfileUpdate('preferences', {
                ...profile.preferences,
                meditationDuration: parseInt(e.target.value)
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Breathwork Pattern
            </label>
            <select
              value={profile.preferences.breathworkType}
              onChange={(e) => handleProfileUpdate('preferences', {
                ...profile.preferences,
                breathworkType: e.target.value
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            >
              <option value="box">Box Breathing</option>
              <option value="478">4-7-8 Breathing</option>
              <option value="coherent">Coherent Breathing</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-700">Walk Reminders</h4>
              <p className="text-sm text-gray-500">Get notified for mindful walks</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProfileUpdate('preferences', {
                ...profile.preferences,
                walkReminders: !profile.preferences.walkReminders
              })}
              className={`w-12 h-6 rounded-full transition-all ${
                profile.preferences.walkReminders
                  ? 'bg-indigo-500'
                  : 'bg-gray-300'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{
                  x: profile.preferences.walkReminders ? 26 : 2,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;