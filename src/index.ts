// Main exports for @zenloop/react-native-sdk

// Components
export { Survey } from './components/Survey';
export { default as ZenloopSurvey } from './components/Survey';

// Question Components (for advanced usage)
export { TextInput } from './components/questions/TextInput';
export { RadioGroup } from './components/questions/RadioGroup';
export { Checkbox } from './components/questions/Checkbox';
export { Rating } from './components/questions/Rating';

// Common Components
export { LoadingIndicator } from './components/common/LoadingIndicator';
export { ErrorMessage } from './components/common/ErrorMessage';

// Hooks
export { useSurvey } from './hooks/useSurvey';
export { useTheme } from './hooks/useTheme';

// Context Providers
export { ThemeProvider } from './contexts/ThemeContext';

// Types
export type {
  Question,
  QuestionType,
  TextQuestion,
  CommentQuestion,
  RadioGroupQuestion,
  CheckboxQuestion,
  RatingQuestion,
  RatingType,
  Choice,
} from './types/question';

export type {
  Survey as SurveyType,
  SurveyStatus,
  SurveyJSON,
  Page,
  TriggerConfiguration,
  SurveyState,
  NavigationState,
} from './types/survey';

export type {
  ResponseData,
  SurveyResponse,
  ResponseStatus,
  ResponseProperties,
  ResponseSubmission,
  ResponseValidation,
  SubmissionResult,
} from './types/response';

export type {
  Theme,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeComponents,
} from './types/theme';

// API Services (for advanced usage)
export { SurveyService, getSurveyService } from './services/api/surveys';
export { ResponseService, getResponseService } from './services/api/responses';
export { ApiClient } from './services/api/client';
export type { ApiConfig, ApiResponse } from './services/api/client';

// Utilities
export { 
  defaultTheme,
  createTheme,
} from './types/theme';

export {
  getRatingScale,
  isTextQuestion,
  isCommentQuestion,
  isRadioGroupQuestion,
  isCheckboxQuestion,
  isRatingQuestion,
} from './types/question';

export {
  getVisiblePages,
  getPageQuestions,
  calculateProgress,
} from './types/survey';

export {
  validateResponse,
  formatResponseForSubmission,
  calculateResponseDuration,
} from './types/response';