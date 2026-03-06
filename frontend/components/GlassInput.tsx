import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface GlassInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSend?: () => void;
  onMic?: () => void;
  showMic?: boolean;
  style?: ViewStyle;
}

export default function GlassInput({
  placeholder,
  value,
  onChangeText,
  onSend,
  onMic,
  showMic = false,
  style,
}: GlassInputProps) {
  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web') {
      // On web: Enter sends, Shift+Enter adds new line
      if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
        e.preventDefault();
        if (value.trim() && onSend) {
          onSend();
        }
      }
    }
  };

  const handleSubmitEditing = () => {
    // On mobile: Enter/Return sends message
    if (value.trim() && onSend) {
      onSend();
    }
  };

  const canSend = value.trim().length > 0;

  return (
    <View style={[styles.container, style]}>
      {showMic && (
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={onMic}>
          <Ionicons name="mic-outline" size={22} color={colors.text.tertiary} />
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        value={value}
        onChangeText={onChangeText}
        onKeyPress={handleKeyPress}
        onSubmitEditing={handleSubmitEditing}
        multiline={Platform.OS === 'web'}
        blurOnSubmit={false}
        returnKeyType="send"
        maxLength={500}
      />
      {onSend && (
        <TouchableOpacity
          style={[
            styles.sendButton,
            canSend && styles.sendButtonActive,
          ]}
          onPress={onSend}
          activeOpacity={0.7}
          disabled={!canSend}
        >
          <Ionicons
            name="send"
            size={20}
            color={canSend ? colors.primary.purple : colors.text.placeholder}
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
    minHeight: 24,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.glass.medium,
    shadowColor: colors.primary.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
