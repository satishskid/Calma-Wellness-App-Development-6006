import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiWifi, FiWifiOff, FiUser } = FiIcons;

const Header = () => {
  const { profile } = useSelector((state) => state.user);
  const { isOnline } = profile;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="flex items-center justify-between px-4 py-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Calma
          </span>
        </motion.div>

        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-1"
          >
            <SafeIcon
              icon={isOnline ? FiWifi : FiWifiOff}
              className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`}
            />
            <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center"
          >
            <SafeIcon icon={FiUser} className="w-4 h-4 text-indigo-600" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;