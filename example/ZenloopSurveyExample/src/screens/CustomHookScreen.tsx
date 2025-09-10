import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSurvey, ThemeProvider, defaultTheme, QuestionRenderer } from '@zenloop/react-native-sdk';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeScreen';

type CustomHookScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomHook'
>;

interface Props {
  navigation: CustomHookScreenNavigationProp;
}

const CustomHookScreen: React.FC<Props> = ({ navigation }) => {
  const {
    survey,
    isLoading,
    isSubmitting,
    isCompleted,
    currentPageIndex,
    totalPages,
    responses,
    errors,
    progress,
    setResponse,
    nextPage,
    previousPage,
    submitSurvey,
    validateCurrentPage,
  } = useSurvey({
    orgId: '4145',
    surveyId: '1447',
    apiUrl: 'http://localhost:8003/api/v2',
    onComplete: (responses) => {
      Alert.alert(
        'Survey Completed!',
        'Your responses have been submitted.',
        [
          {
            text: 'View Responses',
            onPress: () => Alert.alert('Responses', JSON.stringify(responses, null, 2)),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    },
    onError: (error) => {
      Alert.alert('Error', error);
    },
  });

  const handleNext = async () => {
    if (currentPageIndex === totalPages - 1) {
      // Last page - submit
      await submitSurvey();
    } else {
      // Go to next page
      const valid = nextPage();
      if (!valid) {
        Alert.alert('Validation Error', 'Please fill all required fields');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading survey...</Text>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.completedIcon}>✅</Text>
        <Text style={styles.completedTitle}>Thank You!</Text>
        <Text style={styles.completedText}>Your response has been submitted.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Examples</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!survey) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load survey</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentPage = survey.surveyJson.pages[currentPageIndex];

  return (
    <ThemeProvider theme={defaultTheme}>
      <View style={styles.container}>
        {/* Custom Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentPageIndex + 1} of {totalPages}
          </Text>
        </View>

        {/* Survey Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {currentPage.title && (
            <Text style={styles.pageTitle}>{currentPage.title}</Text>
          )}
          
          {currentPage.description && (
            <Text style={styles.pageDescription}>{currentPage.description}</Text>
          )}

          {/* Render Questions */}
          {currentPage.questions.map((question, index) => (
            <View key={question.name || index} style={styles.questionWrapper}>
              <QuestionRenderer
                question={question}
                value={responses[question.name]}
                onChange={(value) => setResponse(question.name, value)}
                error={errors[question.name]}
                theme={defaultTheme}
              />
            </View>
          ))}

          {/* Debug Info */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>Current Responses:</Text>
            <Text style={styles.debugCode}>{JSON.stringify(responses, null, 2)}</Text>
          </View>
        </ScrollView>

        {/* Custom Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentPageIndex === 0 && styles.navButtonDisabled]}
            onPress={previousPage}
            disabled={currentPageIndex === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
                {currentPageIndex === totalPages - 1 ? 'Submit' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  completedIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  completedText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pageDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  questionWrapper: {
    marginBottom: 20,
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  debugCode: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: '#333',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  navButtonPrimary: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  navButtonTextPrimary: {
    color: 'white',
  },
});

export default CustomHookScreen;