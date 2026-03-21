import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { fetchItems } from "../data/api";

const CATEGORIES = [
  { id: "all", label: "All", icon: "🔫" },
  { id: "Knives", label: "Knives", icon: "🔪" },
  { id: "Gloves", label: "Gloves", icon: "🧤" },
  { id: "Rifles", label: "Rifles", icon: "🎯" },
  { id: "Pistols", label: "Pistols", icon: "💥" },
  { id: "SMGs", label: "SMGs", icon: "🔧" },
  { id: "Heavy", label: "Heavy", icon: "💣" },
  { id: "Equipment", label: "Equip", icon: "🛡️" },
];

const ItemCard = ({ item, onPress }) => (
  <TouchableOpacity style={cs.card} onPress={onPress} activeOpacity={0.8}>
    <View style={[cs.rarityBar, { backgroundColor: item.rarityColor || "#B0C3D9" }]} />
    <View style={cs.imageBox}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={cs.image} resizeMode="contain" />
      ) : (
        <Text style={cs.noImage}>🔫</Text>
      )}
    </View>
    <View style={cs.info}>
      <Text style={cs.weapon} numberOfLines={1}>{item.weapon}</Text>
      <Text style={cs.skin} numberOfLines={1}>{item.skin}</Text>
      <Text style={cs.price}>฿{(item.basePrice || 0).toLocaleString()}</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ✅ reload เมื่อ category หรือ search เปลี่ยน
  useEffect(() => {
    setPage(1);
    setItems([]);
    loadItems(1, true);
  }, [activeCategory, search]);

  // ✅ load more เมื่อ page เพิ่ม
  useEffect(() => {
    if (page > 1) loadItems(page, false);
  }, [page]);

  const loadItems = async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await fetchItems({
        page: pageNum,
        limit: 20,
        category: activeCategory === "all" ? "" : activeCategory,
        search: search,
      });

      if (data.success) {
        if (reset || pageNum === 1) setItems(data.items);
        else setItems((prev) => [...prev, ...data.items]);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.log("loadItems error:", err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCategoryPress = (catId) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    setSearchInput("");
    setSearch("");
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.logoRow}>
          <View style={s.logoBadge}>
            <Text style={s.logoLetter}>D</Text>
          </View>
          <Text style={s.logoText}>
            DEFUSE <Text style={s.logoHL}>TH</Text>
          </Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} onPress={() => console.log("Settings")}>
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate("Profile")}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchInput(""); setSearch(""); }}>
              <Text style={{ color: colors.textMuted, fontSize: 16, padding: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.catScroll}
        contentContainerStyle={s.catContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[s.catBtn, activeCategory === cat.id && s.catBtnActive]}
            onPress={() => handleCategoryPress(cat.id)}
          >
            <Text style={s.catIcon}>{cat.icon}</Text>
            <Text
              style={[s.catLabel, activeCategory === cat.id && s.catLabelActive]}
              numberOfLines={1}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Result count */}
      <View style={s.resultRow}>
        <Text style={s.resultText}>
          {total.toLocaleString()} items
          {activeCategory !== "all"
            ? ` · ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`
            : ""}
          {search ? ` · "${search}"` : ""}
        </Text>
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {/* Items Grid */}
      {loading && items.length === 0 ? (
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>กำลังโหลด CS2 items...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => item.id || String(idx)}
          numColumns={2}
          contentContainerStyle={s.grid}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() =>
                navigation.navigate("ItemDetail", {
                  item: { ...item, price: item.basePrice || 0 },
                })
              }
            />
          )}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator color={colors.primary} />
                <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 12 }}>
                  โหลดเพิ่มเติม...
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={{ fontSize: 44, marginBottom: 12 }}>🔍</Text>
              <Text style={s.emptyText}>ไม่พบ items</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoLetter: { color: "#000", fontWeight: "900", fontSize: 16 },
  logoText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  logoHL: { color: colors.primary, fontWeight: "900" },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: { padding: 4 },

  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, height: 40, fontSize: 14 },

  catScroll: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexShrink: 0,
    flexGrow: 0,
  },
  catContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  catBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    flexShrink: 0,
  },
  catIcon: { fontSize: 14, marginRight: 5 },
  catLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 0,
  },
  catBtnActive: {
    backgroundColor: colors.primary + "22",
    borderColor: colors.primary,
  },
  catLabelActive: { color: colors.primary, fontWeight: "700" },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultText: { color: colors.textMuted, fontSize: 12 },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },

  grid: { padding: 8, paddingBottom: 30 },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyText: { color: colors.textMuted, fontSize: 15 },
});

const cs = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  rarityBar: { height: 3 },
  imageBox: {
    height: 110,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  noImage: { fontSize: 36, opacity: 0.3 },
  info: { padding: 8 },
  weapon: { color: colors.textMuted, fontSize: 9, fontWeight: "600", marginBottom: 1 },
  skin: { color: colors.textPrimary, fontSize: 11, fontWeight: "700", marginBottom: 4 },
  price: { color: colors.primary, fontSize: 12, fontWeight: "800" },
});