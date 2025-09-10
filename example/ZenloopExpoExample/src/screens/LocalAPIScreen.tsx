import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ZenloopSurvey } from '@zenloop/react-native-sdk';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeScreen';

type LocalAPIScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LocalAPI'
>;

interface Props {
  navigation: LocalAPIScreenNavigationProp;
}

const LocalAPIScreen: React.FC<Props> = ({ navigation }) => {
  const [config, setConfig] = useState({
    apiUrl: 'http://localhost:8003/api/v2',
    orgId: '4145',
    surveyId: '1447',
    apiKey: '',
  });
  const [showSurvey, setShowSurvey] = useState(false);

  const handleStartSurvey = () => {
    if (!config.orgId || !config.surveyId) {
      Alert.alert('Error', 'Please enter Org ID and Survey ID');
      return;
    }
    setShowSurvey(true);
  };

  const handleComplete = (responses: any) => {
    Alert.alert(
      'Survey Completed!',
      `Responses submitted successfully`,
      [
        {
          text: 'View Responses',
          onPress: () => {
            Alert.alert('Responses', JSON.stringify(responses, null, 2));
          },
        },
        {
          text: 'Done',
          onPress: () => {
            setShowSurvey(false);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleError = (error: string) => {
    Alert.alert('Survey Error', error, [
      {
        text: 'Edit Config',
        onPress: () => setShowSurvey(false),
      },
      {
        text: 'Go Back',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  if (showSurvey) {
    return (
      <View style={styles.container}>
        <ZenloopSurvey
          orgId={config.orgId}
          surveyId={config.surveyId}
          apiUrl={config.apiUrl}
          apiKey={config.apiKey || undefined}
          onComplete={handleComplete}
          onError={handleError}
          showProgress={true}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Local API Configuration</Text>
          <Text style={styles.subtitle}>
            Configure and test your local Zenloop API
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>API URL</Text>
            <TextInput
              style={styles.input}
              value={config.apiUrl}
              onChangeText={(text) => setConfig({ ...config, apiUrl: text })}
              placeholder="http://localhost:8003/api/v2"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>Your local API endpoint</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Organization ID</Text>
            <TextInput
              style={styles.input}
              value={config.orgId}
              onChangeText={(text) => setConfig({ ...config, orgId: text })}
              placeholder="4145"
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Your organization identifier</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Survey ID</Text>
            <TextInput
              style={styles.input}
              value={config.surveyId}
              onChangeText={(text) => setConfig({ ...config, surveyId: text })}
              placeholder="1447"
            />
            <Text style={styles.hint}>The survey to load</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>API Key (Optional)</Text>
            <TextInput
              style={styles.input}
              value={config.apiKey}
              onChangeText={(text) => setConfig({ ...config, apiKey: text })}
              placeholder="Enter API key if required"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
            />
            <Text style={styles.hint}>Leave empty for public surveys</Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartSurvey}
          >
            <Text style={styles.startButtonText}>Start Survey</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Testing Tips</Text>
            <Text style={styles.infoText}>
              • Make sure your local API is running on port 8003
            </Text>
            <Text style={styles.infoText}>
              • For iOS Simulator, use 'localhost'
            </Text>
            <Text style={styles.infoText}>
              • For Android Emulator, use '10.0.2.2:8003'
            </Text>
            <Text style={styles.infoText}>
              • For physical device, use your computer's IP address
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF20',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default LocalAPIScreen;