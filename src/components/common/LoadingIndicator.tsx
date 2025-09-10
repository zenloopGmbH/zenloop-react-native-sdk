import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { Theme } from '../../types/theme';

interface LoadingIndicatorProps {
  message?: string;
  theme: Theme;
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  theme,
  size = 'large',
}) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={theme.colors.primary}
        style={styles.indicator}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    indicator: {
      marginBottom: theme.spacing.md,
    },
    message: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

export default LoadingIndicator;