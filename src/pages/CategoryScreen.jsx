// src/screens/CategoryScreen.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

const CATS = [
  "programming",
  "database",
  "network",
  "security",
  "ai",
  "software_engineering",
  "web",
];

const THEME = {
  bgTop: "#F3F1FF",
  bg: "#F7F8FF",
  card: "#FFFFFF",
  text: "#0F172A",
  sub: "#64748B",
  primary: "#6D60F6",
  primaryDark: "#4B46C6",
  accent: "#14B8A6",
  border: "#E6E6F0",
  chip1: "#F0E9FF",
  chip2: "#E6FBF6",
  chip3: "#EAF3FF",
  chip4: "#FFEFE5",
};

const EMOJI = {
  programming: "💻",
  database: "🗄️",
  network: "🌐",
  security: "🔒",
  ai: "🤖",
  software_engineering: "🧩",
  web: "🕸️",
};

const COLORS_PER_TILE = [
  { bg: THEME.chip1, ring: "#DAD2FF", text: THEME.primaryDark },
  { bg: THEME.chip2, ring: "#C6F7EA", text: "#0E766E" },
  { bg: THEME.chip3, ring: "#CFE4FF", text: "#0F4AA6" },
  { bg: THEME.chip4, ring: "#FFD7BF", text: "#B45309" },
];

export default function CategoryScreen({ navigation }) {
  const go = (cat) => navigation.navigate("Game", { category: cat });
  const goHard = () => navigation.navigate("GameHard"); // ✅ เพิ่มโหมดยาก

  return (
    <SafeAreaView style={S.safe}>
      {/* ลวดลายเบา ๆ */}
      <View style={S.bgDecorTop} />
      <View style={S.bgDecorBottom} />

      <ScrollView
        contentContainerStyle={[S.container, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={S.header}>
          <Text style={S.kicker}>เลือกหมวดแล้วลุยกันเลย</Text>
          <Text style={S.title}>📚 เลือกหมวดหมู่เพื่อเริ่มเล่น</Text>
          <Text style={S.subtitle}>แตะหมวดที่สนใจ หรือเลือกโหมดยากสุดท้าทาย</Text>
        </View>

        {/* Grid 2 คอลัมน์ */}
        <View style={S.grid}>
          {CATS.map((c, i) => {
            const palette = COLORS_PER_TILE[i % COLORS_PER_TILE.length];
            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.9}
                onPress={() => go(c)}
                style={[
                  S.tile,
                  { backgroundColor: palette.bg, borderColor: palette.ring },
                ]}
              >
                <View style={S.tileIconWrap}>
                  <Text style={S.tileIcon}>{EMOJI[c] || "📦"}</Text>
                </View>
                <Text numberOfLines={1} style={[S.tileText, { color: palette.text }]}>
                  หมวด: {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ปุ่มสุ่มหมวดปกติ */}
        <TouchableOpacity
          style={S.randomBtn}
          activeOpacity={0.9}
          onPress={() => go(CATS[Math.floor(Math.random() * CATS.length)])}
        >
          <Text style={S.randomText}>🎲 สุ่มหมวดและเริ่ม</Text>
        </TouchableOpacity>

        {/* 💀 ปุ่มโหมดยาก */}
        <TouchableOpacity
          style={S.hardBtn}
          activeOpacity={0.9}
          onPress={goHard}
        >
          <Text style={S.hardText}>💀 โหมดยาก (รวมทุกหมวด)</Text>
          <Text style={S.hardSub}>จะไม่บอกหมวด และให้คะแนน x2</Text>
        </TouchableOpacity>

        {/* กลับหน้าแรก */}
        <TouchableOpacity
          style={S.homeBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={S.homeText}>🏠 กลับหน้าแรก</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🎨 สไตล์ */
const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.bgTop },
  container: { padding: 18 },
  bgDecorTop: {
    position: "absolute",
    top: -120,
    right: -140,
    width: 320,
    height: 320,
    borderRadius: 9999,
    backgroundColor: "#E9E6FF",
    opacity: 0.8,
  },
  bgDecorBottom: {
    position: "absolute",
    bottom: -160,
    left: -160,
    width: 380,
    height: 380,
    borderRadius: 9999,
    backgroundColor: "#E2FBF5",
    opacity: 0.5,
  },

  header: { marginBottom: 14, alignItems: "center" },
  kicker: { color: THEME.accent, fontWeight: "900", marginBottom: 2 },
  title: { fontSize: 22, fontWeight: "900", color: THEME.primaryDark },
  subtitle: { color: THEME.sub, marginTop: 6, fontSize: 13, textAlign: "center" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
  tile: {
    width: "48%",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 10,
  },
  tileIcon: { fontSize: 22 },
  tileText: { fontWeight: "900" },

  randomBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
    shadowColor: THEME.primary,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  randomText: { color: "white", fontSize: 16, fontWeight: "900" },

  // 💀 ปุ่มโหมดยาก
  hardBtn: {
    backgroundColor: "#F87171",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#B91C1C",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  hardText: { color: "white", fontSize: 16, fontWeight: "900" },
  hardSub: { color: "#FEE2E2", fontSize: 12, marginTop: 2 },

  homeBtn: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  homeText: { color: THEME.text, fontSize: 15, fontWeight: "800" },
});
