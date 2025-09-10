import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Survey as SurveyType, SurveyState, calculateProgress, getVisiblePages } from '../../types/survey';
import { ResponseData, validateResponse } from '../../types/response';
import { Theme, defaultTheme } from '../../types/theme';
import { SurveyService } from '../../services/api/surveys';
import { ResponseService } from '../../services/api/responses';
import SurveyPage from './SurveyPage';
import LoadingIndicator from '../common/LoadingIndicator';
import ErrorMessage from '../common/ErrorMessage';

interface SurveyProps {
  orgId: string;
  surveyId: string;
  apiKey?: string;
  apiUrl?: string;
  theme?: Theme;
  onComplete?: (responses: ResponseData) => void;
  onError?: (error: string) => void;
  initialResponses?: ResponseData;
  showProgress?: boolean;
}

export const Survey: React.FC<SurveyProps> = ({
  orgId,
  surveyId,
  apiKey,
  apiUrl,
  theme,
  onComplete,
  onError,
  initialResponses = {},
  showProgress = true,
}) => {
  // Merge partial theme with default theme
  const mergedTheme = theme ? {
    ...defaultTheme,
    ...theme,
    colors: { ...defaultTheme.colors, ...theme.colors },
    typography: { 
      ...defaultTheme.typography, 
      ...theme.typography,
      fontSize: { ...defaultTheme.typography.fontSize, ...theme.typography?.fontSize },
      fontWeight: { ...defaultTheme.typography.fontWeight, ...theme.typography?.fontWeight }
    },
    spacing: { ...defaultTheme.spacing, ...theme.spacing },
    borderRadius: { ...defaultTheme.borderRadius, ...theme.borderRadius },
  } : defaultTheme;
  const [survey, setSurvey] = useState<SurveyType | null>(null);
  const [state, setState] = useState<SurveyState>({
    currentPageIndex: 0,
    totalPages: 0,
    responses: initialResponses,
    errors: {},
    isLoading: true,
    isSubmitting: false,
    isCompleted: false,
  });

  const surveyService = new SurveyService(apiUrl, apiKey);
  const responseService = new ResponseService(apiUrl, apiKey);

  useEffect(() => {
    loadSurvey();
  }, [surveyId, orgId]);

  const loadSurvey = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await surveyService.fetchSurvey(orgId, surveyId);
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        setSurvey(result.data);
        const visiblePages = getVisiblePages(result.data.surveyJson, initialResponses);
        setState(prev => ({
          ...prev,
          isLoading: false,
          totalPages: visiblePages.length,
          startTime: Date.now(),
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load survey';
      setState(prev => ({ ...prev, isLoading: false }));
      onError?.(errorMessage);
    }
  };

  const handleResponseChange = useCallback((questionName: string, value: any) => {
    setState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionName]: value,
      },
      errors: {
        ...prev.errors,
        [questionName]: undefined,
      },
    }));
  }, []);

  const validateCurrentPage = (): boolean => {
    if (!survey) return false;

    const currentPage = survey.surveyJson.pages[state.currentPageIndex];
    if (!currentPage || !currentPage.questions) return false;

    const requiredQuestions = currentPage.questions
      .filter(q => q.isRequired && q.visible !== false)
      .map(q => q.name);

    const validation = validateResponse(state.responses, requiredQuestions);
    
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        errors: validation.errors,
      }));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      if (state.currentPageIndex < state.totalPages - 1) {
        setState(prev => ({
          ...prev,
          currentPageIndex: prev.currentPageIndex + 1,
          errors: {},
        }));
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (state.currentPageIndex > 0) {
      setState(prev => ({
        ...prev,
        currentPageIndex: prev.currentPageIndex - 1,
        errors: {},
      }));
    }
  };

  const handleSubmit = async () => {
    if (!survey || !validateCurrentPage()) return;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const result = await responseService.submitResponse(
        surveyId,
        orgId,
        state.responses,
        undefined,
        `session-${Date.now()}`
      );

      if (result.success) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          isCompleted: true,
          endTime: Date.now(),
        }));
        onComplete?.(state.responses);
      } else {
        throw new Error(result.error || 'Failed to submit response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit response';
      setState(prev => ({ ...prev, isSubmitting: false }));
      onError?.(errorMessage);
    }
  };

  const renderProgress = () => {
    if (!showProgress || state.totalPages === 0) return null;

    const progress = calculateProgress(state.currentPageIndex, state.totalPages);
    const styles = createStyles(mergedTheme);

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Page {state.currentPageIndex + 1} of {state.totalPages}
        </Text>
      </View>
    );
  };

  const renderNavigation = () => {
    const styles = createStyles(mergedTheme);
    const isFirstPage = state.currentPageIndex === 0;
    const isLastPage = state.currentPageIndex === state.totalPages - 1;

    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonSecondary, isFirstPage && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstPage}
        >
          <Text style={[styles.navButtonText, styles.navButtonTextSecondary]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary]}
          onPress={handleNext}
        >
          <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
            {isLastPage ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = createStyles(mergedTheme);

  if (state.isLoading) {
    return <LoadingIndicator theme={mergedTheme} message="Loading survey..." />;
  }

  if (!survey) {
    return (
      <ErrorMessage
        theme={mergedTheme}
        message="Failed to load survey"
        onRetry={loadSurvey}
      />
    );
  }

  if (state.isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedIcon}>✅</Text>
        <Text style={styles.completedTitle}>Thank You!</Text>
        <Text style={styles.completedMessage}>
          {survey.surveyJson.completedHtml || 'Your response has been submitted successfully.'}
        </Text>
      </View>
    );
  }

  const currentPage = survey.surveyJson.pages[state.currentPageIndex];
  
  if (!currentPage) {
    return (
      <ErrorMessage
        theme={mergedTheme}
        message="Invalid survey page"
        onRetry={loadSurvey}
      />
    );
  }

  // Ensure page has questions array
  const pageWithQuestions = {
    ...currentPage,
    questions: currentPage.questions || []
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderProgress()}
        
        <SurveyPage
          page={pageWithQuestions}
          responses={state.responses}
          errors={state.errors}
          onResponseChange={handleResponseChange}
          theme={mergedTheme}
        />

        {renderNavigation()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    progressContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    progressText: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    navButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.medium,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    navButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    navButtonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    navButtonDisabled: {
      opacity: 0.5,
    },
    navButtonText: {
      fontSize: theme.typography.fontSize.medium,
      fontWeight: theme.typography.fontWeight.medium,
    },
    navButtonTextPrimary: {
      color: theme.colors.background,
    },
    navButtonTextSecondary: {
      color: theme.colors.text,
    },
    completedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    completedIcon: {
      fontSize: 64,
      marginBottom: theme.spacing.lg,
    },
    completedTitle: {
      fontSize: theme.typography.fontSize.xlarge,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    completedMessage: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

export default Survey;