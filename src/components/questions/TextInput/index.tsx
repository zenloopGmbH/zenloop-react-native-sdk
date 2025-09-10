import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import { TextQuestion, CommentQuestion } from '../../../types/question';
import { Theme } from '../../../types/theme';

interface TextInputProps {
  question: TextQuestion | CommentQuestion;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  theme: Theme;
}

export const TextInput: React.FC<TextInputProps> = ({
  question,
  value = '',
  onChange,
  onBlur,
  error,
  theme,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value.length);

  const isMultiline = question.type === 'comment';
  const maxLength = 'maxLength' in question ? question.maxLength : undefined;
  const placeholder = 'placeHolder' in question ? question.placeHolder : undefined;
  const numberOfLines = isMultiline && 'rows' in question ? question.rows : 4;

  const getKeyboardType = (): KeyboardTypeOptions => {
    if (question.type === 'text' && question.inputType) {
      switch (question.inputType) {
        case 'email':
          return 'email-address';
        case 'number':
          return 'numeric';
        case 'tel':
          return 'phone-pad';
        default:
          return 'default';
      }
    }
    return 'default';
  };

  const handleChangeText = (text: string) => {
    if (maxLength && text.length > maxLength) {
      return;
    }
    setCharCount(text.length);
    onChange(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const styles = createStyles(theme, isFocused, !!error);

  return (
    <View style={styles.container}>
      {question.title && (
        <Text style={styles.label}>
          {question.title}
          {question.isRequired && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      {question.description && (
        <Text style={styles.description}>{question.description}</Text>
      )}

      <View style={styles.inputContainer}>
        <RNTextInput
          style={[
            styles.input,
            isMultiline && styles.multilineInput,
            error && styles.inputError,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={getKeyboardType()}
          multiline={isMultiline}
          numberOfLines={isMultiline ? numberOfLines : 1}
          maxLength={maxLength}
          textAlignVertical={isMultiline ? 'top' : 'center'}
          autoCapitalize="sentences"
          autoCorrect={true}
          returnKeyType={isMultiline ? 'default' : 'done'}
        />
      </View>

      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {maxLength && (
          <Text style={styles.charCount}>
            {charCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, isFocused: boolean, hasError: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.fontSize.medium,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.error,
    },
    description: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: hasError
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.background,
      ...Platform.select({
        ios: {
          shadowColor: isFocused ? theme.colors.primary : '#000',
          shadowOffset: { width: 0, height: isFocused ? 2 : 1 },
          shadowOpacity: isFocused ? 0.1 : 0.05,
          shadowRadius: isFocused ? 4 : 2,
        },
        android: {
          elevation: isFocused ? 3 : 1,
        },
      }),
    },
    input: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44, // Accessibility minimum
    },
    multilineInput: {
      minHeight: 100,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    errorText: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.error,
      flex: 1,
    },
    charCount: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
  });

export default TextInput;