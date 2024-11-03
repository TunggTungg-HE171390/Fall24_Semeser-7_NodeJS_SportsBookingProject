import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Explore_screen from "../screens/Explore_screen";
import PostScreen from "../screens/PostScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomTabScreen() {
  const [selectedTab, setSelectedTab] = useState("Explore");

  const renderContent = () => {
    switch (selectedTab) {
      case "Explore":
        return <Explore_screen />;
      case "My Posts":
        return <PostScreen />;
      default:
        return <Explore_screen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBarContainer}>
        {["Explore", "My Posts"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={
                selectedTab === tab ? styles.activeTabText : styles.tabText
              }
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    padding: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#2F95DC",
  },
  tabText: {
    fontSize: 14,
    color: "gray",
  },
  activeTabText: {
    fontSize: 14,
    color: "#2F95DC",
    fontWeight: "600",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff6b01",
    marginBottom: 15,
    justifyContent: "center",
  },
  profileContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  touchableContainer: {
    alignItems: "center",
    backgroundColor: "#ff6b01",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});
