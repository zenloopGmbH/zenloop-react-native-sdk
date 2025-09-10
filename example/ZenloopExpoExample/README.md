# Zenloop React Native SDK Expo Example

A comprehensive Expo-based example application demonstrating the usage of the Zenloop React Native SDK.

## Features

This example app showcases:
- 📝 **Basic Survey Integration** - Simple drop-in component usage
- 🎨 **Themed Surveys** - Custom colors and styling  
- ⚡ **Custom Hook Usage** - Advanced control with `useSurvey` hook
- 🌐 **Local API Testing** - Configure and test with your local backend

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS: Expo Go app or iOS Simulator
- Android: Expo Go app or Android Emulator
- Local Zenloop API running on port 8003 (optional)

### Installation

1. Navigate to the example directory:
```bash
cd /Users/admin/Documents/zenloop/ReactNativeSDK/example/ZenloopExpoExample
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Start the Expo development server:
```bash
npx expo start
```

This will open the Expo developer tools in your browser. From there you can:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Alternative commands:

```bash
# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Run in web browser
npx expo start --web
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
5. For Expo Go: Use your computer's IP address (find it with `ipconfig` or `ifconfig`)

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
ZenloopExpoExample/
├── src/
│   └── screens/
│       ├── HomeScreen.tsx       # Main navigation menu
│       ├── BasicSurveyScreen.tsx # Basic integration example
│       ├── ThemedSurveyScreen.tsx # Custom theme example
│       ├── CustomHookScreen.tsx  # Advanced hook usage
│       └── LocalAPIScreen.tsx    # Configurable API testing
├── App.tsx                       # Navigation setup
├── app.json                      # Expo configuration
├── metro.config.js              # Metro bundler config
└── package.json                 # Dependencies
```

## Troubleshooting

### SDK Not Found
If you get module resolution errors:
1. Ensure the SDK is built: `cd ../.. && npm run build`
2. Clear Metro cache: `npx expo start -c`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### Network Errors
- iOS Simulator: Already configured for `localhost` in app.json
- Android: Use `10.0.2.2` instead of `localhost`
- Physical Device/Expo Go: Use your computer's local IP (e.g., `192.168.1.100:8003`)

### Build Errors
- Clear Expo cache: `npx expo start -c`
- Reset project: `npx expo prebuild --clean`

## Development

This example uses a local file reference to the SDK:
```json
"@zenloop/react-native-sdk": "file:../../"
```

Changes to the SDK source will be reflected after reloading the app.

## Hot Reload

The app supports Fast Refresh:
- **Expo Go**: Shake device and select "Reload"
- **Simulator**: Press <kbd>R</kbd> to reload
- Changes are usually reflected automatically

## Using Expo Go

1. Install Expo Go on your device from the App Store or Google Play
2. Start the development server: `npx expo start`
3. Scan the QR code displayed in the terminal or browser
4. Make sure your device is on the same network as your computer
5. For local API access, update the API URL to use your computer's IP address

## License

MIT