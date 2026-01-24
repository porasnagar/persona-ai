import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/theme';

interface GlowingOrbProps {
  size?: number;
}

export default function GlowingOrb({ size = 200 }: GlowingOrbProps) {
  const floatAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);
  const glowAnim = new Animated.Value(0.6);

  useEffect(() => {
    // Slower, calmer floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Soft glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer glow rings - multiple layers for depth */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            opacity: glowAnim.interpolate({
              inputRange: [0.6, 1],
              outputRange: [0.08, 0.04],
            }),
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            opacity: 0.15,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.6,
            opacity: 0.2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Main orb */}
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ translateY }, { scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary.purple, colors.primary.violet, colors.accent.fuchsia]}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
          style={[styles.gradient, { borderRadius: size / 2 }]}
        >
          {/* Inner highlight */}
          <View
            style={[
              styles.highlight,
              {
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: size * 0.175,
              },
            ]}
          />
          {/* Secondary highlight */}
          <View
            style={[
              styles.secondaryHighlight,
              {
                width: size * 0.2,
                height: size * 0.2,
                borderRadius: size * 0.1,
              },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: colors.primary.glow,
  },
  orb: {
    shadowColor: colors.primary.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 15,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.85,
  },
  highlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    position: 'absolute',
    top: '18%',
    left: '28%',
  },
  secondaryHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    position: 'absolute',
    top: '25%',
    left: '45%',
  },
});