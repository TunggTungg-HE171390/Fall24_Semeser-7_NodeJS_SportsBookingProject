import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Setting() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const api = process.env.REACT_APP_IP_Address;

  const dispatch = useDispatch();
  const handleChangePassword = () => {
    // Logic for changing password
    Alert("Password changed successfully");
    setShowModal(false);
  };

  const handleLogout = async () => {
    axios
      .post(`${api}/auth/sign-out`)

      .then(async (res) => {
        console.log(res.data.message);
        // Xóa token từ AsyncStorage
        await AsyncStorage.removeItem("authToken");
        dispatch(logout());

        // Alert("You have been logged out.");
      })
      .catch((error) => {
        console.log("Logout Error:", error.response);
        Alert("An error occurred during logout.");
      });
  };

  return (
    <View style={styles.container}>
      {/* Setting Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Change Password Modal */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={formData.newPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, newPassword: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  reportContainer: {
    width: "100%",
    padding: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reportItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  reportText: {
    fontSize: 16,
  },
});
