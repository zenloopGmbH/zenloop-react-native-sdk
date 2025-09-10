import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  BasicSurvey: undefined;
  ThemedSurvey: undefined;
  CustomHook: undefined;
  LocalAPI: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const examples = [
    {
      title: '📝 Basic Survey',
      description: 'Simple survey integration with default settings',
      screen: 'BasicSurvey' as const,
    },
    {
      title: '🎨 Themed Survey',
      description: 'Survey with custom theme and colors',
      screen: 'ThemedSurvey' as const,
    },
    {
      title: '⚡ Custom Hook Usage',
      description: 'Advanced control using useSurvey hook',
      screen: 'CustomHook' as const,
    },
    {
      title: '🌐 Local API Test',
      description: 'Test with local API (localhost:8003)',
      screen: 'LocalAPI' as const,
    },
  ];

  const handlePress = (screen: keyof RootStackParamList) => {
    if (screen === 'Home') return;
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zenloop Survey SDK</Text>
        <Text style={styles.subtitle}>React Native Examples</Text>
      </View>

      <View style={styles.examplesContainer}>
        {examples.map((example, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handlePress(example.screen)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardTitle}>{example.title}</Text>
            <Text style={styles.cardDescription}>{example.description}</Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Test Configuration</Text>
        <Text style={styles.infoText}>• Org ID: 4145</Text>
        <Text style={styles.infoText}>• Survey ID: 1447</Text>
        <Text style={styles.infoText}>• Local API: http://localhost:8003</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  examplesContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 60,
  },
  cardArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12,
  },
  arrowText: {
    fontSize: 24,
    color: '#007AFF',
  },
  info: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
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
  },
});

export default HomeScreen;