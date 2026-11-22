// src/screens/HistoryScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { auth, db } from "../config/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const COLORS = {
  bgTop: "#EDF5FF",
  bg: "#F5F9FF",
  card: "#FFFFFF",
  primary: "#1B6CF0",
  primaryDark: "#0F49A6",
  accent: "#18B87A",
  cyan: "#14B8FF",
  text: "#0F172A",
  subtext: "#475569",
  border: "#E2E8F0",
  highlight: "#E6F6FF",
  answerBg: "#EFFFF7",
  warn: "#FF7F50",
  rankBadge: "#0EA5E9",
};

export default function HistoryScreen({ navigation }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const q = query(collection(db, "users", uid, "games"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows(data);
    } catch (e) {
      console.log("load history error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <SafeAreaView style={S.safe}>
        <View style={[S.container, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: COLORS.subtext, marginTop: 12, fontSize: 18 }}>
            กำลังโหลดประวัติ...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={S.safe}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[S.container, { paddingBottom: 60 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListHeaderComponent={
          <Text style={S.title}>📜 ประวัติการเล่น</Text>
        }
        renderItem={({ item, index }) => (
          <View style={S.row}>
            <View style={{ flex: 1 }}>
              <Text style={S.rowTitle}>
                {index + 1}. หมวด: {item.category}
              </Text>
              <Text style={S.rowText}>
                คำตอบ: <Text style={{ color: COLORS.primaryDark }}>{item.targetWord}</Text>
              </Text>
              <Text style={S.rowText}>
                จำนวนครั้งที่ทาย: <Text style={{ fontWeight: "700" }}>{item.attempts}</Text>
              </Text>
              <Text style={S.rowSub}>
                วันที่:{" "}
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString("th-TH")
                  : "-"}
              </Text>
            </View>
            <TouchableOpacity
              style={S.viewBtn}
              onPress={() => navigation.navigate("Game", { category: item.category })}
            >
              <Text style={S.viewBtnText}>เล่นอีกครั้ง</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={S.empty}>ยังไม่มีประวัติการเล่น</Text>}
        ListFooterComponent={
          <TouchableOpacity
            style={S.backBtn}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.85}
          >
            <Text style={S.backBtnText}>🏠 กลับหน้าแรก</Text>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgTop },
  container: { padding: 20, backgroundColor: COLORS.bg },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 18,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rowTitle: { fontWeight: "800", fontSize: 18, color: COLORS.text },
  rowText: { fontSize: 16, color: COLORS.text, marginTop: 4 },
  rowSub: { fontSize: 14, color: COLORS.subtext, marginTop: 6 },
  viewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "center",
  },
  viewBtnText: { color: "white", fontWeight: "800", fontSize: 16 },
  backBtn: {
    alignSelf: "center",
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 10,
  },
  backBtnText: { color: "white", fontWeight: "900", fontSize: 18 },
  empty: { textAlign: "center", color: COLORS.subtext, fontSize: 16, marginTop: 40 },
});
