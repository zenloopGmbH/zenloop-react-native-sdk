import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RatingQuestion, getRatingScale } from '../../../types/question';
import { Theme } from '../../../types/theme';

interface RatingProps {
  question: RatingQuestion;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
  theme: Theme;
}

export const Rating: React.FC<RatingProps> = ({
  question,
  value,
  onChange,
  error,
  theme,
}) => {
  // Use rateMin and rateMax if provided, otherwise use rateValues or default scale
  const scale = question.rateValues || 
    (question.rateMin !== undefined && question.rateMax !== undefined
      ? Array.from({ length: question.rateMax - question.rateMin + 1 }, (_, i) => i + question.rateMin)
      : getRatingScale(question.ratingType));
  const showLabels = question.showLabels !== false;

  const getButtonSize = (): number => {
    const scaleLength = scale.length;
    if (scaleLength >= 11) return 36; // Smaller for 11+ options
    if (scaleLength >= 9) return 40; // Small for 9-10 options
    if (scaleLength >= 7) return 45; // Medium for 7-8 options
    return 50; // Larger for 5-6 options
  };

  const getRatingColor = (rating: number, isSelected: boolean): string => {
    if (!isSelected) return theme.colors.border;

    if (question.ratingType === 'NPS') {
      if (rating <= 6) return theme.colors.error; // Detractors
      if (rating <= 8) return theme.colors.warning; // Passives
      return theme.colors.success; // Promoters
    }

    if (question.ratingType === 'CSAT') {
      if (rating <= 2) return theme.colors.error;
      if (rating === 3) return theme.colors.warning;
      return theme.colors.success;
    }

    return theme.colors.primary;
  };

  const getRatingEmoji = (rating: number): string | null => {
    if (question.ratingType !== 'CSAT') return null;

    switch (rating) {
      case 1:
        return '😞';
      case 2:
        return '😕';
      case 3:
        return '😐';
      case 4:
        return '😊';
      case 5:
        return '😄';
      default:
        return null;
    }
  };

  const styles = createStyles(theme, getButtonSize());

  const renderRatingButton = (rating: number) => {
    const isSelected = value === rating;
    const emoji = getRatingEmoji(rating);
    const color = getRatingColor(rating, isSelected);

    return (
      <TouchableOpacity
        key={rating}
        style={[
          styles.ratingButton,
          isSelected && styles.ratingButtonSelected,
          { borderColor: color },
          isSelected && { backgroundColor: color },
        ]}
        onPress={() => onChange(rating)}
        activeOpacity={0.7}
      >
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : (
          <Text
            style={[
              styles.ratingText,
              isSelected && styles.ratingTextSelected,
            ]}
          >
            {rating}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderLabels = () => {
    if (!showLabels || (!question.minRateDescription && !question.maxRateDescription)) {
      return null;
    }

    return (
      <View style={styles.labelsContainer}>
        {question.minRateDescription && (
          <Text style={styles.labelText}>{question.minRateDescription}</Text>
        )}
        <View style={{ flex: 1 }} />
        {question.maxRateDescription && (
          <Text style={styles.labelText}>{question.maxRateDescription}</Text>
        )}
      </View>
    );
  };

  const renderNPSLabels = () => {
    if (question.ratingType !== 'NPS' || !showLabels) return null;

    return (
      <View style={styles.npsLabelsContainer}>
        <View style={styles.npsLabelGroup}>
          <View style={[styles.npsColorBar, { backgroundColor: theme.colors.error }]} />
          <Text style={styles.npsLabelText}>Detractors (0-6)</Text>
        </View>
        <View style={styles.npsLabelGroup}>
          <View style={[styles.npsColorBar, { backgroundColor: theme.colors.warning }]} />
          <Text style={styles.npsLabelText}>Passives (7-8)</Text>
        </View>
        <View style={styles.npsLabelGroup}>
          <View style={[styles.npsColorBar, { backgroundColor: theme.colors.success }]} />
          <Text style={styles.npsLabelText}>Promoters (9-10)</Text>
        </View>
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ratingContainer}
      >
        {scale.map(renderRatingButton)}
      </ScrollView>

      {renderLabels()}
      {renderNPSLabels()}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: Theme, buttonSize: number) =>
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
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    ratingButton: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.xs / 2,
    },
    ratingButtonSelected: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    ratingText: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.medium,
    },
    ratingTextSelected: {
      color: theme.colors.background,
      fontWeight: theme.typography.fontWeight.bold,
    },
    emoji: {
      fontSize: buttonSize * 0.5,
    },
    labelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    labelText: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    npsLabelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
    },
    npsLabelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    npsColorBar: {
      width: 12,
      height: 12,
      borderRadius: 2,
      marginRight: theme.spacing.xs,
    },
    npsLabelText: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
    },
    errorText: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });

export default Rating;