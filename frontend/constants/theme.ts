export const colors = {
  background: {
    start: '#0a0e27',
    end: '#1a1f3a',
  },
  primary: {
    cyan: '#00d4ff',
    blue: '#0099ff',
    purple: '#6b5cff',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
  },
  ai: {
    message: 'rgba(0, 212, 255, 0.1)',
    glow: '#00d4ff',
  },
  user: {
    message: 'rgba(255, 255, 255, 0.05)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  full: 9999,
};

export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
};