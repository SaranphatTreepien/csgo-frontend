import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fetchItems } from '../data/api';

const CATEGORIES = [
  { id: '',       label: 'Glove',  icon: '🧤', color: '#9C27B0', apiCat: 'Gloves' },
  { id: 'knife',  label: 'Knife',  icon: '🔪', color: '#F44336', apiCat: 'Knives' },
  { id: 'guns',   label: 'Guns',   icon: '🔫', color: '#4CAF50', apiCat: 'Rifles' },
  { id: 'cases',  label: 'Cases',  icon: '📦', color: '#2196F3', apiCat: 'Cases'  },
];

const ItemCard = ({ item, onPress }) => (
  <TouchableOpacity style={cs.card} onPress={onPress} activeOpacity={0.8}>
    <View style={[cs.rarityBar, { backgroundColor: item.rarityColor || item.rarity?.color || '#B0C3D9' }]} />
    <View style={cs.imageBox}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={cs.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={cs.noImage}>🔫</Text>
      )}
      {item.stattrak && (
        <View style={cs.stBadge}><Text style={cs.stText}>ST</Text></View>
      )}
    </View>
    <View style={cs.info}>
      <Text style={cs.weapon} numberOfLines={1}>{item.weapon}</Text>
      <Text style={cs.skin} numberOfLines={1}>{item.skin}</Text>
      <View style={cs.wearRow}>
        <View style={[cs.wearDot, { backgroundColor: item.rarityColor || '#B0C3D9' }]} />
        <Text style={cs.wearText}>{item.wears?.[0] || item.wear || 'FN'}</Text>
      </View>
      <Text style={cs.price}>
        ฿{(item.basePrice || item.price || 0).toLocaleString()}
      </Text>
    </View>
  </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
  <View style={s.sectionHeader}>
    <View style={s.sectionAccent} />
    <Text style={s.sectionTitle}>{title}</Text>
  </View>
);

