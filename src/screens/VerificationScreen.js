import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const FormField = ({ label, placeholder, value, onChangeText, keyboardType, icon, maxLength }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputRow}>
      {icon && <Text style={styles.inputIcon}>{icon}</Text>}
      <TextInput
        style={[styles.input, icon && styles.inputWithIcon]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength}
      />
    </View>
  </View>
);

export default function VerificationScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idCard: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field) => (val) => setForm(prev => ({ ...prev, [field]: val }));

  const isComplete = Object.values(form).every(v => v.trim().length > 0);

  const handleSubmit = () => {
    if (!isComplete) {
      Alert.alert('Incomplete', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Verification Submitted',
        'Your documents are under review. This usually takes 1-2 business days.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Status Banner */}
          <View style={styles.statusBanner}>
            <View style={styles.statusIcon}>
              <Text style={{ fontSize: 24 }}>🛡️</Text>
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>ID Verification Required</Text>
              <Text style={styles.statusSub}>Verify your identity to unlock all features including deposits and withdrawals.</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionLabel}>PERSONAL INFORMATION</Text>

            <FormField
              label="First Name"
              placeholder="Enter your first name"
              value={form.firstName}
              onChangeText={update('firstName')}
              icon="👤"
            />
            <FormField
              label="Last Name"
              placeholder="Enter your last name"
              value={form.lastName}
              onChangeText={update('lastName')}
              icon="👤"
            />
            <FormField
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={update('email')}
              keyboardType="email-address"
              icon="📧"
            />

            <View style={styles.divider} />
            <Text style={styles.formSectionLabel}>IDENTIFICATION</Text>

            <FormField
              label="ID Card Number"
              placeholder="X-XXXX-XXXXX-XX-X"
              value={form.idCard}
              onChangeText={update('idCard')}
              keyboardType="number-pad"
              icon="🪪"
              maxLength={17}
            />
            <FormField
              label="Birth Date"
              placeholder="DD/MM/YYYY"
              value={form.birthDate}
              onChangeText={update('birthDate')}
              keyboardType="numbers-and-punctuation"
              icon="📅"
              maxLength={10}
            />
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Why we need this?</Text>
            <Text style={styles.infoText}>
              Your information is encrypted and used only for identity verification in compliance with Thai financial regulations. We never share your data with third parties.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, (!isComplete || loading) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isComplete || loading}
          >
            <Text style={styles.submitText}>{loading ? 'SUBMITTING...' : 'SUBMIT VERIFICATION'}</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  statusBanner: {
    backgroundColor: colors.primary + '15',
    borderRadius: 14, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: colors.primary + '44',
    flexDirection: 'row', gap: 14,
  },
  statusIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  statusText: { flex: 1 },
  statusTitle: { color: colors.primary, fontSize: 14, fontWeight: '800', marginBottom: 4 },
  statusSub: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },

  formCard: {
    backgroundColor: colors.surfaceElevated, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  formSectionLabel: {
    color: colors.textMuted, fontSize: 10, fontWeight: '800',
    letterSpacing: 2, marginBottom: 14,
  },

  field: { marginBottom: 16 },
  fieldLabel: {
    color: colors.textSecondary, fontSize: 12, fontWeight: '600',
    marginBottom: 6, letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 12, paddingVertical: 12,
    fontSize: 16, borderRightWidth: 1, borderRightColor: colors.border,
  },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 12,
    color: colors.textPrimary, fontSize: 14,
  },
  inputWithIcon: { paddingLeft: 12 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },

  infoBox: {
    backgroundColor: colors.accent + '11', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.accent + '33', marginBottom: 20,
  },
  infoTitle: { color: colors.accent, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  infoText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },

  submitBtn: {
    backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: colors.primary + '55' },
  submitText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});
