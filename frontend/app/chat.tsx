import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ChatBubble from '../components/ChatBubble';
import GlassInput from '../components/GlassInput';
import { colors, spacing, typography } from '../constants/theme';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I\'m your AI assistant. How can I help you today?',
    isAI: true,
  },
  {
    id: '2',
    text: 'Can you tell me about the latest AI trends?',
    isAI: false,
  },
  {
    id: '3',
    text: 'Of course! The latest AI trends include advancements in large language models, generative AI for creative content, and improved natural language understanding. These technologies are transforming industries from healthcare to entertainment.',
    isAI: true,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        isAI: false,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I understand your question. This is a UI demo, so I\'m showing a mock response. In a production app, this would connect to a real AI service.',
          isAI: true,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);

      setInput('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.end]}
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
            <View style={styles.headerAvatar} />
            <Text style={styles.headerTitle}>AI Assistant</Text>
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
                message={message.text}
                isAI={message.isAI}
                showActions={message.isAI && index === messages.length - 1}
              />
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <GlassInput
              placeholder="Type a message..."
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