export default function HomeScreen({ navigation }) {
  const [searchInput, setSearchInput] = useState('');
  const [popularItems, setPopularItems]       = useState([]);
  const [knivesItems, setKnivesItems]         = useState([]);
  const [glovesItems, setGlovesItems]         = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const [popular, knives, gloves] = await Promise.all([
        fetchItems({ rarity: 'Covert', limit: 10, sort: 'name' }),
        fetchItems({ category: 'Knives', limit: 10 }),
        fetchItems({ category: 'Gloves', limit: 10 }),
      ]);
      if (popular.success) setPopularItems(popular.items);
      if (knives.success)  setKnivesItems(knives.items);
      if (gloves.success)  setGlovesItems(gloves.items);
    } catch (err) {
      console.log('loadItems error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigation.navigate('Store');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.logoRow}>
          <View style={s.logoBadge}><Text style={s.logoLetter}>D</Text></View>
          <Text style={s.logoText}>DEFUSE <Text style={s.logoHL}>TH</Text></Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.headerIcon} onPress={() => navigation.navigate('Profile')}>
            <Text>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {['Home', 'Popular', 'Best Selling', 'Recommended'].map(tab => (
          <TouchableOpacity key={tab} style={[s.tab, tab === 'Home' && s.tabActive]}>
            <Text style={[s.tabText, tab === 'Home' && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput
              style={s.searchInput}
              placeholder="ค้นหา skins..."
              placeholderTextColor={colors.textMuted}
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={s.filterBtn} onPress={handleSearch}>
            <Text style={s.filterIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <TouchableOpacity style={s.heroBanner} activeOpacity={0.85} onPress={() => navigation.navigate('Store')}>
          <View style={s.heroContent}>
            <Text style={s.heroSub}>2,092 ITEMS</Text>
            <Text style={s.heroTitle}>Counter Strike 2</Text>
            <Text style={s.heroDesc}>Premium Marketplace 🇹🇭</Text>
            <View style={s.heroBtn}>
              <Text style={s.heroBtnText}>BROWSE SKINS →</Text>
            </View>
          </View>
          <View style={s.heroDecor}>
            <Text style={s.heroEmoji}>🔫</Text>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={s.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[s.categoryCard, { borderColor: cat.color + '66' }]}
              onPress={() => navigation.navigate('Store')}
            >
              <View style={[s.catIconBg, { backgroundColor: cat.color + '33' }]}>
                <Text style={s.catIcon}>{cat.icon}</Text>
              </View>
              <Text style={[s.catLabel, { color: cat.color }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={s.loadingText}>กำลังโหลด items จาก Backend...</Text>
          </View>
        ) : (
          <>
            {/* Popular - Covert items */}
            <SectionHeader title="Popular (Covert)" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hList}>
              {popularItems.map(item => (
                <ItemCard key={item.id} item={item}
                  onPress={() => navigation.navigate('ItemDetail', { item: { ...item, price: item.basePrice } })}
                />
              ))}
            </ScrollView>

            {/* Knives */}
            <SectionHeader title="★ Knives" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hList}>
              {knivesItems.map(item => (
                <ItemCard key={item.id} item={item}
                  onPress={() => navigation.navigate('ItemDetail', { item: { ...item, price: item.basePrice } })}
                />
              ))}
            </ScrollView>

            {/* Gloves */}
            <SectionHeader title="★ Gloves" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={[s.hList, { marginBottom: 30 }]}>
              {glovesItems.map(item => (
                <ItemCard key={item.id} item={item}
                  onPress={() => navigation.navigate('ItemDetail', { item: { ...item, price: item.basePrice } })}
                />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: {
    width: 28, height: 28, borderRadius: 6, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  logoLetter: { color: '#000', fontWeight: '900', fontSize: 16 },
  logoText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  logoHL: { color: colors.primary, fontWeight: '900' },
  headerRight: { flexDirection: 'row' },
  headerIcon: { padding: 8 },

  tabRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    paddingHorizontal: 12, paddingBottom: 2,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: { paddingHorizontal: 10, paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: colors.primary },

  scroll: { flex: 1 },

  searchRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8,
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceElevated, borderRadius: 10,
    paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, height: 40, fontSize: 14 },
  filterBtn: {
    width: 40, height: 40, backgroundColor: colors.surfaceElevated,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  filterIcon: { fontSize: 18 },

  heroBanner: {
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 14, backgroundColor: colors.surfaceElevated,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', overflow: 'hidden', height: 140,
  },
  heroContent: { flex: 1, padding: 16, justifyContent: 'center' },
  heroSub: { color: colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  heroTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '900', marginBottom: 2 },
  heroDesc: { color: colors.textSecondary, fontSize: 12, marginBottom: 12 },
  heroBtn: {
    backgroundColor: colors.primary, paddingHorizontal: 14,
    paddingVertical: 7, borderRadius: 6, alignSelf: 'flex-start',
  },
  heroBtnText: { color: '#000', fontSize: 11, fontWeight: '900' },
  heroDecor: {
    width: 100, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary + '11',
  },
  heroEmoji: { fontSize: 56, transform: [{ rotate: '-20deg' }] },

  categoriesRow: {
    flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20, gap: 8,
  },
  categoryCard: {
    flex: 1, backgroundColor: colors.cardBg, borderRadius: 10,
    alignItems: 'center', paddingVertical: 10,
    borderWidth: 1,
  },
  catIconBg: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  catIcon: { fontSize: 18 },
  catLabel: { fontSize: 10, fontWeight: '700' },

  loadingBox: { alignItems: 'center', paddingTop: 60, gap: 16 },
  loadingText: { color: colors.textMuted, fontSize: 13 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 12, marginTop: 4,
  },
  sectionAccent: {
    width: 4, height: 18, backgroundColor: colors.primary,
    borderRadius: 2, marginRight: 10,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  hList: { paddingHorizontal: 16, paddingBottom: 10 },
});

const cs = StyleSheet.create({
  card: {
    width: 130, marginRight: 10, backgroundColor: colors.cardBg,
    borderRadius: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  rarityBar: { height: 3 },
  imageBox: {
    height: 90, backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  noImage: { fontSize: 32, opacity: 0.3 },
  stBadge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#CF6A32', borderRadius: 3,
    paddingHorizontal: 4, paddingVertical: 1,
  },
  stText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  info: { padding: 8 },
  weapon: { color: colors.textMuted, fontSize: 9, fontWeight: '600', marginBottom: 1 },
  skin: { color: colors.textPrimary, fontSize: 11, fontWeight: '700', marginBottom: 3 },
  wearRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  wearDot: { width: 5, height: 5, borderRadius: 3, marginRight: 4 },
  wearText: { color: colors.textMuted, fontSize: 9, fontWeight: '600' },
  price: { color: colors.primary, fontSize: 12, fontWeight: '800' },
});