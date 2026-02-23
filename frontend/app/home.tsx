import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput as RNTextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlowingOrb from '../components/GlowingOrb';
import PersonaSelector from '../components/PersonaSelector';
import GlassButton from '../components/GlassButton';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useChatStore } from '../store/chatStore';

export default function HomeScreen() {
  const router = useRouter();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  
  const { selectedPersona, setSelectedPersona, setCustomPrompt, loadConversations } = useChatStore();

  useEffect(() => {
    loadConversations();
  }, []);

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    router.push('/chat');
  };

  const handleCustomPersona = () => {
    setShowCustomModal(true);
  };

  const saveCustomPersona = () => {
    if (!customName.trim() || !customDescription.trim()) {
      Alert.alert('Required Fields', 'Please enter both name and description');
      return;
    }
    
    const prompt = `You are ${customName}. ${customDescription}`;
    setCustomPrompt(prompt);
    setSelectedPersona('CUSTOM');
    setShowCustomModal(false);
    setCustomName('');
    setCustomDescription('');
    router.push('/chat');
  };

  return (
    <LinearGradient
      colors={[colors.background.start, colors.background.mid, colors.background.end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Large Glowing Orb */}
          <View style={styles.orbContainer}>
            <GlowingOrb size={280} />
          </View>

          {/* Prompt Text */}
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>Choose Your</Text>
            <Text style={styles.promptText}>Companion</Text>
            <Text style={styles.promptSubtext}>Select a guide for your journey</Text>
          </View>

          {/* Persona Selector */}
          <View style={styles.personaContainer}>
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelectPersona={handlePersonaSelect}
              onCustomPress={handleCustomPersona}
            />
          </View>
        </ScrollView>

        {/* Custom Persona Modal */}
        <Modal
          visible={showCustomModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCustomModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Custom Persona</Text>
              
              <RNTextInput
                style={styles.modalInput}
                placeholder="Persona Name (e.g., Life Coach)"
                placeholderTextColor={colors.text.placeholder}
                value={customName}
                onChangeText={setCustomName}
              />
              
              <RNTextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Describe personality and style..."
                placeholderTextColor={colors.text.placeholder}
                value={customDescription}
                onChangeText={setCustomDescription}
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.modalButtons}>
                <GlassButton
                  title="Cancel"
                  onPress={() => {
                    setShowCustomModal(false);
                    setCustomName('');
                    setCustomDescription('');
                  }}
                  variant="secondary"
                  style={styles.modalButton}
                />
                <GlassButton
                  title="Create"
                  onPress={saveCustomPersona}
                  variant="primary"
                  style={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  orbContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  promptContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  promptText: {
    ...typography.title,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  promptSubtext: {
    ...typography.caption,
    color: colors.text.placeholder,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  personaContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background.mid,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  modalTitle: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    padding: spacing.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
    ...typography.body,
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});