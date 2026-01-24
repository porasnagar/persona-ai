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
import { colors, spacing, typography } from '../constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

  // Initial AI greeting
  useEffect(() => {
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content: 'Hello. I\'m here to listen and support you. What\'s on your mind today?',
      timestamp: new Date().toISOString(),
    };
    setMessages([greeting]);
  }, []);

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
    // In a real app, you'd use Clipboard API here
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
            <Text style={styles.headerTitle}>Calm Companion</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

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
                  <ActivityIndicator size="small" color={colors.primary.cyan} />
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
    borderBottomColor: colors.glass.border,
  },
  backButton: {
    width: 40,
    height: 40,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.cyan,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
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
  inputContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
});