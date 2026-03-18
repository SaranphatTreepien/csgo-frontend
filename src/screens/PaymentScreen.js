import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { formatPrice } from '../data/items';
import { storeItems } from '../data/items';

const PAYMENT_METHODS = [
  { id: 'promptpay', label: 'PromptPay', icon: '📱', sub: 'QR Code payment' },
  { id: 'truemoney', label: 'TrueMoney', icon: '💰', sub: 'TrueMoney Wallet' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', sub: 'Direct bank transfer' },
  { id: 'card', label: 'Credit/Debit', icon: '💳', sub: 'Visa, Mastercard' },
];

export default function PaymentScreen({ route, navigation }) {
  const passedItems = route?.params?.items || [storeItems[0], storeItems[2]];
  const [selectedMethod, setSelectedMethod] = useState('promptpay');
  const [items] = useState(passedItems);

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const serviceFee = Math.round(subtotal * 0.02);
  const total = subtotal + serviceFee;

  const handlePay = () => {
    if (selectedMethod === 'promptpay' || selectedMethod === 'truemoney') {
      navigation.navigate('QRPayment', { amount: total });
    } else {
      Alert.alert('Processing', 'Redirecting to payment gateway...', [
        { text: 'OK', onPress: () => navigation.navigate('Main') }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
          <View style={styles.itemsList}>
            {items.map((item, idx) => (
              <View key={item.id + idx} style={styles.orderItem}>
                <View style={styles.orderItemImage}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.orderImg}
                    resizeMode="contain"
                    defaultSource={{ uri: 'https://via.placeholder.com/50x34/1A1A26/444?text=...' }}
                  />
                  <View style={[styles.orderRarityDot, { backgroundColor: item.rarityColor }]} />
                </View>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemWeapon}>{item.weapon}</Text>
                  <Text style={styles.orderItemSkin} numberOfLines={1}>{item.skin}</Text>
                  {item.wear && <Text style={styles.orderItemWear}>{item.wear}</Text>}
                </View>
                <Text style={styles.orderItemPrice}>{formatPrice(item.price)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
          <View style={styles.methodList}>
            {PAYMENT_METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodLeft}>
                  <View style={[
                    styles.methodIconBox,
                    selectedMethod === method.id && { backgroundColor: colors.primary + '22' }
                  ]}>
                    <Text style={styles.methodIcon}>{method.icon}</Text>
                  </View>
                  <View>
                    <Text style={[styles.methodLabel, selectedMethod === method.id && { color: colors.primary }]}>
                      {method.label}
                    </Text>
                    <Text style={styles.methodSub}>{method.sub}</Text>
                  </View>
                </View>
                <View style={[styles.radioOuter, selectedMethod === method.id && styles.radioOuterActive]}>
                  {selectedMethod === method.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRICE DETAILS</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal ({items.length} items)</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee (2%)</Text>
              <Text style={styles.priceValue}>{formatPrice(serviceFee)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceTotalLabel}>Total</Text>
              <Text style={styles.priceTotalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Pay Button */}
      <View style={styles.payFooter}>
        <View style={styles.payTotalRow}>
          <Text style={styles.payTotalLabel}>Total</Text>
          <Text style={styles.payTotalAmount}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
          <Text style={styles.payBtnText}>PAY NOW →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1 },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    color: colors.textMuted, fontSize: 10, fontWeight: '800',
    letterSpacing: 2, marginBottom: 12,
  },

  itemsList: {
    backgroundColor: colors.surfaceElevated, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  orderItemImage: {
    width: 60, height: 42, position: 'relative',
    backgroundColor: colors.cardBg, borderRadius: 8,
    marginRight: 12, alignItems: 'center', justifyContent: 'center',
  },
  orderImg: { width: 56, height: 38 },
  orderRarityDot: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, borderRadius: 1,
  },
  orderItemInfo: { flex: 1 },
  orderItemWeapon: { color: colors.textMuted, fontSize: 10, fontWeight: '600', marginBottom: 2 },
  orderItemSkin: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 2 },
  orderItemWear: { color: colors.textMuted, fontSize: 10 },
  orderItemPrice: { color: colors.primary, fontSize: 14, fontWeight: '800' },

  methodList: { gap: 8 },
  methodCard: {
    backgroundColor: colors.surfaceElevated, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  methodCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '0A' },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodIconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center',
  },
  methodIcon: { fontSize: 20 },
  methodLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  methodSub: { color: colors.textMuted, fontSize: 11 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.primary },
  radioInner: {
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: colors.primary,
  },

  priceCard: {
    backgroundColor: colors.surfaceElevated, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { color: colors.textSecondary, fontSize: 13 },
  priceValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  priceDivider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  priceTotalLabel: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  priceTotalValue: { color: colors.primary, fontSize: 18, fontWeight: '900' },

  payFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  payTotalRow: { flex: 1 },
  payTotalLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600', marginBottom: 2 },
  payTotalAmount: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  payBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 14,
  },
  payBtnText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});
