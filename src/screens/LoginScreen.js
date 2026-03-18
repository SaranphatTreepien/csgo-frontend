import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ จำเป็นต้องเรียกเพื่อให้ Browser ปิดตัวเองได้
WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = 'https://defuse-th-backend.onrender.com';

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // ฟัง Deep Link ที่ส่งกลับมาจาก Backend
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // เช็คว่ามี Token เก่าอยู่แล้วไหม (Auto Login)
    checkExistingToken();

    return () => subscription.remove();
  }, []);

  const checkExistingToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) navigation.replace('Main');
  };

  const handleDeepLink = async ({ url }) => {
    if (!url.includes('auth/callback')) return;

    const parsed = Linking.parse(url);
    const { token, steamId, name, error } = parsed.queryParams;

    if (error) {
      alert('Login ล้มเหลว: ' + error);
      setLoading(false);
      return;
    }

    if (token) {
      // บันทึก Token + ข้อมูล User
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('steamId', steamId);
      await AsyncStorage.setItem('displayName', decodeURIComponent(name));
      navigation.replace('Main');
    }
  };

  const handleSteamLogin = async () => {
    setLoading(true);
    try {
      // เปิด Browser ใน App → ไปที่ Steam Login
      const result = await WebBrowser.openAuthSessionAsync(
        `${BACKEND_URL}/auth/steam`,
        'myapp://auth/callback'
      );

      // ถ้า User ปิด Browser เอง
      if (result.type === 'cancel' || result.type === 'dismiss') {
        setLoading(false);
      }
    } catch (err) {
      console.error('Steam login error:', err);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>💣</Text>
      <Text style={styles.title}>DEFUSE TH</Text>
      <Text style={styles.subtitle}>CS2 Marketplace</Text>

      {/* Steam Login Button */}
      <TouchableOpacity
        style={[styles.steamBtn, loading && styles.steamBtnDisabled]}
        onPress={handleSteamLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#66c0f4" />
        ) : (
          <Text style={styles.steamBtnText}>🎮  Login ด้วย Steam</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>
        ต้องมีบัญชี Steam{'\n'}และเปิด Inventory เป็น Public
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0e1a', padding: 24 },
  logo:            { fontSize: 64, marginBottom: 12 },
  title:           { fontSize: 36, fontWeight: 'bold', color: '#fff', letterSpacing: 4 },
  subtitle:        { fontSize: 16, color: '#8899aa', marginBottom: 60 },
  steamBtn:        { backgroundColor: '#1b2838', borderWidth: 1.5, borderColor: '#66c0f4', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 8, minWidth: 240, alignItems: 'center' },
  steamBtnDisabled:{ opacity: 0.6 },
  steamBtnText:    { color: '#66c0f4', fontSize: 18, fontWeight: 'bold' },
  hint:            { marginTop: 24, color: '#556677', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});