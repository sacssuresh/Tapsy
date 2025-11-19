import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type Theme } from '../theme/themes';

/**
 * Hook to get the current theme based on device color scheme
 * Returns light theme if device is in light mode, dark theme if in dark mode
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

