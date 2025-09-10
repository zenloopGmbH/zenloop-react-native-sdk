import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ZenloopSurvey } from '@zenloop/react-native-sdk';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeScreen';

type BasicSurveyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BasicSurvey'
>;

interface Props {
  navigation: BasicSurveyScreenNavigationProp;
}

const BasicSurveyScreen: React.FC<Props> = ({ navigation }) => {
  const handleComplete = (responses: any) => {
    Alert.alert(
      'Survey Completed!',
      `Responses received: ${JSON.stringify(responses, null, 2)}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
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
    backgroundColor: '#fff',
  },
});

export default BasicSurveyScreen;