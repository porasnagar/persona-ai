import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  showActions?: boolean;
  onLike?: () => void;
  onCopy?: () => void;
}

export default function ChatBubble({ 
  message, 
  isAI, 
  showActions = false,
  onLike,
  onCopy 
}: ChatBubbleProps) {
  return (
    <View style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}>
      {isAI && (
        <View style={styles.aiAvatar}>
          <View style={styles.avatarInner} />
        </View>
      )}
      <View style={styles.messageContainer}>
        <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        {isAI && showActions && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={onLike}>
              <Ionicons name="heart-outline" size={17} color={colors.text.placeholder} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={onCopy}>
              <Ionicons name="copy-outline" size={17} color={colors.text.placeholder} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  aiContainer: {
    paddingRight: spacing.xl,
  },
  userContainer: {
    justifyContent: 'flex-end',
    paddingLeft: spacing.xl,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.ai.glowSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    shadowColor: colors.ai.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  avatarInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary.purple,
    opacity: 0.9,
  },
  messageContainer: {
    flex: 1,
  },
  bubble: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md + 4,
    borderWidth: 1,
  },
  aiBubble: {
    backgroundColor: colors.ai.message,
    borderColor: colors.glass.borderSoft,
    shadowColor: colors.ai.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  userBubble: {
    backgroundColor: colors.user.message,
    borderColor: colors.glass.borderSoft,
  },
  messageText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
  actionButton: {
    marginRight: spacing.md + 4,
    padding: spacing.xs,
  },
});