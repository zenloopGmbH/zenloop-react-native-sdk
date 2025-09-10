import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Page } from '../../types/survey';
import { Question } from '../../types/question';
import { Theme } from '../../types/theme';
import { ResponseData } from '../../types/response';
import QuestionRenderer from '../QuestionRenderer';

interface SurveyPageProps {
  page: Page;
  responses: ResponseData;
  errors: Record<string, string>;
  onResponseChange: (questionName: string, value: any) => void;
  theme: Theme;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({
  page,
  responses,
  errors,
  onResponseChange,
  theme,
}) => {
  const styles = createStyles(theme);

  const renderQuestion = (question: Question, index: number) => {
    if (question.visible === false) return null;

    return (
      <View key={question.name || index} style={styles.questionContainer}>
        <QuestionRenderer
          question={question}
          value={responses[question.name]}
          onChange={(value) => onResponseChange(question.name, value)}
          error={errors[question.name]}
          theme={theme}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {page.title && (
        <Text style={styles.pageTitle}>{page.title}</Text>
      )}
      
      {page.description && (
        <Text style={styles.pageDescription}>{page.description}</Text>
      )}

      {page.questions && page.questions.map((question, index) => renderQuestion(question, index))}
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    pageTitle: {
      fontSize: theme.typography.fontSize.xlarge,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    pageDescription: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    questionContainer: {
      marginBottom: theme.spacing.lg,
    },
  });

export default SurveyPage;