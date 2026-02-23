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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ChatBubble from '../components/ChatBubble';
import GlassInput from '../components/GlassInput';
import ChatHistorySidebar from '../components/ChatHistorySidebar';
import { colors, spacing, typography } from '../constants/theme';
import { useChatStore } from '../store/chatStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  is_introduction?: boolean;
}

const BACKEND_URL = 'https://persona-ai-yev2.onrender.com';

const PERSONA_INFO: Record<string, { name: string; icon: string }> = {
  MENTOR: { name: 'Mentor', icon: '🧙' },
  TEACHER: { name: 'Teacher', icon: '📚' },
  MOTIVATOR: { name: 'Motivator', icon: '⚡' },
  LISTENER: { name: 'Listener', icon: '💙' },
  PHILOSOPHER: { name: 'Philosopher', icon: '🌟' },
  YOGA: { name: 'Yoga Guide', icon: '🧘' },
  CUSTOM: { name: 'Custom', icon: '✨' },
};

export default function ChatScreen() {
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const { 
    selectedPersona, 
    customPrompt, 
    isVoiceEnabled, 
    toggleVoice,
    conversations,
    saveConversation,
    activeConversationId,
    setActiveConversation,
    deleteConversation,
    loadConversations,
  } = useChatStore();

  const personaInfo = PERSONA_INFO[selectedPersona] || PERSONA_INFO.MENTOR;

  useEffect(() => {
    loadConversations();
    initializeChat();
  }, []);

  useEffect(() => {
    if (isVoiceEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !lastMessage.is_introduction) {
        Speech.speak(lastMessage.content, {
          language: 'en',
          pitch: 1.0,
          rate: 0.9,
        });
      }
    }
  }, [messages, isVoiceEnabled]);

  const initializeChat = async () => {
    if (activeConversationId) {
      const existingConv = conversations.find(c => c.id === activeConversationId);
      if (existingConv) {
        setMessages(existingConv.messages);
        setConversationId(existingConv.id);
        return;
      }
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/chat/new?persona=${selectedPersona}${
          selectedPersona === 'CUSTOM' && customPrompt ? `&custom_prompt=${encodeURIComponent(customPrompt)}` : ''
        }`
      );
      
      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversation_id);
        setActiveConversation(data.conversation_id);
        
        const introMessage: Message = {
          id: '1',
          role: 'assistant',
          content: data.introduction,
          timestamp: new Date().toISOString(),
          is_introduction: true,
        };
        setMessages([introMessage]);
        
        saveConversation({
          id: data.conversation_id,
          persona: selectedPersona,
          messages: [introMessage],
          customPrompt: customPrompt || undefined,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      const fallbackIntro: Message = {
        id: '1',
        role: 'assistant',
        content: `I'm your ${personaInfo.name}. How can I help you today?`,
        timestamp: new Date().toISOString(),
        is_introduction: true,
      };
      setMessages([fallbackIntro]);
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

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
          persona: selectedPersona,
          custom_prompt: selectedPersona === 'CUSTOM' ? customPrompt : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      if (!conversationId) {
        setConversationId(data.conversation_id);
        setActiveConversation(data.conversation_id);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      const updatedMessages = [...messages, userMessage, aiMessage];
      saveConversation({
        id: conversationId || data.conversation_id,
        persona: selectedPersona,
        messages: updatedMessages,
        customPrompt: customPrompt || undefined,
        lastUpdated: new Date().toISOString(),
      });

      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Unable to get AI response. Check connection.');
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setConversationId(conv.id);
      setActiveConversation(conv.id);
      setMessages(conv.messages);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setActiveConversation(null);
    router.push('/home');
  };

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.mid, colors.background.end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content} edges={['top']}>
        <View style={styles.mainContainer}>
          {/* Sidebar */}
          {showSidebar && (
            <ChatHistorySidebar
              conversations={conversations.map(c => ({
                id: c.id,
                persona: c.persona,
                lastMessage: c.messages[c.messages.length - 1]?.content || '',
                lastUpdated: c.lastUpdated,
              }))}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              onDeleteConversation={deleteConversation}
            />
          )}

          {/* Chat Area */}
          <View style={styles.chatArea}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setShowSidebar(!showSidebar)}
                activeOpacity={0.7}
              >
                <Ionicons name=\"menu\" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerIcon}>{personaInfo.icon}</Text>
                <View>
                  <Text style={styles.headerTitle}>{personaInfo.name}</Text>
                  <Text style={styles.headerSubtitle}>AI Companion</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.voiceButton}
                onPress={() => {
                  toggleVoice();
                  Alert.alert('Voice', isVoiceEnabled ? 'Disabled' : 'Enabled');
                }}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={isVoiceEnabled ? \"volume-high\" : \"volume-mute\"} 
                  size={22} 
                  color={isVoiceEnabled ? colors.primary.purple : colors.text.tertiary} 
                />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
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
                    onCopy={() => Alert.alert('Copied')}
                    onLike={() => {}}
                  />
                ))}
                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingBubble}>
                      <ActivityIndicator size=\"small\" color={colors.primary.purple} />
                      <Text style={styles.loadingText}>Thinking...</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.inputContainer}>
                <GlassInput
                  placeholder=\"Share your thoughts...\"
                  value={input}
                  onChangeText={setInput}
                  onSend={handleSend}
                  showMic
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

  const initializeChat = async () => {
    try {
      // Check if we have an active conversation in store
      if (activeConversationId) {
        const existingConv = conversations.find(c => c.id === activeConversationId);
        if (existingConv) {
          setMessages(existingConv.messages);
          setConversationId(existingConv.id);
          return;
        }
      }

      // Create new conversation
      const response = await fetch(
        `${BACKEND_URL}/api/chat/new?persona=${selectedPersona}${
          selectedPersona === 'CUSTOM' && customPrompt ? `&custom_prompt=${encodeURIComponent(customPrompt)}` : ''
        }`
      );
      
      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversation_id);
        setActiveConversation(data.conversation_id);
        
        const introMessage: Message = {
          id: '1',
          role: 'assistant',
          content: data.introduction,
          timestamp: new Date().toISOString(),
          is_introduction: true,
        };
        setMessages([introMessage]);
        
        // Save to local store
        saveConversation({
          id: data.conversation_id,
          persona: selectedPersona,
          messages: [introMessage],
          customPrompt: customPrompt || undefined,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      const fallbackIntro: Message = {
        id: '1',
        role: 'assistant',
        content: `I'm your ${personaInfo.name}. How can I help you today?`,
        timestamp: new Date().toISOString(),
        is_introduction: true,
      };
      setMessages([fallbackIntro]);
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

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
          persona: selectedPersona,
          custom_prompt: selectedPersona === 'CUSTOM' ? customPrompt : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (!conversationId) {
        setConversationId(data.conversation_id);
        setActiveConversation(data.conversation_id);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Save to store
      const updatedMessages = [...messages, userMessage, aiMessage];
      saveConversation({
        id: conversationId || data.conversation_id,
        persona: selectedPersona,
        messages: updatedMessages,
        customPrompt: customPrompt || undefined,
        lastUpdated: new Date().toISOString(),
      });

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Unable to get AI response. Please check your connection.');
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const handleVoiceToggle = () => {
    toggleVoice();
    Alert.alert(
      'Voice Response',
      isVoiceEnabled ? 'Voice responses disabled' : 'Voice responses enabled'
    );
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
            <Text style={styles.headerIcon}>{personaInfo.icon}</Text>
            <View>
              <Text style={styles.headerTitle}>{personaInfo.name}</Text>
              <Text style={styles.headerSubtitle}>AI Companion</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handleVoiceToggle}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isVoiceEnabled ? "volume-high" : "volume-mute"} 
              size={22} 
              color={isVoiceEnabled ? colors.primary.purple : colors.text.tertiary} 
            />
          </TouchableOpacity>
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
                onLike={() => console.log('Liked')}
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
    gap: spacing.sm,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  headerSubtitle: {
    ...typography.small,
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 2,
  },
  voiceButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.xl,
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
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
});