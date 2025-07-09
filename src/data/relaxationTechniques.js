export const relaxationTechniques = {
  mbsr: {
    id: 'mbsr',
    name: 'Mindfulness-Based Stress Reduction (MBSR)',
    category: 'mindfulness',
    duration: [10, 20, 30, 45],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Evidence-based program combining mindfulness meditation and yoga',
    benefits: [
      'Reduces chronic pain by 57%',
      'Decreases anxiety and depression',
      'Improves immune function',
      'Enhances emotional regulation'
    ],
    clinicalEvidence: {
      studies: 200,
      participants: 12000,
      effectSize: 0.68,
      source: 'Journal of Health Psychology, 2019'
    },
    instructions: {
      beginner: {
        audio: 'Focus on your breath. Notice each inhale and exhale without trying to change anything.',
        visual: 'breathing-circle',
        text: 'Sit comfortably and close your eyes. Begin by noticing your natural breath...'
      },
      intermediate: {
        audio: 'Expand your awareness to include body sensations, thoughts, and emotions.',
        visual: 'body-scan',
        text: 'After establishing breath awareness, gently expand your attention...'
      },
      advanced: {
        audio: 'Practice choiceless awareness, observing whatever arises without attachment.',
        visual: 'open-awareness',
        text: 'Rest in open awareness, allowing all experiences to come and go...'
      }
    },
    phases: [
      { name: 'Centering', duration: 2, instruction: 'Find your comfortable position' },
      { name: 'Breath Awareness', duration: 5, instruction: 'Focus on natural breathing' },
      { name: 'Body Scan', duration: 8, instruction: 'Scan from head to toe' },
      { name: 'Open Awareness', duration: 10, instruction: 'Observe without judgment' },
      { name: 'Integration', duration: 5, instruction: 'Prepare to return' }
    ]
  },
  sky: {
    id: 'sky',
    name: 'Sudarshan Kriya Yoga (SKY)',
    category: 'breathwork',
    duration: [15, 25, 35],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Rhythmic breathing technique that harmonizes body, mind, and emotions',
    benefits: [
      'Reduces cortisol levels by 68%',
      'Improves sleep quality',
      'Enhances cognitive function',
      'Boosts natural antioxidants'
    ],
    clinicalEvidence: {
      studies: 42,
      participants: 3500,
      effectSize: 0.73,
      source: 'International Journal of Yoga, 2020'
    },
    instructions: {
      beginner: {
        audio: 'Begin with slow, deep breathing. Inhale for 4 counts, hold for 2.',
        visual: 'wave-breathing',
        text: 'Start with basic three-part breathing to establish rhythm...'
      },
      intermediate: {
        audio: 'Add the medium rhythm. Breathe at 20 breaths per minute.',
        visual: 'rhythmic-waves',
        text: 'Progress to the intermediate rhythm with controlled breathing...'
      },
      advanced: {
        audio: 'Practice the full Sudarshan Kriya with all four rhythms.',
        visual: 'complex-waves',
        text: 'Engage in the complete practice with all rhythmic variations...'
      }
    },
    phases: [
      { name: 'Ujjayi', duration: 5, instruction: 'Slow, deep breathing' },
      { name: 'Bhastrika', duration: 3, instruction: 'Bellows breathing' },
      { name: 'Om Chanting', duration: 2, instruction: 'Three long Oms' },
      { name: 'Sudarshan Kriya', duration: 20, instruction: 'Rhythmic breathing cycles' },
      { name: 'Meditation', duration: 5, instruction: 'Silent rest' }
    ]
  },
  pmr: {
    id: 'pmr',
    name: 'Progressive Muscle Relaxation (PMR)',
    category: 'body',
    duration: [10, 15, 20, 30],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Systematic tensing and relaxing of muscle groups to reduce physical tension',
    benefits: [
      'Reduces muscle tension by 45%',
      'Improves sleep onset time',
      'Lowers blood pressure',
      'Decreases chronic pain'
    ],
    clinicalEvidence: {
      studies: 156,
      participants: 8900,
      effectSize: 0.58,
      source: 'Applied Psychology: Health and Well-Being, 2018'
    },
    instructions: {
      beginner: {
        audio: 'Tense your fists for 5 seconds, then release and feel the relaxation.',
        visual: 'muscle-groups',
        text: 'Start with your hands. Make tight fists, hold, then release...'
      },
      intermediate: {
        audio: 'Work through each muscle group systematically, holding tension for 7 seconds.',
        visual: 'body-progression',
        text: 'Progress through all major muscle groups with increased awareness...'
      },
      advanced: {
        audio: 'Practice differential relaxation while maintaining necessary muscle tone.',
        visual: 'selective-tension',
        text: 'Master selective relaxation while maintaining functional muscle activity...'
      }
    },
    phases: [
      { name: 'Preparation', duration: 2, instruction: 'Get comfortable and centered' },
      { name: 'Hands & Arms', duration: 4, instruction: 'Tense and release upper limbs' },
      { name: 'Face & Neck', duration: 3, instruction: 'Work facial muscles' },
      { name: 'Torso', duration: 5, instruction: 'Chest, shoulders, back' },
      { name: 'Legs & Feet', duration: 4, instruction: 'Lower body tension release' },
      { name: 'Whole Body', duration: 2, instruction: 'Full body awareness' }
    ]
  },
  autogenic: {
    id: 'autogenic',
    name: 'Autogenic Training',
    category: 'mind-body',
    duration: [12, 18, 25],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Self-hypnosis technique using autosuggestion for deep relaxation',
    benefits: [
      'Reduces anxiety by 52%',
      'Improves heart rate variability',
      'Enhances stress resilience',
      'Promotes emotional balance'
    ],
    clinicalEvidence: {
      studies: 89,
      participants: 5600,
      effectSize: 0.62,
      source: 'Clinical Psychology Review, 2019'
    },
    phases: [
      { name: 'Heaviness', duration: 4, instruction: 'My arms and legs are heavy' },
      { name: 'Warmth', duration: 4, instruction: 'My arms and legs are warm' },
      { name: 'Heart', duration: 3, instruction: 'My heartbeat is calm and regular' },
      { name: 'Breathing', duration: 3, instruction: 'My breathing is calm and regular' },
      { name: 'Solar Plexus', duration: 3, instruction: 'My solar plexus is warm' },
      { name: 'Forehead', duration: 3, instruction: 'My forehead is cool' }
    ]
  },
  vipassana: {
    id: 'vipassana',
    name: 'Vipassana Meditation',
    category: 'mindfulness',
    duration: [15, 25, 45, 60],
    difficulty: ['intermediate', 'advanced'],
    description: 'Insight meditation focusing on the impermanent nature of experience',
    benefits: [
      'Increases gray matter density',
      'Improves emotional regulation',
      'Enhances self-awareness',
      'Reduces rumination'
    ],
    clinicalEvidence: {
      studies: 67,
      participants: 4200,
      effectSize: 0.71,
      source: 'Psychological Science, 2020'
    }
  },
  yoga_nidra: {
    id: 'yoga_nidra',
    name: 'Yoga Nidra',
    category: 'meditation',
    duration: [20, 30, 45, 60],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Yogic sleep technique for deep relaxation and consciousness exploration',
    benefits: [
      'Improves sleep quality by 64%',
      'Reduces PTSD symptoms',
      'Enhances creativity',
      'Promotes deep rest'
    ],
    clinicalEvidence: {
      studies: 34,
      participants: 2100,
      effectSize: 0.69,
      source: 'International Journal of Yoga Therapy, 2019'
    }
  },
  box_breathing: {
    id: 'box_breathing',
    name: 'Box Breathing (4-4-4-4)',
    category: 'breathwork',
    duration: [5, 10, 15, 20],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Square breathing pattern for nervous system regulation',
    benefits: [
      'Activates parasympathetic nervous system',
      'Reduces stress hormones',
      'Improves focus',
      'Enhances emotional control'
    ],
    clinicalEvidence: {
      studies: 28,
      participants: 1800,
      effectSize: 0.54,
      source: 'Frontiers in Psychology, 2020'
    }
  },
  wim_hof: {
    id: 'wim_hof',
    name: 'Wim Hof Method',
    category: 'breathwork',
    duration: [10, 15, 20],
    difficulty: ['intermediate', 'advanced'],
    description: 'Breathing technique combined with cold exposure for resilience',
    benefits: [
      'Boosts immune system',
      'Increases stress tolerance',
      'Improves circulation',
      'Enhances mental clarity'
    ],
    clinicalEvidence: {
      studies: 15,
      participants: 900,
      effectSize: 0.76,
      source: 'PNAS, 2018'
    }
  },
  coherent_breathing: {
    id: 'coherent_breathing',
    name: 'Coherent Breathing (5-5)',
    category: 'breathwork',
    duration: [8, 12, 16, 20],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Balanced breathing for heart rate variability optimization',
    benefits: [
      'Optimizes heart rate variability',
      'Balances autonomic nervous system',
      'Reduces anxiety',
      'Improves emotional balance'
    ],
    clinicalEvidence: {
      studies: 45,
      participants: 2800,
      effectSize: 0.61,
      source: 'Applied Psychophysiology and Biofeedback, 2019'
    }
  },
  loving_kindness: {
    id: 'loving_kindness',
    name: 'Loving-Kindness Meditation',
    category: 'compassion',
    duration: [10, 15, 20, 30],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Cultivation of compassion and loving-kindness towards self and others',
    benefits: [
      'Increases positive emotions',
      'Reduces implicit bias',
      'Enhances social connection',
      'Improves self-compassion'
    ],
    clinicalEvidence: {
      studies: 52,
      participants: 3400,
      effectSize: 0.65,
      source: 'Clinical Psychological Science, 2018'
    }
  },
  body_scan: {
    id: 'body_scan',
    name: 'Body Scan Meditation',
    category: 'mindfulness',
    duration: [10, 15, 20, 30, 45],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Systematic awareness of body sensations for mindful embodiment',
    benefits: [
      'Increases body awareness',
      'Reduces chronic pain',
      'Improves sleep quality',
      'Enhances present-moment awareness'
    ],
    clinicalEvidence: {
      studies: 78,
      participants: 4900,
      effectSize: 0.59,
      source: 'Pain Medicine, 2019'
    }
  },
  alternate_nostril: {
    id: 'alternate_nostril',
    name: 'Alternate Nostril Breathing',
    category: 'breathwork',
    duration: [8, 12, 16, 20],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Pranayama technique for balancing the nervous system',
    benefits: [
      'Balances brain hemispheres',
      'Reduces stress and anxiety',
      'Improves concentration',
      'Enhances respiratory function'
    ],
    clinicalEvidence: {
      studies: 23,
      participants: 1400,
      effectSize: 0.57,
      source: 'Journal of Alternative Medicine, 2020'
    }
  },
  zen_meditation: {
    id: 'zen_meditation',
    name: 'Zen Meditation (Zazen)',
    category: 'meditation',
    duration: [15, 25, 40, 60],
    difficulty: ['intermediate', 'advanced'],
    description: 'Seated meditation focusing on posture and breath awareness',
    benefits: [
      'Develops sustained attention',
      'Reduces mental reactivity',
      'Cultivates equanimity',
      'Enhances present-moment awareness'
    ],
    clinicalEvidence: {
      studies: 41,
      participants: 2600,
      effectSize: 0.63,
      source: 'Mindfulness, 2019'
    }
  },
  mantra_meditation: {
    id: 'mantra_meditation',
    name: 'Mantra Meditation',
    category: 'meditation',
    duration: [10, 15, 20, 30],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Repetition of sacred sounds for focused concentration',
    benefits: [
      'Calms mental chatter',
      'Improves concentration',
      'Reduces anxiety',
      'Enhances spiritual connection'
    ],
    clinicalEvidence: {
      studies: 36,
      participants: 2200,
      effectSize: 0.56,
      source: 'International Journal of Behavioral Medicine, 2018'
    }
  },
  visualization: {
    id: 'visualization',
    name: 'Guided Visualization',
    category: 'imagery',
    duration: [10, 15, 20, 25],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Mental imagery for relaxation and positive psychological states',
    benefits: [
      'Reduces stress and anxiety',
      'Improves performance',
      'Enhances healing',
      'Promotes positive emotions'
    ],
    clinicalEvidence: {
      studies: 64,
      participants: 3800,
      effectSize: 0.52,
      source: 'Journal of Mental Imagery, 2019'
    }
  },
  forest_bathing: {
    id: 'forest_bathing',
    name: 'Forest Bathing (Shinrin-yoku)',
    category: 'nature',
    duration: [15, 20, 30, 45],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Mindful immersion in nature for stress reduction and well-being',
    benefits: [
      'Boosts immune system',
      'Reduces cortisol levels',
      'Improves mood',
      'Enhances creativity'
    ],
    clinicalEvidence: {
      studies: 19,
      participants: 1200,
      effectSize: 0.68,
      source: 'Environmental Research, 2020'
    }
  },
  sound_meditation: {
    id: 'sound_meditation',
    name: 'Sound Bath Meditation',
    category: 'sound',
    duration: [15, 20, 30, 45],
    difficulty: ['beginner', 'intermediate', 'advanced'],
    description: 'Immersion in healing sounds and vibrations for deep relaxation',
    benefits: [
      'Reduces stress and tension',
      'Improves sleep quality',
      'Enhances focus',
      'Promotes emotional release'
    ],
    clinicalEvidence: {
      studies: 12,
      participants: 800,
      effectSize: 0.61,
      source: 'Journal of Music Therapy, 2019'
    }
  }
};

export const categories = {
  mindfulness: { name: 'Mindfulness', color: 'purple', icon: 'FiMind' },
  breathwork: { name: 'Breathwork', color: 'blue', icon: 'FiWind' },
  body: { name: 'Body-Based', color: 'green', icon: 'FiActivity' },
  meditation: { name: 'Meditation', color: 'indigo', icon: 'FiCircle' },
  compassion: { name: 'Compassion', color: 'pink', icon: 'FiHeart' },
  imagery: { name: 'Imagery', color: 'orange', icon: 'FiEye' },
  nature: { name: 'Nature', color: 'emerald', icon: 'FiLeaf' },
  sound: { name: 'Sound', color: 'cyan', icon: 'FiMusic' },
  'mind-body': { name: 'Mind-Body', color: 'violet', icon: 'FiBrain' }
};