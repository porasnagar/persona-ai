import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const PERSONAS: Persona[] = [
  { id: 'MENTOR', name: 'Mentor', description: 'Wise guidance & life advice', icon: '🧙' },
  { id: 'TEACHER', name: 'Teacher', description: 'Clear explanations', icon: '📚' },
  { id: 'MOTIVATOR', name: 'Motivator', description: 'Energy & uplift', icon: '⚡' },
  { id: 'LISTENER', name: 'Listener', description: 'Empathy & calm', icon: '💙' },
  { id: 'PHILOSOPHER', name: 'Philosopher', description: 'Deep with lightness', icon: '🌟' },
  { id: 'YOGA', name: 'Yoga Guide', description: 'Breath & movement', icon: '🧘' },
  { id: 'CUSTOM', name: 'Custom', description: 'Your own persona', icon: '✨' },
];

interface PersonaSelectorProps {
  selectedPersona: string;
  onSelectPersona: (personaId: string) => void;
  onCustomPress?: () => void;
}

export default function PersonaSelector({ selectedPersona, onSelectPersona, onCustomPress }: PersonaSelectorProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {PERSONAS.map((persona) => (
        <TouchableOpacity
          key={persona.id}
          style={[
            styles.card,
            selectedPersona === persona.id && styles.cardActive,
          ]}
          onPress={() => {
            if (persona.id === 'CUSTOM' && onCustomPress) {
              onCustomPress();
            } else {
              onSelectPersona(persona.id);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{persona.icon}</Text>
          <Text style={[
            styles.name,
            selectedPersona === persona.id && styles.nameActive
          ]}>
            {persona.name}
          </Text>
          <Text style={styles.description}>{persona.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  card: {
    width: 140,
    padding: spacing.md,
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardActive: {
    backgroundColor: colors.glass.medium,
    borderColor: colors.primary.purple,
    shadowColor: colors.primary.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  nameActive: {
    color: colors.text.primary,
  },
  description: {
    ...typography.small,
    color: colors.text.tertiary,
    textAlign: 'center',
    fontSize: 11,
  },
});