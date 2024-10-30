import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { useSelector } from "react-redux";
import axios from "axios";

export default function History() {
  const [viewType, setViewType] = useState("monthly");
  const [markedDates, setMarkedDates] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      getFieldOrderByCustomerId();
    }
  }, [userId]);

  const getFieldOrderByCustomerId = async () => {
    try {
      const res = await axios.get(
        `http://172.22.240.1:3000/field_order/${userId}`
      );
      const fetchedOrders = res.data.data;
      setOrders(fetchedOrders);

      const dates = {};
      fetchedOrders.forEach((order) => {
        const orderDate = order.fieldTime[0].start.split("T")[0];
        dates[orderDate] = {
          selected: true,
          marked: true,
          selectedColor: "red",
        };
      });
      setMarkedDates(dates);
    } catch (error) {
      console.log("Error fetching field orders:", error);
    }
  };

  const getFieldOrderDetail = async (fieldOrderId) => {
    try {
      const res = await axios.get(
        `http://172.22.240.1:3000/field_order/getDetail/${fieldOrderId}`
      );
      setSelectedOrder(res.data.data);
      console.log(res.data.data);
      setModalVisible(true);
    } catch (error) {
      console.log("Error fetching field order detail:", error);
    }
  };

  const onDayPress = (day) => {
    const order = orders.find((o) =>
      o.fieldTime[0].start.startsWith(day.dateString)
    );
    if (order) {
      getFieldOrderDetail(order._id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, viewType === "monthly" && styles.activeButton]}
          onPress={() => setViewType("monthly")}
        >
          <Text style={styles.buttonText}>Monthly view</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, viewType === "weekly" && styles.activeButton]}
          onPress={() => setViewType("weekly")}
        >
          <Text style={styles.buttonText}>Weekly view</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        <Calendar
          markingType={"custom"}
          markedDates={markedDates}
          onDayPress={onDayPress}
        />
      </View>

      {/* Modal hiển thị thông tin đơn đặt hàng */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chi tiết đơn đặt hàng</Text>
            <Text>Khách hàng: {selectedOrder?.customerName}</Text>
            {selectedOrder?.fieldTime.map((time, index) => (
              <Text key={index}>Sân: {time.fieldName}</Text>
            ))}
            {selectedOrder?.fieldTime.map((time, index) => (
              <Text key={index}>
                Thời gian: {time.start} - {time.end}
              </Text>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Đóng</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
  },
  calendar: {
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "48%",
  },
  activeButton: {
    backgroundColor: "#ff6b01",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    color: "blue",
    marginTop: 15,
    textAlign: "center",
  },
});
