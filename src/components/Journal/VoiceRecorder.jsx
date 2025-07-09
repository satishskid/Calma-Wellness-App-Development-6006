import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMic, FiMicOff, FiPlay, FiPause, FiTrash2, FiCheck, FiVolume2 } = FiIcons;

const VoiceRecorder = ({ onTranscription, onSave, isActive, setIsActive }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript + interimTranscript;
        setTranscription(fullTranscript);
        onTranscription(fullTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
      };

      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
      };
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onTranscription]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio level monitoring
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Start audio level monitoring
      const monitorAudioLevel = () => {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
        setAudioLevel(average / 255);
        
        if (isRecording) {
          animationRef.current = requestAnimationFrame(monitorAudioLevel);
        }
      };
      monitorAudioLevel();

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsActive(true);
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsTranscribing(true);
      }

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setTranscription('');
    setRecordingTime(0);
    setIsActive(false);
    onTranscription('');
  };

  const saveRecording = () => {
    if (transcription.trim()) {
      onSave(transcription, audioBlob);
      setTranscription('');
      setAudioBlob(null);
      setRecordingTime(0);
      setIsActive(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Recording Interface */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="relative"
            animate={{
              scale: isRecording ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isRecording ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <SafeIcon 
                icon={isRecording ? FiMicOff : FiMic} 
                className="w-8 h-8 text-white" 
              />
            </motion.button>
            
            {/* Audio level visualization */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-300"
                animate={{
                  scale: 1 + (audioLevel * 0.5),
                  opacity: 0.3 + (audioLevel * 0.7)
                }}
                transition={{ duration: 0.1 }}
              />
            )}
          </motion.div>
        </div>

        {/* Recording Status */}
        <div className="text-center space-y-2">
          {isRecording ? (
            <div>
              <div className="text-lg font-semibold text-red-600">Recording...</div>
              <div className="text-sm text-gray-600">{formatTime(recordingTime)}</div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Listening and transcribing</span>
              </div>
            </div>
          ) : audioBlob ? (
            <div>
              <div className="text-lg font-semibold text-green-600">Recording Complete</div>
              <div className="text-sm text-gray-600">{formatTime(recordingTime)}</div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-semibold text-gray-700">Ready to Record</div>
              <div className="text-sm text-gray-500">Tap the microphone to start</div>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        {audioBlob && (
          <div className="flex items-center justify-center space-x-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isPlaying ? pauseAudio : playAudio}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-5 h-5 text-gray-700" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={deleteRecording}
              className="p-3 bg-red-100 rounded-full hover:bg-red-200"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5 text-red-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={saveRecording}
              disabled={!transcription.trim()}
              className="p-3 bg-green-100 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
            </motion.button>
          </div>
        )}

        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>

      {/* Live Transcription */}
      <AnimatePresence>
        {(transcription || isTranscribing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 rounded-xl p-4 border border-blue-200"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiVolume2} className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Live Transcription</span>
              {isTranscribing && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
            <div className="text-gray-700 leading-relaxed">
              {transcription || (isTranscribing ? 'Listening...' : '')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceRecorder;