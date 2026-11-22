import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { auth, db } from "../config/firebaseConfig";
import {
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getHintThai } from "../api/gemini";

/* 🎨 Soft CIS Pastel Theme */
const COLORS = {
  bg: "#F4F8FB",
  primary: "#3B82F6",
  secondary: "#2563EB",
  accent: "#10B981",
  gray: "#6B7280",
  lightBlue: "#DBEAFE",
  lightGreen: "#D1FAE5",
};

/* ⚙️ ตั้งค่า Cooldown */
const COOLDOWN_MS = 5000;

/* 🔘 ปุ่ม */
function Btn({ title, onPress, disabled = false, type = "primary" }) {
  const bg =
    type === "primary"
      ? COLORS.primary
      : type === "secondary"
      ? COLORS.secondary
      : COLORS.accent;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: disabled ? "#CBD5E1" : bg },
      ]}
    >
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* 🎮 GameScreen (Normal Mode) */
export default function GameScreen({ navigation, route }) {
  const category = route.params?.category;

  const [target, setTarget] = useState(null);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Hint System
  const [hint, setHint] = useState("");
  const [hintLevel, setHintLevel] = useState(1);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [lastHintTime, setLastHintTime] = useState(0);

  /* โหลดคำจาก Firestore เฉพาะหมวด */
  useEffect(() => {
    if (!category) return;

    async function fetchWords() {
      setLoading(true);
      try {
        const q = query(collection(db, "words"), where("category", "==", category));
        const snap = await getDocs(q);
        const wordsList = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          word: d.data().word.toLowerCase(),
        }));

        if (wordsList.length === 0) {
          Alert.alert("ไม่มีข้อมูลคำศัพท์", `ไม่พบคำในหมวด ${category}`);
          setLoading(false);
          return;
        }

        const pick = wordsList[Math.floor(Math.random() * wordsList.length)];
        setTarget(pick);
        setAllWords(wordsList);
        setInput("");
        setGuesses([]);
        setRevealed(false);
        setHint("");
        setHintLevel(1);
        usedRanks.clear();
        setStartedAt(Date.now());
      } catch (e) {
        console.error("Error loading words:", e);
        Alert.alert("โหลดข้อมูลไม่สำเร็จ", e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, [category]);

  /* ระบบ Rank */
  const usedRanks = new Set();
  function randomInt(min, max) {
    let n;
    do {
      n = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (usedRanks.has(n));
    usedRanks.add(n);
    return n;
  }

  function calculateSmartRank(guessWord, targetWord) {
    const targetObj = allWords.find((w) => w.word === targetWord.toLowerCase());
    const guessObj = allWords.find((w) => w.word === guessWord.toLowerCase());

    if (!targetObj || !guessObj) return randomInt(200, 300);

    const sameSubSub = allWords.filter((w) => w.subsub === targetObj.subsub);
    const sameSub = allWords.filter((w) => w.subgroup === targetObj.subgroup);
    const lenSubSub = sameSubSub.length;
    const lenSub = sameSub.length;

    if (guessObj.subsub === targetObj.subsub) return randomInt(2, lenSubSub);
    if (guessObj.subgroup === targetObj.subgroup)
      return randomInt(lenSubSub + 2, lenSub + 2);
    if (guessObj.category === targetObj.category) {
      const totalCat = allWords.length;
      return randomInt(lenSub + 3, totalCat);
    }
    return randomInt(150, 300);
  }

  /* หาคำใกล้เคียง */
  function getSimilarWords(input) {
    if (!input) return [];
    const text = input.toLowerCase();
    const matches = allWords
      .filter((w) => w.word.includes(text) && w.word !== text)
      .map((w) => w.word);
    return matches.slice(0, 4);
  }

  /* การทายคำ */
  const sortedGuesses = useMemo(
    () => [...guesses].sort((a, b) => a.rank - b.rank),
    [guesses]
  );

  async function onGuess(word) {
    if (!target) return;
    const normalized = (word || "").trim().toLowerCase();
    if (!normalized) return;

    if (!allWords.some((w) => w.word === normalized)) {
      Alert.alert("❌ ไม่มีคำนี้ในหมวด", "โปรดพิมพ์เฉพาะคำในหมวดนี้เท่านั้น");
      return;
    }

    if (guesses.some((g) => g.word === normalized)) {
      Alert.alert("ซ้ำแล้ว", "คุณได้ทายคำนี้ไปแล้ว");
      return;
    }

    if (normalized === target.word.toLowerCase()) {
      const uid = auth.currentUser?.uid;
      if (uid && !revealed) {
        await updateDoc(doc(db, "users", uid), { score: increment(1) });
        await addDoc(collection(db, "users", uid, "games"), {
          category,
          targetWord: target.word,
          attempts: guesses.length + 1,
          startedAt,
          endedAt: Date.now(),
          createdAt: serverTimestamp(),
          usedReveal: revealed,
        });
      }
      navigation.replace("Win", {
        word: target.word,
        category,
        meaning: target.meaning,
      });
      return;
    }

    const rank = calculateSmartRank(normalized, target.word);
    setGuesses((prev) => [
      { word: normalized, rank, isNew: true },
      ...prev.map((g) => ({ ...g, isNew: false })),
    ]);
  }

  /* ระบบใบ้จาก AI (แบบหลายระดับ + cooldown) */
  async function handleHint() {
    if (!target) return;

    const now = Date.now();
    if (now - lastHintTime < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (now - lastHintTime)) / 1000);
      Alert.alert("⏳ รอก่อน", `ขอคำใบ้ได้อีกครั้งใน ${remaining} วินาที`);
      return;
    }

    try {
      setIsHintLoading(true);
      setHintLevel((prevLevel) => {
        const levelToUse = prevLevel;

        (async () => {
          const text = await getHintThai(target.word, category, levelToUse);

          setHint((prev) => {
            const cleanPrev = prev
              .split("\n")
              .filter((line) => !line.startsWith(`💡 ใบ้ระดับ ${levelToUse}:`))
              .join("\n");

            const newLine = `💡 ใบ้ระดับ ${levelToUse}: ${text}`;
            return cleanPrev ? cleanPrev + "\n" + newLine : newLine;
          });

          setLastHintTime(Date.now());
        })();

        return Math.min(prevLevel + 1, 3);
      });
    } catch (e) {
      setHint("⚠️ เกิดข้อผิดพลาดในการขอคำใบ้");
    } finally {
      setIsHintLoading(false);
    }
  }

  /* Render */
  if (loading) return <Text>⏳ กำลังโหลดคำศัพท์...</Text>;
  if (!target) return <Text>ไม่พบคำศัพท์</Text>;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={sortedGuesses}
        keyExtractor={(item, i) => `${item.word}-${i}`}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>หมวด: {category}</Text>

            <TextInput
              placeholder="พิมพ์คำศัพท์..."
              value={input}
              onChangeText={(txt) => {
                setInput(txt);
                setSuggestions(getSimilarWords(txt));
              }}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            {suggestions.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.hintTitle}>คำใกล้เคียง:</Text>
                {suggestions.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setInput(s)}
                    style={styles.suggestBtn}
                  >
                    <Text style={{ color: COLORS.secondary }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Btn title="ทายคำ" onPress={() => onGuess(input)} />

            <Btn
              title={isHintLoading ? "กำลังสร้างคำใบ้..." : "🧠 ขอคำใบ้จาก AI"}
              onPress={handleHint}
              disabled={isHintLoading}
              type="secondary"
            />

            {hint ? (
              <Text
                style={{
                  marginTop: 8,
                  color: COLORS.gray,
                  lineHeight: 20,
                  backgroundColor: "#E0F2FE",
                  borderRadius: 8,
                  padding: 6,
                }}
              >
                {hint}
              </Text>
            ) : null}

            <Btn
              title="🧩 เฉลยคำตอบ"
              onPress={() => setRevealed(true)}
              type="accent"
            />

            {revealed && (
              <>
                <Text style={styles.answer}>คำตอบคือ: {target.word}</Text>
                <Text style={styles.meaning}>ความหมาย: {target.meaning}</Text>
              </>
            )}

            <Text style={styles.historyTitle}>ประวัติการทาย:</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.guessItem,
              { backgroundColor: item.isNew ? COLORS.lightGreen : "white" },
            ]}
          >
            <Text style={styles.guessText}>
              {item.word} → อันดับ {item.rank}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <Btn
            title="🔙 เลือกหมวด"
            onPress={() => navigation.replace("Category")}
          />
        }
      />
    </SafeAreaView>
  );
}

/* 🎨 Style */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, padding: 10 },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "white",
  },
  hintTitle: { fontWeight: "bold", color: COLORS.gray, marginTop: 4 },
  suggestBtn: {
    backgroundColor: COLORS.lightBlue,
    padding: 6,
    marginVertical: 2,
    borderRadius: 6,
  },
  guessItem: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 3,
  },
  guessText: { fontSize: 15, color: COLORS.secondary },
  historyTitle: {
    marginTop: 10,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
  answer: { marginTop: 8, color: COLORS.accent, fontWeight: "bold" },
  meaning: { color: COLORS.gray },
});
