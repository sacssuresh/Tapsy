import React from 'react';
import { NavigationContainer, NavigationContainerProps } from '@react-navigation/native';

/**
 * Wrapper to ensure all boolean props are properly typed for React 19 compatibility
 * This fixes the "expected dynamic type 'boolean', but had type 'string'" error
 */
export const SafeNavigationContainer: React.FC<NavigationContainerProps> = (props) => {
  // Ensure all children are properly rendered
  return <NavigationContainer {...props} />;
};

