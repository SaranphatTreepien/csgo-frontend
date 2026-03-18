import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { logout, fetchBalance, depositBalance, getStoredUser } from '../data/api';

const MenuItem = ({ icon, label, sublabel, onPress, danger = false, accent = false }) => (
  <TouchableOpacity style={ms.item} onPress={onPress} activeOpacity={0.7}>
    <View style={[
      ms.iconBox,
      danger  && { backgroundColor: colors.accentRed  + '22' },
      accent  && { backgroundColor: colors.primary    + '22' },
    ]}>
      <Text style={ms.icon}>{icon}</Text>
    </View>
    <View style={ms.textBox}>
      <Text style={[ms.label, danger && { color: colors.accentRed }]}>{label}</Text>
      {sublabel && <Text style={ms.sublabel}>{sublabel}</Text>}
    </View>
    <Text style={ms.arrow}>›</Text>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const [balance, setBalance]   = useState(0);
  const [user, setUser]         = useState(null);

  useEffect(() => {
    loadUser();
    loadBalance();
  }, []);

  const loadUser = async () => {
    const stored = await getStoredUser();
    if (stored) setUser(stored);
  };

  const loadBalance = async () => {
    try {
      const data = await fetchBalance();
      if (data.success) setBalance(data.balance);
    } catch {}
  };

  const handleDeposit = () => {
    Alert.alert(
      '+ เติมเงิน',
      'เลือกจำนวนที่ต้องการเติม',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: '฿100',  onPress: () => doDeposit(100)  },
        { text: '฿500',  onPress: () => doDeposit(500)  },
        { text: '฿1000', onPress: () => doDeposit(1000) },
      ]
    );
  };

  const doDeposit = async (amount) => {
    try {
      const data = await depositBalance(amount);
      if (data.success) {
        setBalance(data.newBalance);
        Alert.alert('✅ เติมเงินสำเร็จ', `เติม ฿${amount} สำเร็จ\nยอดคงเหลือ: ฿${data.newBalance.toLocaleString()}`);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'ต้องการออกจากระบบ?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const displayName = user?.displayName || 'HEALINGFACTOR';
  const steamId     = user?.steamId     || '76561198283624115';
  const avatar      = user?.avatar      || null;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
        <TouchableOpacity style={s.settingsBtn} onPress={loadBalance}>
          <Text>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={s.profileCard}>
          <View style={s.avatarBox}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={s.avatarImg} />
            ) : (
              <View style={s.avatarPlaceholder}>
                <Text style={s.avatarEmoji}>🎯</Text>
              </View>
            )}
            <View style={s.levelBadge}><Text style={s.levelText}>Lv.42</Text></View>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.userName}>{displayName}</Text>
            <Text style={s.userId}>ID: {steamId.slice(-6)}</Text>
            <View style={s.statsRow}>
              <View style={s.stat}>
                <Text style={s.statValue}>128</Text>
                <Text style={s.statLabel}>Trades</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={s.statValue}>⭐ 4.9</Text>
                <Text style={s.statLabel}>Rating</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={[s.statValue, { color: colors.accentGreen }]}>✓</Text>
                <Text style={s.statLabel}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={s.balanceCard}>
          <View>
            <Text style={s.balanceLabel}>💰 BALANCE</Text>
            <Text style={s.balanceAmount}>฿ {balance.toLocaleString()}</Text>
          </View>
          <View style={s.balanceActions}>
            <TouchableOpacity style={s.depositBtn} onPress={handleDeposit}>
              <Text style={s.depositText}>+ DEPOSIT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.withdrawBtn}
              onPress={() => Alert.alert('Withdraw', 'กรอกจำนวนที่ต้องการถอน')}
            >
              <Text style={s.withdrawText}>WITHDRAW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>ACTIVITY</Text>
          <View style={s.menuCard}>
            <MenuItem
              icon="🛒"
              label="Buy History"
              sublabel="ประวัติการซื้อทั้งหมด"
              onPress={() => Alert.alert('Buy History', 'ยังไม่มีประวัติการซื้อ')}
            />
            <View style={s.divider} />
            <MenuItem
              icon="💸"
              label="Sale History / วางขาย"
              sublabel="จัดการของที่วางขาย"
              accent
              onPress={() => navigation.navigate('Sell')}
            />
          </View>
        </View>

        {/* Account */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>ACCOUNT</Text>
          <View style={s.menuCard}>
            <MenuItem
              icon="🛡️"
              label="Verification"
              sublabel="สถานะการยืนยันตัวตน"
              accent
              onPress={() => navigation.navigate('Verification')}
            />
            <View style={s.divider} />
            <MenuItem
              icon="🔔"
              label="Notifications"
              sublabel="จัดการการแจ้งเตือน"
              onPress={() => Alert.alert('Notifications', 'ตั้งค่าการแจ้งเตือน')}
            />
            <View style={s.divider} />
            <MenuItem
              icon="🔒"
              label="Security"
              sublabel="รหัสผ่าน & 2FA"
              onPress={() => Alert.alert('Security', 'ตั้งค่าความปลอดภัย')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={s.section}>
          <View style={s.menuCard}>
            <MenuItem
              icon="🚪"
              label="Logout"
              danger
              onPress={handleLogout}
            />
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  settingsBtn: { padding: 6 },
  scroll: { flex: 1 },

  profileCard: {
    backgroundColor: colors.surfaceElevated,
    margin: 16, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  avatarBox: { position: 'relative' },
  avatarImg: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: colors.primary },
  avatarPlaceholder: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primary + '33',
    borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 36 },
  levelBadge: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: colors.primary, borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  levelText: { color: '#000', fontSize: 10, fontWeight: '900' },
  profileInfo: { flex: 1 },
  userName: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 2 },
  userId: { color: colors.textMuted, fontSize: 12, marginBottom: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stat: { alignItems: 'center' },
  statValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '800', marginBottom: 1 },
  statLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '600' },
  statDivider: { width: 1, height: 24, backgroundColor: colors.border },

  balanceCard: {
    backgroundColor: colors.cardBg,
    marginHorizontal: 16, marginBottom: 8,
    borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.primary + '44',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  balanceLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  balanceAmount: { color: colors.primary, fontSize: 26, fontWeight: '900' },
  balanceActions: { gap: 8 },
  depositBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  depositText: { color: '#000', fontSize: 12, fontWeight: '900' },
  withdrawBtn: {
    backgroundColor: 'transparent', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  withdrawText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },

  section: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: {
    color: colors.textMuted, fontSize: 10, fontWeight: '800',
    letterSpacing: 2, marginBottom: 8, paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.cardBg, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 64 },
});

const ms = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 14, gap: 12,
  },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  textBox: { flex: 1 },
  label: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 1 },
  sublabel: { color: colors.textMuted, fontSize: 11 },
  arrow: { color: colors.textMuted, fontSize: 22, fontWeight: '300' },
});