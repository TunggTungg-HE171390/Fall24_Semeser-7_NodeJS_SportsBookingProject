import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import Tab_bar from "./components/Tab_bar";
import Home_screen from "./screens/Home_screen";
import Profile_screen from "./screens/Profile_screen";
import Booking_screen from "./screens/Booking_screen";
import Inbox_screen from "./screens/Inbox_screen";
import Explore_screen from "./screens/Explore_screen";
import LoginScreen from "./screens/Login_screen";
import FieldDetailScreen from "./screens/FieldDetailScreen";
import FieldListScreen from "./screens/FieldListScreen";
import FieldAdminDetailScreen from "./screens/FieldAdminsDetail";
import Header from "./layout/Header";
import ManageAccount from "./screens/ManageAccount";
import AccountDetail from "./screens/AccountDetail";
import Dashboard from "./screens/Dashbord";
import { ROUTER } from "./utils/contant";

import TabScreen from './components/Tab_Navigator';

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

function ManageBooking() {
  return (
      <Stack.Navigator initialRouteName="TabScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="TabScreen"
          component={TabScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
}

function FieldStack() {
  return (
    <Stack.Navigator initialRouteName="FieldList">
      <Stack.Screen
        name="FieldList"
        component={FieldListScreen}
        options={{ title: "Quản lý sân thể thao" }}
      />
      <Stack.Screen
        name="FieldAdminDetail"
        component={FieldAdminDetailScreen}
        options={{ title: "Chi tiết sân" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs(){
  return (
    <Tab.Navigator tabBar={(props) => <Tab_bar {...props} screenOptions={{ headerShown: false }}/>}>
      <Tab.Screen name="Home" component={Home_screen} />
      <Tab.Screen name="Explore" component={Explore_screen} />
      <Tab.Screen name="Booking" component={BookingStack} options={{ title: "Booking" }} />
      <Tab.Screen name="Inbox" component={Inbox_screen} />
      <Tab.Screen name="Profile" component={ManageBooking} options={{ headerShown: false }}/>
      <Tab.Screen name="Field" component={FieldStack} />
      <Tab.Screen name="Dash" component={DashboardStack} />
    </Tab.Navigator>
  )
};
function DashboardStack() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Stack.Navigator
        initialRouteName={ROUTER.DASHBOARD}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTER.MANAGE_ACCOUNT} component={ManageAccount} />
        <Stack.Screen name={ROUTER.ACCOUNT_DETAIL} component={AccountDetail} />
        <Stack.Screen name={ROUTER.DASHBOARD} component={Dashboard} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}


export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});