import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { saveEntry } from '../../store/slices/journalSlice';
import { incrementStat } from '../../store/slices/userSlice';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiSend, FiMic, FiUser, FiHeart, FiThumbsUp, FiRefreshCw } = FiIcons;

const ConversationalAgent = ({ initialPrompt, onComplete }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [conversationPhase, setConversationPhase] = useState('greeting');
  const [userResponses, setUserResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [sessionSummary, setSessionSummary] = useState('');
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const agentPersonality = {
    name: 'Sage',
    traits: ['empathetic', 'curious', 'supportive', 'non-judgmental'],
    responses: {
      greeting: [
        "Hello! I'm Sage, your journaling companion. I'm here to listen and help you explore your thoughts and feelings.",
        "Hi there! I'm excited to spend some time with you today. What's on your mind?",
        "Welcome! I'm here to create a safe space for you to share whatever you're experiencing."
      ],
      encouragement: [
        "Thank you for sharing that with me. That takes courage.",
        "I appreciate you being so open. How does it feel to express that?",
        "That's really insightful. What else comes up for you about this?",
        "I can hear how important this is to you. Tell me more."
      ],
      deepening: [
        "That's interesting. What do you think might be underneath that feeling?",
        "I'm curious - when you think about this, what comes up in your body?",
        "What would you tell a close friend who was going through something similar?",
        "How do you think this connects to other areas of your life?"
      ],
      reflection: [
        "Looking back on what you've shared, what stands out most to you?",
        "What patterns do you notice in what you've told me?",
        "How do you feel now compared to when we started?",
        "What would you like to remember from our conversation today?"
      ]
    }
  };

  const conversationFlow = {
    greeting: { next: 'exploration', minResponses: 1 },
    exploration: { next: 'deepening', minResponses: 2 },
    deepening: { next: 'integration', minResponses: 2 },
    integration: { next: 'closing', minResponses: 1 },
    closing: { next: 'complete', minResponses: 1 }
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Start conversation
    startConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = () => {
    const greeting = getRandomResponse('greeting');
    const initialMessage = {
      id: Date.now(),
      type: 'agent',
      content: greeting,
      timestamp: new Date().toISOString()
    };
    
    setTimeout(() => {
      setMessages([initialMessage]);
      if (initialPrompt) {
        setTimeout(() => {
          addAgentMessage(`I see you're reflecting on: "${initialPrompt}". What would you like to explore about this?`);
        }, 1000);
      }
    }, 500);
  };

  const getRandomResponse = (category) => {
    const responses = agentPersonality.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addAgentMessage = (content) => {
    setIsAgentTyping(true);
    
    setTimeout(() => {
      const message = {
        id: Date.now(),
        type: 'agent',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      setIsAgentTyping(false);
    }, 1000 + Math.random() * 1000); // Simulate thinking time
  };

  const addUserMessage = (content) => {
    const message = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, message]);
    setUserResponses(prev => [...prev, content]);
    
    // Generate agent response
    generateAgentResponse(content);
  };

  const generateAgentResponse = (userInput) => {
    const currentFlow = conversationFlow[conversationPhase];
    const userResponseCount = userResponses.length;
    
    let response = '';
    let nextPhase = conversationPhase;
    
    // Analyze user input for emotional content
    const emotionalWords = ['sad', 'happy', 'angry', 'frustrated', 'excited', 'worried', 'grateful', 'overwhelmed'];
    const hasEmotion = emotionalWords.some(word => userInput.toLowerCase().includes(word));
    
    switch (conversationPhase) {
      case 'greeting':
        response = getRandomResponse('encouragement');
        if (userResponseCount >= currentFlow.minResponses) {
          nextPhase = 'exploration';
        }
        break;
        
      case 'exploration':
        if (hasEmotion) {
          response = "I can sense there's some strong emotion there. " + getRandomResponse('deepening');
        } else {
          response = getRandomResponse('encouragement');
        }
        if (userResponseCount >= currentFlow.minResponses) {
          nextPhase = 'deepening';
        }
        break;
        
      case 'deepening':
        response = getRandomResponse('deepening');
        if (userResponseCount >= currentFlow.minResponses) {
          nextPhase = 'integration';
        }
        break;
        
      case 'integration':
        response = getRandomResponse('reflection');
        if (userResponseCount >= currentFlow.minResponses) {
          nextPhase = 'closing';
        }
        break;
        
      case 'closing':
        response = "Thank you for sharing so openly with me today. This has been really meaningful. Would you like me to help you capture the key insights from our conversation?";
        nextPhase = 'complete';
        break;
    }
    
    setConversationPhase(nextPhase);
    addAgentMessage(response);
    
    if (nextPhase === 'complete') {
      setTimeout(() => {
        completeSession();
      }, 2000);
    }
  };

  const completeSession = () => {
    const summary = userResponses.join('\n\n');
    setSessionSummary(summary);
    
    // Save to journal
    dispatch(saveEntry({
      content: summary,
      prompt: initialPrompt || 'Conversational Journal Session',
      sentiment: 'neutral', // Could be analyzed
      mood: 'reflective',
      sessionType: 'conversational',
      agentName: agentPersonality.name
    }));
    
    dispatch(incrementStat({ stat: 'totalJournalEntries' }));
    
    addAgentMessage("I've saved our conversation to your journal. Thank you for this meaningful exchange. Take care of yourself!");
    
    setTimeout(() => {
      onComplete(summary);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (currentInput.trim()) {
      addUserMessage(currentInput);
      setCurrentInput('');
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-white/50 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiHeart} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{agentPersonality.name}</h3>
            <p className="text-sm text-gray-600">Your journaling companion</p>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'agent' && (
                    <SafeIcon icon={FiHeart} className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isAgentTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiHeart} className="w-4 h-4 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">Sage is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/20 bg-white/50 backdrop-blur-sm rounded-b-xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startListening}
            disabled={isListening}
            className={`p-2 rounded-lg ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiMic} className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!currentInput.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={FiSend} className="w-5 h-5" />
          </motion.button>
        </div>
        
        {isListening && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Listening...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationalAgent;