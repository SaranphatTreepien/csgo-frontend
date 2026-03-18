import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fetchBalance } from '../data/api';

const FILTERS = ['Sellable', 'Trade Lock', 'Containers'];

const MOCK_INVENTORY = [
  {
    id: 'inv-1', name: 'AK-47 | Redline', weapon: 'AK-47', skin: 'Redline',
    rarity: 'Classified', rarityColor: '#D32CE6', wear: 'Field-Tested',
    price: 18450, float: 0.2341, category: 'Guns',
    tradeLock: false, stattrak: false, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA',
  },
  {
    id: 'inv-2', name: 'Karambit | Fade', weapon: 'Karambit', skin: 'Fade',
    rarity: 'Covert', rarityColor: '#EB4B4B', wear: 'Factory New',
    price: 245000, float: 0.0034, category: 'Knife',
    tradeLock: true, stattrak: true, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SD1iWwOpzj-1gSCGn20tztm_UyIn_JHKUbgYlWMcmQ-ZcskSwldS0MOnntAfd3YlMzH35jntXrnE8SOGRGG8',
  },
  {
    id: 'inv-3', name: 'Glock-18 | Fade', weapon: 'Glock-18', skin: 'Fade',
    rarity: 'Restricted', rarityColor: '#8847FF', wear: 'Factory New',
    price: 9800, float: 0.0112, category: 'Guns',
    tradeLock: false, stattrak: false, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2oaaBoH_yaCW-Ej-8u5bZvHnq1w0Vz62TUzNj4eCiVblMmXMAkROJeskLpkdXjMrzksVTAy9US8PY25So',
  },
  {
    id: 'inv-4', name: 'CS2 Revolution Case', weapon: 'Case', skin: 'Revolution',
    rarity: 'Base Grade', rarityColor: '#B0C3D9', wear: null,
    price: 350, float: null, category: 'Cases',
    tradeLock: false, stattrak: false, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHcVuPaoafU1JqiVWWSVkux15OQ8Giiylk0k5mvTnIqpd3PCaQIhWMYkE_lK7EcNeCKW-w',
  },
  {
    id: 'inv-5', name: 'USP-S | Kill Confirmed', weapon: 'USP-S', skin: 'Kill Confirmed',
    rarity: 'Covert', rarityColor: '#EB4B4B', wear: 'Minimal Wear',
    price: 32500, float: 0.1234, category: 'Guns',
    tradeLock: false, stattrak: true, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160',
  },
  {
    id: 'inv-6', name: 'Desert Eagle | Blaze', weapon: 'Desert Eagle', skin: 'Blaze',
    rarity: 'Restricted', rarityColor: '#8847FF', wear: 'Factory New',
    price: 24500, float: 0.0078, category: 'Guns',
    tradeLock: false, stattrak: false, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU',
  },
  {
    id: 'inv-7', name: 'Specialist Gloves | Crimson Kimono', weapon: 'Specialist Gloves', skin: 'Crimson Kimono',
    rarity: 'Extraordinary', rarityColor: '#E4AE33', wear: 'Well-Worn',
    price: 87000, float: 0.4123, category: 'Glove',
    tradeLock: false, stattrak: false, listed: false,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJu-hkQCe8qhkusjCKlIvqHjnCOml8U8UoAfkItBLswdbuNbjr5FHdjNkUzSv73C1K5y46tu4EUvAg-6bU3FrBMOE4_9BdcyhkRns5',
  },
];

const ItemCard = ({ item, onSell, onPress }) => (
  <View style={cs.wrapper}>
    <TouchableOpacity style={cs.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[cs.rarityBar, { backgroundColor: item.rarityColor }]} />
      <View style={cs.imageBox}>
        <Image
          source={{ uri: item.image }}
          style={cs.image}
          resizeMode="contain"
        />
        {item.stattrak && (
          <View style={cs.stBadge}><Text style={cs.stText}>StatTrak™</Text></View>
        )}
        {item.listed && (
          <View style={cs.listedOverlay}>
            <Text style={cs.listedOverlayText}>LISTED</Text>
          </View>
        )}
      </View>
      <View style={cs.info}>
        <Text style={cs.weapon} numberOfLines={1}>{item.weapon}</Text>
        <Text style={cs.skin} numberOfLines={1}>{item.skin}</Text>
        <View style={cs.detailRow}>
          {item.wear && (
            <Text style={cs.wear}>
              {item.wear === 'Factory New' ? 'FN'
                : item.wear === 'Minimal Wear' ? 'MW'
                : item.wear === 'Field-Tested' ? 'FT'
                : item.wear === 'Well-Worn' ? 'WW'
                : item.wear === 'Battle-Scarred' ? 'BS' : item.wear}
            </Text>
          )}
          {item.float != null && (
            <Text style={cs.float}>{item.float.toFixed(4)}</Text>
          )}
        </View>
        <Text style={cs.price}>฿{item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        cs.sellBtn,
        item.tradeLock && cs.sellBtnLocked,
        item.listed && cs.sellBtnListed,
      ]}
      disabled={item.tradeLock}
      onPress={() => !item.tradeLock && onSell(item)}
    >
      <Text style={cs.sellBtnText}>
        {item.tradeLock ? '🔒 LOCKED' : item.listed ? '✅ LISTED' : 'SELL'}
      </Text>
    </TouchableOpacity>
  </View>
);

