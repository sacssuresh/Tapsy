import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { GlassPanel } from './GlassPanel';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <GlassPanel style={style}>{children}</GlassPanel>;
};

