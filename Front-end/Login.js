import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { login } from "./redux/authSlice";
import axios from "axios";

export default function Login({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const api = process.env.REACT_APP_IP_Address;
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://${api}:3000/auth/sign-in`, {
        identifier: identifier,
        password: password,
      });

      console.log("Login successful");
      dispatch(login(res.data.userInfo));
      console.log(res.data.userInfo);
      setErrorMessage("");
    } catch (error) {
      console.log("Login failed");
      if (error.response) {
        // Nếu có phản hồi từ server, hiển thị thông báo lỗi
        const message = error.response.data.message || "Đăng nhập thất bại";
        setErrorMessage(message);
      } else if (error.request) {
        // Nếu không nhận được phản hồi từ server
        setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } else {
        // Các lỗi khác (ví dụ: lỗi khi cấu hình yêu cầu)
        setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
      console.log(error.response || error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post(`http://${api}:3000/user/forgetPassword`, {
        email: email,
      });
      console.log(res.data.message);
      setCodeSent(true);
      Alert.alert("Mã xác thực", "Mã xác thực đã được gửi đến email của bạn.");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Lỗi",
        "Không thể gửi mã xác thực. Vui lòng kiểm tra lại email."
      );
    }
  };

  const handleResendCode = () => {
    handleForgotPassword();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Get Started with Sports Booking</Text>

      <TextInput
        style={styles.input}
        placeholder="EMAIL OR USERNAME"
        onChangeText={(text) => setIdentifier(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>----------------OR----------------</Text>

      <TouchableOpacity
        style={styles.socialButton}
        accessibilityLabel="Continue with Google"
      >
        <Icon name="google" size={24} color="#DB4437" style={styles.icon} />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        accessibilityLabel="Continue with Apple"
      >
        <Icon name="apple" size={24} color="#000" style={styles.icon} />
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        accessibilityLabel="Continue with Facebook"
      >
        <Icon name="facebook" size={24} color="#4267B2" style={styles.icon} />
        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <Text
        style={styles.termsForgotPass}
        onPress={() => setModalVisible(true)}
      >
        Forgot password?
      </Text>

      <Text
        style={styles.termsText}
        onPress={() => navigation.navigate("Register")}
      >
        Create your account?
      </Text>

      {/* Modal Forgot Password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCodeSent(false); // Reset lại trạng thái khi đóng modal
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* Nút X để đóng modal */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setModalVisible(false);
                setCodeSent(false);
              }}
            >
              <Icon name="times" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {codeSent ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    setCodeSent(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleResendCode}
                >
                  <Text style={styles.modalButtonText}>Gửi lại mã</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Hiển thị nút "Send code to email" khi chưa gửi mã
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.modalButtonText}>Send code to email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },

  backButton: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  continueButton: {
    height: 50,
    backgroundColor: "#ff6b01",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    color: "#666",
  },
  socialButton: {
    flexDirection: "row",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#000",
  },
  termsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "blue",
  },
  termsForgotPass: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#ff6b01",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  termsForgotPass: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "orange",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 7,
  },
});
