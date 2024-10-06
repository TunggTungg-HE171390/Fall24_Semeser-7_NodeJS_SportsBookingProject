import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import PropTypes from "prop-types";
const AccountDetail = ({ route }) => {
  const navigation = useNavigation();
  const { account } = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={account.profile.avatar} style={styles.avatar} />
      <Text style={styles.nameText}>{account.username}</Text>
      <Text style={styles.infoText}>Role: {account.role}</Text>
      <Text style={styles.infoText}>Email: {account.email}</Text>
      <Text style={styles.infoText}>Phone: {account.profile.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

AccountDetail.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountDetail;
