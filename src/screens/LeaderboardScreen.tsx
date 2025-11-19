import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { Card } from '../components/Card';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { LeaderboardRow } from '../components/LeaderboardRow';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../state/userStore';
import { getRankings, type LeaderboardEntry } from '../services/leaderboardService';
import { isConfigured } from '../services/firebase';

export const LeaderboardScreen: React.FC = () => {
  const { goBack } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const { username: currentUsername } = useUserStore();
  const theme = useTheme();
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRankings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRankings(50);
      setRankings(data);
    } catch (error) {
      console.warn('Error loading leaderboard:', error);
      setRankings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRankings();
  }, [loadRankings]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadRankings();
  }, [loadRankings]);

  const renderHeader = () => (
    <View
      style={[
        styles.tableHeader,
        {
          borderBottomColor: theme.colors.border,
          paddingHorizontal: 8,
        },
      ]}
    >
      <View style={styles.rankHeader}>
        <Text style={[styles.headerText, { color: theme.colors.textSecondary }]}>Rank</Text>
      </View>
      <View style={styles.nameHeader}>
        <Text style={[styles.headerText, { color: theme.colors.textSecondary }]}>Name</Text>
      </View>
      <View style={styles.combinedHeader}>
        <Text style={[styles.headerText, { color: theme.colors.primary }]}>Score</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 1;
    const isCurrentUser = currentUsername && item.name.toLowerCase() === currentUsername.toLowerCase();

    return <LeaderboardRow entry={item} rank={rank} isCurrentUser={isCurrentUser} />;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {!isConfigured ? (
        <>
          <Text style={[styles.emptyText, { color: theme.colors.warning }]}>
            Firebase Not Configured
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Please configure Firebase to enable leaderboard rankings.
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary, marginTop: 8, fontSize: 12 }]}>
            Set EXPO_PUBLIC_FIREBASE_* environment variables in your .env file or update firebase.ts
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No rankings yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Be the first to submit a score!
          </Text>
        </>
      )}
    </View>
  );

  return (
    <AnimatedBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View
          style={[
            styles.header,
            {
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.md,
              marginBottom: theme.spacing.md,
            },
          ]}
        >
          <TouchableOpacity
            onPress={goBack}
            disabled={false}
            style={[styles.backButton, { backgroundColor: `${theme.colors.primary}1A` }]}
          >
            <Text style={[styles.backButtonIcon, { color: theme.colors.primary }]}>←</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              {
                fontSize: theme.typography.title.fontSize,
                fontWeight: theme.typography.title.fontWeight,
                letterSpacing: theme.typography.title.letterSpacing,
                color: theme.colors.textPrimary,
              },
            ]}
          >
            Leaderboard
          </Text>
        </View>

        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              marginHorizontal: theme.spacing.lg,
              marginBottom: insets.bottom + theme.spacing.lg,
            },
          ]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading rankings...
              </Text>
            </View>
          ) : (
            <FlatList
              data={rankings}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={theme.colors.primary}
                />
              }
              showsVerticalScrollIndicator={false}
              horizontal={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </Card>
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  backButtonIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  rankHeader: {
    width: 50,
  },
  nameHeader: {
    flex: 1,
    marginHorizontal: 8,
    minWidth: 100,
  },
  combinedHeader: {
    width: 110,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  listContent: {
    flexGrow: 1,
  },
});
