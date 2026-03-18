import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function Header({ title, showCart, showNotif, cartCount = 0, onCartPress, onNotifPress, showBack, onBackPress }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.logoRow}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>D</Text>
              </View>
              <Text style={styles.logoTitle}>DEFUSE <Text style={styles.logoBold}>TH</Text></Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.right}>
          {showCart && (
            <TouchableOpacity style={styles.iconBtn} onPress={onCartPress}>
              <Text style={styles.iconText}>🛒</Text>
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {showNotif && (
            <TouchableOpacity style={styles.iconBtn} onPress={onNotifPress}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  left: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },
  logoTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  logoBold: {
    color: colors.primary,
    fontWeight: '900',
  },
  title: {
    flex: 2,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4,
    position: 'relative',
  },
  iconText: {
    fontSize: 20,
  },
  backArrow: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
