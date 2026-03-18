import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  TextInput, Alert, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { listItem, removeListing } from '../data/api';

const WEAR_SHORT = {
  'Factory New': 'FN', 'Minimal Wear': 'MW',
  'Field-Tested': 'FT', 'Well-Worn': 'WW', 'Battle-Scarred': 'BS',
};

// Mock Inventory — ใช้รูปจาก Steam จริง
const MOCK_INVENTORY = [
  {
    id: 'inv-1', assetId: 'inv-1',
    name: 'AK-47 | Redline', weapon: 'AK-47', skin: 'Redline',
    rarity: 'Classified', rarityColor: '#D32CE6', wear: 'Field-Tested',
    price: 18450, float: 0.2341, category: 'Guns',
    tradeLock: false, stattrak: false, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA',
  },
  {
    id: 'inv-2', assetId: 'inv-2',
    name: 'Karambit | Fade', weapon: 'Karambit', skin: 'Fade',
    rarity: 'Covert', rarityColor: '#EB4B4B', wear: 'Factory New',
    price: 245000, float: 0.0034, category: 'Knife',
    tradeLock: true, stattrak: true, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SD1iWwOpzj-1gSCGn20tztm_UyIn_JHKUbgYlWMcmQ-ZcskSwldS0MOnntAfd3YlMzH35jntXrnE8SOGRGG8',
  },
  {
    id: 'inv-3', assetId: 'inv-3',
    name: 'Glock-18 | Fade', weapon: 'Glock-18', skin: 'Fade',
    rarity: 'Restricted', rarityColor: '#8847FF', wear: 'Factory New',
    price: 9800, float: 0.0112, category: 'Guns',
    tradeLock: false, stattrak: false, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2oaaBoH_yaCW-Ej-8u5bZvHnq1w0Vz62TUzNj4eCiVblMmXMAkROJeskLpkdXjMrzksVTAy9US8PY25So',
  },
  {
    id: 'inv-4', assetId: 'inv-4',
    name: 'CS2 Revolution Case', weapon: 'Case', skin: 'Revolution',
    rarity: 'Base Grade', rarityColor: '#B0C3D9', wear: null,
    price: 350, float: null, category: 'Cases',
    tradeLock: false, stattrak: false, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHcVuPaoafU1JqiVWWSVkux15OQ8Giiylk0k5mvTnIqpd3PCaQIhWMYkE_lK7EcNeCKW-w',
  },
  {
    id: 'inv-5', assetId: 'inv-5',
    name: 'USP-S | Kill Confirmed', weapon: 'USP-S', skin: 'Kill Confirmed',
    rarity: 'Covert', rarityColor: '#EB4B4B', wear: 'Minimal Wear',
    price: 32500, float: 0.1234, category: 'Guns',
    tradeLock: false, stattrak: true, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160',
  },
  {
    id: 'inv-6', assetId: 'inv-6',
    name: 'Desert Eagle | Blaze', weapon: 'Desert Eagle', skin: 'Blaze',
    rarity: 'Restricted', rarityColor: '#8847FF', wear: 'Factory New',
    price: 24500, float: 0.0078, category: 'Guns',
    tradeLock: false, stattrak: false, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU',
  },
  {
    id: 'inv-7', assetId: 'inv-7',
    name: 'Specialist Gloves | Crimson Kimono', weapon: 'Specialist Gloves', skin: 'Crimson Kimono',
    rarity: 'Extraordinary', rarityColor: '#E4AE33', wear: 'Well-Worn',
    price: 87000, float: 0.4123, category: 'Glove',
    tradeLock: false, stattrak: false, listed: false, listingId: null,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJu-hkQCe8qhkusjCKlIvqHjnCOml8U8UoAfkItBLswdbuNbjr5FHdjNkUzSv73C1K5y46tu4EUvAg-6bU3FrBMOE4_9BdcyhkRns5',
  },
];

