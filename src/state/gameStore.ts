import { create } from 'zustand';
import type { GameState, GameMode, TileIndex } from '../types';
import { generateSequence, extendSequence } from '../utils/sequenceGenerator';

interface GameStore extends GameState {
  startGame: (mode: GameMode) => void;
  playSequence: (onComplete: () => void) => void;
  handleTileTap: (tileIndex: TileIndex, onMismatch: () => void, onLevelComplete: () => void) => void;
  checkInput: (onMismatch: () => void, onLevelComplete: () => void) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  calculateScore: () => number;
}

const getModeConfig = (mode: GameMode) => {
  switch (mode) {
    case 'speed':
      return { playbackSpeed: 400, scoreMultiplier: 1.5 };
    case 'zen':
      return { playbackSpeed: 800, scoreMultiplier: 1.0 };
    default:
      return { playbackSpeed: 600, scoreMultiplier: 1.0 };
  }
};

const initialState: GameState = {
  mode: 'classic',
  level: 1,
  sequence: [],
  playerInput: [],
  isPlayingSequence: false,
  isGameOver: false,
  score: 0,
  currentTileIndex: 0,
  isPaused: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (mode: GameMode) => {
    const sequence = generateSequence(1);
    set({
      mode,
      sequence,
      level: 1,
      score: 0,
      playerInput: [],
      isPlayingSequence: false,
      isGameOver: false,
      currentTileIndex: 0,
      isPaused: false,
    });
  },

  playSequence: (onComplete: () => void) => {
    const state = get();
    if (state.isPlayingSequence || state.sequence.length === 0) return;

    set({ isPlayingSequence: true, currentTileIndex: -1, playerInput: [] });

    const config = getModeConfig(state.mode);
    const sequence = [...state.sequence]; // Capture sequence at start
    let index = 0;

    const playNext = () => {
      const currentState = get();
      if (!currentState.isPlayingSequence || currentState.isPaused) {
        return;
      }

      if (index >= sequence.length) {
        set({ isPlayingSequence: false, currentTileIndex: -1 });
        onComplete();
        return;
      }

      set({ currentTileIndex: sequence[index] });
      index++;

      setTimeout(() => {
        // Reset tile highlight before next one
        if (index < sequence.length) {
          set({ currentTileIndex: -1 });
        }
        setTimeout(playNext, 100); // Brief pause between tiles
      }, config.playbackSpeed);
    };

    // Start after initial delay
    setTimeout(playNext, 200);
  },

  handleTileTap: (tileIndex: TileIndex, onMismatch: () => void, onLevelComplete: () => void) => {
    const state = get();
    if (state.isPlayingSequence || state.isGameOver || state.isPaused) return;

    const newInput = [...state.playerInput, tileIndex];
    set({ playerInput: newInput });

    // Check if input matches expected sequence
    get().checkInput(onMismatch, onLevelComplete);
  },

  checkInput: (onMismatch: () => void, onLevelComplete: () => void) => {
    const state = get();
    const expectedSequence = state.mode === 'reverse' 
      ? [...state.sequence].reverse() 
      : state.sequence;

    // Check if current input length matches expected
    if (state.playerInput.length < expectedSequence.length) {
      // Check if current input matches so far
      for (let i = 0; i < state.playerInput.length; i++) {
        if (state.playerInput[i] !== expectedSequence[i]) {
          set({ isGameOver: true });
          onMismatch();
          return;
        }
      }
      // Input matches so far, wait for more
      return;
    }

    // Input complete, check if it matches
    if (state.playerInput.length === expectedSequence.length) {
      const isMatch = state.playerInput.every(
        (tile, index) => tile === expectedSequence[index]
      );

      if (!isMatch) {
        set({ isGameOver: true });
        onMismatch();
      } else {
        // Level complete, advance to next level
        // Calculate score based on level just completed
        const config = getModeConfig(state.mode);
        const baseScore = state.level * 10;
        const scoreIncrement = Math.floor(baseScore * config.scoreMultiplier);
        
        const newLevel = state.level + 1;
        const newSequence = extendSequence(state.sequence);
        set({
          level: newLevel,
          sequence: newSequence,
          playerInput: [],
          score: state.score + scoreIncrement,
        });
        onLevelComplete();
      }
    }
  },

  calculateScore: () => {
    const state = get();
    const config = getModeConfig(state.mode);
    const baseScore = state.level * 10;
    return Math.floor(baseScore * config.scoreMultiplier);
  },

  resetGame: () => {
    set({
      mode: 'classic',
      level: 1,
      sequence: [],
      playerInput: [],
      isPlayingSequence: false,
      isGameOver: false,
      score: 0,
      currentTileIndex: 0,
      isPaused: false,
    });
  },

  pauseGame: () => {
    const state = get();
    // If sequence is playing, stop it
    // The GameScreen will handle restarting the sequence on resume
    if (state.isPlayingSequence) {
      set({ 
        isPaused: true, 
        isPlayingSequence: false,
        currentTileIndex: -1,
      });
    } else {
      set({ isPaused: true });
    }
  },

  resumeGame: () => {
    set({ isPaused: false });
  },
}));

