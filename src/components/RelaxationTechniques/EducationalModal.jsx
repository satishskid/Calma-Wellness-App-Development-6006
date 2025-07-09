import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiBook, FiTrendingUp, FiUsers, FiAward, FiChevronRight, FiPlay } = FiIcons;

const EducationalModal = ({ technique, isOpen, onClose, onStartSession }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'benefits', label: 'Benefits', icon: FiTrendingUp },
    { id: 'science', label: 'Science', icon: FiAward },
    { id: 'practice', label: 'How to Practice', icon: FiUsers }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">What is {technique.name}?</h3>
        <p className="text-gray-600 leading-relaxed">{technique.description}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{technique.duration[0]}-{technique.duration[technique.duration.length-1]}</div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{technique.difficulty.length}</div>
          <div className="text-sm text-gray-600">Levels</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{technique.category}</div>
          <div className="text-sm text-gray-600">Category</div>
        </div>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Proven Benefits</h3>
      <div className="space-y-3">
        {technique.benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-gray-700">{benefit}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderScience = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Clinical Evidence</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{technique.clinicalEvidence.studies}</div>
            <div className="text-sm text-gray-600">Clinical Studies</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{technique.clinicalEvidence.participants.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Participants</div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <SafeIcon icon={FiAward} className="w-5 h-5 text-yellow-600" />
          <span className="font-semibold text-yellow-800">Effect Size</span>
        </div>
        <div className="text-2xl font-bold text-yellow-600">{technique.clinicalEvidence.effectSize}</div>
        <p className="text-sm text-gray-600 mt-1">
          {technique.clinicalEvidence.effectSize > 0.8 ? 'Large' : 
           technique.clinicalEvidence.effectSize > 0.5 ? 'Medium' : 'Small'} effect size
        </p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Source:</span> {technique.clinicalEvidence.source}
        </p>
      </div>
    </div>
  );

  const renderPractice = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Practice</h3>
        {technique.phases && (
          <div className="space-y-3">
            {technique.phases.map((phase, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{phase.name}</h4>
                  <p className="text-sm text-gray-600">{phase.instruction}</p>
                  <p className="text-xs text-indigo-600 mt-1">{phase.duration} minutes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Getting Started</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Find a quiet, comfortable space</li>
          <li>• Choose your experience level</li>
          <li>• Select your preferred duration</li>
          <li>• Follow the guided instructions</li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'benefits': return renderBenefits();
      case 'science': return renderScience();
      case 'practice': return renderPractice();
      default: return renderOverview();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{technique.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{technique.category} • {technique.difficulty.join(', ')}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStartSession(technique)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiPlay} className="w-5 h-5" />
                  <span>Start Session</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EducationalModal;