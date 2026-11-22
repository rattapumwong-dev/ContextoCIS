// src/screens/LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const C = {
  bgTop: "#EDF5FF",
  bg: "#F5F9FF",
  card: "#FFFFFF",
  primary: "#1B6CF0",
  primaryDark: "#0F49A6",
  accent: "#18B87A",
  text: "#0F172A",
  sub: "#475569",
  border: "#E2E8F0",
  warn: "#FF7F50",
  cyan: "#14B8FF",
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

  const mapFirebaseErr = (code, message) => {
    if (code?.includes("invalid-credential")) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    if (code?.includes("user-not-found"))     return "ไม่พบบัญชีนี้ในระบบ";
    if (code?.includes("wrong-password"))     return "รหัสผ่านไม่ถูกต้อง";
    if (code?.includes("too-many-requests"))  return "พยายามมากเกินไป กรุณาลองใหม่ภายหลัง";
    return message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ ข้อมูลไม่ครบ", "กรุณากรอก Email และ Password");
      return;
    }
    if (!emailOk(email)) {
      Alert.alert("⚠️ อีเมลไม่ถูกต้อง", "กรุณาตรวจสอบรูปแบบอีเมล");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("✅ เข้าสู่ระบบสำเร็จ");
      navigation.replace("Home");
    } catch (err) {
      Alert.alert("❌ เข้าสู่ระบบไม่สำเร็จ", mapFirebaseErr(err.code, err.message));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email && password && !loading;

  return (
    <SafeAreaView style={S.safe}>
      {/* ลวดลายพื้นหลัง */}
      <View style={S.bgDecorTop} />
      <View style={S.bgDecorDot} />
      <View style={S.bgDecorBottom} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[S.container, { flexGrow: 1, paddingBottom: 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* โลโก้/หัวเรื่อง */}
          <View style={{ alignItems: "center", marginTop: 16, marginBottom: 10 }}>
            <Text style={S.brand}>🎮 ContextoCIS</Text>

          </View>

          {/* การ์ดล็อกอิน */}
          <View style={S.card}>
            <Text style={S.title}>เข้าสู่ระบบ</Text>
            <Text style={S.desc}>ยินดีต้อนรับกลับมา! พร้อมเล่นต่อหรือยัง 😊</Text>

            <Text style={S.label}>อีเมล</Text>
            <View style={S.inputWrap}>
              <TextInput
                placeholder="you@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={S.input}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={S.label}>รหัสผ่าน</Text>
            <View style={[S.inputWrap, { flexDirection: "row", alignItems: "center" }]}>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                style={[S.input, { flex: 1, paddingRight: 8 }]}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={() => setShowPw((v) => !v)}
                activeOpacity={0.8}
                style={S.eyeBtn}
              >
                <Text style={{ color: C.primaryDark, fontWeight: "800" }}>
                  {showPw ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[S.btn, !canSubmit && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={!canSubmit}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={S.btnText}>เข้าสู่ระบบ</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={S.btnGhost}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={S.btnGhostText}>🆕 สมัครสมาชิกใหม่</Text>
            </TouchableOpacity>

          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bgTop },

  container: { padding: 16, backgroundColor: "transparent" },

  /* พื้นหลังลวดลายแบบเรียบหรู */
  bgDecorTop: {
    position: "absolute",
    top: -100,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 9999,
    backgroundColor: "#E6F6FF",
    opacity: 0.8,
  },
  bgDecorBottom: {
    position: "absolute",
    bottom: -140,
    left: -140,
    width: 360,
    height: 360,
    borderRadius: 9999,
    backgroundColor: "#D7ECFF",
    opacity: 0.6,
  },
  bgDecorDot: {
    position: "absolute",
    top: 80,
    left: 20,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: C.cyan,
    opacity: 0.7,
  },

  brand: {
    fontSize: 30,
    fontWeight: "900",
    color: C.primaryDark,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: C.sub,
    marginTop: 4,
  },

  card: {
    marginTop: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
    shadowColor: C.primary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: C.text,
  },
  desc: {
    color: C.sub,
    marginTop: 4,
    marginBottom: 10,
  },

  label: { color: C.sub, fontSize: 13, marginTop: 8, marginBottom: 6 },

  inputWrap: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  input: {
    fontSize: 16,
    color: C.text,
    paddingVertical: 12,
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderLeftWidth: 1,
    borderLeftColor: C.border,
  },

  btn: {
    marginTop: 14,
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "900" },

  btnGhost: {
    marginTop: 10,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnGhostText: { color: C.text, fontWeight: "800" },

  note: { color: C.sub, fontSize: 12, marginTop: 2, textAlign: "center" },
});
