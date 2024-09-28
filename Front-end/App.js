import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tab_bar from "./components/Tab_bar"; // Tab_bar đã được định nghĩa
import Home_screen from "./screens/Home_screen";
import Profile_screen from "./screens/Profile_screen";
import Booking_screen from "./screens/Booking_screen";
import Inbox_screen from "./screens/Inbox_screen";
import Explore_screen from "./screens/Explore_screen";

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <Tab_bar {...props} />}>
        <Tab.Screen name="Home" component={Home_screen} />
        <Tab.Screen name="Explore" component={Explore_screen} />
        <Tab.Screen name="Booking" component={Booking_screen} />
        <Tab.Screen name="Inbox" component={Inbox_screen} />
        <Tab.Screen name="Profile" component={Profile_screen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
