import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ROUTER } from "../utils/contant";
import PropTypes from "prop-types";
const SideBar = ({ visible, onClose }) => {
  const [currentTab, setCurrentTab] = useState(ROUTER.DASHBOARD);
  const navigation = useNavigation();
  if (!visible) return null;

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab === ROUTER.DASHBOARD) {
      navigation.navigate(ROUTER.DASHBOARD);
    } else if (tab === ROUTER.MANAGE_ACCOUNT) {
      navigation.navigate(ROUTER.MANAGE_ACCOUNT);
    }

    onClose();
  };

  return (
    <View style={styles.sidebarContainer}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/*  Part Content */}
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => handleTabChange(ROUTER.DASHBOARD)}
          style={[
            styles.tab,
            currentTab === ROUTER.DASHBOARD && styles.activeTab,
          ]}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color={currentTab === ROUTER.DASHBOARD ? "#fff" : "#000"}
          />
          <Text style={[styles.tabText, { marginLeft: 10 }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange(ROUTER.MANAGE_ACCOUNT)}
          style={[
            styles.tab,
            currentTab === ROUTER.MANAGE_ACCOUNT && styles.activeTab,
          ]}
        >
          <Ionicons
            name="people-outline"
            size={24}
            color={currentTab === ROUTER.MANAGE_ACCOUNT ? "#fff" : "#000"}
          />
          <Text style={[styles.tabText, { marginLeft: 10 }]}>
            Manage Account
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Phần footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need more features?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    height: "100%",
    width: "70%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  closeButton: {
    alignSelf: "flex-start",
  },
  closeText: {
    fontSize: 18,
    color: "#A49086",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  activeTab: {
    backgroundColor: "#FD6326",
  },
  tabText: {
    fontSize: 18,
    color: "#000",
  },
  footer: {
    alignItems: "center",
    marginVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#666",
  },
});

SideBar.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideBar;
