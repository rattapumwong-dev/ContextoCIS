import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./src/pages/LoginScreen.jsx";
import RegisterScreen from "./src/pages/RegisterScreen.jsx";
import HomeScreen from "./src/pages/HomeScreen.jsx";
import GameScreen from "./src/pages/GameScreen.jsx";
import RankScreen from "./src/pages/RankScreen.jsx";
import HistoryScreen from "./src/pages/HistoryScreen.jsx";
import CategoryScreen from "./src/pages/CategoryScreen.jsx";
import WinScreen from "./src/pages/WinScreen.jsx";
import ChatScreen from "./src/pages/ChatScreen.jsx";
import GameScreenHard from "./src/pages/GameScreenHard.jsx"
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "ContextoCIS" }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ title: "เลือกหมวดหมู่" }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: "Play" }} />
        <Stack.Screen name="Win" component={WinScreen} options={{ title: "ผลการเล่น" }} />
        <Stack.Screen name="Rank" component={RankScreen} options={{ title: "Leaderboard" }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: "ประวัติการเล่น" }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "แชทสอบถาม" }} />
        <Stack.Screen name="GameHard" component={GameScreenHard} options={{ title: "PlayButHard" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
