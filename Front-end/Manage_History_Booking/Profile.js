import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function Profile() {
  const [viewType, setViewType] = useState("monthly");
  const [userDetails, setUserDetails] = useState(null);

  const userName = useSelector((state) => state.auth.user?.name);
  const userId = useSelector((state) => state.auth.user?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    userInfoDetail();
  }, []);

  const userInfoDetail = async () => {
    try {
      const res = await axios.get(
        `http://192.168.0.104:3000/user/userInfo/${userId}`
      );
      setUserDetails(res.data);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  return (
    <View style={styles.container}>
      {userDetails ? (
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Thông tin cá nhân</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Tài khoản: {userDetails.profile.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Email: {userDetails.account.email}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Chức vụ:{" "}
              {userDetails.role === 1
                ? "Thành viên"
                : userDetails.role === 2
                ? "Quản lý"
                : userDetails.role === 3
                ? "Admin"
                : "Chưa xác định"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Số điện thoại: {userDetails.profile.phone}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              {" "}
              Chế độ tài khoản:
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      userDetails.role === 1
                        ? "green"
                        : userDetails.role === 2
                        ? "red"
                        : "black",
                  },
                ]}
              >
                {" "}
                {userDetails.role === 1
                  ? "ACTIVE"
                  : userDetails.role === 2
                  ? "BLOCK"
                  : "Chưa xác định"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading user details...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
