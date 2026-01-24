import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import ChatBubble from '../components/ChatBubble';
import GlassInput from '../components/GlassInput';
import PersonaToggle from '../components/PersonaToggle';
import { colors, spacing, typography } from '../constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  is_introduction?: boolean;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  introduction: string;
}

const PERSONAS: Persona[] = [
  { id: 'AURA', name: 'AURA', description: 'Emotional Well-being', introduction: '' },
  { id: 'SERENE', name: 'SERENE', description: 'Mindfulness & Calm', introduction: '' },
  { id: 'NOVA', name: 'NOVA', description: 'Motivation & Growth', introduction: '' },
  { id: 'REFLECT', name: 'REFLECT', description: 'Self-Reflection', introduction: '' },
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState('AURA');
  const [showPersonaToggle, setShowPersonaToggle] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const BACKEND_URL = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

  // Initialize new conversation with selected persona
  useEffect(() => {
    initializeConversation(activePersona);
  }, []);

  const initializeConversation = async (persona: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/new?persona=${persona}`);
      const data = await response.json();
      
      setConversationId(data.conversation_id);
      
      // Add introduction message
      const introMessage: Message = {
        id: '1',
        role: 'assistant',
        content: data.introduction,
        timestamp: new Date().toISOString(),
        is_introduction: true,
      };
      setMessages([introMessage]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      // Fallback introduction
      const introMessage: Message = {
        id: '1',
        role: 'assistant',
        content: `I'm ${persona}. How can I support you today?`,
        timestamp: new Date().toISOString(),
        is_introduction: true,
      };
      setMessages([introMessage]);
    }
  };

  const handlePersonaChange = (newPersona: string) => {
    if (newPersona === activePersona) return;

    // If there are messages beyond introduction, confirm persona change
    const hasConversation = messages.filter(m => !m.is_introduction && m.role === 'user').length > 0;
    
    if (hasConversation) {
      Alert.alert(
        'Switch Persona',
        'Changing personas will start a new conversation. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start New Chat',
            onPress: () => {
              setActivePersona(newPersona);
              setMessages([]);
              setConversationId(null);
              initializeConversation(newPersona);
            },
          },
        ]
      );
    } else {
      setActivePersona(newPersona);
      setMessages([]);
      setConversationId(null);
      initializeConversation(newPersona);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowPersonaToggle(false); // Hide toggle once conversation starts

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
          persona: activePersona,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();

      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Unable to connect to AI service. ';
      
      if (error instanceof Error) {
        if (error.message.includes('not configured')) {
          errorMessage = 'AI service is not configured yet. Please add your GROQ_API_KEY to the backend environment variables.';
        } else {
          errorMessage += error.message;
        }
      }

      Alert.alert(
        'Connection Error',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );

      // Remove the user message if API call failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    console.log('Copied:', text);
  };

  const handleLike = () => {
    console.log('Liked');
  };

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.mid, colors.background.end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <View style={styles.headerAvatarInner} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Calm Companion</Text>
              <Text style={styles.headerSubtitle}>{activePersona}</Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Persona Toggle - Shows only at conversation start */}
        {showPersonaToggle && (
          <View style={styles.personaContainer}>
            <PersonaToggle
              personas={PERSONAS}
              activePersona={activePersona}
              onPersonaChange={handlePersonaChange}
            />
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <ChatBubble
                key={message.id}
                message={message.content}
                isAI={message.role === 'assistant'}
                showActions={message.role === 'assistant' && index === messages.length - 1 && !isLoading}
                onCopy={() => handleCopy(message.content)}
                onLike={handleLike}
              />
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color={colors.primary.purple} />
                  <Text style={styles.loadingText}>Thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <GlassInput
              placeholder="Share your thoughts..."
              value={input}
              onChangeText={setInput}
              onSend={handleSend}
              showMic
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.ai.glowSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  headerAvatarInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.purple,
    opacity: 0.9,
  },
  headerTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  headerSubtitle: {
    ...typography.small,
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  personaContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    paddingRight: spacing.xl,
    marginBottom: spacing.lg,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ai.message,
    borderRadius: 20,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    marginLeft: 48,
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  inputContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
});
