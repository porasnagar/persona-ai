import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface Persona {
  id: string;
  name: string;
  description: string;
}

interface PersonaToggleProps {
  personas: Persona[];
  activePersona: string;
  onPersonaChange: (personaId: string) => void;
}

export default function PersonaToggle({ personas, activePersona, onPersonaChange }: PersonaToggleProps) {
  return (
    <View style={styles.container}>
      {personas.map((persona) => (
        <TouchableOpacity
          key={persona.id}
          style={[
            styles.personaButton,
            activePersona === persona.id && styles.personaButtonActive,
          ]}
          onPress={() => onPersonaChange(persona.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.personaText,
              activePersona === persona.id && styles.personaTextActive,
            ]}
          >
            {persona.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.glass.ultraLight,
    borderRadius: borderRadius.full,
    padding: spacing.xs / 2,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  personaButton: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.xs / 4,
  },
  personaButtonActive: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: colors.primary.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  personaText: {
    ...typography.small,
    color: colors.text.tertiary,
    fontWeight: '500',
    fontSize: 12,
  },
  personaTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
});
