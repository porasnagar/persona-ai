import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  showActions?: boolean;
}

export default function ChatBubble({ message, isAI, showActions = false }: ChatBubbleProps) {
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
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="thumbs-up-outline" size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="thumbs-down-outline" size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="copy-outline" size={16} color={colors.text.tertiary} />
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.primary.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    shadowColor: colors.primary.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  avatarInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.cyan,
  },
  messageContainer: {
    flex: 1,
  },
  bubble: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
  },
  aiBubble: {
    backgroundColor: colors.ai.message,
    borderColor: colors.glass.border,
    shadowColor: colors.ai.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  userBubble: {
    backgroundColor: colors.user.message,
    borderColor: colors.glass.border,
  },
  messageText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
  actionButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
});