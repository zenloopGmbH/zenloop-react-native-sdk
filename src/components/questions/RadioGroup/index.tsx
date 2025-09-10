import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { RadioGroupQuestion, Choice } from '../../../types/question';
import { Theme } from '../../../types/theme';

interface RadioGroupProps {
  question: RadioGroupQuestion;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  theme: Theme;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  question,
  value = '',
  onChange,
  error,
  theme,
}) => {
  const [otherText, setOtherText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const isHorizontal = question.layout === 'horizontal';
  const choices = question.choices || [];

  const handleSelect = (choiceValue: string) => {
    if (choiceValue === 'other' && question.hasOther) {
      setShowOtherInput(true);
      onChange(otherText || 'other');
    } else {
      setShowOtherInput(false);
      onChange(choiceValue);
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    onChange(`other: ${text}`);
  };

  const isSelected = (choiceValue: string): boolean => {
    if (choiceValue === 'other' && question.hasOther) {
      return value.startsWith('other');
    }
    return value === choiceValue;
  };

  const styles = createStyles(theme);

  const renderChoice = (choice: Choice) => {
    const selected = isSelected(choice.value);
    
    return (
      <TouchableOpacity
        key={choice.value}
        style={[
          styles.choiceContainer,
          isHorizontal && styles.horizontalChoice,
        ]}
        onPress={() => handleSelect(choice.value)}
        activeOpacity={0.7}
      >
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
          {choice.text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOtherOption = () => {
    if (!question.hasOther) return null;

    const selected = value.startsWith('other');
    
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.choiceContainer,
            isHorizontal && styles.horizontalChoice,
          ]}
          onPress={() => handleSelect('other')}
          activeOpacity={0.7}
        >
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <View style={styles.radioInner} />}
          </View>
          <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
            {question.otherText || 'Other'}
          </Text>
        </TouchableOpacity>
        
        {showOtherInput && (
          <TextInput
            style={styles.otherInput}
            value={otherText}
            onChangeText={handleOtherTextChange}
            placeholder="Please specify..."
            placeholderTextColor={theme.colors.textSecondary}
          />
        )}
      </View>
    );
  };

  const content = (
    <>
      {question.title && (
        <Text style={styles.label}>
          {question.title}
          {question.isRequired && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      {question.description && (
        <Text style={styles.description}>{question.description}</Text>
      )}

      <View style={[styles.choicesContainer, isHorizontal && styles.horizontalContainer]}>
        {choices.map(renderChoice)}
        {renderOtherOption()}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );

  return isHorizontal ? (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {content}
    </ScrollView>
  ) : (
    <View style={styles.container}>
      {content}
    </View>
  );
};

const createStyles = (theme: Theme) =>
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
    choicesContainer: {
      marginTop: theme.spacing.sm,
    },
    horizontalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    choiceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    horizontalChoice: {
      marginRight: theme.spacing.lg,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: theme.colors.primary,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    choiceText: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.text,
      flex: 1,
    },
    choiceTextSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    otherInput: {
      marginTop: theme.spacing.sm,
      marginLeft: 28, // Align with text (20px radio + 8px margin)
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.text,
    },
    errorText: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });

export default RadioGroup;