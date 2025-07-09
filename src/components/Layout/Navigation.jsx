import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiHeart, FiEdit3, FiWind, FiMapPin, FiTarget } = FiIcons;

const Navigation = () => {
  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/meditation', icon: FiHeart, label: 'Meditate' },
    { path: '/relaxation', icon: FiTarget, label: 'Relax' },
    { path: '/journal', icon: FiEdit3, label: 'Journal' },
    { path: '/breathwork', icon: FiWind, label: 'Breathe' },
    { path: '/walk', icon: FiMapPin, label: 'Walk' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center space-y-1"
              >
                <SafeIcon
                  icon={item.icon}
                  className={`w-6 h-6 ${
                    isActive ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;