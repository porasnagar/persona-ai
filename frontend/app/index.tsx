import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlowingOrb from '../components/GlowingOrb';
import GlassButton from '../components/GlassButton';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.mid, colors.background.end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Centered Glowing Orb */}
        <View style={styles.orbContainer}>
          <GlowingOrb size={260} />
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Calm AI</Text>
          <Text style={styles.title}>Companion</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsContainer}>
          <GlassButton
            title="Continue as Guest"
            onPress={() => router.push('/home')}
            variant="primary"
            style={styles.primaryButton}
          />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => console.log('Sign in pressed')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
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
    flex: 0.3,
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
    marginTop: spacing.lg,
    lineHeight: 26,
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    backgroundColor: colors.glass.ultraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});