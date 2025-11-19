import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleNavigator, Screen } from './src/navigation/SimpleNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppState } from 'react-native';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ModeSelectScreen } from './src/screens/ModeSelectScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { MascotSelectorScreen } from './src/screens/MascotSelectorScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { useGameStore } from './src/state/gameStore';
import { soundManager } from './src/audio/SoundManager';

export default function App() {
  // Start directly on Home for faster loading
  // Storage will load in background
  React.useEffect(() => {
    let currentState = AppState.currentState;
    const sub = AppState.addEventListener('change', (next) => {
      if (currentState === 'active' && (next === 'inactive' || next === 'background')) {
        // Pause gameplay and mute sounds when app backgrounds
        try {
          useGameStore.getState().pauseGame();
        } catch {}
        try {
          soundManager.setEnabled(false);
        } catch {}
      }
      if ((currentState === 'inactive' || currentState === 'background') && next === 'active') {
        // Re-enable sounds on foreground; gameplay remains paused until user resumes
        try {
          soundManager.setEnabled(true);
        } catch {}
      }
      currentState = next;
    });
    return () => sub.remove();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <SimpleNavigator initialScreen="Home">
          <Screen name="Splash" component={SplashScreen} />
          <Screen name="Home" component={HomeScreen} />
          <Screen name="ModeSelect" component={ModeSelectScreen} />
          <Screen name="Game" component={GameScreen} />
          <Screen name="GameOver" component={GameOverScreen} />
          <Screen name="Shop" component={ShopScreen} />
          <Screen name="Settings" component={SettingsScreen} />
          <Screen name="MascotSelector" component={MascotSelectorScreen} />
          <Screen name="Leaderboard" component={LeaderboardScreen} />
        </SimpleNavigator>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
