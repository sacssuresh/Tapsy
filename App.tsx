import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleNavigator, Screen } from './src/navigation/SimpleNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ModeSelectScreen } from './src/screens/ModeSelectScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  // Start directly on Home for faster loading
  // Storage will load in background
  return (
    <SafeAreaProvider>
      <SimpleNavigator initialScreen="Home">
        <Screen name="Splash" component={SplashScreen} />
        <Screen name="Home" component={HomeScreen} />
        <Screen name="ModeSelect" component={ModeSelectScreen} />
        <Screen name="Game" component={GameScreen} />
        <Screen name="GameOver" component={GameOverScreen} />
        <Screen name="Shop" component={ShopScreen} />
        <Screen name="Settings" component={SettingsScreen} />
      </SimpleNavigator>
    </SafeAreaProvider>
  );
}
