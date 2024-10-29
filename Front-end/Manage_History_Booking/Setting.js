import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from "../redux/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export default function Setting({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const userName = useSelector(state => state.auth.user?.name);

  const [formData, setFormData] = useState({ name: userName, password: '', newPassword: '', confirmPassword: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleChangePassword = () => {
    const { name, password, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp");
      setModalVisible(true);
      return;
    }

    axios.post("http://172.20.10.2:3000/auth/change-password", formData)
      .then(res => {
        console.log(res);
        Alert.alert("Success", "Password changed successfully");
        setModalVisible(false);
        setShowModal(false);
        navigation.navigate("Login");
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
        console.error("Lỗi:", errorMessage);
        setErrorMessage(errorMessage);
        setModalVisible(true);
      });
  };

  const handleLogout = async () => {
    axios.post("http://172.20.10.2:3000/auth/sign-out")
      .then(async (res) => {
        console.log(res.data.message);
        await AsyncStorage.removeItem('authToken');
        dispatch(logout());
        Alert.alert("Logged out", "You have been logged out.");
      })
      .catch(error => {
        console.log("Logout Error:", error.response);
        Alert.alert("Error", "An error occurred during logout.");
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={formData.newPassword}
              onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
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
    alignItems: 'center',
    marginBottom: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
