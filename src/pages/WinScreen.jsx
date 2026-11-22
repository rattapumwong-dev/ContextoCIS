// src/screens/WinScreen.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

const C = {
  bgTop: "#EDF5FF",
  bg: "#F5F9FF",
  card: "#FFFFFF",
  primary: "#1B6CF0",
  primaryDark: "#0F49A6",
  accent: "#18B87A",
  cyan: "#14B8FF",
  text: "#0F172A",
  sub: "#475569",
  border: "#E2E8F0",
  answerBg: "#EFFFF7",
};

export default function WinScreen({ navigation, route }) {
  const { category, word, meaning } = route.params || {};

  return (
    <SafeAreaView style={S.safe}>
      {/* 🌈 พื้นหลังตกแต่ง */}
      <View style={S.bgDecorTop} />
      <View style={S.bgDecorDot} />
      <View style={S.bgDecorBottom} />

      <ScrollView
        contentContainerStyle={[S.container, { flexGrow: 1, paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 🏆 ส่วนหัว (ชัยชนะ) */}
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <Text style={S.bigCheck}>✅</Text>
          <Text style={S.title}>ถูกต้อง!</Text>
          <Text style={S.subTitle}>เยี่ยมมาก • หมวด {category || "-"}</Text>

          {/* 🎉 เอฟเฟกต์คอนเฟตติ */}
          <View style={S.confettiRow}>
            <Text style={S.confetti}>🎉</Text>
            <Text style={S.confetti}>🎊</Text>
            <Text style={S.confetti}>🎉</Text>
            <Text style={S.confetti}>🎊</Text>
            <Text style={S.confetti}>🎉</Text>
          </View>
        </View>

        {/* 🧩 การ์ดคำตอบ */}
        <View style={S.card}>
          <Text style={S.cardHead}>คำตอบ</Text>
          <Text style={S.wordText}>
            {word ? (
              <Text style={{ color: C.primaryDark, fontWeight: "900" }}>{word}</Text>
            ) : (
              "-"
            )}
          </Text>

          {/* 💬 กล่องแสดงความหมาย */}
          {!!meaning && (
            <View style={S.meanBox}>
              <Text style={S.meanTitle}>ความหมาย</Text>
              <Text style={S.meanText}>{meaning}</Text>
            </View>
          )}
        </View>

        {/* 🔘 ปุ่มเมนูหลังชนะ */}
        <View style={S.btnGroup}>
          <Btn
            title="▶️ เล่นต่อ (สุ่มคำในหมวดเดิม)"
            onPress={() => navigation.replace("Game", { category })}
          />
          <Btn
            title="📚 เลือกหมวดอื่น"
            kind="ghost"
            onPress={() => navigation.replace("Category")}
          />
          <Btn
            title="🏆 ดู Rank"
            kind="accent"
            onPress={() => navigation.navigate("Rank")}
          />
          <Btn
            title="🏠 กลับหน้าแรก"
            kind="ghost"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🔹 ปุ่มใช้งานซ้ำได้ */
function Btn({ title, onPress, kind = "primary", disabled = false }) {
  const base = [S.btn];
  let wrap = base;
  let textStyle = S.btnTextPrimary;

  if (kind === "primary") wrap = [...base, S.btnPrimary];
  if (kind === "ghost") {
    wrap = [...base, S.btnGhost];
    textStyle = S.btnTextGhost;
  }
  if (kind === "accent") wrap = [...base, S.btnAccent];

  if (disabled) wrap.push({ opacity: 0.5 });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={disabled} style={wrap}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

/* 🎨 สไตล์ */
const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bgTop },
  container: { padding: 16 },

  /* ลวดลายพื้นหลัง */
  bgDecorTop: {
    position: "absolute",
    top: -120,
    right: -140,
    width: 320,
    height: 320,
    borderRadius: 9999,
    backgroundColor: "#E6F6FF",
    opacity: 0.8,
  },
  bgDecorBottom: {
    position: "absolute",
    bottom: -160,
    left: -160,
    width: 380,
    height: 380,
    borderRadius: 9999,
    backgroundColor: "#D7ECFF",
    opacity: 0.6,
  },
  bgDecorDot: {
    position: "absolute",
    top: 70,
    left: 24,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: C.cyan,
    opacity: 0.7,
  },

  /* Header */
  bigCheck: { fontSize: 52, marginTop: 8 },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: C.primaryDark,
    marginTop: 4,
  },
  subTitle: { color: C.sub, marginTop: 2 },

  confettiRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  confetti: { fontSize: 18 },

  /* การ์ดคำตอบ */
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
  cardHead: { color: C.sub, fontSize: 13, marginBottom: 6 },
  wordText: { fontSize: 22, fontWeight: "900", color: C.text },

  meanBox: {
    marginTop: 12,
    backgroundColor: C.answerBg,
    borderWidth: 1,
    borderColor: "#CFF7E7",
    borderRadius: 14,
    padding: 12,
  },
  meanTitle: { color: C.sub, fontWeight: "700", marginBottom: 4 },
  meanText: { color: C.text, lineHeight: 20 },

  /* ปุ่ม */
  btnGroup: { marginTop: 18, gap: 10 },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  btnPrimary: { backgroundColor: C.primary, shadowColor: C.primary },
  btnGhost: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000000",
  },
  btnAccent: { backgroundColor: C.accent, shadowColor: C.accent },
  btnTextPrimary: { color: "white", fontSize: 16, fontWeight: "900" },
  btnTextGhost: { color: C.text, fontSize: 16, fontWeight: "800" },
});
