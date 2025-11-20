import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';
import { checkUsernameAvailability } from '../services/leaderboardService';

interface UsernameModalProps {
  visible: boolean;
  onSubmit: (username: string) => void;
}

/**
 * Modal component for username entry on first launch
 * Styled with theme colors and modern design
 */
export const UsernameModal: React.FC<UsernameModalProps> = ({ visible, onSubmit }) => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (visible) {
      setUsername('');
      setError('');
      setChecking(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      return;
    }

    setChecking(true);
    setError('');

    try {
      const isAvailable = await checkUsernameAvailability(trimmed);
      if (isAvailable) {
        onSubmit(trimmed.toLowerCase());
      } else {
        setError('Username already taken. Please choose another.');
      }
    } catch (err) {
      setError('Error checking username. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // Prevent Android back button from closing
      presentationStyle="overFullScreen"
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => {}} // Prevent backdrop press from closing
      >
        <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Welcome to Tapsy!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter your username to get started
          </Text>
          
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: error ? theme.colors.error || '#FF3B30' : theme.colors.border,
                color: theme.colors.textPrimary,
              },
            ]}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (error) setError('');
            }}
            placeholder="Username"
            placeholderTextColor={theme.colors.textSecondary}
            autoFocus
            maxLength={20}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            selectionColor={theme.colors.primary}
            editable={!checking}
          />

          {error ? (
            <Text style={[styles.errorText, { color: theme.colors.error || '#FF3B30' }]}>
              {error}
            </Text>
          ) : null}

          <PrimaryButton
            title={checking ? 'Checking...' : 'Start Playing'}
            onPress={handleSubmit}
            disabled={!username.trim() || checking}
          />
        </Card>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
});

