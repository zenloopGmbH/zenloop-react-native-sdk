# Component Documentation

This document provides detailed information about all components in the Zenloop React Native SDK.

## Table of Contents

- [ZenloopSurvey (Main Component)](#zenloopsurvey-main-component)
- [Question Components](#question-components)
  - [TextInput](#textinput)
  - [Rating](#rating)
  - [RadioGroup](#radiogroup)
  - [Checkbox](#checkbox)
- [Common Components](#common-components)
  - [LoadingIndicator](#loadingindicator)
  - [ErrorMessage](#errormessage)
- [Layout Components](#layout-components)
  - [SurveyPage](#surveypage)
  - [QuestionRenderer](#questionrenderer)

---

## ZenloopSurvey (Main Component)

The primary component for embedding complete surveys in your application.

### Features

- 🔄 Automatic survey loading and response submission
- 📊 Built-in progress tracking and navigation
- 🎨 Customizable theming
- 🔧 Error handling and retry logic
- 📱 Responsive design for all screen sizes

### Usage

```tsx
import { ZenloopSurvey } from '@zenloop/react-native-sdk';

<ZenloopSurvey
  orgId="4145"
  surveyId="1447"
  apiUrl="https://api.zenloop.com/api/v2"
  showProgress={true}
  onComplete={(responses) => {
    console.log('Survey completed:', responses);
  }}
  onError={(error) => {
    console.error('Error:', error);
  }}
  theme={{
    colors: {
      primary: '#007AFF',
      secondary: '#34C759'
    }
  }}
/>
```

### States

- **Loading**: Shows loading indicator while fetching survey
- **Active**: Displays current survey page with questions
- **Completed**: Shows thank you message after submission
- **Error**: Displays error message with retry option

---

## Question Components

### TextInput

Component for text-based questions including single-line input and email validation.

#### Props

```tsx
interface TextInputProps {
  question: TextQuestion;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  theme: Theme;
}
```

#### Supported Question Properties

- `inputType`: text, email, number, phone, url
- `maxLength`: Maximum character limit
- `placeHolder`: Placeholder text
- `isRequired`: Required field validation

#### Example

```tsx
import { TextInput } from '@zenloop/react-native-sdk';

<TextInput
  question={{
    type: 'text',
    name: 'email',
    title: 'What is your email address?',
    isRequired: true,
    inputType: 'email',
    maxLength: 100,
    placeHolder: 'user@example.com'
  }}
  value={email}
  onChange={setEmail}
  error={emailError}
  theme={theme}
/>
```

#### Features

- Auto-focus on mount
- Real-time validation
- Character counter
- Keyboard type optimization
- Accessibility support

---

### Rating

Component for rating scale questions including NPS, CSAT, and custom scales.

#### Props

```tsx
interface RatingProps {
  question: RatingQuestion;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
  theme: Theme;
}
```

#### Supported Question Properties

- `ratingType`: NPS (0-10), CSAT (1-5), CES (1-7)
- `rateMin`: Custom minimum value
- `rateMax`: Custom maximum value
- `rateValues`: Custom array of values
- `minRateDescription`: Label for minimum value
- `maxRateDescription`: Label for maximum value
- `showLabels`: Display value labels

#### Example

```tsx
import { Rating } from '@zenloop/react-native-sdk';

<Rating
  question={{
    type: 'rating',
    name: 'satisfaction',
    title: 'How satisfied are you with our service?',
    rateMin: 0,
    rateMax: 10,
    minRateDescription: 'Not satisfied',
    maxRateDescription: 'Very satisfied',
    showLabels: true
  }}
  value={rating}
  onChange={setRating}
  theme={theme}
/>
```

#### Features

- Dynamic button sizing based on scale length
- Color coding for different rating types
- Touch and accessibility support
- Horizontal scrolling for long scales
- Visual feedback on selection

---

### RadioGroup

Component for single-choice questions.

#### Props

```tsx
interface RadioGroupProps {
  question: RadioGroupQuestion;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  theme: Theme;
}
```

#### Supported Question Properties

- `choices`: Array of choice objects with value and text
- `isRequired`: Required field validation

#### Example

```tsx
import { RadioGroup } from '@zenloop/react-native-sdk';

<RadioGroup
  question={{
    type: 'radiogroup',
    name: 'recommendation',
    title: 'Would you recommend our product?',
    choices: [
      { value: 'yes', text: 'Yes, definitely' },
      { value: 'maybe', text: 'Maybe' },
      { value: 'no', text: 'No, probably not' }
    ],
    isRequired: true
  }}
  value={recommendation}
  onChange={setRecommendation}
  theme={theme}
/>
```

#### Features

- Clear visual selection states
- Touch optimization
- Keyboard navigation
- Screen reader support
- Custom choice styling

---

### Checkbox

Component for multiple-choice questions.

#### Props

```tsx
interface CheckboxProps {
  question: CheckboxQuestion;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
  theme: Theme;
}
```

#### Supported Question Properties

- `choices`: Array of choice objects
- `minSelect`: Minimum required selections
- `maxSelect`: Maximum allowed selections
- `isRequired`: Required field validation

#### Example

```tsx
import { Checkbox } from '@zenloop/react-native-sdk';

<Checkbox
  question={{
    type: 'checkbox',
    name: 'features',
    title: 'Which features do you use most? (Select up to 3)',
    choices: [
      { value: 'analytics', text: 'Analytics Dashboard' },
      { value: 'reports', text: 'Custom Reports' },
      { value: 'api', text: 'API Access' },
      { value: 'integrations', text: 'Integrations' }
    ],
    minSelect: 1,
    maxSelect: 3,
    isRequired: true
  }}
  value={features}
  onChange={setFeatures}
  theme={theme}
/>
```

#### Features

- Multiple selection support
- Selection limit validation
- Visual selection counters
- Indeterminate states
- Batch selection/deselection

---

## Common Components

### LoadingIndicator

Displays loading state with customizable message and spinner.

#### Props

```tsx
interface LoadingIndicatorProps {
  theme: Theme;
  message?: string;
  size?: 'small' | 'large';
}
```

#### Example

```tsx
import { LoadingIndicator } from '@zenloop/react-native-sdk';

<LoadingIndicator
  theme={theme}
  message="Loading survey..."
  size="large"
/>
```

#### Features

- Animated spinner
- Customizable message
- Theme integration
- Accessibility announcements

---

### ErrorMessage

Displays error messages with optional retry functionality.

#### Props

```tsx
interface ErrorMessageProps {
  theme: Theme;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}
```

#### Example

```tsx
import { ErrorMessage } from '@zenloop/react-native-sdk';

<ErrorMessage
  theme={theme}
  message="Failed to load survey. Please check your connection."
  onRetry={handleRetry}
  retryText="Try Again"
/>
```

#### Features

- Clear error messaging
- Optional retry button
- Theme-aware styling
- Accessibility support

---

## Layout Components

### SurveyPage

Internal component that renders a single survey page with all its questions.

#### Props

```tsx
interface SurveyPageProps {
  page: Page;
  responses: ResponseData;
  errors: Record<string, string>;
  onResponseChange: (questionName: string, value: any) => void;
  theme: Theme;
}
```

#### Features

- Page title and description rendering
- Question iteration and rendering
- Scroll view with keyboard handling
- Error state management
- Theme consistency

---

### QuestionRenderer

Internal component that determines which question component to render based on question type.

#### Props

```tsx
interface QuestionRendererProps {
  question: Question;
  value?: any;
  onChange: (value: any) => void;
  error?: string;
  theme: Theme;
}
```

#### Features

- Type-safe question rendering
- Automatic component selection
- Props forwarding
- Error handling
- Theme propagation

---

## Styling and Theming

All components support comprehensive theming through the Theme system:

### Theme Structure

```tsx
interface Theme {
  colors: {
    primary: string;        // Main brand color
    secondary: string;      // Secondary brand color
    background: string;     // Page background
    surface: string;        // Card/surface background
    text: string;          // Primary text
    textSecondary: string; // Secondary text
    border: string;        // Border colors
    error: string;         // Error states
    success: string;       // Success states
    warning: string;       // Warning states
    info: string;          // Info states
    disabled: string;      // Disabled states
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: number;       // 14px
      medium: number;      // 16px
      large: number;       // 20px
      xlarge: number;      // 24px
    };
    fontWeight: {
      regular: string;     // '400'
      medium: string;      // '500'
      semibold: string;    // '600'
      bold: string;        // '700'
    };
  };
  spacing: {
    xs: number;            // 4px
    sm: number;            // 8px
    md: number;            // 16px
    lg: number;            // 24px
    xl: number;            // 32px
    xxl: number;           // 48px
  };
  borderRadius: {
    small: number;         // 4px
    medium: number;        // 8px
    large: number;         // 12px
    round: number;         // 999px
  };
}
```

### Custom Theme Example

```tsx
const customTheme: Partial<Theme> = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    background: '#FAFAFA',
    text: '#1F2937',
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: {
      large: 22,
      medium: 18,
    },
  },
  spacing: {
    md: 20,
    lg: 28,
  },
};
```

---

## Accessibility

All components include comprehensive accessibility support:

- **Screen Reader Support**: Proper labels and descriptions
- **Keyboard Navigation**: Tab order and focus management
- **Touch Targets**: Minimum 44pt touch targets
- **Color Contrast**: WCAG AA compliant color ratios
- **Announcements**: Dynamic content announcements
- **Reduced Motion**: Respects user motion preferences

### Accessibility Props

Components automatically include appropriate accessibility props:

```tsx
// Automatic accessibility features
accessibilityLabel="Question title"
accessibilityHint="Select your answer"
accessibilityRole="radio"
accessibilityState={{ selected: true }}
```

---

## Performance Optimizations

### Rendering Optimizations

- **React.memo**: Prevent unnecessary re-renders
- **Lazy Loading**: Components load only when needed
- **Image Optimization**: Optimized image loading
- **Debounced Input**: Prevent excessive state updates

### Memory Management

- **Cleanup**: Automatic cleanup of subscriptions
- **Weak References**: Prevent memory leaks
- **Efficient Updates**: Minimal DOM manipulation
- **Cached Styles**: StyleSheet caching

### Example Performance Usage

```tsx
// Memoized component to prevent re-renders
const MemoizedSurvey = React.memo(ZenloopSurvey);

// Debounced text input
const debouncedOnChange = useCallback(
  debounce((value) => setResponse('feedback', value), 300),
  []
);
```