import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import getPrompt from "../api/getPrompt";

/* 💬 ข้อความเริ่มต้นของ AI */
export const initialMessageHistory = [
  {
    id: "default",
    text: `สวัสดีครับ! ผมคือ RuleExplainerAI 🤖  
ผมสามารถอธิบายกฎ วิธีเล่น และระบบคะแนนของเกม ContextoCIS ให้คุณเข้าใจได้  
อยากให้ผมอธิบายส่วนไหนก่อนดีครับ เช่น “วิธีเล่น”, “คะแนน”, หรือ “หมวดคำศัพท์”?`,
    sender: "model",
  },
];

/* 🔑 ตั้งค่า API Key ของคุณ */
const genAI = new GoogleGenerativeAI("AIzaSyAgJ_qzmCzFofVPfBsaduYU2zxclHCPo5M"); //Your API key not mine

// ✅ สร้างโมเดลไว้ใช้ตลอดอายุ component
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function ChatScreen() {
  const [messageHistory, setMessageHistory] = useState(initialMessageHistory);
  const [message, setMessage] = useState("");

  /* ✉️ ฟังก์ชันส่งข้อความ */
  async function handleSendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      id: uuid.v4(),
      text: message.trim(),
      sender: "user",
    };

    setMessage("");
    setMessageHistory((prev) => [...prev, userMessage]);

    try {
      // 🧠 รวม prompt ของ AI กับคำถามผู้ใช้
      const promptText = getPrompt(messageHistory);
      const fullPrompt = `${promptText}\n\nคำถามของผู้ใช้: ${message}`;

      // ✅ ส่งข้อความไปยังโมเดล (ไม่ต้องใช้ role/parts)
      const result = await model.generateContent([fullPrompt]);

      // ✅ ดึงข้อความตอบกลับจาก response
      const aiText = result.response.text();

      const modelMessage = {
        id: uuid.v4(),
        text: aiText || "ขออภัยครับ ระบบยังไม่มีคำตอบตอนนี้ 😅",
        sender: "model",
      };

      setMessageHistory((prev) => [...prev, modelMessage]);
    } catch (err) {
      console.error("AI error:", err);
      const errorMessage = {
        id: uuid.v4(),
        text: "ขออภัยครับ ระบบไม่สามารถตอบได้ในขณะนี้ 😢",
        sender: "model",
      };
      setMessageHistory((prev) => [...prev, errorMessage]);
    }
  }

  /* 🧠 UI แสดงผล */
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.title}>AI อธิบายกฎเกม ContextoCIS</Text>
      </View>

      {/* Message List */}
      <FlatList
        style={styles.messageContainer}
        data={messageHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isModel = item.sender === "model";
          return (
            <View
              style={[
                styles.messageItem,
                { justifyContent: isModel ? "flex-start" : "flex-end" },
              ]}
            >
              {isModel && (
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
                  }}
                  style={styles.avatar}
                />
              )}
              <Text
                style={[
                  styles.message,
                  { backgroundColor: isModel ? "#27272a" : "#3f3f46" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="พิมพ์คำถามเกี่ยวกับกฎเกม..."
          placeholderTextColor="#fafafa"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
          <Text style={styles.text}>ส่ง</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* 🎨 สไตล์ธีมเข้ม CIS */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18181b" },
  header: {
    borderBottomWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: { width: 40, height: 40, borderRadius: 999 },
  title: { color: "#fafafa", fontWeight: "bold", fontSize: 18 },
  messageContainer: { flex: 1, paddingVertical: 16, paddingHorizontal: 12 },
  messageItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  message: {
    color: "#fafafa",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  inputContainer: {
    backgroundColor: "#27272a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fafafa",
    backgroundColor: "#18181b",
  },
  button: {
    marginLeft: 8,
    backgroundColor: "#3f3f46",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  text: { color: "#fafafa", fontWeight: "bold" },
});
