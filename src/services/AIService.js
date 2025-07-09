// AI Service with resilient fallback system
class AIService {
  constructor() {
    this.kyutaiApiKey = process.env.REACT_APP_KYUTAI_API_KEY;
    this.openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.isOnline = navigator.onLine;
    
    // Initialize cached responses
    this.cachedResponses = this.loadCachedResponses();
    this.fallbackResponses = this.initializeFallbackResponses();
    
    // Listen for online/offline events
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  }

  async getAIResponse(prompt, type = 'meditation') {
    try {
      // Primary: Kyutai API
      if (this.isOnline && this.kyutaiApiKey) {
        const response = await this.callKyutaiAPI(prompt, type);
        if (response) {
          this.cacheResponse(prompt, response, type);
          return response;
        }
      }

      // Fallback 1: OpenAI API
      if (this.isOnline && this.openAiApiKey) {
        const response = await this.callOpenAI(prompt, type);
        if (response) {
          this.cacheResponse(prompt, response, type);
          return response;
        }
      }

      // Fallback 2: Cached responses
      const cachedResponse = this.getCachedResponse(prompt, type);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fallback 3: Local pre-generated responses
      return this.getFallbackResponse(type);

    } catch (error) {
      console.error('AI Service error:', error);
      return this.getFallbackResponse(type);
    }
  }

  async callKyutaiAPI(prompt, type) {
    try {
      const response = await fetch('https://api.kyutai.org/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.kyutaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'kyutai-chat',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(type),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('Kyutai API failed');

      const data = await response.json();
      return data.choices[0]?.message?.content;
    } catch (error) {
      console.error('Kyutai API error:', error);
      return null;
    }
  }

  async callOpenAI(prompt, type) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(type),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('OpenAI API failed');

      const data = await response.json();
      return data.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  getSystemPrompt(type) {
    const prompts = {
      meditation: `You are a compassionate meditation guide. Provide gentle, supportive guidance for meditation practices. Keep responses warm, empathetic, and under 150 words.`,
      journal: `You are a supportive journaling companion. Provide thoughtful prompts and gentle insights for self-reflection. Be empathetic and encouraging.`,
      breathwork: `You are a breathwork instructor. Provide clear, calming guidance for breathing exercises. Focus on safety and relaxation.`,
      walk: `You are a mindful walking guide. Provide gentle cues for mindful movement and nature connection. Keep guidance peaceful and grounding.`,
    };
    return prompts[type] || prompts.meditation;
  }

  getCachedResponse(prompt, type) {
    const key = `${type}_${this.hashString(prompt)}`;
    return this.cachedResponses[key];
  }

  cacheResponse(prompt, response, type) {
    const key = `${type}_${this.hashString(prompt)}`;
    this.cachedResponses[key] = response;
    localStorage.setItem('calma_ai_cache', JSON.stringify(this.cachedResponses));
  }

  loadCachedResponses() {
    try {
      const cached = localStorage.getItem('calma_ai_cache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }

  getFallbackResponse(type) {
    const responses = this.fallbackResponses[type] || this.fallbackResponses.meditation;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  initializeFallbackResponses() {
    return {
      meditation: [
        "Take a moment to breathe deeply. Let your shoulders relax and your mind settle into this peaceful space.",
        "Focus on your breath as it flows naturally. Each inhale brings calm, each exhale releases tension.",
        "You are exactly where you need to be in this moment. Allow yourself to simply be present.",
        "Notice any thoughts that arise without judgment. Let them pass like clouds in the sky.",
        "Feel your body supported and safe. This is your time to rest and restore.",
      ],
      journal: [
        "What are you grateful for in this moment? Even small things can bring joy.",
        "How has your day shaped you? What did you learn about yourself?",
        "What emotions are you carrying right now? It's okay to feel whatever comes up.",
        "If you could tell your past self one thing, what would it be?",
        "What would make tomorrow feel a little brighter for you?",
      ],
      breathwork: [
        "Begin by finding a comfortable position. Let your breathing be natural and easy.",
        "Focus on lengthening your exhale. This activates your body's relaxation response.",
        "Breathe in calm, breathe out tension. You're doing beautifully.",
        "Notice how your body feels with each breath. There's no right or wrong way.",
        "Your breath is always available to bring you back to the present moment.",
      ],
      walk: [
        "Feel your feet connecting with the earth beneath you. Each step is grounding.",
        "Notice the rhythm of your movement. Let it become a walking meditation.",
        "Take in the sights, sounds, and sensations around you with fresh awareness.",
        "Your body knows how to move naturally. Trust in its wisdom.",
        "Walking is a form of meditation in motion. Enjoy this peaceful journey.",
      ],
    };
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Sentiment analysis for journal entries
  analyzeSentiment(text) {
    const positiveWords = [
      'good', 'great', 'happy', 'joy', 'love', 'grateful', 'peace', 'calm',
      'wonderful', 'amazing', 'beautiful', 'blessed', 'content', 'hopeful'
    ];
    
    const negativeWords = [
      'bad', 'sad', 'angry', 'hate', 'stress', 'worry', 'fear', 'anxious',
      'depressed', 'overwhelmed', 'frustrated', 'tired', 'difficult', 'painful'
    ];

    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Generate personalized meditation recommendation
  generateMeditationRecommendation(userState) {
    const { stressLevel, sleepQuality, recentEntries } = userState;
    
    if (stressLevel > 7) {
      return {
        type: 'stress',
        duration: 15,
        message: "I sense you're feeling overwhelmed. Let's focus on releasing tension and finding your center.",
      };
    }
    
    if (sleepQuality < 5) {
      return {
        type: 'sleep',
        duration: 20,
        message: "Your rest seems disrupted. A longer, deeper meditation might help prepare you for better sleep.",
      };
    }
    
    return {
      type: 'balance',
      duration: 10,
      message: "A balanced meditation to help you maintain your center and clarity.",
    };
  }
}

export default new AIService();