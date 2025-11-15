import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch React errors
 * Displays a user-friendly error screen instead of crashing the app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to error tracking service in production
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    // TODO: Send to error tracking service (e.g., Sentry, Bugsnag) in production
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorText}>{this.state.error.toString()}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    fontSize: 24,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.body,
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  buttonText: {
    ...typography.button,
    color: '#FFFFFF',
  },
});

