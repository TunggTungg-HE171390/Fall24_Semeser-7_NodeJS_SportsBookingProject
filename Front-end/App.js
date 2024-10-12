import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./routers/RootNavigator";
import store from "./redux/store";
import { Provider } from "react-redux";
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
