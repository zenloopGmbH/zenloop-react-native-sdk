# Examples Guide

This document provides comprehensive examples for using the Zenloop React Native SDK in various scenarios.

## Table of Contents

- [Basic Integration](#basic-integration)
- [Custom Theming](#custom-theming)
- [Advanced Hook Usage](#advanced-hook-usage)
- [Error Handling](#error-handling)
- [Form Integration](#form-integration)
- [Multi-Step Surveys](#multi-step-surveys)
- [Offline Support](#offline-support)
- [Analytics Integration](#analytics-integration)
- [Custom Components](#custom-components)

---

## Basic Integration

### Simple Survey Embedding

The most straightforward way to add a survey to your React Native app:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ZenloopSurvey } from '@zenloop/react-native-sdk';

export default function BasicSurveyScreen() {
  const handleComplete = (responses) => {
    console.log('Survey completed with responses:', responses);
    // Navigate to thank you screen or handle completion
  };

  const handleError = (error) => {
    console.error('Survey error:', error);
    // Show error message to user
  };

  return (
    <View style={styles.container}>
      <ZenloopSurvey
        orgId="4145"
        surveyId="1447"
        apiUrl="https://api.zenloop.com/api/v2"
        onComplete={handleComplete}
        onError={handleError}
        showProgress={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

### With Navigation Integration

Integrating with React Navigation:

```tsx
import React from 'react';
import { View } from 'react-native';
import { ZenloopSurvey } from '@zenloop/react-native-sdk';
import { useNavigation } from '@react-navigation/native';

export default function SurveyScreen() {
  const navigation = useNavigation();

  const handleComplete = (responses) => {
    // Store responses if needed
    console.log('Survey responses:', responses);
    
    // Navigate to success screen
    navigation.navigate('SurveySuccess', { responses });
  };

  const handleError = (error) => {
    // Navigate to error screen or show alert
    navigation.navigate('SurveyError', { error });
  };

  return (
    <View style={{ flex: 1 }}>
      <ZenloopSurvey
        orgId="your-org-id"
        surveyId="your-survey-id"
        onComplete={handleComplete}
        onError={handleError}
      />
    </View>
  );
}
```

---

## Custom Theming

### Brand-Matched Theme

Create a theme that matches your app's brand:

```tsx
import React from 'react';
import { ZenloopSurvey, Theme } from '@zenloop/react-native-sdk';

const brandTheme: Partial<Theme> = {
  colors: {
    primary: '#FF6B6B',        // Your brand primary
    secondary: '#4ECDC4',      // Your brand secondary
    background: '#F8F9FA',     // Light background
    surface: '#FFFFFF',        // Card background
    text: '#2D3436',           // Dark text
    textSecondary: '#636E72',  // Muted text
    border: '#DDD',            // Light borders
    error: '#E17055',          // Error red
    success: '#00B894',        // Success green
    warning: '#FDCB6E',        // Warning yellow
  },
  typography: {
    fontFamily: 'Inter',       // Your app font
    fontSize: {
      small: 14,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 999,
  },
};

export default function ThemedSurveyScreen() {
  return (
    <ZenloopSurvey
      orgId="your-org-id"
      surveyId="your-survey-id"
      theme={brandTheme}
      onComplete={(responses) => {
        console.log('Themed survey completed:', responses);
      }}
    />
  );
}
```

### Dark Mode Support

Implementing dark mode theme switching:

```tsx
import React from 'react';
import { useColorScheme } from 'react-native';
import { ZenloopSurvey, Theme } from '@zenloop/react-native-sdk';

const lightTheme: Partial<Theme> = {
  colors: {
    primary: '#007AFF',
    secondary: '#34C759',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#3C3C43',
    border: '#C6C6C8',
  },
};

const darkTheme: Partial<Theme> = {
  colors: {
    primary: '#0A84FF',
    secondary: '#32D74B',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    border: '#38383A',
  },
};

export default function AdaptiveThemeSurvey() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ZenloopSurvey
      orgId="your-org-id"
      surveyId="your-survey-id"
      theme={theme}
      onComplete={(responses) => {
        console.log('Adaptive survey completed:', responses);
      }}
    />
  );
}
```

---

## Advanced Hook Usage

### Custom Survey Flow

Building a completely custom survey experience:

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSurvey, QuestionRenderer } from '@zenloop/react-native-sdk';

export default function CustomSurveyFlow() {
  const [showIntro, setShowIntro] = useState(true);

  const {
    survey,
    responses,
    currentPage,
    currentPageIndex,
    totalPages,
    isLoading,
    isSubmitting,
    isCompleted,
    errors,
    setResponse,
    nextPage,
    previousPage,
    submitSurvey,
  } = useSurvey({
    orgId: 'your-org-id',
    surveyId: 'your-survey-id',
    onComplete: (responses) => {
      Alert.alert('Thank You!', 'Your feedback has been submitted.');
      console.log('Survey completed:', responses);
    },
    onError: (error) => {
      Alert.alert('Error', error);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading your survey...</Text>
      </View>
    );
  }

  if (showIntro && survey) {
    return (
      <View style={styles.container}>
        <View style={styles.introCard}>
          <Text style={styles.title}>{survey.surveyName}</Text>
          <Text style={styles.description}>
            {survey.surveyDescription || 'We value your feedback!'}
          </Text>
          <Text style={styles.info}>
            This survey has {totalPages} pages and takes about 2 minutes to complete.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowIntro(false)}
          >
            <Text style={styles.startButtonText}>Start Survey</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.center}>
        <Text style={styles.thankYou}>🎉 Thank You!</Text>
        <Text style={styles.message}>
          Your feedback has been submitted successfully.
        </Text>
      </View>
    );
  }

  if (!currentPage) {
    return (
      <View style={styles.center}>
        <Text>No survey page available.</Text>
      </View>
    );
  }

  const progress = ((currentPageIndex + 1) / totalPages) * 100;
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  return (
    <View style={styles.container}>
      {/* Custom Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentPageIndex + 1} of {totalPages}
        </Text>
      </View>

      {/* Page Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentPage.title && (
          <Text style={styles.pageTitle}>{currentPage.title}</Text>
        )}
        
        {currentPage.description && (
          <Text style={styles.pageDescription}>{currentPage.description}</Text>
        )}

        {/* Render Questions */}
        {currentPage.questions.map((question, index) => (
          <View key={question.name || index} style={styles.questionContainer}>
            <QuestionRenderer
              question={question}
              value={responses[question.name]}
              onChange={(value) => setResponse(question.name, value)}
              error={errors[question.name]}
            />
          </View>
        ))}
      </ScrollView>

      {/* Custom Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton, isFirstPage && styles.disabled]}
          onPress={previousPage}
          disabled={isFirstPage}
        >
          <Text style={styles.navButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={isLastPage ? submitSurvey : nextPage}
          disabled={isSubmitting}
        >
          <Text style={[styles.navButtonText, styles.nextButtonText]}>
            {isSubmitting ? 'Submitting...' : isLastPage ? 'Submit' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  introCard: {
    margin: 20,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pageDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  questionContainer: {
    marginBottom: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButtonText: {
    color: '#fff',
  },
  thankYou: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
```

---

## Error Handling

### Comprehensive Error Management

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ZenloopSurvey } from '@zenloop/react-native-sdk';

export default function ErrorHandledSurvey() {
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleError = (error: string) => {
    setLastError(error);
    console.error('Survey Error:', error);

    // Handle different error types
    if (error.includes('network') || error.includes('timeout')) {
      handleNetworkError(error);
    } else if (error.includes('not found')) {
      handleNotFoundError(error);
    } else if (error.includes('validation')) {
      handleValidationError(error);
    } else {
      handleGenericError(error);
    }
  };

  const handleNetworkError = (error: string) => {
    if (retryCount < 3) {
      Alert.alert(
        'Connection Issue',
        'Unable to connect to the survey service. Would you like to retry?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Retry',
            onPress: () => {
              setRetryCount(prev => prev + 1);
              // The component will automatically retry
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Connection Failed',
        'Unable to load the survey after multiple attempts. Please check your internet connection and try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNotFoundError = (error: string) => {
    Alert.alert(
      'Survey Not Available',
      'The requested survey could not be found. Please contact support if this issue persists.',
      [{ text: 'OK' }]
    );
  };

  const handleValidationError = (error: string) => {
    Alert.alert(
      'Validation Error',
      'There was an issue with your survey responses. Please review your answers and try again.',
      [{ text: 'OK' }]
    );
  };

  const handleGenericError = (error: string) => {
    Alert.alert(
      'Unexpected Error',
      'An unexpected error occurred while loading the survey. Please try again later.',
      [{ text: 'OK' }]
    );
  };

  const handleComplete = (responses: any) => {
    // Reset error state on successful completion
    setRetryCount(0);
    setLastError(null);
    
    console.log('Survey completed successfully:', responses);
    
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ZenloopSurvey
        orgId="your-org-id"
        surveyId="your-survey-id"
        apiUrl="https://api.zenloop.com/api/v2"
        onComplete={handleComplete}
        onError={handleError}
        key={retryCount} // Force re-mount on retry
      />
      
      {/* Debug info in development */}
      {__DEV__ && lastError && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffebee',
          padding: 10,
        }}>
          <Text style={{ fontSize: 12, color: '#c62828' }}>
            Last Error: {lastError}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Retry Count: {retryCount}
          </Text>
        </View>
      )}
    </View>
  );
}
```

---

## Form Integration

### Survey as Part of Larger Form

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSurvey } from '@zenloop/react-native-sdk';

export default function FormWithSurvey() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: '',
  });

  const {
    survey,
    responses: surveyResponses,
    isLoading: surveyLoading,
    setResponse,
    submitSurvey,
  } = useSurvey({
    orgId: 'your-org-id',
    surveyId: 'your-survey-id',
    onComplete: (responses) => {
      console.log('Survey part completed:', responses);
    },
  });

  const handleSubmitAll = async () => {
    try {
      // Validate user info
      if (!userInfo.name || !userInfo.email) {
        alert('Please fill in all required fields');
        return;
      }

      // Submit survey responses
      await submitSurvey();
      
      // Submit combined data to your backend
      const combinedData = {
        userInfo,
        surveyResponses,
        timestamp: new Date().toISOString(),
      };

      console.log('Submitting combined data:', combinedData);
      
      // Your API call here
      // await submitFormData(combinedData);
      
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit form');
    }
  };

  if (surveyLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading survey...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Your Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={userInfo.name}
          onChangeText={(text) => setUserInfo(prev => ({ ...prev, name: text }))}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={userInfo.email}
          onChangeText={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company</Text>
        <TextInput
          style={styles.input}
          value={userInfo.company}
          onChangeText={(text) => setUserInfo(prev => ({ ...prev, company: text }))}
          placeholder="Enter your company"
        />
      </View>

      <Text style={styles.sectionTitle}>Feedback Survey</Text>
      
      {survey && (
        <View style={styles.surveyContainer}>
          {survey.surveyJson.pages[0]?.questions.map((question, index) => (
            <View key={question.name || index} style={styles.questionContainer}>
              <Text style={styles.questionTitle}>{question.title}</Text>
              {/* Render question based on type - simplified for example */}
              {question.type === 'text' && (
                <TextInput
                  style={styles.input}
                  value={surveyResponses[question.name] || ''}
                  onChangeText={(text) => setResponse(question.name, text)}
                  placeholder={question.placeHolder || 'Enter your answer'}
                />
              )}
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAll}>
        <Text style={styles.submitButtonText}>Submit Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  surveyContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

---

## Multi-Step Surveys

### Wizard-Style Survey Flow

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSurvey } from '@zenloop/react-native-sdk';

export default function WizardSurvey() {
  const [slideAnim] = useState(new Animated.Value(0));

  const {
    survey,
    responses,
    currentPageIndex,
    totalPages,
    currentPage,
    isLoading,
    isCompleted,
    nextPage,
    previousPage,
    setResponse,
    submitSurvey,
  } = useSurvey({
    orgId: 'your-org-id',
    surveyId: 'your-survey-id',
  });

  const animateTransition = (direction: 'forward' | 'backward') => {
    const toValue = direction === 'forward' ? -50 : 50;
    
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    animateTransition('forward');
    setTimeout(() => nextPage(), 100);
  };

  const handlePrevious = () => {
    animateTransition('backward');
    setTimeout(() => previousPage(), 100);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading survey...</Text>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.center}>
        <Text style={styles.completedTitle}>🎉 Survey Complete!</Text>
        <Text style={styles.completedMessage}>
          Thank you for taking the time to provide your feedback.
        </Text>
      </View>
    );
  }

  if (!currentPage) return null;

  const progress = ((currentPageIndex + 1) / totalPages) * 100;
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicatorContainer}>
        {Array.from({ length: totalPages }, (_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index <= currentPageIndex && styles.stepDotActive,
            ]}
          />
        ))}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Page Counter */}
      <Text style={styles.pageCounter}>
        Step {currentPageIndex + 1} of {totalPages}
      </Text>

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.pageCard}>
          <Text style={styles.pageTitle}>{currentPage.title}</Text>
          
          {currentPage.description && (
            <Text style={styles.pageDescription}>
              {currentPage.description}
            </Text>
          )}

          {/* Questions */}
          {currentPage.questions.map((question, index) => (
            <View key={question.name || index} style={styles.questionContainer}>
              <Text style={styles.questionTitle}>{question.title}</Text>
              
              {/* Simplified question rendering - expand based on your needs */}
              {question.type === 'rating' && (
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.ratingButton,
                        responses[question.name] === i && styles.ratingButtonSelected,
                      ]}
                      onPress={() => setResponse(question.name, i)}
                    >
                      <Text
                        style={[
                          styles.ratingButtonText,
                          responses[question.name] === i && styles.ratingButtonTextSelected,
                        ]}
                      >
                        {i}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton, isFirstPage && styles.disabled]}
          onPress={handlePrevious}
          disabled={isFirstPage}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={isLastPage ? submitSurvey : handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastPage ? 'Submit' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e9ecef',
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: '#007AFF',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e9ecef',
    marginHorizontal: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  pageCounter: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    padding: 10,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  pageCard: {
    margin: 20,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  ratingButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  ratingButtonTextSelected: {
    color: '#fff',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  completedMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
```

---

This comprehensive examples guide provides practical implementations for various use cases. Each example is fully functional and can be adapted to your specific needs. The examples progress from basic to advanced usage, covering theming, error handling, form integration, and custom UI implementations.