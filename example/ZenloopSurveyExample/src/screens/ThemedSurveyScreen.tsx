import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ZenloopSurvey, Theme } from '@zenloop/react-native-sdk';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeScreen';

type ThemedSurveyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ThemedSurvey'
>;

interface Props {
  navigation: ThemedSurveyScreenNavigationProp;
}

const ThemedSurveyScreen: React.FC<Props> = ({ navigation }) => {
  // Custom purple theme
  const customTheme: Partial<Theme> = {
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: '#FAFAFA',
      surface: '#F3E8FF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
      disabled: '#D1D5DB',
    },
    typography: {
      fontFamily: 'System',
      fontSize: {
        small: 14,
        medium: 18,
        large: 22,
        xlarge: 28,
      },
    },
    borderRadius: {
      small: 6,
      medium: 12,
      large: 18,
      round: 999,
    },
  };

  const handleComplete = (responses: any) => {
    Alert.alert(
      '🎉 Survey Completed!',
      'Thank you for your feedback!',
      [
        {
          text: 'View Responses',
          onPress: () => {
            Alert.alert('Responses', JSON.stringify(responses, null, 2));
          },
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
      ]
    );
  };

  const handleError = (error: string) => {
    Alert.alert('Survey Error', error, [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ZenloopSurvey
        orgId="4145"
        surveyId="1447"
        apiUrl="http://localhost:8003/api/v2"
        theme={customTheme}
        onComplete={handleComplete}
        onError={handleError}
        showProgress={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
});

export default ThemedSurveyScreen;