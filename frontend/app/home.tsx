import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlowingOrb from '../components/GlowingOrb';
import GlassInput from '../components/GlassInput';
import TopicChip from '../components/TopicChip';
import { colors, spacing, typography } from '../constants/theme';

const topics = ['Calm', 'Reflect', 'Focus', 'Gratitude'];

export default function HomeScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      router.push('/chat');
    }
  };

  const handleTopicPress = (topic: string) => {
    setInput(topic);
    setTimeout(() => router.push('/chat'), 200);
  };

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.mid, colors.background.end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Large Glowing Orb */}
            <View style={styles.orbContainer}>
              <GlowingOrb size={300} />
            </View>

            {/* Prompt Text */}
            <View style={styles.promptContainer}>
              <Text style={styles.promptText}>I'm here.</Text>
              <Text style={styles.promptText}>Take a breath.</Text>
              <Text style={styles.promptSubtext}>or choose a path below</Text>
            </View>

            {/* Topic Chips */}
            <View style={styles.topicsContainer}>
              {topics.map((topic) => (
                <TopicChip
                  key={topic}
                  title={topic}
                  onPress={() => handleTopicPress(topic)}
                />
              ))}
            </View>
          </ScrollView>

          {/* Bottom Input Bar */}
          <View style={styles.inputContainer}>
            <GlassInput
              placeholder="Share what's on your mind..."
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
  },
  orbContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  promptContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  promptText: {
    ...typography.title,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  promptSubtext: {
    ...typography.caption,
    color: colors.text.placeholder,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  inputContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
});