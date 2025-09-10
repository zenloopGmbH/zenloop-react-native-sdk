# Zenloop React Native SDK

A comprehensive React Native SDK for embedding Zenloop surveys directly into your mobile applications. This SDK provides native UI components for rendering surveys without the need for WebViews, ensuring optimal performance and seamless integration with your app's design system.

[![npm version](https://badge.fury.io/js/%40zenloop%2Freact-native-sdk.svg)](https://badge.fury.io/js/%40zenloop%2Freact-native-sdk)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Native Components** - Fully native React Native components, no WebViews
- 🎨 **Customizable Themes** - Complete theming system with colors, typography, and spacing
- 📱 **Cross-Platform** - Works seamlessly on iOS and Android
- 🔧 **TypeScript Support** - Full TypeScript definitions included
- 🎯 **Question Types** - Support for text, rating, radio, checkbox, and comment questions
- 📊 **Progress Tracking** - Built-in progress indicators and navigation
- 🌐 **API Integration** - Automatic survey fetching and response submission
- 🔄 **Hooks API** - React hooks for advanced customization
- 📦 **Expo Compatible** - Works with both Expo and bare React Native projects

## Installation

```bash
npm install @zenloop/react-native-sdk
```

### iOS Setup

For iOS, add network security exception for localhost (if using local API):

```xml
<!-- ios/YourApp/Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSExceptionDomains</key>
  <dict>
    <key>localhost</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```

### Android Setup

No additional setup required for Android.

## Quick Start

### Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { ZenloopSurvey } from '@zenloop/react-native-sdk';

export default function App() {
  const handleComplete = (responses) => {
    console.log('Survey completed:', responses);
  };

  const handleError = (error) => {
    console.error('Survey error:', error);
  };

  return (
    <View style={{ flex: 1 }}>
      <ZenloopSurvey
        orgId="your-org-id"
        surveyId="your-survey-id"
        apiUrl="https://your-api.com/api/v2"
        onComplete={handleComplete}
        onError={handleError}
      />
    </View>
  );
}
```

### Custom Theme

```tsx
import { ZenloopSurvey, Theme } from '@zenloop/react-native-sdk';

const customTheme: Partial<Theme> = {
  colors: {
    primary: '#007AFF',
    secondary: '#34C759',
    background: '#FFFFFF',
    text: '#000000',
  },
  typography: {
    fontSize: {
      large: 20,
      medium: 16,
    },
  },
  spacing: {
    md: 16,
    lg: 24,
  },
};

<ZenloopSurvey
  orgId="your-org-id"
  surveyId="your-survey-id"
  theme={customTheme}
  onComplete={handleComplete}
/>
```

### Advanced Usage with Hooks

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSurvey } from '@zenloop/react-native-sdk';

export default function CustomSurvey() {
  const {
    survey,
    responses,
    currentPage,
    isLoading,
    isCompleted,
    setResponse,
    nextPage,
    previousPage,
    submitSurvey,
  } = useSurvey({
    orgId: 'your-org-id',
    surveyId: 'your-survey-id',
    apiUrl: 'https://your-api.com/api/v2',
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isCompleted) return <Text>Thank you!</Text>;

  return (
    <View>
      {/* Render current page questions */}
      {currentPage?.questions.map((question) => (
        <View key={question.name}>
          <Text>{question.title}</Text>
          {/* Render question component based on type */}
        </View>
      ))}
      
      <TouchableOpacity onPress={nextPage}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## API Reference

### ZenloopSurvey Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `orgId` | `string` | ✅ | Your organization ID |
| `surveyId` | `string` | ✅ | The survey ID to display |
| `apiUrl` | `string` | ❌ | Custom API endpoint URL |
| `apiKey` | `string` | ❌ | API key for authentication |
| `theme` | `Partial<Theme>` | ❌ | Custom theme configuration |
| `onComplete` | `(responses: ResponseData) => void` | ❌ | Called when survey is completed |
| `onError` | `(error: string) => void` | ❌ | Called when an error occurs |
| `initialResponses` | `ResponseData` | ❌ | Pre-filled responses |
| `showProgress` | `boolean` | ❌ | Show progress indicator (default: true) |

### useSurvey Hook

```tsx
const {
  survey,           // Survey data
  responses,        // Current responses
  currentPage,      // Current page data
  isLoading,        // Loading state
  isSubmitting,     // Submitting state
  isCompleted,      // Completion state
  setResponse,      // Set response for a question
  nextPage,         // Navigate to next page
  previousPage,     // Navigate to previous page
  submitSurvey,     // Submit the survey
} = useSurvey(config);
```

## Supported Question Types

### Text Input
```json
{
  "type": "text",
  "name": "feedback",
  "title": "Your feedback",
  "isRequired": true,
  "placeholder": "Enter your feedback..."
}
```

### Rating Scale
```json
{
  "type": "rating",
  "name": "satisfaction",
  "title": "How satisfied are you?",
  "rateMin": 0,
  "rateMax": 10,
  "minRateDescription": "Not satisfied",
  "maxRateDescription": "Very satisfied"
}
```

### Radio Group
```json
{
  "type": "radiogroup",
  "name": "recommendation",
  "title": "Would you recommend us?",
  "choices": [
    {"value": "yes", "text": "Yes"},
    {"value": "no", "text": "No"}
  ]
}
```

### Checkbox
```json
{
  "type": "checkbox",
  "name": "features",
  "title": "Which features do you use?",
  "choices": [
    {"value": "feature1", "text": "Feature 1"},
    {"value": "feature2", "text": "Feature 2"}
  ],
  "minSelect": 1,
  "maxSelect": 3
}
```

### Comment
```json
{
  "type": "comment",
  "name": "suggestions",
  "title": "Any suggestions?",
  "rows": 4,
  "placeholder": "Your suggestions..."
}
```

## Theme System

The SDK provides a comprehensive theming system:

```tsx
interface Theme {
  colors: {
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
  };
  typography: {
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
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    round: number;
  };
}
```

## Error Handling

The SDK provides comprehensive error handling:

```tsx
<ZenloopSurvey
  orgId="your-org-id"
  surveyId="your-survey-id"
  onError={(error) => {
    // Handle different error types
    if (error.includes('network')) {
      // Handle network errors
    } else if (error.includes('survey not found')) {
      // Handle survey not found
    }
    // Show user-friendly error message
  }}
/>
```

## Examples

Check out the [example applications](./example/) to see the SDK in action:

- **Basic Example**: Simple survey integration
- **Themed Example**: Custom styled surveys
- **Expo Example**: Expo-compatible implementation
- **Custom Hook Example**: Advanced usage with hooks

## Development

### Running the Example Apps

```bash
# React Native example
cd example/ZenloopSurveyExample
npm install
npm run ios  # or npm run android

# Expo example
cd example/ZenloopExpoExample
npm install
npx expo start
```

### Building the SDK

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Troubleshooting

### Common Issues

**SDK not found errors:**
```bash
cd path/to/sdk && npm run build
npx react-native start --reset-cache
```

**Network errors:**
- iOS: Add localhost to Info.plist exceptions
- Android: Use `10.0.2.2` instead of `localhost` for emulator
- Physical devices: Use your computer's IP address

**TypeScript errors:**
Make sure you have the correct versions:
```json
{
  "@types/react": "~18.2.14",
  "typescript": "^5.1.3"
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the SDK: `npm run build`
4. Run the example app to test changes

## License

MIT © [Zenloop](https://zenloop.com)

## Support

- 📖 [Documentation](https://docs.zenloop.com)
- 💬 [GitHub Issues](https://github.com/zenloop/react-native-sdk/issues)
- 📧 [Support Email](mailto:support@zenloop.com)

---

Made with ❤️ by the [Zenloop](https://zenloop.com) team