import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface GlassInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSend?: () => void;
  showMic?: boolean;
  style?: ViewStyle;
}

export default function GlassInput({
  placeholder,
  value,
  onChangeText,
  onSend,
  showMic = false,
  style,
}: GlassInputProps) {
  return (
    <View style={[styles.container, style]}>
      {showMic && (
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="mic" size={22} color={colors.text.tertiary} />
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={500}
      />
      {onSend && (
        <TouchableOpacity
          style={[styles.iconButton, value.length > 0 && styles.sendActive]}
          onPress={onSend}
          activeOpacity={0.7}
          disabled={value.length === 0}
        >
          <Ionicons
            name="send"
            size={20}
            color={value.length > 0 ? colors.primary.purple : colors.text.placeholder}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 54,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingHorizontal: spacing.sm,
    maxHeight: 100,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendActive: {
    backgroundColor: colors.glass.medium,
  },
});