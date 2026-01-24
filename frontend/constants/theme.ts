export const colors = {
  background: {
    start: '#0a0014',
    mid: '#1a0f2e',
    end: '#0f0520',
  },
  primary: {
    purple: '#a855f7',
    violet: '#8b5cf6',
    pink: '#c084fc',
    glow: '#a855f7',
  },
  glass: {
    ultraLight: 'rgba(168, 85, 247, 0.05)',
    light: 'rgba(168, 85, 247, 0.08)',
    medium: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.2)',
    borderSoft: 'rgba(168, 85, 247, 0.15)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.55)',
    placeholder: 'rgba(255, 255, 255, 0.4)',
  },
  ai: {
    message: 'rgba(168, 85, 247, 0.08)',
    glow: '#a855f7',
    glowSoft: 'rgba(168, 85, 247, 0.3)',
  },
  user: {
    message: 'rgba(255, 255, 255, 0.06)',
  },
  accent: {
    purple: '#9333ea',
    violet: '#7c3aed',
    fuchsia: '#d946ef',
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