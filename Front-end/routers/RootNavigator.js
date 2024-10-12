import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Tab_bar from "../components/Tab_bar";
import Booking_screen from "../screens/Booking_screen";
import Explore_screen from "../screens/Explore_screen";
import LoginScreen from "../screens/Login_screen";
import FieldDetailScreen from "../screens/FieldDetailScreen";
import FieldListScreen from "../screens/FieldListScreen";
import FieldAdminDetailScreen from "../screens/FieldAdminsDetail";
import Header from "../layout/Header";
import ManageAccount from "../screens/ManageAccount";
import AccountDetail from "../screens/AccountDetail";
import Dashboard from "../screens/Dashbord";
import { ROUTER } from "../utils/constant";
import RentalEquipmentScreen from "../screens/RentalEquipmentScreen";
import EquipmentDetailScreen from "../screens/EquipmentDetailsScreen";
import TabScreen from "../components/Tab_Navigator";
import SportSelected from "../screens/SportSelected";
import RegisterScreen from "../screens/Register_screen";
import { useSelector } from "react-redux";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Đạt
function BookingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookingList" component={Booking_screen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
    </Stack.Navigator>
  );
}

// Tùng
function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="TabScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="TabScreen"
        component={TabScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Cường
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

// Mạnh
function Equipment_Rental_Stack() {
  return (
    <Stack.Navigator initialRouteName="RentalEquipment">
      <Stack.Screen name="RentalEquipment" component={RentalEquipmentScreen} />
      <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} />
    </Stack.Navigator>
  );
}

// Tùng làm phần Sport trước khi vào Explore
// Phần Manage Post bên trong của Việt Anh
function Explore_Sports_Stack() {
  return (
    <Stack.Navigator
      initialRouteName="SportSelected"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SportSelected" component={SportSelected} />
      <Stack.Screen name="ExploreScreen" component={Explore_screen} />
    </Stack.Navigator>
  );
}

function AdminRole() {
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
        <Stack.Screen name="Profile" component={ProfileStack} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

function Main() {
  const role = useSelector((state) => state.auth.user?.role);
  return (
    <Tab.Navigator
      tabBar={(props) => <Tab_bar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {role === 1 && (
        <>
          <Tab.Screen name="Explore" component={Explore_Sports_Stack} />
          <Tab.Screen name="Booking" component={BookingStack} />
          <Tab.Screen name="Equipment" component={Equipment_Rental_Stack} />
        </>
      )}

      {role === 2 && <>{/**Hiện chưa có màn hình nào */}</>}
      {role === 3 && <Tab.Screen name="Field" component={FieldStack} />}
      {role === 4 && <Stack.Screen name="Admin" component={AdminRole} />}

      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={Main} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});

export default RootNavigator;
