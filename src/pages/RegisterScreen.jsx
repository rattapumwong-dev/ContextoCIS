// src/screens/RegisterScreen.jsx
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
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

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
};

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  // ✅ ฟังก์ชันตรวจสอบอีเมล
const emailOk = (v) => {
  // ตรวจรูปแบบทั่วไปก่อน
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;

  // อนุญาตเฉพาะ gmail.com หรือ ku.th
  return v.endsWith("@gmail.com") || v.endsWith("@ku.th");
};

const handleRegister = async () => {
  if (!username || !email || !password || !confirmPassword) {
    Alert.alert("⚠️ ข้อมูลไม่ครบ", "กรุณากรอกทุกช่องให้ครบถ้วน");
    return;
  }
  if (!emailOk(email)) {
    Alert.alert(
      "⚠️ อีเมลไม่ถูกต้อง",
      "อนุญาตเฉพาะอีเมลที่ลงท้ายด้วย @gmail.com หรือ @ku.th เท่านั้น"
    );
    return;
  }
  if (password.length < 6) {
    Alert.alert("⚠️ รหัสผ่านสั้นเกินไป", "ต้องมีอย่างน้อย 6 ตัวอักษร");
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert("❌ รหัสผ่านไม่ตรงกัน", "กรุณากรอกให้ตรงกัน");
    return;
  }

  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      score: 0,
      createdAt: new Date(),
    });

    Alert.alert("✅ สมัครสมาชิกสำเร็จ", "เข้าสู่ระบบได้เลย!");
    navigation.navigate("Login");
  } catch (err) {
    const msg = mapFirebaseErr(err.code, err.message);
    Alert.alert("❌ สมัครสมาชิกไม่สำเร็จ", msg);
  } finally {
    setLoading(false);
  }
};


  const canSubmit = username && email && password && confirmPassword && !loading;

  return (
    <SafeAreaView style={S.safe}>
      <ScrollView
        contentContainerStyle={[S.container, { flexGrow: 1, paddingBottom: 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={S.title}>✨ สมัครสมาชิก</Text>
        <Text style={S.subtitle}>สร้างบัญชีเพื่อเริ่มเล่น ContextoCIS</Text>

        {/* Card */}
        <View style={S.card}>
          <Text style={S.label}>ชื่อผู้ใช้</Text>
          <TextInput
            placeholder="เช่น RattapumSoHandsom"
            value={username}
            onChangeText={setUsername}
            style={S.input}
            autoCapitalize="none"
          />

          <Text style={S.label}>อีเมล</Text>
          <TextInput
            placeholder="you@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={S.input}
          />

          <Text style={S.label}>รหัสผ่าน</Text>
          <TextInput
            placeholder="อย่างน้อย 6 ตัวอักษร"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={S.input}
          />

          <Text style={S.label}>ยืนยันรหัสผ่าน</Text>
          <TextInput
            placeholder="again and agian"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={S.input}
          />

          <TouchableOpacity
            activeOpacity={0.9}
            style={[S.btn, !canSubmit && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={S.btnText}>สร้างบัญชี</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[S.btnGhost]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={S.btnGhostText}>🔙 กลับไปหน้า Login</Text>
          </TouchableOpacity>
        </View>

     
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bgTop },
  container: { padding: 16, backgroundColor: C.bg },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: C.primaryDark,
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    textAlign: "center",
    color: C.sub,
    marginTop: 4,
    marginBottom: 16,
  },

  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    shadowColor: C.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  label: { color: C.sub, fontSize: 13, marginTop: 8, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: C.text,
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

  tips: { marginTop: 12, gap: 4, alignItems: "center" },
  tipText: { color: C.sub, fontSize: 12 },
});
