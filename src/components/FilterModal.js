import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../theme/colors';

const RARITIES = ['All', 'Consumer', 'Industrial', 'Mil-Spec', 'Restricted', 'Classified', 'Covert'];
const TYPES = ['All', 'Rifle', 'Pistol', 'Sniper Rifle', 'Knife', 'Gloves', 'Case'];
const WEAR_LIST = ['All', 'Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
const SORT_OPTIONS = ['Price: Low to High', 'Price: High to Low', 'Float: Low', 'Newest'];

export default function FilterModal({ visible, onClose, onApply }) {
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedWear, setSelectedWear] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Price: Low to High');

  const handleApply = () => {
    onApply({ rarity: selectedRarity, type: selectedType, wear: selectedWear, sort: selectedSort });
    onClose();
  };

  const handleReset = () => {
    setSelectedRarity('All');
    setSelectedType('All');
    setSelectedWear('All');
    setSelectedSort('Price: Low to High');
  };

  const ChipRow = ({ label, options, selected, onSelect }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, selected === opt && styles.chipActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>Filter & Sort</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ChipRow label="RARITY" options={RARITIES} selected={selectedRarity} onSelect={setSelectedRarity} />
        <ChipRow label="WEAPON TYPE" options={TYPES} selected={selectedType} onSelect={setSelectedType} />
        <ChipRow label="WEAR" options={WEAR_LIST} selected={selectedWear} onSelect={setSelectedWear} />
        <ChipRow label="SORT BY" options={SORT_OPTIONS} selected={selectedSort} onSelect={setSelectedSort} />

        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>APPLY FILTERS</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  resetText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  chipScroll: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  applyText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