const SellItemCard = ({ item, onList, onRemove }) => {
  const [price, setPrice] = useState(item.myPrice ? String(item.myPrice) : '');
  const [loading, setLoading] = useState(false);
  const receiveAmount = price ? Math.round(Number(price) * 0.95) : 0;

  const handleList = async () => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('❌ กรอกราคา', 'กรุณากรอกราคาที่ต้องการขาย');
      return;
    }
    Alert.alert(
      'ยืนยันการวางขาย',
      `${item.name}\nราคา: ฿${Number(price).toLocaleString()}\nรับจริง: ฿${receiveAmount.toLocaleString()}`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'วางขาย ✅',
          onPress: () => onList(item, Number(price), setLoading),
        },
      ]
    );
  };

  return (
    <View style={ss.card}>
      <View style={[ss.rarityBar, { backgroundColor: item.rarityColor }]} />
      <View style={ss.cardBody}>
        <View style={ss.imageBox}>
          <Image source={{ uri: item.image }} style={ss.image} resizeMode="contain" />
          {item.stattrak && <View style={ss.stBadge}><Text style={ss.stText}>ST</Text></View>}
          {item.tradeLock && <View style={[ss.stBadge, { backgroundColor: colors.accentRed }]}><Text style={ss.stText}>🔒</Text></View>}
        </View>

        <View style={ss.infoBox}>
          <Text style={ss.weapon}>{item.weapon}</Text>
          <Text style={ss.skin} numberOfLines={1}>{item.skin}</Text>
          {item.wear && (
            <View style={ss.wearRow}>
              <View style={[ss.wearDot, { backgroundColor: item.rarityColor }]} />
              <Text style={ss.wearText}>{WEAR_SHORT[item.wear] || item.wear}</Text>
              {item.float != null && <Text style={ss.floatText}>  {item.float.toFixed(4)}</Text>}
            </View>
          )}
          <Text style={ss.marketPrice}>ราคาตลาด: ฿{item.price.toLocaleString()}</Text>
        </View>

        <View style={ss.actionBox}>
          {item.listed ? (
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={ss.listedText}>✅ วางขายแล้ว</Text>
              <TouchableOpacity onPress={() => onRemove(item)} style={ss.removeBtn}>
                <Text style={ss.removeBtnText}>ถอน</Text>
              </TouchableOpacity>
            </View>
          ) : item.tradeLock ? (
            <View style={ss.lockedBadge}>
              <Text style={ss.lockedText}>🔒 ล็อค</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[ss.sellBtn, loading && { opacity: 0.6 }]}
              onPress={handleList}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator size="small" color="#000" />
                : <Text style={ss.sellBtnText}>วางขาย</Text>
              }
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!item.listed && !item.tradeLock && (
        <View style={ss.priceSection}>
          <View style={ss.priceInputRow}>
            <Text style={ss.priceInputLabel}>ราคาขาย (฿)</Text>
            <TouchableOpacity onPress={() => setPrice(String(item.price))}>
              <Text style={ss.suggestBtn}>ใช้ราคาตลาด</Text>
            </TouchableOpacity>
          </View>
          <View style={ss.inputRow}>
            <Text style={ss.currencySymbol}>฿</Text>
            <TextInput
              style={ss.priceInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
            {price.length > 0 && (
              <View style={ss.receiveBox}>
                <Text style={ss.receiveLabel}>รับจริง</Text>
                <Text style={ss.receiveAmount}>฿{receiveAmount.toLocaleString()}</Text>
              </View>
            )}
          </View>
          {price.length > 0 && (
            <Text style={ss.feeNote}>หักค่าธรรมเนียม 5%</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default function SellScreen({ navigation }) {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [activeTab, setActiveTab] = useState('all');

  const handleList = async (item, price, setLoading) => {
    setLoading(true);
    try {
      const data = await listItem(item, price);
      if (data.success) {
        setItems(prev => prev.map(i =>
          i.id === item.id
            ? { ...i, listed: true, listingId: data.listing.listingId }
            : i
        ));
        Alert.alert(
          '✅ วางขายสำเร็จ!',
          `${item.name}\nราคา: ฿${price.toLocaleString()}\n\nของคุณปรากฏใน Store แล้วครับ คนอื่นสามารถซื้อได้`
        );
      } else {
        Alert.alert('❌ Error', data.error || 'เกิดข้อผิดพลาด กรุณา Login ก่อน');
      }
    } catch (err) {
      Alert.alert('❌ Connection Error', 'ไม่สามารถเชื่อมต่อ Backend ได้\n' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    Alert.alert('ถอนรายการ', `ถอน ${item.name} ออกจากการขาย?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ถอน', style: 'destructive',
        onPress: async () => {
          try {
            if (item.listingId) {
              await removeListing(item.listingId);
            }
            setItems(prev => prev.map(i =>
              i.id === item.id ? { ...i, listed: false, listingId: null } : i
            ));
            Alert.alert('✅ ถอนสำเร็จ', 'ของถูกถอนออกจากการขายแล้ว');
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const filtered = items.filter(item => {
    if (activeTab === 'listed')    return item.listed;
    if (activeTab === 'available') return !item.listed && !item.tradeLock;
    return true;
  });

  const listedCount   = items.filter(i => i.listed).length;
  const listedValue   = items.filter(i => i.listed).reduce((s, i) => s + i.price, 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>วางขาย Skins</Text>
        <View style={{ width: 40 }} />
      </View>

      {listedCount > 0 && (
        <View style={s.summaryBanner}>
          <View>
            <Text style={s.summaryLabel}>วางขายอยู่</Text>
            <Text style={s.summaryValue}>{listedCount} ชิ้น</Text>
          </View>
          <View style={s.summaryDivider} />
          <View>
            <Text style={s.summaryLabel}>มูลค่ารวม</Text>
            <Text style={[s.summaryValue, { color: colors.primary }]}>฿{listedValue.toLocaleString()}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View>
            <Text style={s.summaryLabel}>รับจริง (~95%)</Text>
            <Text style={[s.summaryValue, { color: colors.accentGreen }]}>฿{Math.round(listedValue * 0.95).toLocaleString()}</Text>
          </View>
        </View>
      )}

      <View style={s.tabRow}>
        {[
          { key: 'all',       label: `ทั้งหมด (${items.length})` },
          { key: 'available', label: `ขายได้ (${items.filter(i => !i.listed && !i.tradeLock).length})` },
          { key: 'listed',    label: `วางขาย (${listedCount})` },
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tab, activeTab === t.key && s.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[s.tabText, activeTab === t.key && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SellItemCard item={item} onList={handleList} onRemove={handleRemove} />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyIcon}>📦</Text>
            <Text style={s.emptyText}>ไม่มีไอเทมในหมวดนี้</Text>
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
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  summaryBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  summaryLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '600', marginBottom: 3 },
  summaryValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border },
  tabRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  list: { padding: 12, paddingBottom: 30 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 44, marginBottom: 12, opacity: 0.4 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});

const ss = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg, borderRadius: 12,
    marginBottom: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  rarityBar: { height: 3 },
  cardBody: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  imageBox: {
    width: 80, height: 56, backgroundColor: colors.surfaceElevated,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  image: { width: 76, height: 52 },
  stBadge: {
    position: 'absolute', top: 2, left: 2, backgroundColor: '#CF6A32',
    borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1,
  },
  stText: { color: '#fff', fontSize: 7, fontWeight: '800' },
  infoBox: { flex: 1 },
  weapon: { color: colors.textMuted, fontSize: 10, fontWeight: '600', marginBottom: 1 },
  skin: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  wearRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  wearDot: { width: 5, height: 5, borderRadius: 3, marginRight: 4 },
  wearText: { color: colors.textMuted, fontSize: 10, fontWeight: '600' },
  floatText: { color: colors.textMuted, fontSize: 9 },
  marketPrice: { color: colors.textMuted, fontSize: 10 },
  actionBox: { alignItems: 'flex-end', minWidth: 70 },
  sellBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8, minWidth: 70, alignItems: 'center',
  },
  sellBtnText: { color: '#000', fontSize: 12, fontWeight: '800' },
  listedText: { color: colors.accentGreen, fontSize: 11, fontWeight: '700' },
  removeBtn: {
    borderWidth: 1, borderColor: colors.accentRed, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 4,
  },
  removeBtnText: { color: colors.accentRed, fontSize: 10, fontWeight: '700' },
  lockedBadge: {
    backgroundColor: colors.accentRed + '22', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.accentRed + '44',
  },
  lockedText: { color: colors.accentRed, fontSize: 11, fontWeight: '600' },
  priceSection: {
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.surfaceElevated,
  },
  priceInputRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  priceInputLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  suggestBtn: { color: colors.accent, fontSize: 11, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: 8,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 10, gap: 6,
  },
  currencySymbol: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  priceInput: {
    flex: 1, color: colors.textPrimary,
    fontSize: 16, fontWeight: '700', paddingVertical: 10,
  },
  receiveBox: { alignItems: 'flex-end' },
  receiveLabel: { color: colors.textMuted, fontSize: 9 },
  receiveAmount: { color: colors.accentGreen, fontSize: 13, fontWeight: '800' },
  feeNote: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
});