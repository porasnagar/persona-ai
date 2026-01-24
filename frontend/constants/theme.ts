export const colors = {
  background: {
    start: '#070b1f',
    mid: '#0d1228',
    end: '#151a35',
  },
  primary: {
    cyan: '#5eb3e0',
    blue: '#4a9fd8',
    purple: '#7a8fe8',
    glow: '#4db8ff',
  },
  glass: {
    ultraLight: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.15)',
    borderSoft: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.75)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
    placeholder: 'rgba(255, 255, 255, 0.35)',
  },
  ai: {
    message: 'rgba(78, 159, 216, 0.08)',
    glow: '#5eb3e0',
    glowSoft: 'rgba(94, 179, 224, 0.3)',
  },
  user: {
    message: 'rgba(255, 255, 255, 0.04)',
  },
};

export const spacing = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 40,
  xxl: 56,
  xxxl: 72,
};

export const borderRadius = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  full: 9999,
};

export const typography = {
  hero: {
    fontSize: 36,
    fontWeight: '600' as const,
    letterSpacing: -0.8,
    lineHeight: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 19,
    fontWeight: '400' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  caption: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
};

export const blur = {
  light: 10,
  medium: 20,
  heavy: 40,
  ultra: 60,
};