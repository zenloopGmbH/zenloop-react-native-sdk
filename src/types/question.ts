export interface BaseQuestion {
  type: QuestionType;
  name: string;
  title: string;
  description?: string;
  isRequired?: boolean;
  visibleIf?: string;
  enableIf?: string;
  visible?: boolean;
  order?: number;
}

export type QuestionType = 'text' | 'radiogroup' | 'checkbox' | 'rating' | 'comment';

export type RatingType = 'NPS' | 'CSAT' | 'CES';

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeHolder?: string;
  inputType?: 'text' | 'email' | 'number' | 'tel';
  maxLength?: number;
}

export interface CommentQuestion extends BaseQuestion {
  type: 'comment';
  placeHolder?: string;
  rows?: number;
  maxLength?: number;
}

export interface RadioGroupQuestion extends BaseQuestion {
  type: 'radiogroup';
  choices: Choice[];
  hasOther?: boolean;
  otherText?: string;
  layout?: 'vertical' | 'horizontal';
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  choices: Choice[];
  hasOther?: boolean;
  otherText?: string;
  selectAll?: boolean;
  minSelect?: number;
  maxSelect?: number;
}

export interface RatingQuestion extends BaseQuestion {
  type: 'rating';
  ratingType?: RatingType;
  rateValues?: number[];
  rateMin?: number;
  rateMax?: number;
  minRateDescription?: string;
  maxRateDescription?: string;
  showLabels?: boolean;
}

export interface Choice {
  value: string;
  text: string;
}

export type Question = 
  | TextQuestion 
  | CommentQuestion 
  | RadioGroupQuestion 
  | CheckboxQuestion 
  | RatingQuestion;

export function isTextQuestion(question: Question): question is TextQuestion {
  return question.type === 'text';
}

export function isCommentQuestion(question: Question): question is CommentQuestion {
  return question.type === 'comment';
}

export function isRadioGroupQuestion(question: Question): question is RadioGroupQuestion {
  return question.type === 'radiogroup';
}

export function isCheckboxQuestion(question: Question): question is CheckboxQuestion {
  return question.type === 'checkbox';
}

export function isRatingQuestion(question: Question): question is RatingQuestion {
  return question.type === 'rating';
}

export function getRatingScale(ratingType?: RatingType): number[] {
  switch (ratingType) {
    case 'NPS':
      return Array.from({ length: 11 }, (_, i) => i); // 0-10
    case 'CSAT':
      return Array.from({ length: 5 }, (_, i) => i + 1); // 1-5
    case 'CES':
      return Array.from({ length: 7 }, (_, i) => i + 1); // 1-7
    default:
      return Array.from({ length: 5 }, (_, i) => i + 1); // Default 1-5
  }
}