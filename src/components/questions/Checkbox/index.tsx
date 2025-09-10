import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { CheckboxQuestion, Choice } from '../../../types/question';
import { Theme } from '../../../types/theme';

interface CheckboxProps {
  question: CheckboxQuestion;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
  theme: Theme;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  question,
  value = [],
  onChange,
  error,
  theme,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const [otherText, setOtherText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const choices = question.choices || [];
  const hasSelectAll = question.selectAll;
  const minSelect = question.minSelect;
  const maxSelect = question.maxSelect;

  useEffect(() => {
    setSelectedValues(value);
    setShowOtherInput(value.some(v => v.startsWith('other')));
  }, [value]);

  const handleToggle = (choiceValue: string) => {
    let newValues: string[] = [];

    if (choiceValue === 'select_all' && hasSelectAll) {
      if (selectedValues.length === choices.length) {
        // Deselect all
        newValues = [];
      } else {
        // Select all
        newValues = choices.map(c => c.value);
      }
    } else if (choiceValue === 'other' && question.hasOther) {
      if (selectedValues.some(v => v.startsWith('other'))) {
        // Remove other
        newValues = selectedValues.filter(v => !v.startsWith('other'));
        setShowOtherInput(false);
        setOtherText('');
      } else {
        // Add other
        newValues = [...selectedValues, `other: ${otherText}`];
        setShowOtherInput(true);
      }
    } else {
      if (selectedValues.includes(choiceValue)) {
        // Deselect
        newValues = selectedValues.filter(v => v !== choiceValue);
      } else {
        // Select
        if (maxSelect && selectedValues.length >= maxSelect) {
          // Can't select more
          return;
        }
        newValues = [...selectedValues, choiceValue];
      }
    }

    setSelectedValues(newValues);
    onChange(newValues);
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    const newValues = selectedValues.filter(v => !v.startsWith('other'));
    if (text) {
      newValues.push(`other: ${text}`);
    }
    setSelectedValues(newValues);
    onChange(newValues);
  };

  const isSelected = (choiceValue: string): boolean => {
    if (choiceValue === 'other' && question.hasOther) {
      return selectedValues.some(v => v.startsWith('other'));
    }
    return selectedValues.includes(choiceValue);
  };

  const isAllSelected = (): boolean => {
    return choices.every(choice => selectedValues.includes(choice.value));
  };

  const getValidationMessage = (): string | null => {
    if (minSelect && selectedValues.length < minSelect) {
      return `Please select at least ${minSelect} option${minSelect > 1 ? 's' : ''}`;
    }
    if (maxSelect && selectedValues.length > maxSelect) {
      return `Please select no more than ${maxSelect} option${maxSelect > 1 ? 's' : ''}`;
    }
    return null;
  };

  const styles = createStyles(theme);
  const validationMessage = getValidationMessage();

  const renderCheckbox = (isChecked: boolean) => (
    <View style={[styles.checkbox, isChecked && styles.checkboxSelected]}>
      {isChecked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );

  const renderChoice = (choice: Choice) => {
    const selected = isSelected(choice.value);
    const disabled = !selected && maxSelect !== undefined && selectedValues.length >= maxSelect;
    
    return (
      <TouchableOpacity
        key={choice.value}
        style={[styles.choiceContainer, disabled && styles.choiceDisabled]}
        onPress={() => !disabled && handleToggle(choice.value)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {renderCheckbox(selected)}
        <Text style={[
          styles.choiceText,
          selected && styles.choiceTextSelected,
          disabled && styles.choiceTextDisabled
        ]}>
          {choice.text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSelectAll = () => {
    if (!hasSelectAll) return null;

    const allSelected = isAllSelected();
    
    return (
      <TouchableOpacity
        style={[styles.choiceContainer, styles.selectAllContainer]}
        onPress={() => handleToggle('select_all')}
        activeOpacity={0.7}
      >
        {renderCheckbox(allSelected)}
        <Text style={[styles.choiceText, allSelected && styles.choiceTextSelected]}>
          Select All
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOtherOption = () => {
    if (!question.hasOther) return null;

    const selected = selectedValues.some(v => v.startsWith('other'));
    const disabled = !selected && maxSelect !== undefined && selectedValues.length >= maxSelect;
    
    return (
      <View>
        <TouchableOpacity
          style={[styles.choiceContainer, disabled && styles.choiceDisabled]}
          onPress={() => !disabled && handleToggle('other')}
          activeOpacity={0.7}
          disabled={disabled}
        >
          {renderCheckbox(selected)}
          <Text style={[
            styles.choiceText,
            selected && styles.choiceTextSelected,
            disabled && styles.choiceTextDisabled
          ]}>
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

      {(minSelect || maxSelect) && (
        <Text style={styles.selectionInfo}>
          {minSelect && maxSelect
            ? `Select ${minSelect} to ${maxSelect} options`
            : minSelect
            ? `Select at least ${minSelect} option${minSelect > 1 ? 's' : ''}`
            : `Select up to ${maxSelect} option${maxSelect > 1 ? 's' : ''}`}
        </Text>
      )}

      <View style={styles.choicesContainer}>
        {renderSelectAll()}
        {choices.map(renderChoice)}
        {renderOtherOption()}
      </View>

      {(error || validationMessage) && (
        <Text style={styles.errorText}>{error || validationMessage}</Text>
      )}
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
    selectionInfo: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.info,
      marginBottom: theme.spacing.sm,
      fontStyle: 'italic',
    },
    choicesContainer: {
      marginTop: theme.spacing.sm,
    },
    choiceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    choiceDisabled: {
      opacity: 0.5,
    },
    selectAllContainer: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.xs,
      paddingBottom: theme.spacing.sm,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: theme.borderRadius.small,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    checkboxSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    checkmark: {
      color: theme.colors.background,
      fontSize: 14,
      fontWeight: 'bold',
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
    choiceTextDisabled: {
      color: theme.colors.disabled,
    },
    otherInput: {
      marginTop: theme.spacing.sm,
      marginLeft: 30, // Align with text (22px checkbox + 8px margin)
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

export default Checkbox;