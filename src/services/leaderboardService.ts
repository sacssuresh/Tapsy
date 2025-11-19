import { collection, query, orderBy, limit, getDocs, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from './firebase';

export type LeaderboardMode = 'classic' | 'reverse' | 'hard';

export interface LeaderboardEntry {
  name: string;
  scores: {
    classic: number;
    reverse: number;
    hard: number;
  };
  combined: number;
  updatedAt: number;
}

/**
 * Submit a score to the leaderboard
 * Updates only if new score is higher than existing score for that mode
 * Recalculates combined score
 */
export async function submitScore(
  mode: LeaderboardMode,
  score: number,
  username: string
): Promise<void> {
  if (!db || !isConfigured || !username || !username.trim()) {
    if (!isConfigured) {
      console.warn('Firebase not configured - cannot submit score to leaderboard');
    }
    return;
  }

  try {
    const usernameTrimmed = username.trim();
    const userDocRef = doc(db, 'leaderboard', usernameTrimmed);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // User exists, update if new score is higher
      const data = userDoc.data();
      const currentScore = data.scores?.[mode] || 0;

      if (score > currentScore) {
        // Update the mode score
        const updatedScores = {
          ...data.scores,
          [mode]: score,
        };

        // Recalculate combined
        const combined = updatedScores.classic + updatedScores.reverse + updatedScores.hard;

        await setDoc(userDocRef, {
          name: usernameTrimmed,
          scores: updatedScores,
          combined,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } else {
      // New user, create document
      const scores = {
        classic: mode === 'classic' ? score : 0,
        reverse: mode === 'reverse' ? score : 0,
        hard: mode === 'hard' ? score : 0,
      };
      const combined = scores.classic + scores.reverse + scores.hard;

      await setDoc(userDocRef, {
        name: usernameTrimmed,
        scores,
        combined,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('Error submitting score to leaderboard:', error);
    // Fail silently - leaderboard is non-critical
  }
}

/**
 * Get top rankings sorted by combined score
 * Only returns entries with combined score > 0
 */
export async function getRankings(limitCount: number = 50): Promise<LeaderboardEntry[]> {
  if (!db || !isConfigured) {
    console.warn('Firebase not configured - cannot fetch leaderboard rankings');
    return [];
  }

  try {
    const leaderboardRef = collection(db, 'leaderboard');
    // Query for more entries to account for filtering, then limit to top 50
    const q = query(
      leaderboardRef,
      orderBy('combined', 'desc'),
      limit(limitCount * 2) // Fetch more to filter out zeros
    );

    const querySnapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const combined = data.combined || 0;
      
      // Only include entries with combined score > 0
      if (combined > 0) {
        entries.push({
          name: data.name || doc.id,
          scores: {
            classic: data.scores?.classic || 0,
            reverse: data.scores?.reverse || 0,
            hard: data.scores?.hard || 0,
          },
          combined,
          updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now(),
        });
      }
    });

    // Limit to top 50 after filtering
    return entries.slice(0, limitCount);
  } catch (error) {
    console.warn('Error fetching leaderboard rankings:', error);
    return [];
  }
}

/**
 * Delete user's leaderboard entry
 */
export async function deleteUserLeaderboard(username: string): Promise<void> {
  if (!db || !username || !username.trim()) {
    return;
  }

  try {
    const userDocRef = doc(db, 'leaderboard', username.trim());
    await deleteDoc(userDocRef);
  } catch (error) {
    console.warn('Error deleting user leaderboard:', error);
    // Fail silently
  }
}
