import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import FilterModal from "../components/FilterModal";
import { fetchItems, fetchListings, buyItem, fetchBalance } from "../data/api";

const CATEGORIES = [
  { id: "", label: "All", icon: "🔫" },
  { id: "Rifles", label: "Rifles", icon: "🎯" },
  { id: "Pistols", label: "Pistols", icon: "💥" },
  { id: "Knives", label: "Knives", icon: "🔪" },
  { id: "Gloves", label: "Gloves", icon: "🧤" },
  { id: "SMGs", label: "SMGs", icon: "🔧" },
  { id: "Heavy", label: "Heavy", icon: "💣" },
  { id: "Equipment", label: "Equipment", icon: "🛡️" },
];

const ItemCard = ({ item, onPress }) => (
  <TouchableOpacity style={cs.card} onPress={onPress} activeOpacity={0.8}>
    <View style={[cs.rarityBar, { backgroundColor: item.rarityColor }]} />
    <View style={cs.imageBox}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={cs.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={cs.noImage}>🔫</Text>
      )}
    </View>
    <View style={cs.info}>
      <Text style={cs.weapon} numberOfLines={1}>
        {item.weapon}
      </Text>
      <Text style={cs.skin} numberOfLines={1}>
        {item.skin}
      </Text>
      <View style={[cs.rarityBadge, { borderColor: item.rarityColor }]}>
        <Text style={[cs.rarityText, { color: item.rarityColor }]}>
          {item.rarity}
        </Text>
      </View>
      <Text style={cs.price}>
        {item.listingPrice
          ? `฿${item.listingPrice.toLocaleString()}`
          : `฿${item.basePrice?.toLocaleString() || "—"}`}
      </Text>
      {item.sellerName && <Text style={cs.seller}>👤 {item.sellerName}</Text>}
    </View>
  </TouchableOpacity>
);

export default function StoreScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("database"); // database | listings

  useEffect(() => {
    loadData();
    loadBalance();
  }, [search, selectedCategory, activeTab, page]);

  const loadBalance = async () => {
    try {
      const data = await fetchBalance();
      if (data.success) setBalance(data.balance);
    } catch {}
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
      setPage(1);
    } else setLoading(true);

    try {
      if (activeTab === "database") {
        // ดึงจาก CS2 Items Database
        const data = await fetchItems({
          search,
          category: selectedCategory,
          page: isRefresh ? 1 : page,
          limit: 20,
        });
        if (data.success) {
          if (isRefresh || page === 1) setItems(data.items);
          else setItems((prev) => [...prev, ...data.items]);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } else {
        // ดึง Market Listings
        const data = await fetchListings();
        if (data.success) {
          setItems(
            data.listings.map((l) => ({
              ...l.item,
              listingId: l.listingId,
              listingPrice: l.price,
              sellerName: l.sellerName,
            })),
          );
          setTotal(data.total);
        }
      }
    } catch (err) {
      Alert.alert("Error", "ไม่สามารถโหลดข้อมูลได้: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleBuy = (item) => {
    navigation.navigate("Payment", {
      items: [{ ...item, price: item.listingPrice || item.basePrice }],
    });
  };

  const loadMore = () => {
    if (page < totalPages && !loading) setPage((p) => p + 1);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Store</Text>
        <View style={s.headerRight}>
          <View style={s.balanceBadge}>
            <Text style={s.balanceText}>฿{balance.toLocaleString()}</Text>
          </View>
          <TouchableOpacity onPress={() => loadData(true)}>
            <Text style={{ fontSize: 18 }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab: Database vs Listings */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tab, activeTab === "database" && s.tabActive]}
          onPress={() => {
            setActiveTab("database");
            setPage(1);
          }}
        >
          <Text
            style={[s.tabText, activeTab === "database" && s.tabTextActive]}
          >
            🎮 CS2 Items ({activeTab === "database" ? total : "2092"})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, activeTab === "listings" && s.tabActive]}
          onPress={() => {
            setActiveTab("listings");
            setPage(1);
          }}
        >
          <Text
            style={[s.tabText, activeTab === "listings" && s.tabTextActive]}
          >
            🏪 Listings ({activeTab === "listings" ? total : ""})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="ค้นหา เช่น AK-47, Karambit..."
            placeholderTextColor={colors.textMuted}
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchInput("");
                setSearch("");
              }}
            >
              <Text style={s.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Text style={s.searchBtnText}>ค้นหา</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={s.catRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[s.catBtn, selectedCategory === cat.id && s.catBtnActive]}
            onPress={() => {
              setSelectedCategory(cat.id);
              setPage(1);
            }}
          >
            <Text
              style={[
                s.catText,
                selectedCategory === cat.id && s.catTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.resultRow}>
        <Text style={s.resultText}>{total.toLocaleString()} items</Text>
        <Text style={s.pageText}>
          หน้า {page}/{totalPages}
        </Text>
      </View>

      {loading && page === 1 ? (
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>กำลังโหลด CS2 items...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i, idx) => i.id || String(idx)}
          numColumns={2}
          contentContainerStyle={s.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(true)}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() =>
                navigation.navigate("ItemDetail", {
                  item: { ...item, price: item.listingPrice || item.basePrice },
                })
              }
            />
          )}
          ListFooterComponent={
            loading && page > 1 ? (
              <View style={s.loadMoreBox}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🔍</Text>
              <Text style={s.emptyText}>ไม่พบ items</Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={() => {}}
      />
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
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "800" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  balanceBadge: {
    backgroundColor: colors.primary + "22",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary + "44",
  },
  balanceText: { color: colors.primary, fontSize: 13, fontWeight: "800" },

  tabRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: colors.primary, fontWeight: "700" },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, color: colors.textPrimary, height: 38, fontSize: 13 },
  clearBtn: { color: colors.textMuted, fontSize: 14, padding: 4 },
  searchBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  searchBtnText: { color: "#000", fontSize: 13, fontWeight: "800" },

  catRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catBtnActive: {
    backgroundColor: colors.primary + "22",
    borderColor: colors.primary,
  },
  catText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  catTextActive: { color: colors.primary, fontWeight: "700" },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultText: { color: colors.textMuted, fontSize: 11 },
  pageText: { color: colors.textMuted, fontSize: 11 },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 80,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  loadMoreBox: { padding: 20, alignItems: "center" },

  grid: { padding: 8, paddingBottom: 30 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 48, opacity: 0.4 },
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
  noImage: { fontSize: 40, opacity: 0.3 },
  info: { padding: 8 },
  weapon: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "600",
    marginBottom: 1,
  },
  skin: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  rarityBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  rarityText: { fontSize: 8, fontWeight: "700" },
  price: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  seller: { color: colors.textMuted, fontSize: 9, marginTop: 2 },
});
