import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "./SideBar";

const Header = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftGroup}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleSidebar}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="people-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatarButton}>
            <Image
              source={require("../assets/images/avatar/avatar.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 30,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginRight: 15,
  },
  avatarButton: {
    marginLeft: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
