import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={S.safe}>
      <View style={S.container}>
        <Text style={S.title}>🎮 ContextoCIS</Text>
        <Text style={S.subtitle}></Text>

        <View style={S.buttonGroup}>
          <TouchableOpacity
            style={[S.btn, S.btnPrimary]}
            onPress={() => navigation.navigate("Category")}
          >
            <Text style={S.btnText}>▶️ เล่นเกม</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[S.btn, S.btnSecondary]}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={S.btnText}>📜 ประวัติ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[S.btn, S.btnAccent]}
            onPress={() => navigation.navigate("Rank")}
          >
            <Text style={S.btnText}>🏆 ดูอันดับ</Text>
          </TouchableOpacity>

          {/* ✅ ปุ่มใหม่: สอบถามกฎเกม */}
          <TouchableOpacity
            style={[S.btn, S.btnGhost]}
            onPress={() => navigation.navigate("Chat")}
          >
            <Text style={[S.btnText, { color: COLORS.primaryDark }]}>🧠 สอบถามกฎเกม</Text>
          </TouchableOpacity>
        </View>


      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  bg: "#EAF4FF",
  primary: "#1B6CF0",
  primaryDark: "#0F49A6",
  accent: "#18B87A",
  gray: "#64748B",
};

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 36 },
  buttonGroup: { width: "80%", gap: 14 },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnSecondary: { backgroundColor: COLORS.primaryDark },
  btnAccent: { backgroundColor: COLORS.accent },

  // ✅ ปุ่มใหม่โทนอ่อน
  btnGhost: {
    backgroundColor: "#EAF4FF",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  btnText: { color: "white", fontSize: 18, fontWeight: "800" },
  footer: { position: "absolute", bottom: 18, fontSize: 12, color: COLORS.gray },
});
