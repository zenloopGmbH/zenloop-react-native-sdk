import { useState, useEffect, useCallback } from 'react';
import { Survey, SurveyState, getVisiblePages } from '../types/survey';
import { ResponseData, validateResponse, SubmissionResult } from '../types/response';
import { SurveyService } from '../services/api/surveys';
import { ResponseService } from '../services/api/responses';

interface UseSurveyOptions {
  orgId: string;
  surveyId: string;
  apiKey?: string;
  apiUrl?: string;
  initialResponses?: ResponseData;
  onComplete?: (responses: ResponseData) => void;
  onError?: (error: string) => void;
}

interface UseSurveyReturn {
  survey: Survey | null;
  state: SurveyState;
  isLoading: boolean;
  isSubmitting: boolean;
  isCompleted: boolean;
  currentPageIndex: number;
  totalPages: number;
  responses: ResponseData;
  errors: Record<string, string>;
  progress: number;
  setResponse: (questionName: string, value: any) => void;
  nextPage: () => boolean;
  previousPage: () => void;
  submitSurvey: () => Promise<void>;
  validateCurrentPage: () => boolean;
  retry: () => void;
}

export const useSurvey = ({
  orgId,
  surveyId,
  apiKey,
  apiUrl,
  initialResponses = {},
  onComplete,
  onError,
}: UseSurveyOptions): UseSurveyReturn => {
  const [survey, setSurvey] = useState<Survey | null>(null);
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

  const loadSurvey = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, errors: {} }));

    try {
      const result = await surveyService.fetchSurvey(orgId, surveyId);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        setSurvey(result.data);
        const visiblePages = getVisiblePages(result.data.surveyJson, state.responses);
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
  }, [orgId, surveyId]);

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  const setResponse = useCallback((questionName: string, value: any) => {
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

  const validateCurrentPage = useCallback((): boolean => {
    if (!survey) return false;

    const currentPage = survey.surveyJson.pages[state.currentPageIndex];
    if (!currentPage) return false;

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
  }, [survey, state.currentPageIndex, state.responses]);

  const nextPage = useCallback((): boolean => {
    if (!validateCurrentPage()) {
      return false;
    }

    if (state.currentPageIndex < state.totalPages - 1) {
      setState(prev => ({
        ...prev,
        currentPageIndex: prev.currentPageIndex + 1,
        errors: {},
      }));
      return true;
    }

    return false;
  }, [state.currentPageIndex, state.totalPages, validateCurrentPage]);

  const previousPage = useCallback(() => {
    if (state.currentPageIndex > 0) {
      setState(prev => ({
        ...prev,
        currentPageIndex: prev.currentPageIndex - 1,
        errors: {},
      }));
    }
  }, [state.currentPageIndex]);

  const submitSurvey = useCallback(async () => {
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
  }, [survey, surveyId, orgId, state.responses, validateCurrentPage, onComplete, onError]);

  const retry = useCallback(() => {
    loadSurvey();
  }, [loadSurvey]);

  const progress = state.totalPages > 0
    ? Math.round(((state.currentPageIndex + 1) / state.totalPages) * 100)
    : 0;

  return {
    survey,
    state,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    isCompleted: state.isCompleted,
    currentPageIndex: state.currentPageIndex,
    totalPages: state.totalPages,
    responses: state.responses,
    errors: state.errors,
    progress,
    setResponse,
    nextPage,
    previousPage,
    submitSurvey,
    validateCurrentPage,
    retry,
  };
};

export default useSurvey;