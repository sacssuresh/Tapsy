# Tapsy 🎮

A clean, minimal Gen-Z friendly memory game built with React Native and Expo.

## 🎯 About

Tapsy is a modern Simon-style memory game featuring a beautiful, minimalist UI designed for Gen-Z and kids. The game challenges players to remember and repeat sequences of colored tiles, with multiple game modes and engaging animations.

## ✨ Features

- **4 Game Modes:**
  - 🎯 **Classic**: Sequence grows by 1 each level, normal speed
  - ⚡ **Speed**: Faster playback with higher score multiplier
  - 🔁 **Reverse**: Input the sequence in reverse order
  - 🧘 **Zen**: Slower, calmer gameplay with no ads

- **Beautiful UI:**
  - Animated gradient backgrounds
  - Glass morphism effects
  - Smooth micro-interactions
  - Pastel color palette
  - Animated mascot with expressions

- **Sound System:**
  - Multiple sound packs (Bubble, Pastel, Anime)
  - Tile-specific sounds
  - Success and failure feedback

- **Game Features:**
  - Hints system (optional)
  - Streak tracking
  - XP and leveling system
  - Best score tracking per mode
  - Pause/resume functionality

- **Settings:**
  - Sound toggle
  - Haptics toggle
  - Hints toggle
  - Sound pack selection

## 🛠️ Tech Stack

- **React Native** + **Expo** (~54.0.23)
- **TypeScript**
- **Zustand** (State management)
- **AsyncStorage** (Local persistence)
- **Expo AV** (Sound playback)
- **Expo Blur** (Glass effects)
- **React Native Safe Area Context** (UI layout)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sacssuresh/Tapsy.git
   cd Tapsy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## 🎮 How to Play

1. Watch the sequence of colored tiles as they light up
2. Repeat the sequence by tapping the tiles in the same order
3. Each level adds one more tile to the sequence
4. Make a mistake and the game is over!

## 📱 Screenshots

_Screenshots coming soon!_

## 🚀 Development

### Project Structure

```
Tapsy/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── state/          # Zustand stores
│   ├── theme/          # Design system (colors, typography, etc.)
│   ├── navigation/     # Navigation setup
│   ├── audio/          # Sound management
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
├── assets/             # Images, sounds, JSON theme files
└── App.tsx            # Main entry point
```

### Key Files

- `App.tsx` - Main application component
- `src/state/gameStore.ts` - Game logic and state
- `src/state/userStore.ts` - User data and persistence
- `src/theme/` - Design system configuration

## 📝 License

This project is private and proprietary.

## 👤 Author

**sacssuresh**

- GitHub: [@sacssuresh](https://github.com/sacssuresh)

## 🙏 Acknowledgments

- Built with love for Gen-Z and kids who enjoy memory challenges
- Inspired by the classic Simon game

---

Made with ❤️ using React Native and Expo

