/**
 * Zenloop React Native SDK Example App
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import BasicSurveyScreen from './src/screens/BasicSurveyScreen';
import ThemedSurveyScreen from './src/screens/ThemedSurveyScreen';
import CustomHookScreen from './src/screens/CustomHookScreen';
import LocalAPIScreen from './src/screens/LocalAPIScreen';

// Define navigation types
export type RootStackParamList = {
  Home: undefined;
  BasicSurvey: undefined;
  ThemedSurvey: undefined;
  CustomHook: undefined;
  LocalAPI: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Zenloop SDK Examples',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BasicSurvey"
            component={BasicSurveyScreen}
            options={{
              title: 'Basic Survey',
            }}
          />
          <Stack.Screen
            name="ThemedSurvey"
            component={ThemedSurveyScreen}
            options={{
              title: 'Themed Survey',
            }}
          />
          <Stack.Screen
            name="CustomHook"
            component={CustomHookScreen}
            options={{
              title: 'Custom Hook Example',
            }}
          />
          <Stack.Screen
            name="LocalAPI"
            component={LocalAPIScreen}
            options={{
              title: 'Local API Test',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;