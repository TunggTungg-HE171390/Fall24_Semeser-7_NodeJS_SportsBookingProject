import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./routers/RootNavigator";
import store from "./redux/store";
import { Provider } from "react-redux";
 
export default function App() {
  return (
    // vào root navigator để xem các router điều hướng
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
