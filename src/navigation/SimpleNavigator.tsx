import React, { useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import type { ScreenParams } from '../types/navigation';

type ScreenName = 'Splash' | 'Home' | 'ModeSelect' | 'Game' | 'GameOver' | 'Shop' | 'Settings' | 'MascotSelector' | 'Leaderboard';

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName, params?: ScreenParams) => void;
  goBack: () => void;
  params: ScreenParams;
}

const NavigationContext = React.createContext<NavigationContextType | null>(null);

export const useSimpleNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error('useSimpleNavigation must be used within SimpleNavigator');
  }
  return context;
};

interface SimpleNavigatorProps {
  children: ReactNode;
  initialScreen?: ScreenName;
}

export const SimpleNavigator: React.FC<SimpleNavigatorProps> = ({ 
  children, 
  initialScreen = 'Splash' 
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(initialScreen);
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>([initialScreen]);
  const [params, setParams] = useState<ScreenParams>({});

  const navigate = (screen: ScreenName, newParams?: ScreenParams) => {
    setScreenHistory([...screenHistory, currentScreen]);
    setCurrentScreen(screen);
    setParams(newParams || {});
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(screenHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
      setParams({});
    }
  };

  const contextValue: NavigationContextType = {
    currentScreen,
    navigate,
    goBack,
    params,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      <View style={styles.container}>
        {children}
      </View>
    </NavigationContext.Provider>
  );
};

interface ScreenProps {
  name: ScreenName;
  component: React.ComponentType<{ route?: { params?: ScreenParams } }>;
}

export const Screen: React.FC<ScreenProps> = ({ name, component: Component }) => {
  const { currentScreen, params } = useSimpleNavigation();
  
  if (currentScreen !== name) {
    return null;
  }
  
  return <Component route={{ params }} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

