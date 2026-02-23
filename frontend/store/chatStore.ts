import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  is_introduction?: boolean;
}

interface Conversation {
  id: string;
  persona: string;
  messages: Message[];
  customPrompt?: string;
  lastUpdated: string;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedPersona: string;
  customPrompt: string;
  isVoiceEnabled: boolean;
  
  // Actions
  loadConversations: () => Promise<void>;
  saveConversation: (conversation: Conversation) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
  setSelectedPersona: (persona: string) => void;
  setCustomPrompt: (prompt: string) => void;
  toggleVoice: () => void;
  addMessage: (conversationId: string, message: Message) => void;
  createNewConversation: (persona: string, customPrompt?: string) => Conversation;
  deleteConversation: (id: string) => Promise<void>;
}

const STORAGE_KEY = '@calm_ai_conversations';

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  selectedPersona: 'MENTOR',
  customPrompt: '',
  isVoiceEnabled: false,

  loadConversations: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const conversations = JSON.parse(stored);
        set({ conversations });
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  },

  saveConversation: async (conversation: Conversation) => {
    try {
      const { conversations } = get();
      const index = conversations.findIndex(c => c.id === conversation.id);
      
      let updated;
      if (index >= 0) {
        updated = [...conversations];
        updated[index] = conversation;
      } else {
        updated = [conversation, ...conversations];
      }
      
      // Keep only last 50 conversations
      if (updated.length > 50) {
        updated = updated.slice(0, 50);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ conversations: updated });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setSelectedPersona: (persona) => set({ selectedPersona: persona }),

  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),

  toggleVoice: () => set((state) => ({ isVoiceEnabled: !state.isVoiceEnabled })),

  addMessage: (conversationId, message) => {
    const { conversations, saveConversation } = get();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      const updated = {
        ...conversation,
        messages: [...conversation.messages, message],
        lastUpdated: new Date().toISOString()
      };
      saveConversation(updated);
    }
  },

  createNewConversation: (persona, customPrompt) => {
    const newConv: Conversation = {
      id: `local_${Date.now()}`,
      persona,
      messages: [],
      customPrompt,
      lastUpdated: new Date().toISOString()
    };
    return newConv;
  },

  deleteConversation: async (id) => {
    try {
      const { conversations } = get();
      const updated = conversations.filter(c => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ conversations: updated });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  },
}));