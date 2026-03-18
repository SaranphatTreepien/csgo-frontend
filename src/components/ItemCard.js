import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { formatPrice } from '../data/items';

const WEAR_SHORT = {
  'Factory New': 'FN',
  'Minimal Wear': 'MW',
  'Field-Tested': 'FT',
  'Well-Worn': 'WW',
  'Battle-Scarred': 'BS',
};

export default function ItemCard({ item, onPress, compact = false, showBuyBtn = false, onBuy }) {
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.rarityBar, { backgroundColor: item.rarityColor }]} />
        <View style={styles.compactImageBox}>
          <Image
            source={{ uri: item.image }}
            style={styles.compactImage}
            resizeMode="contain"
            defaultSource={{ uri: 'https://via.placeholder.com/80x50/1A1A26/444?text=...' }}
          />
          {item.stattrak && (
            <View style={styles.stBadge}>
              <Text style={styles.stText}>ST</Text>
            </View>
          )}
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactWeapon} numberOfLines={1}>{item.weapon}</Text>
          <Text style={styles.compactSkin} numberOfLines={1}>{item.skin}</Text>
          {item.wear && (
            <View style={styles.wearRow}>
              <View style={[styles.wearDot, { backgroundColor: item.rarityColor }]} />
              <Text style={styles.wearText}>{WEAR_SHORT[item.wear] || item.wear}</Text>
            </View>
          )}
          <Text style={styles.compactPrice}>{formatPrice(item.price)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.topRarityBar, { backgroundColor: item.rarityColor }]} />
      <View style={styles.imageBox}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
          defaultSource={{ uri: 'https://via.placeholder.com/120x80/1A1A26/444?text=...' }}
        />
        <View style={styles.badgeRow}>
          {item.stattrak && (
            <View style={styles.stBadge}>
              <Text style={styles.stText}>StatTrak™</Text>
            </View>
          )}
          {item.souvenir && (
            <View style={[styles.stBadge, { backgroundColor: '#E4AE33' }]}>
              <Text style={[styles.stText, { color: '#000' }]}>Souvenir</Text>
            </View>
          )}
          {item.tradeLock && (
            <View style={[styles.stBadge, { backgroundColor: colors.accentRed }]}>
              <Text style={styles.stText}>🔒</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.weapon} numberOfLines={1}>{item.weapon}</Text>
        <Text style={styles.skin} numberOfLines={1}>{item.skin}</Text>
        <View style={styles.detailRow}>
          {item.wear && <Text style={styles.wear}>{WEAR_SHORT[item.wear] || item.wear}</Text>}
          {item.float && <Text style={styles.float}>{item.float.toFixed(4)}</Text>}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          {showBuyBtn && (
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={(e) => { e.stopPropagation(); onBuy && onBuy(item); }}
            >
              <Text style={styles.buyText}>BUY</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    margin: 4,
  },
  topRarityBar: {
    height: 3,
    width: '100%',
  },
  imageBox: {
    backgroundColor: colors.surfaceElevated,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'column',
    gap: 2,
  },
  stBadge: {
    backgroundColor: '#CF6A32',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginBottom: 2,
  },
  stText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  info: {
    padding: 8,
  },
  weapon: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 1,
  },
  skin: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  wear: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  float: {
    color: colors.textMuted,
    fontSize: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  buyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buyText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },

  // Compact styles
  compactCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    width: 130,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rarityBar: {
    height: 2,
    width: '100%',
  },
  compactImageBox: {
    backgroundColor: colors.surfaceElevated,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactInfo: {
    padding: 6,
  },
  compactWeapon: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 1,
  },
  compactSkin: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  wearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  wearDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },
  wearText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  compactPrice: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
