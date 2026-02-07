# Atmos - Weather Forecast App

A modern, beautifully designed weather application built with React Native and Expo. Get real-time weather information and forecasts for your current location with an intuitive user interface and smooth animations.

## Features

- **Current Weather Display**: View real-time temperature, weather conditions, and weather descriptions for your current location
- **5-Day Forecast**: See detailed 5-day weather forecasts with hourly breakdowns
- **Location Services**: Automatic detection and tracking of your current location
- **Beautiful UI**: Dynamic weather-appropriate background images and weather icons
- **Responsive Design**: Works seamlessly on iOS, Android, and web platforms
- **Weather Icons**: Large, clear weather condition icons for intuitive weather visualization
- **Dynamic Backgrounds**: Background images that change based on current weather conditions
- **Loading States**: Smooth loading indicators while fetching data
- **Error Handling**: User-friendly error messages with quick access to settings when needed

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Weather Data**: OpenWeather API
- **Location Services**: Expo Location
- **UI Components**: React Native native components
- **Animations**: Lottie React Native for smooth animations
- **Icons**: Expo Vector Icons (Ionicons)
- **Date/Time**: Day.js for date manipulation
- **Maps**: React Native Maps support
- **State Management**: React Hooks

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI**: `npm install -g expo-cli`
- **OpenWeather API Key**: Get one free at [openweathermap.org](https://openweathermap.org/api)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/pthanksdev/Atmos_Weather_App.git
cd Atmos_Weather_App-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with your OpenWeather API key:

```env
EXPO_PUBLIC_OPEN_WEATHER_KEY=your_api_key_here
```

### 4. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open on iOS simulator
- Press `a` to open on Android emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
bweather-main/
├── app/                          # App screens and navigation
│   ├── _layout.tsx              # Root layout component
│   └── index.tsx                # Main weather screen
├── assets/                       # Static assets
│   ├── images/                  # App icons and splash screen
│   └── weather-backgrounds/     # Dynamic weather background images
│   └── weather-icons/           # Weather condition icons
├── components/                   # Reusable React components
│   ├── ForecastListItem.tsx     # Individual forecast item component
│   └── ForecastSection.tsx      # Forecast list container
├── constants/                    # Application constants
│   ├── weatherBackgrounds.ts    # Background image mappings
│   └── weatherIcons.ts          # Weather icon mappings
├── hooks/                        # Custom React hooks
│   └── useCurrentLocation.ts    # Location detection hook
├── services/                     # API services
│   └── openWeather.ts           # OpenWeather API integration
├── types/                        # TypeScript type definitions
│   └── openWeather.ts           # API response types
├── utils/                        # Utility functions
│   ├── forecast.ts              # Forecast data utilities
│   ├── http.ts                  # HTTP request helper
│   ├── time.ts                  # Time formatting utilities
│   ├── url.ts                   # URL building utilities
│   ├── weatherBackground.ts     # Background selection logic
│   └── weatherIcon.ts           # Icon selection logic
├── package.json                  # Project dependencies
├── app.json                       # Expo configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                      # This file
```

## Key Components

### Main Screen (`app/index.tsx`)

- Displays current weather information
- Shows temperature and weather conditions
- Lists 5-day forecast
- Handles location permissions and error states

### ForecastSection (`components/ForecastSection.tsx`)

- Displays list of forecast items
- Scrollable forecast view
- Organized weather data presentation

### ForecastListItem (`components/ForecastListItem.tsx`)

- Individual forecast card component
- Shows temperature, weather icon, and time
- Compact forecast information display

### Location Hook (`hooks/useCurrentLocation.ts`)

- Manages location permission requests
- Handles GPS coordinate retrieval
- Provides loading and error states

### Weather Service (`services/openWeather.ts`)

- Fetches current weather data
- Fetches 5-day forecast data
- Handles API authentication

## Environment Variables

Create a `.env` file or set environment variables:

```env
EXPO_PUBLIC_OPEN_WEATHER_KEY=your_openweather_api_key
```

The API key is obtained from [OpenWeather API](https://openweathermap.org/api) (free tier available).

## Available Scripts

```bash
npm start           # Start development server
npm run dev         # Start in development mode
npm run android     # Start Android emulator
npm run ios         # Start iOS simulator
npm run web         # Start web browser version
npm run lint        # Run ESLint code checker
```

## Customization

### Weather Icons

Edit [constants/weatherIcons.ts](constants/weatherIcons.ts) to change weather condition icon mappings.

### Weather Backgrounds

Edit [constants/weatherBackgrounds.ts](constants/weatherBackgrounds.ts) to customize background images for different weather conditions.

### API Configuration

Modify [services/openWeather.ts](services/openWeather.ts) to change weather API endpoints or settings.

## Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Troubleshooting

### "Missing EXPO_PUBLIC_OPEN_WEATHER_KEY" Error

- Ensure you've created a `.env` file with your OpenWeather API key
- The variable must be prefixed with `EXPO_PUBLIC_` to be accessible in the app

### Location Permission Denied

- On physical devices: Go to Settings → App Permissions → Location → Allow
- The app will show a settings button to quickly access location settings
- Ensure the app has foreground location permission

### API Errors

- Verify your OpenWeather API key is valid and not expired
- Check your internet connection
- Ensure the API key has access to current weather and forecast endpoints

### Build Issues

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Reset project: `npm run reset-project`

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [OpenWeather API Docs](https://openweathermap.org/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo Router Guide](https://expo.github.io/router/)

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

**Made by pthanks using React Native and Expo**


"# Atmos_Weather_App" 
