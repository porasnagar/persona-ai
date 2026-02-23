import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface Conversation {
  id: string;
  persona: string;
  lastMessage: string;
  lastUpdated: string;
}

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

const PERSONA_ICONS: Record<string, string> = {
  MENTOR: '🧙',
  TEACHER: '📚',
  MOTIVATOR: '⚡',
  LISTENER: '💙',
  PHILOSOPHER: '🌟',
  YOGA: '🧘',
  CUSTOM: '✨',
};

export default function ChatHistorySidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: ChatHistorySidebarProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat History</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={onNewChat}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Start a new chat to begin</Text>
          </View>
        ) : (
          conversations.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              style={[
                styles.conversationItem,
                activeConversationId === conv.id && styles.conversationItemActive,
              ]}
              onPress={() => onSelectConversation(conv.id)}
              activeOpacity={0.7}
            >
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationIcon}>
                  {PERSONA_ICONS[conv.persona] || '✨'}
                </Text>
                <View style={styles.conversationInfo}>
                  <Text style={styles.conversationPersona} numberOfLines={1}>
                    {conv.persona}
                  </Text>
                  <Text style={styles.conversationTime}>
                    {formatTime(conv.lastUpdated)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.text.tertiary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.conversationMessage} numberOfLines={2}>
                {conv.lastMessage}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: colors.background.mid,
    borderRightWidth: 1,
    borderRightColor: colors.glass.borderSoft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  headerTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  newChatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  conversationItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  conversationItemActive: {
    backgroundColor: colors.glass.ultraLight,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  conversationIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationPersona: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  conversationTime: {
    ...typography.small,
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 2,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  conversationMessage: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 13,
    lineHeight: 18,
  },
});