export default function InventoryScreen({ navigation }) {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await fetchBalance();
      if (data.success) setBalance(data.balance);
    } catch {}
  };

  const filteredItems = useMemo(() => {
    let result = items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
    if (activeFilter === 'Trade Lock') result = result.filter(i => i.tradeLock);
    if (activeFilter === 'Sellable')   result = result.filter(i => !i.tradeLock && !i.listed);
    if (activeFilter === 'Containers') result = result.filter(i => i.category === 'Cases');
    return result;
  }, [search, activeFilter, items]);

  const totalValue = items.reduce((s, i) => s + i.price, 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Inventory</Text>
        <TouchableOpacity onPress={loadBalance} style={s.refreshBtn}>
          <Text>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={s.valueBanner}>
        <View>
          <Text style={s.valueLabel}>TOTAL VALUE</Text>
          <Text style={s.valueAmount}>฿{totalValue.toLocaleString()}</Text>
          <Text style={s.valueCount}>{items.length} items</Text>
        </View>
        <View style={s.valueRight}>
          <TouchableOpacity style={s.sellAllBtn} onPress={() => navigation.navigate('Sell')}>
            <Text style={s.sellAllText}>💰 วางขาย</Text>
          </TouchableOpacity>
          <View style={s.balanceBadge}>
            <Text style={s.balanceText}>Balance: ฿{balance.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Text>🔍 </Text>
          <TextInput
            style={s.searchInput}
            placeholder="ค้นหา..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={s.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterPill, activeFilter === f && s.filterPillActive]}
            onPress={() => setActiveFilter(activeFilter === f ? null : f)}
          >
            <Text style={[s.filterPillText, activeFilter === f && s.filterPillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={s.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetail', { item })}
            onSell={(item) => navigation.navigate('Sell')}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyIcon}>📦</Text>
            <Text style={s.emptyText}>ไม่พบ items</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  refreshBtn: { padding: 6 },
  valueBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  valueLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  valueAmount: { color: colors.primary, fontSize: 22, fontWeight: '900', marginBottom: 2 },
  valueCount: { color: colors.textSecondary, fontSize: 12 },
  valueRight: { alignItems: 'flex-end', gap: 8 },
  sellAllBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  sellAllText: { color: '#000', fontSize: 12, fontWeight: '900' },
  balanceBadge: {
    backgroundColor: colors.accentGreen + '22', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.accentGreen,
  },
  balanceText: { color: colors.accentGreen, fontSize: 10, fontWeight: '600' },
  searchRow: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceElevated, borderRadius: 10,
    paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.textPrimary, height: 40, fontSize: 14 },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg,
  },
  filterPillActive: { backgroundColor: colors.primary + '22', borderColor: colors.primary },
  filterPillText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  filterPillTextActive: { color: colors.primary, fontWeight: '700' },
  grid: { padding: 8, paddingBottom: 30 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 44, marginBottom: 12, opacity: 0.4 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});

const cs = StyleSheet.create({
  wrapper: { flex: 1, margin: 4 },
  card: {
    backgroundColor: colors.cardBg, borderRadius: 10,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
  },
  rarityBar: { height: 3 },
  imageBox: {
    height: 100, backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  stBadge: {
    position: 'absolute', top: 4, left: 4,
    backgroundColor: '#CF6A32', borderRadius: 3,
    paddingHorizontal: 4, paddingVertical: 1,
  },
  stText: { color: '#fff', fontSize: 7, fontWeight: '800' },
  listedOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(76,175,80,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  listedOverlayText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  info: { padding: 8 },
  weapon: { color: colors.textMuted, fontSize: 9, fontWeight: '600', marginBottom: 1 },
  skin: { color: colors.textPrimary, fontSize: 12, fontWeight: '700', marginBottom: 3 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  wear: {
    color: colors.textMuted, fontSize: 9, fontWeight: '600',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3,
  },
  float: { color: colors.textMuted, fontSize: 9 },
  price: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  sellBtn: {
    backgroundColor: colors.accentGreen, paddingVertical: 8, alignItems: 'center',
    borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
  },
  sellBtnLocked: { backgroundColor: colors.surfaceElevated },
  sellBtnListed: { backgroundColor: colors.accentGreen + '44' },
  sellBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});