# Tapsy 🎮

A clean, minimal Gen-Z friendly memory game built with React Native and Expo.

## 🎯 About

Tapsy is a modern Simon-style memory game featuring a beautiful, minimalist UI designed for Gen-Z and kids. The game challenges players to remember and repeat sequences of colored tiles, with multiple game modes and engaging animations.

## ✨ Features

- **3 Game Modes:**
  - 🎯 **Classic**: Sequence grows by 1 each level, normal speed
  - 🔁 **Reverse**: Input the sequence in reverse order
  - ⚡ **Hard**: Faster playback with higher difficulty

- **Beautiful UI:**
  - Animated gradient backgrounds
  - Glass morphism effects
  - Smooth micro-interactions
  - Pastel color palette
  - Animated mascot with expressions

- **Leaderboard:**
  - Global rankings based on combined scores
  - Top 50 players
  - Real-time score tracking

- **Sound System:**
  - Multiple sound packs
  - Tile-specific sounds
  - Success and failure feedback

- **Settings:**
  - Sound toggle
  - Haptics toggle
  - Customizable themes

## 🛠️ Tech Stack

- **React Native** + **Expo** (~54.0.23)
- **TypeScript**
- **Zustand** (State management)
- **Firebase** (Leaderboard)
- **AsyncStorage** (Local persistence)

## 📦 Quick Start

```bash
# Clone repository
git clone https://github.com/sacssuresh/Tapsy.git
cd Tapsy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your Firebase credentials

# Start development server
npm start
```

## 🔐 Environment Variables

This app requires Firebase credentials to enable the leaderboard feature. All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. Get these values from your [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps

### EAS Build (Production)

For production builds, set environment variables as EAS secrets:

```bash
# Set each Firebase credential as a secret
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value your-api-key
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value your-project.firebaseapp.com
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value your-project-id
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value your-project.firebasestorage.app
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value your-sender-id
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_APP_ID --value your-app-id
```

**Note:** The `.env` file is already in `.gitignore` and will not be committed to the repository.

## 🎮 How to Play

1. Watch the sequence of colored tiles as they light up
2. Repeat the sequence by tapping the tiles in the same order
3. Each level adds one more tile to the sequence
4. Make a mistake and the game is over!

## 📝 License

This project is private and proprietary.

---

Made with ❤️ using React Native and Expo
