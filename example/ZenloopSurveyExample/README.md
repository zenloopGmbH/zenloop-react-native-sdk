# Zenloop React Native SDK Example App

A comprehensive example application demonstrating the usage of the Zenloop React Native SDK.

## Features

This example app showcases:
- 📝 **Basic Survey Integration** - Simple drop-in component usage
- 🎨 **Themed Surveys** - Custom colors and styling  
- ⚡ **Custom Hook Usage** - Advanced control with `useSurvey` hook
- 🌐 **Local API Testing** - Configure and test with your local backend

## Setup

### Prerequisites

- Node.js 18+
- React Native development environment set up
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)
- Local Zenloop API running on port 8003 (optional)

### Installation

1. Navigate to the example directory:
```bash
cd /Users/admin/Documents/zenloop/ReactNativeSDK/example/ZenloopSurveyExample
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. For iOS, install CocoaPods:
```bash
cd ios
bundle install # First time only
bundle exec pod install
cd ..
```

## Running the App

### iOS
```bash
npm run ios
# or
yarn ios
```

### Android
```bash
npm run android
# or
yarn android
```

### Metro Bundler
If the bundler doesn't start automatically:
```bash
npm start
# or
yarn start
```

## Configuration

### Default Test Configuration
- **Organization ID**: 4145
- **Survey ID**: 1447
- **Local API URL**: http://localhost:8003/api/v2

### Testing with Local API

1. Start your local Zenloop API server on port 8003
2. For iOS Simulator: Use `localhost:8003`
3. For Android Emulator: Use `10.0.2.2:8003`
4. For Physical Device: Use your computer's IP address

## Examples Included

### 1. Basic Survey
Simple integration with minimal configuration:
```tsx
<ZenloopSurvey
  orgId="4145"
  surveyId="1447"
  apiUrl="http://localhost:8003/api/v2"
  onComplete={(responses) => console.log(responses)}
/>
```

### 2. Themed Survey
Custom styled survey with purple theme:
```tsx
const customTheme = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    // ... other colors
  }
};

<ZenloopSurvey
  theme={customTheme}
  // ... other props
/>
```

### 3. Custom Hook Example
Full control over survey flow:
```tsx
const {
  survey,
  responses,
  setResponse,
  nextPage,
  submitSurvey,
} = useSurvey({
  orgId: '4145',
  surveyId: '1447',
});
```

### 4. Local API Test
Dynamic configuration for testing different endpoints and surveys.

## Project Structure

```
ZenloopSurveyExample/
├── src/
│   └── screens/
│       ├── HomeScreen.tsx       # Main navigation menu
│       ├── BasicSurveyScreen.tsx # Basic integration example
│       ├── ThemedSurveyScreen.tsx # Custom theme example
│       ├── CustomHookScreen.tsx  # Advanced hook usage
│       └── LocalAPIScreen.tsx    # Configurable API testing
├── App.tsx                       # Navigation setup
├── metro.config.js              # Metro bundler config
└── package.json                 # Dependencies
```

## Troubleshooting

### SDK Not Found
If you get module resolution errors:
1. Ensure the SDK is built: `cd ../.. && npm run build`
2. Clear Metro cache: `npx react-native start --reset-cache`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### Network Errors
- iOS Simulator: Add `localhost` to Info.plist exceptions
- Android: Use `10.0.2.2` instead of `localhost`
- Physical Device: Use your computer's local IP

### Build Errors
- iOS: Clean build folder in Xcode (Cmd+Shift+K)
- Android: `cd android && ./gradlew clean`

## Development

This example uses a local file reference to the SDK:
```json
"@zenloop/react-native-sdk": "file:../../"
```

Changes to the SDK source will be reflected after reloading the Metro bundler.

## Hot Reload

The app supports Fast Refresh:
- **Android**: Press <kbd>R</kbd> twice or <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>M</kbd> → Reload
- **iOS**: Press <kbd>R</kbd> in the simulator

## License

MIT