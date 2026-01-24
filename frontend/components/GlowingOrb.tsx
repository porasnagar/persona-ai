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

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer glow rings */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: size * 0.8,
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.1],
              outputRange: [0.2, 0.1],
            }),
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 0.65,
            opacity: 0.3,
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
          colors={[colors.primary.cyan, colors.primary.blue, colors.primary.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: size / 2 }]}
        >
          {/* Inner highlight */}
          <View
            style={[
              styles.highlight,
              {
                width: size * 0.4,
                height: size * 0.4,
                borderRadius: size * 0.2,
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
    backgroundColor: colors.primary.cyan,
    opacity: 0.2,
  },
  orb: {
    shadowColor: colors.primary.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  highlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    top: '20%',
    left: '30%',
  },
});