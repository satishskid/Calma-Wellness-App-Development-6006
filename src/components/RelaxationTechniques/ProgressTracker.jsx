import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTarget, FiAward, FiCalendar, FiClock, FiStar } = FiIcons;

const ProgressTracker = ({ technique }) => {
  const { userProgress } = useSelector(state => state.relaxation);
  const progress = userProgress[technique.id] || {
    level: 'beginner',
    completedSessions: 0,
    totalMinutes: 0,
    streak: 0,
    achievements: [],
    weeklyGoal: 3,
    weeklyProgress: 0
  };

  const achievements = [
    { id: 'first_session', name: 'First Steps', description: 'Complete your first session', threshold: 1 },
    { id: 'consistent', name: 'Consistent Practice', description: 'Complete 7 sessions', threshold: 7 },
    { id: 'dedicated', name: 'Dedicated Practitioner', description: 'Complete 30 sessions', threshold: 30 },
    { id: 'master', name: 'Master Level', description: 'Complete 100 sessions', threshold: 100 },
    { id: 'streak_7', name: 'Weekly Warrior', description: 'Maintain 7-day streak', threshold: 7, type: 'streak' },
    { id: 'streak_30', name: 'Monthly Master', description: 'Maintain 30-day streak', threshold: 30, type: 'streak' },
    { id: 'time_60', name: 'Hour of Practice', description: 'Complete 60 minutes', threshold: 60, type: 'time' },
    { id: 'time_300', name: 'Five Hour Club', description: 'Complete 5 hours', threshold: 300, type: 'time' }
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getNextLevel = (currentLevel) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const getSessionsForNextLevel = (currentLevel) => {
    switch (currentLevel) {
      case 'beginner': return 10;
      case 'intermediate': return 25;
      default: return null;
    }
  };

  const checkAchievements = () => {
    return achievements.map(achievement => {
      let isEarned = false;
      let current = 0;
      
      switch (achievement.type) {
        case 'streak':
          current = progress.streak;
          isEarned = current >= achievement.threshold;
          break;
        case 'time':
          current = progress.totalMinutes;
          isEarned = current >= achievement.threshold;
          break;
        default:
          current = progress.completedSessions;
          isEarned = current >= achievement.threshold;
      }
      
      return {
        ...achievement,
        isEarned,
        progress: Math.min((current / achievement.threshold) * 100, 100)
      };
    });
  };

  const nextLevel = getNextLevel(progress.level);
  const sessionsForNextLevel = getSessionsForNextLevel(progress.level);
  const earnedAchievements = checkAchievements();

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Level</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
            {progress.level}
          </span>
        </div>
        
        {nextLevel && sessionsForNextLevel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress to {nextLevel}</span>
              <span className="font-medium">{progress.completedSessions}/{sessionsForNextLevel}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                style={{ width: `${getProgressPercentage(progress.completedSessions, sessionsForNextLevel)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage(progress.completedSessions, sessionsForNextLevel)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{progress.completedSessions}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiClock} className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{progress.totalMinutes}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{progress.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiAward} className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{earnedAchievements.filter(a => a.isEarned).length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Weekly Goal</h3>
          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">This week</span>
            <span className="font-medium">{progress.weeklyProgress}/{progress.weeklyGoal} sessions</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              style={{ width: `${getProgressPercentage(progress.weeklyProgress, progress.weeklyGoal)}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage(progress.weeklyProgress, progress.weeklyGoal)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {earnedAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                achievement.isEarned 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.isEarned ? 'bg-yellow-500' : 'bg-gray-300'
              }`}>
                <SafeIcon 
                  icon={achievement.isEarned ? FiStar : FiTarget} 
                  className={`w-5 h-5 ${achievement.isEarned ? 'text-white' : 'text-gray-500'}`} 
                />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${achievement.isEarned ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {achievement.name}
                </h4>
                <p className={`text-sm ${achievement.isEarned ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                {!achievement.isEarned && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;