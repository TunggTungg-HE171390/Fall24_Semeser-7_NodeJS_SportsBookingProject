import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./routers/RootNavigator";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
