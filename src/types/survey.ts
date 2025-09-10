import { Question } from './question';
import { Theme } from './theme';

export interface Survey {
  id: string;
  orgId: string;
  surveyName: string;
  surveyDescription?: string;
  surveyJson: SurveyJSON;
  themeJSON?: Theme;
  status: SurveyStatus;
  created?: number;
  triggerConfiguration?: TriggerConfiguration;
}

export type SurveyStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DELETED';

export interface SurveyJSON {
  title?: string;
  description?: string;
  pages: Page[];
  showProgressBar?: 'top' | 'bottom' | 'both' | 'off';
  showPageNumbers?: boolean;
  showQuestionNumbers?: 'on' | 'onPage' | 'off';
  completedHtml?: string;
  completedHtmlOnCondition?: Array<{
    expression: string;
    html: string;
  }>;
  requiredText?: string;
  startSurveyText?: string;
  pagePrevText?: string;
  pageNextText?: string;
  completeText?: string;
  locale?: string;
}

export interface Page {
  name?: string;
  title?: string;
  description?: string;
  questions: Question[];
  visibleIf?: string;
  enableIf?: string;
}

export interface TriggerConfiguration {
  type?: 'manual' | 'automatic' | 'scheduled';
  conditions?: TriggerCondition[];
  delay?: number;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string | number | boolean;
}

export interface SurveyState {
  currentPageIndex: number;
  totalPages: number;
  responses: Record<string, any>;
  errors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  isCompleted: boolean;
  startTime?: number;
  endTime?: number;
}

export interface NavigationState {
  canGoNext: boolean;
  canGoPrevious: boolean;
  canSubmit: boolean;
}

export function getVisiblePages(survey: SurveyJSON, responses: Record<string, any>): Page[] {
  return survey.pages.filter(page => {
    if (!page.visibleIf) return true;
    // TODO: Implement expression evaluation
    return true;
  });
}

export function getPageQuestions(page: Page, responses: Record<string, any>): Question[] {
  return page.questions.filter(question => {
    if (!question.visibleIf) return true;
    // TODO: Implement expression evaluation
    return question.visible !== false;
  });
}

export function calculateProgress(currentPage: number, totalPages: number): number {
  if (totalPages === 0) return 0;
  return Math.round(((currentPage + 1) / totalPages) * 100);
}