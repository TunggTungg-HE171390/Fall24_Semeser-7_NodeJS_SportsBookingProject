import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function RegisterScreen({ navigation }) {
  const handleRegister = () => {
    alert("Đăng ký thành công");
    navigation.navigate("Login");
  };
  const backtoLogin = () => {
    navigation.navigate("Login");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register your account </Text>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraIconContainer}>
          <Icon name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value="Oscar" editable={false} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value="Sun" editable={false} />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value="Oscar" editable={false} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gmaill</Text>
          <TextInput style={styles.input} value="Sun" editable={false} />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainerFull}>
          <Text style={styles.label}>Enter your password </Text>
          <TextInput style={styles.input} value="09/10/1998" editable={false} />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainerFull}>
          <Text style={styles.label}>Enter your password again </Text>
          <TextInput style={styles.input} value="09/10/1998" editable={false} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBlack} onPress={backtoLogin}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
  avatarContainer: {
    position: "relative",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff6b01",
    borderRadius: 20,
    padding: 5,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputContainerFull: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#ff6b01",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonBlack: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
});
