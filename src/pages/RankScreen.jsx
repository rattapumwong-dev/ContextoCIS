// src/screens/RankScreen.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

/* ===== Theme (CIS: Blue / Navy / Green) ===== */
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
  badge: "#0EA5E9",
  gold: "#F59E0B",
  silver: "#94A3B8",
  bronze: "#D97706",
};

const Medal = ({ rank }) => {
  const map = { 0: "🥇", 1: "🥈", 2: "🥉" };
  return <Text style={{ fontSize: 22 }}>{map[rank] || ""}</Text>;
};

const Avatar = ({ name = "", size = 56 }) => {
  const initials =
    (name || "")
      .trim()
      .split(/\s+/)
      .map((s) => s[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U";
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: C.badge,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "900", fontSize: size * 0.36 }}>
        {initials}
      </Text>
    </View>
  );
};

const ScorePill = ({ score = 0 }) => (
  <View style={S.scorePill}>
    <Text style={S.scoreText}>⭐ {score}</Text>
  </View>
);

export default function RankScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRank = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), orderBy("score", "desc"), limit(50));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (err) {
      console.error("โหลดอันดับไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRank();
  }, [fetchRank]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRank();
  };

  const top3 = useMemo(() => users.slice(0, 3), [users]);
  const rest = useMemo(() => users.slice(3), [users]);

  if (loading) {
    return (
      <SafeAreaView style={S.safe}>
        <View style={[S.container, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={{ color: C.sub, marginTop: 10 }}>กำลังโหลดอันดับ…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const Podium = () => {
    // ป้องกันกรณีมีน้อยกว่าหรือเท่ากับ 3 คน
    const t1 = top3[0];
    const t2 = top3[1];
    const t3 = top3[2];

    // กล่องบุ๋มแบบโพเดียม
    const Block = ({ rank, user, height, tint }) => {
      if (!user) {
        return (
          <View style={[S.podiumBlock, { height, backgroundColor: "#F1F5F9" }]}>
            <Text style={{ color: C.sub }}>—</Text>
          </View>
        );
      }
      const name = user.username || "ไม่ระบุชื่อ";
      const score = user.score || 0;

      return (
        <View style={{ alignItems: "center", width: 100 }}>
          <Medal rank={rank} />
          <Avatar name={name} size={rank === 0 ? 64 : 56} />
          <Text numberOfLines={1} style={[S.podiumName, rank === 0 && { fontSize: 16 }]}>
            {name}
          </Text>
          <ScorePill score={score} />
          <View style={[S.podiumBlock, { height, backgroundColor: tint }]} />
        </View>
      );
    };

    return (
      <View style={S.podiumWrap}>
        <Block
          rank={1}
          user={t2}
          height={70}
          tint="#EAF2FF"
        />
        <Block
          rank={0}
          user={t1}
          height={110}
          tint="#E6F6FF"
        />
        <Block
          rank={2}
          user={t3}
          height={50}
          tint="#F7FBFF"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={S.safe}>
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[C.primary]} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={S.title}>🏆 ตารางอันดับผู้เล่น</Text>
            <Text style={S.subtitle}>อัปเดตเรียงจากคะแนนมากไปน้อย • แสดงสูงสุด 50 คน</Text>
            {/* โพเดียม Top 3 */}
            <Podium />
            {/* หัวข้อส่วนที่เหลือ */}
            {rest.length > 0 && (
              <Text style={S.sectionTitle}>อันดับถัดไป</Text>
            )}
          </View>
        }
        renderItem={({ item, index }) => {
          const rank = index + 4; // เพราะแสดงต่อจาก 1..3
          const username = item.username || "ไม่ระบุชื่อ";
          const score = item.score || 0;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={S.row}
              onPress={() => navigation.navigate("Home")} // เปลี่ยนปลายทางได้ตามต้องการ
            >
              {/* อันดับ */}
              <View style={S.rankBox}>
                <View style={S.rankBadge}>
                  <Text style={S.rankNum}>{rank}</Text>
                </View>
              </View>

              {/* ชื่อ */}
              <View style={S.centerBox}>
                <Avatar name={username} size={34} />
                <Text numberOfLines={1} style={S.name}>
                  {username}
                </Text>
              </View>

              {/* คะแนน */}
              <ScorePill score={score} />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={S.empty}>
            <Text style={{ color: C.sub }}>ยังไม่มีข้อมูลอันดับ</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={S.backBtn} onPress={() => navigation.navigate("Home")} activeOpacity={0.85}>
            <Text style={S.backBtnText}>🔙 กลับหน้าแรก</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bgTop },
  container: { flex: 1, padding: 16, backgroundColor: C.bg },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: C.primaryDark,
  },
  subtitle: {
    marginTop: 4,
    color: C.sub,
    fontSize: 12,
  },

  /* ===== Podium ===== */
  podiumWrap: {
    marginTop: 16,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  podiumBlock: {
    width: 100,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    marginTop: 8,
  },
  podiumName: {
    marginTop: 6,
    color: C.text,
    fontWeight: "900",
    maxWidth: 120,
  },

  /* ===== Rows 4+ ===== */
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  rankBox: { width: 40, alignItems: "flex-start", marginRight: 6 },
  rankBadge: {
    minWidth: 32,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#EEF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  rankNum: { fontWeight: "900", color: C.primaryDark },

  centerBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  name: { color: C.text, fontSize: 16, fontWeight: "800", maxWidth: "80%" },

  scorePill: {
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 78,
    alignItems: "center",
  },
  scoreText: { color: "white", fontWeight: "800" },

  empty: {
    backgroundColor: "#F5FAFF",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    marginTop: 12,
  },

  backBtn: {
    alignSelf: "center",
    backgroundColor: C.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 14,
  },
  backBtnText: { color: "white", fontWeight: "900" },
});
