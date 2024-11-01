import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
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
      const res = await axios.get(`http://192.168.20.35:3000/field-order/customer/${userId}`);
      const fetchedOrders = res.data.data || [];
      const updatedOrders = fetchedOrders.map((order) => {
        const [time, date] = order.orderDate.split(" ");
        const [day, month, year] = date.split("/");
        const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        return { ...order, formattedOrderDate: formattedDate }; // Thêm trường formattedOrderDate với định dạng chuẩn
      });
      setOrders(updatedOrders);

      const dates = {};
      updatedOrders.forEach((order) => {
        if (order.formattedOrderDate) {
          dates[order.formattedOrderDate] = {
            selected: true,
            marked: true,
            selectedColor: "red",
          };
        }
      });

      setMarkedDates(dates);
    } catch (error) {
      console.log("Error fetching field orders:", error);
    }
  };


  const getFieldOrderDetail = async (fieldOrderId) => {
    try {
      const res = await axios.get(`http://192.168.20.35:3000/field-order/detail/${fieldOrderId}`);
      setSelectedOrder(res.data.data);
      setModalVisible(true);
    } catch (error) {
      console.log("Error fetching field order detail:", error);
    }
  };

  const onDayPress = (day) => {
    console.log("Day pressed:", day);
    const order = orders.find((o) =>
      o.formattedOrderDate === day.dateString // So sánh với formattedOrderDate
    );
    if (order) {
      console.log("Order found:", order);
      getFieldOrderDetail(order._id);
    } else {
      console.log("No order found for the selected day.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Lịch đăng kí</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="sliders" size={16} color="#ccc" style={{ marginRight: 5 }} />
          <Text style={styles.filterText}>Bộ lọc</Text>
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
            <Text style={{ fontWeight: "bold" }}>
              Thông tin đặt sân
            </Text>
            <Text>Khách hàng: {selectedOrder?.customerName || "N/A"}</Text>
            <Text>Ngày đặt:{selectedOrder?.orderDate || "N/A"}</Text>
            {selectedOrder?.fieldTime ? (
              <View>
                <Text>Thời gian: {selectedOrder.fieldTime}</Text>
                <Text>Địa điểm: {selectedOrder.fieldName || "N/A"}</Text>
                <Text>Tên sân: {selectedOrder.subFieldName || "N/A"}</Text>
              </View>
            ) : (
              <Text>Thông tin thời gian không có sẵn</Text>
            )}

            <Text style={{ fontWeight: "bold" }}>Thiết bị đăng kí:</Text>
            {selectedOrder?.equipmentOrder?.length > 0 ? (
              <View style={{ marginVertical: 2 }}>
                {selectedOrder.equipmentOrder.map((equipment, index) => (
                  <View key={index} style={{ marginLeft: 10, marginVertical: 5 }}>
                    {equipment.equipmentName.map((name, i) => (
                      <Text key={i}>- {name} | Số lượng: {equipment.quantity[i]} | Giá: {equipment.price[i]} |
                        <Text style={{ fontWeight: "bold" }}>
                          Thành tiền: {equipment.quantity[i] * equipment.price[i]} VND
                        </Text>
                      </Text>
                    ))}
                  </View>
                ))}
                <Text style={{ fontWeight: "bold" }}>
                  Tổng tiền: {selectedOrder.totalPrice} VND
                </Text>
              </View>
            ) : (
              <Text>Không có thiết bị đặt hàng</Text>
            )}

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
    marginTop: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
  },
  calendar: {
    flex: 1,
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
    fontSize: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333', // Màu nền chính
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 25,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555', // Màu nền của nút "Bộ lọc"
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterText: {
    color: '#ccc', // Màu chữ của nút "Bộ lọc"
    fontSize: 14,
  },
});
