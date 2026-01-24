import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface TopicChipProps {
  title: string;
  onPress: () => void;
}

export default function TopicChip({ title, onPress }: TopicChipProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});