import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { formatPrice } from '../data/items';

const QR_SIZE = 220;

const QRPlaceholder = ({ size }) => {
  const cells = 21;
  const cellSize = Math.floor(size / cells);

  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
    [0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0],
    [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1],
  ];

  return (
    <View style={[styles.qrWrapper, { width: size, height: size }]}>
      <View style={{ backgroundColor: '#fff', padding: 8, borderRadius: 12 }}>
        {pattern.map((row, r) => (
          <View key={r} style={{ flexDirection: 'row' }}>
            {row.map((cell, c) => (
              <View
                key={c}
                style={{
                  width: cellSize - 0.5,
                  height: cellSize - 0.5,
                  backgroundColor: cell === 1 ? '#000' : '#fff',
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default function QRPaymentScreen({ route, navigation }) {
  const amount = route?.params?.amount || 17053.83;
  const isDeposit = route?.params?.isDeposit || false;
  const [countdown, setCountdown] = useState(300);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSimulatePay = () => {
    setPaid(true);
    setTimeout(() => {
      Alert.alert('Payment Successful! 🎉', `${formatPrice(amount)} has been ${isDeposit ? 'deposited' : 'paid'} successfully.`, [
        { text: 'Done', onPress: () => navigation.navigate('Main') }
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isDeposit ? 'Deposit' : 'Payment'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* App Logo row */}
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoLetter}>D</Text>
          </View>
          <Text style={styles.logoText}>DEFUSE <Text style={styles.logoHL}>TH</Text></Text>
        </View>

        {/* Amount */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.amountValue}>{formatPrice(amount)}</Text>
          <Text style={styles.amountUSD}>${(amount / 350).toFixed(2)} USD</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          {paid ? (
            <View style={styles.paidOverlay}>
              <Text style={styles.paidCheckmark}>✅</Text>
              <Text style={styles.paidText}>PAID</Text>
            </View>
          ) : (
            <QRPlaceholder size={QR_SIZE} />
          )}
        </View>

        {/* PromptPay label */}
        <View style={styles.promptpayBadge}>
          <Text style={styles.promptpayIcon}>📱</Text>
          <Text style={styles.promptpayText}>Scan with PromptPay or Banking App</Text>
        </View>

        {/* Timer */}
        {!paid && (
          <View style={[styles.timerBox, countdown < 60 && { borderColor: colors.accentRed }]}>
            <Text style={styles.timerLabel}>Expires in</Text>
            <Text style={[styles.timerValue, countdown < 60 && { color: colors.accentRed }]}>
              {formatCountdown(countdown)}
            </Text>
          </View>
        )}

        {/* Steps */}
        <View style={styles.stepsBox}>
          <Text style={styles.stepsTitle}>How to pay:</Text>
          {[
            '1. Open your banking app',
            '2. Select "Scan QR" or "PromptPay"',
            '3. Scan the QR code above',
            '4. Confirm the payment amount',
            '5. Complete the payment',
          ].map(step => (
            <Text key={step} style={styles.stepText}>{step}</Text>
          ))}
        </View>

        {/* Simulate pay (demo button) */}
        {!paid && (
          <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulatePay}>
            <Text style={styles.simulateBtnText}>SIMULATE PAYMENT (DEMO)</Text>
          </TouchableOpacity>
        )}
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

  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },

  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoBadge: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  logoLetter: { color: '#000', fontWeight: '900', fontSize: 16 },
  logoText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  logoHL: { color: colors.primary, fontWeight: '900' },

  amountBox: { alignItems: 'center', marginBottom: 20 },
  amountLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  amountValue: { color: colors.primary, fontSize: 32, fontWeight: '900', marginBottom: 2 },
  amountUSD: { color: colors.textMuted, fontSize: 13 },

  qrContainer: { marginBottom: 16, position: 'relative' },
  qrWrapper: { alignItems: 'center', justifyContent: 'center' },
  paidOverlay: {
    width: QR_SIZE, height: QR_SIZE,
    backgroundColor: colors.accentGreen + '22',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.accentGreen,
  },
  paidCheckmark: { fontSize: 56, marginBottom: 8 },
  paidText: { color: colors.accentGreen, fontSize: 24, fontWeight: '900', letterSpacing: 4 },

  promptpayBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surfaceElevated, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  promptpayIcon: { fontSize: 14 },
  promptpayText: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },

  timerBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8,
    marginBottom: 16,
  },
  timerLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
  timerValue: { color: colors.primary, fontSize: 18, fontWeight: '900', letterSpacing: 1 },

  stepsBox: {
    backgroundColor: colors.surfaceElevated, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, width: '100%', marginBottom: 16,
  },
  stepsTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  stepText: { color: colors.textMuted, fontSize: 11, marginBottom: 3, lineHeight: 18 },

  simulateBtn: {
    backgroundColor: colors.accentGreen + '22',
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24,
    borderWidth: 1, borderColor: colors.accentGreen, width: '100%', alignItems: 'center',
  },
  simulateBtnText: { color: colors.accentGreen, fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
});
