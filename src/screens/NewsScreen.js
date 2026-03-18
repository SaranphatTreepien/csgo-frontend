import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { matches, newsItems } from '../data/news';

const { width } = Dimensions.get('window');

const CategoryBadge = ({ label, color = colors.accent }) => (
  <View style={[styles.catBadge, { backgroundColor: color + '33', borderColor: color }]}>
    <Text style={[styles.catBadgeText, { color }]}>{label}</Text>
  </View>
);

const MatchCard = ({ match }) => (
  <View style={[styles.matchCard, match.isLive && styles.matchCardLive]}>
    {match.isLive && (
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    )}
    {!match.isLive && (
      <View style={styles.scheduledBadge}>
        <Text style={styles.scheduledTime}>{match.time}</Text>
      </View>
    )}
    <View style={styles.matchTeams}>
      <View style={styles.teamBox}>
        <View style={styles.teamLogo}>
          <Text style={styles.teamFlag}>{match.team1.flag}</Text>
        </View>
        <Text style={styles.teamName}>{match.team1.short}</Text>
      </View>
      <View style={styles.scoreBox}>
        {match.isLive ? (
          <Text style={styles.scoreText}>{match.score1} <Text style={styles.scoreDivider}>–</Text> {match.score2}</Text>
        ) : (
          <Text style={styles.vsText}>VS</Text>
        )}
        <Text style={styles.mapText}>{match.map}</Text>
      </View>
      <View style={styles.teamBox}>
        <View style={styles.teamLogo}>
          <Text style={styles.teamFlag}>{match.team2.flag}</Text>
        </View>
        <Text style={styles.teamName}>{match.team2.short}</Text>
      </View>
    </View>
    <Text style={styles.tournamentText}>{match.tournament}</Text>
  </View>
);

const NewsCard = ({ item }) => {
  const categoryColors = {
    Esports: colors.accent,
    Update: colors.accentGreen,
    Tournament: colors.primary,
    Market: colors.accentPurple,
    'Game Update': colors.accentBlue,
  };

  return (
    <TouchableOpacity style={styles.newsCard} activeOpacity={0.8}>
      <View style={styles.newsImagePlaceholder}>
        <Text style={styles.newsImageIcon}>📰</Text>
        <CategoryBadge label={item.category} color={categoryColors[item.category] || colors.accent} />
      </View>
      <View style={styles.newsBody}>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsAuthor}>@{item.author}</Text>
          <Text style={styles.newsTime}>{item.time}</Text>
          <Text style={styles.newsViews}>👁 {(item.views / 1000).toFixed(0)}K</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function NewsScreen() {
  const liveMatches = matches.filter(m => m.isLive);
  const scheduledMatches = matches.filter(m => !m.isLive);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News & Matches</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Today's Matches */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionAccentBar} />
          <Text style={styles.sectionTitle}>TODAY'S MATCHES</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchScroll}>
          {matches.map(m => <MatchCard key={m.id} match={m} />)}
        </ScrollView>

        <View style={styles.divider} />

        {/* Today's News */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionAccentBar} />
          <Text style={styles.sectionTitle}>TODAY'S NEWS</Text>
        </View>

        <View style={styles.newsList}>
          {newsItems.map(item => <NewsCard key={item.id} item={item} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  headerIcon: { padding: 6 },
  scroll: { flex: 1 },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 14,
  },
  sectionAccentBar: {
    width: 4, height: 18,
    backgroundColor: colors.primary,
    borderRadius: 2, marginRight: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14, fontWeight: '800',
    letterSpacing: 1.5,
  },

  matchScroll: { paddingHorizontal: 16, gap: 12 },
  matchCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 14,
    width: 200,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  matchCardLive: {
    borderColor: colors.accentRed + '88',
    backgroundColor: colors.accentRed + '0A',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  liveDot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: colors.accentRed,
  },
  liveText: {
    color: colors.accentRed,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  scheduledBadge: { marginBottom: 10 },
  scheduledTime: { color: colors.primary, fontSize: 13, fontWeight: '700' },

  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamBox: { alignItems: 'center', flex: 1 },
  teamLogo: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  teamFlag: { fontSize: 22 },
  teamName: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
  scoreBox: { alignItems: 'center', flex: 1 },
  scoreText: { color: colors.textPrimary, fontSize: 20, fontWeight: '900' },
  scoreDivider: { color: colors.textMuted },
  vsText: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  mapText: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  tournamentText: {
    color: colors.textMuted, fontSize: 10, textAlign: 'center',
    fontWeight: '500', marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginTop: 8,
  },

  newsList: { paddingHorizontal: 16, paddingBottom: 30 },
  newsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
  },
  newsImagePlaceholder: {
    width: 100,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  newsImageIcon: { fontSize: 28, marginBottom: 8 },
  newsBody: { flex: 1, padding: 12 },
  newsTitle: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 5, lineHeight: 18 },
  newsSummary: { color: colors.textSecondary, fontSize: 11, lineHeight: 16, marginBottom: 8 },
  newsFooter: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  newsAuthor: { color: colors.accent, fontSize: 10, fontWeight: '600' },
  newsTime: { color: colors.textMuted, fontSize: 10 },
  newsViews: { color: colors.textMuted, fontSize: 10, marginLeft: 'auto' },
  catBadge: {
    borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1, marginTop: 6,
  },
  catBadgeText: { fontSize: 9, fontWeight: '700' },
});
