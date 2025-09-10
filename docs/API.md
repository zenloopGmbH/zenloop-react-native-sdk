# API Documentation

## Table of Contents

- [ZenloopSurvey Component](#zenloopsurvey-component)
- [useSurvey Hook](#usesurvey-hook)
- [Individual Components](#individual-components)
- [Services](#services)
- [Types](#types)

## ZenloopSurvey Component

The main component for embedding surveys in your React Native application.

### Props

```tsx
interface SurveyProps {
  orgId: string;
  surveyId: string;
  apiKey?: string;
  apiUrl?: string;
  theme?: Partial<Theme>;
  onComplete?: (responses: ResponseData) => void;
  onError?: (error: string) => void;
  initialResponses?: ResponseData;
  showProgress?: boolean;
}
```

#### Required Props

- **orgId** (`string`) - Your organization identifier
- **surveyId** (`string`) - The survey identifier to load

#### Optional Props

- **apiKey** (`string`) - Authentication key for private surveys
- **apiUrl** (`string`) - Custom API endpoint (defaults to production API)
- **theme** (`Partial<Theme>`) - Custom theme configuration
- **onComplete** (`function`) - Callback fired when survey is completed
- **onError** (`function`) - Callback fired when an error occurs
- **initialResponses** (`ResponseData`) - Pre-filled responses
- **showProgress** (`boolean`) - Whether to show progress bar (default: `true`)

### Example Usage

```tsx
import { ZenloopSurvey } from '@zenloop/react-native-sdk';

<ZenloopSurvey
  orgId="4145"
  surveyId="1447"
  apiUrl="https://your-api.com/api/v2"
  showProgress={true}
  onComplete={(responses) => {
    console.log('Survey completed with responses:', responses);
  }}
  onError={(error) => {
    console.error('Survey error:', error);
  }}
/>
```

---

## useSurvey Hook

Advanced hook for building custom survey implementations.

### Parameters

```tsx
interface SurveyConfig {
  orgId: string;
  surveyId: string;
  apiUrl?: string;
  apiKey?: string;
  onComplete?: (responses: ResponseData) => void;
  onError?: (error: string) => void;
  initialResponses?: ResponseData;
}
```

### Return Value

```tsx
interface SurveyHookReturn {
  // Survey Data
  survey: Survey | null;
  responses: ResponseData;
  
  // Navigation State
  currentPageIndex: number;
  totalPages: number;
  currentPage: Page | null;
  
  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  isCompleted: boolean;
  errors: Record<string, string>;
  
  // Actions
  setResponse: (questionName: string, value: any) => void;
  nextPage: () => void;
  previousPage: () => void;
  submitSurvey: () => Promise<void>;
  loadSurvey: () => Promise<void>;
}
```

### Example Usage

```tsx
import { useSurvey } from '@zenloop/react-native-sdk';

function CustomSurvey() {
  const {
    survey,
    currentPage,
    responses,
    isLoading,
    isCompleted,
    setResponse,
    nextPage,
    previousPage
  } = useSurvey({
    orgId: '4145',
    surveyId: '1447',
    onComplete: (responses) => console.log(responses)
  });

  if (isLoading) return <LoadingScreen />;
  if (isCompleted) return <ThankYouScreen />;
  
  return (
    <View>
      {currentPage?.questions.map(question => (
        <QuestionComponent
          key={question.name}
          question={question}
          value={responses[question.name]}
          onChange={(value) => setResponse(question.name, value)}
        />
      ))}
      <Button title="Next" onPress={nextPage} />
    </View>
  );
}
```

---

## Individual Components

For custom implementations, you can use individual question components.

### TextInput Component

```tsx
interface TextInputProps {
  question: TextQuestion;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  theme: Theme;
}
```

### Rating Component

```tsx
interface RatingProps {
  question: RatingQuestion;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
  theme: Theme;
}
```

### RadioGroup Component

```tsx
interface RadioGroupProps {
  question: RadioGroupQuestion;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  theme: Theme;
}
```

### Checkbox Component

```tsx
interface CheckboxProps {
  question: CheckboxQuestion;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
  theme: Theme;
}
```

### Example Usage

```tsx
import { TextInput, defaultTheme } from '@zenloop/react-native-sdk';

<TextInput
  question={{
    type: 'text',
    name: 'email',
    title: 'What is your email?',
    isRequired: true,
    inputType: 'email',
    maxLength: 100
  }}
  value={email}
  onChange={setEmail}
  theme={defaultTheme}
/>
```

---

## Services

### SurveyService

Service for fetching survey data from the API.

```tsx
class SurveyService {
  constructor(apiUrl?: string, apiKey?: string);
  
  fetchSurvey(orgId: string, surveyId: string): Promise<ApiResponse<Survey>>;
  fetchSurveys(orgId: string): Promise<ApiResponse<Survey[]>>;
  updateConfig(apiUrl?: string, apiKey?: string): void;
}
```

### ResponseService

Service for submitting survey responses.

```tsx
class ResponseService {
  constructor(apiUrl?: string, apiKey?: string);
  
  submitResponse(
    surveyId: string,
    orgId: string,
    responses: ResponseData,
    metadata?: ResponseProperties
  ): Promise<ApiResponse<SubmissionResult>>;
  
  updateConfig(apiUrl?: string, apiKey?: string): void;
}
```

### Example Usage

```tsx
import { SurveyService, ResponseService } from '@zenloop/react-native-sdk';

const surveyService = new SurveyService('https://api.example.com', 'api-key');
const responseService = new ResponseService('https://api.example.com', 'api-key');

// Fetch survey
const survey = await surveyService.fetchSurvey('4145', '1447');

// Submit responses
const result = await responseService.submitResponse(
  '1447',
  '4145',
  { satisfaction: 8, feedback: 'Great product!' }
);
```

---

## Types

### Survey Types

```tsx
interface Survey {
  id: string;
  orgId: string;
  surveyName: string;
  surveyDescription?: string;
  surveyJson: SurveyJSON;
  themeJSON?: Theme;
  status: SurveyStatus;
  created?: string;
  triggerConfiguration?: TriggerConfiguration;
}

interface SurveyJSON {
  pages: Page[];
  completedHtml?: string;
  showProgressBar?: boolean;
  showQuestionNumbers?: boolean;
}

interface Page {
  name: string;
  title?: string;
  description?: string;
  questions: Question[];
}
```

### Question Types

```tsx
type Question = 
  | TextQuestion 
  | CommentQuestion 
  | RadioGroupQuestion 
  | CheckboxQuestion 
  | RatingQuestion;

interface BaseQuestion {
  type: string;
  name: string;
  title: string;
  description?: string;
  isRequired?: boolean;
  visible?: boolean;
}

interface TextQuestion extends BaseQuestion {
  type: 'text';
  inputType?: 'text' | 'email' | 'number' | 'phone' | 'url';
  maxLength?: number;
  placeHolder?: string;
}

interface CommentQuestion extends BaseQuestion {
  type: 'comment';
  rows?: number;
  maxLength?: number;
  placeHolder?: string;
}

interface RadioGroupQuestion extends BaseQuestion {
  type: 'radiogroup';
  choices: Choice[];
}

interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  choices: Choice[];
  minSelect?: number;
  maxSelect?: number;
}

interface RatingQuestion extends BaseQuestion {
  type: 'rating';
  ratingType?: RatingType;
  rateValues?: number[];
  rateMin?: number;
  rateMax?: number;
  minRateDescription?: string;
  maxRateDescription?: string;
  showLabels?: boolean;
}

interface Choice {
  value: string;
  text: string;
}

type RatingType = 'NPS' | 'CSAT' | 'CES';
```

### Theme Types

```tsx
interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
}

interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  fontWeight: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface ThemeBorderRadius {
  small: number;
  medium: number;
  large: number;
  round: number;
}
```

### Response Types

```tsx
interface ResponseData {
  [questionName: string]: any;
}

interface ResponseSubmission {
  surveyId: string;
  orgId: string;
  responses: ResponseData;
  startTime?: number;
  endTime?: number;
  metadata?: ResponseProperties;
}

interface SubmissionResult {
  success: boolean;
  responseId?: string;
  error?: string;
}

interface ResponseValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
```

### API Types

```tsx
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  token?: string;
  timeout?: number;
}
```

---

## Utility Functions

### Question Type Guards

```tsx
function isTextQuestion(question: Question): question is TextQuestion;
function isCommentQuestion(question: Question): question is CommentQuestion;
function isRadioGroupQuestion(question: Question): question is RadioGroupQuestion;
function isCheckboxQuestion(question: Question): question is CheckboxQuestion;
function isRatingQuestion(question: Question): question is RatingQuestion;
```

### Response Utilities

```tsx
function validateResponse(
  responses: ResponseData,
  requiredQuestions: string[]
): ResponseValidation;

function formatResponseForSubmission(
  responses: ResponseData,
  survey: Survey
): ResponseSubmission;

function calculateResponseDuration(
  startTime: number,
  endTime: number
): number;
```

### Survey Utilities

```tsx
function getVisiblePages(
  surveyJson: SurveyJSON,
  responses: ResponseData
): Page[];

function calculateProgress(
  currentPageIndex: number,
  totalPages: number
): number;

function getPageQuestions(page: Page): Question[];
```

### Theme Utilities

```tsx
function createTheme(customTheme: Partial<Theme>): Theme;

const defaultTheme: Theme;
```