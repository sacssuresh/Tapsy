import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TileButton } from './TileButton';
import { spacing } from '../theme';
import type { TileIndex } from '../types';

interface GameGridProps {
  activeTileIndex: number | null;
  onTilePress: (tileIndex: TileIndex) => void;
  disabled?: boolean;
  playSound?: (tileIndex: TileIndex) => void;
  onTilePressWithPosition?: (tileIndex: TileIndex, x: number, y: number) => void;
  hintTileIndex?: number | null; // Tile to show hint on
  tileColors: readonly [string, string, string, string];
}

export const GameGrid: React.FC<GameGridProps> = ({
  activeTileIndex,
  onTilePress,
  disabled = false,
  playSound,
  onTilePressWithPosition,
  hintTileIndex = null,
  tileColors,
}) => {
  const renderTile = (index: TileIndex) => {
    return (
      <TileButton
        key={index}
        tileIndex={index}
        color={tileColors[index]}
        isActive={Boolean(activeTileIndex === index)}
        onPress={() => onTilePress(index)}
        disabled={!!disabled}
        playSound={() => playSound?.(index)}
        onPressWithPosition={(x, y) => onTilePressWithPosition?.(index, x, y)}
        showHint={hintTileIndex !== null && hintTileIndex === index}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderTile(0)}
        {renderTile(1)}
      </View>
      <View style={styles.row}>
        {renderTile(2)}
        {renderTile(3)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    alignSelf: 'center',
    paddingHorizontal: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
});

