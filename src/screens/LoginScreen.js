import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = "https://defuse-th-backend.onrender.com";

// ข้อมูล Admin (ตั้งค่าได้ตามต้องการ)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin@1234";
const ADMIN_STEAM_ID = "admin_dev_001";

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showAdminForm, setShowAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    checkExistingToken();
    return () => subscription.remove();
  }, []);

  // ── Auto Login ─────────────────────────────────────
  const checkExistingToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) navigation.replace("Main");
  };

  // ── Steam Deep Link Handler ─────────────────────────
  const handleDeepLink = async ({ url }) => {
    if (!url.includes("auth/callback")) return;
    const parsed = Linking.parse(url);
    const { token, steamId, name, error } = parsed.queryParams;

    if (error) {
      Alert.alert("❌ Login ล้มเหลว", error);
      setLoading(false);
      return;
    }
    if (token) {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("steamId", steamId);
      await AsyncStorage.setItem("displayName", decodeURIComponent(name));
      await AsyncStorage.setItem("userType", "steam");

      // ดึง avatar จาก Backend หลัง login สำเร็จ
      try {
        const verifyRes = await fetch(`${BACKEND_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.user?.avatar) {
          await AsyncStorage.setItem("avatar", verifyData.user.avatar);
        }
      } catch {}

      navigation.replace("Main");
    }
  };

  // ── Steam Login ─────────────────────────────────────
  const handleSteamLogin = async () => {
    setLoading(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${BACKEND_URL}/auth/steam`,
        "myapp://auth/callback",
      );
      if (result.type === "cancel" || result.type === "dismiss") {
        setLoading(false);
      }
    } catch (err) {
      console.error("Steam login error:", err);
      setLoading(false);
    }
  };

  // ── Admin Login ─────────────────────────────────────
  const handleAdminLogin = async () => {
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      Alert.alert("❌ ผิด", "Username หรือ Password ไม่ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      // เรียก Mock Login API ด้วย Admin SteamId
      const res = await fetch(`${BACKEND_URL}/auth/mock-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steamId: ADMIN_STEAM_ID,
          displayName: "Admin Dev",
        }),
      });
      const data = await res.json();

      if (data.success) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("steamId", data.steamId);
        await AsyncStorage.setItem("displayName", data.displayName);
        await AsyncStorage.setItem("userType", "admin"); // บันทึกว่าเป็น admin
        navigation.replace("Main");
      } else {
        Alert.alert("Error", data.error || "Login ล้มเหลว");
      }
    } catch (err) {
      Alert.alert("Error", "ไม่สามารถเชื่อมต่อ Server ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>💣</Text>
      <Text style={styles.title}>DEFUSE TH</Text>
      <Text style={styles.subtitle}>CS2 Marketplace</Text>

      {!showAdminForm ? (
        // ── หน้าปกติ ──────────────────────────────────
        <>
          {/* Steam Login */}
          <TouchableOpacity
            style={[styles.steamBtn, loading && styles.btnDisabled]}
            onPress={handleSteamLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#66c0f4" />
            ) : (
              <Text style={styles.steamBtnText}>🎮 Login ด้วย Steam</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            ต้องมีบัญชี Steam{"\n"}และเปิด Inventory เป็น Public
          </Text>

          {/* Admin Login (กดตรงข้อความเล็กๆ) */}
          <TouchableOpacity
            style={styles.adminLink}
            onPress={() => setShowAdmin(true)}
          >
            <Text style={styles.adminLinkText}>🔧 Developer Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        // ── Admin Form ────────────────────────────────
        <>
          <View style={styles.adminForm}>
            <Text style={styles.adminFormTitle}>🔧 Developer Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#556677"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#556677"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.adminBtn, loading && styles.btnDisabled]}
              onPress={handleAdminLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.adminBtnText}>เข้าสู่ระบบ</Text>
              )}
            </TouchableOpacity>

            {/* กลับ */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                setShowAdmin(false);
                setUsername("");
                setPassword("");
              }}
            >
              <Text style={styles.backBtnText}>← กลับ</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e1a",
    padding: 24,
  },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: "bold", color: "#fff", letterSpacing: 4 },
  subtitle: { fontSize: 16, color: "#8899aa", marginBottom: 48 },

  // Steam
  steamBtn: {
    backgroundColor: "#1b2838",
    borderWidth: 1.5,
    borderColor: "#66c0f4",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    minWidth: 240,
    alignItems: "center",
  },
  steamBtnText: { color: "#66c0f4", fontSize: 18, fontWeight: "bold" },
  btnDisabled: { opacity: 0.6 },
  hint: {
    marginTop: 16,
    color: "#556677",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  // Admin Link
  adminLink: { marginTop: 40, padding: 8 },
  adminLinkText: { color: "#334455", fontSize: 12 },

  // Admin Form
  adminForm: { width: "100%", alignItems: "center" },
  adminFormTitle: {
    color: "#aabbcc",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#1a2233",
    borderWidth: 1,
    borderColor: "#2a3a4a",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  adminBtn: {
    width: "100%",
    backgroundColor: "#66c0f4",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  adminBtnText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  backBtn: { marginTop: 16, padding: 8 },
  backBtnText: { color: "#556677", fontSize: 14 },
});
