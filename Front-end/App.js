import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tab_bar from "./components/Tab_bar";
import Home_screen from "./screens/Home_screen";
import Profile_screen from "./screens/Profile_screen";
import Booking_screen from "./screens/Booking_screen";
import Inbox_screen from "./screens/Inbox_screen";
import Explore_screen from "./screens/Explore_screen";
import { createStackNavigator } from "@react-navigation/stack";
import FieldDetailScreen from "./screens/FieldDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BookingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookingList" component={Booking_screen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <Tab_bar {...props} /> } screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home_screen} />
        <Tab.Screen name="Explore" component={Explore_screen} />
        <Tab.Screen
          name="Booking"
          component={BookingStack}
          options={{ title: "Booking" }}
        />
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
