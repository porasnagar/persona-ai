import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlowingOrb from '../components/GlowingOrb';
import GlassButton from '../components/GlassButton';
import { colors, spacing, typography } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Centered Glowing Orb */}
        <View style={styles.orbContainer}>
          <GlowingOrb size={240} />
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Intelligent</Text>
          <Text style={styles.title}>AI Companion</Text>
          <Text style={styles.subtitle}>
            Experience the future of conversation with your personal AI assistant
          </Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsContainer}>
          <GlassButton
            title="Get Started"
            onPress={() => router.push('/home')}
            variant="primary"
            style={styles.primaryButton}
          />
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => console.log('Sign in pressed')}
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing.xl,
  },
  topSpacer: {
    flex: 0.5,
  },
  orbContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl,
  },
  primaryButton: {
    width: '100%',
  },
  signInButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signInText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});