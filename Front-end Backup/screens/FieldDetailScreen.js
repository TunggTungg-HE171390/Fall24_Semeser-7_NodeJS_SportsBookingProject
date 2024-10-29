import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";

const FieldDetailScreen = ({ route }) => {
  const { field } = route.params;

  // State để lưu thời gian
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showDate, setShowDate] = useState(false); // Chọn ngày
  const [showStartTime, setShowStartTime] = useState(false); // Chọn giờ bắt đầu
  const [showEndTime, setShowEndTime] = useState(false); // Chọn giờ kết thúc
  const [showModal, setShowModal] = useState(false); // Hiển thị modal khi đặt sân

  // Hàm xử lý khi chọn ngày
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setSelectedDate(currentDate);
  };

  // Hàm xử lý khi chọn giờ bắt đầu
  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTime(false);
    setStartTime(currentTime);
  };

  // Hàm xử lý khi chọn giờ kết thúc
  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTime(false);
    if (currentTime < startTime) {
      alert("Giờ kết thúc không được nhỏ hơn giờ bắt đầu!");
    } else {
      setEndTime(currentTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hình ảnh sân */}
      <Image source={field.image} style={styles.detailImage} />

      {/* Thông tin sân */}
      <View style={styles.infoContainer}>
        <Text style={styles.detailName}>{field.name}</Text>
        <Text style={styles.detailLocation}>
          <Ionicons name="location-outline" size={18} color="#666" />{" "}
          {field.location}
        </Text>
        <Text style={styles.detailPrice}>
          Giá: {field.price.toLocaleString()} VND/h
        </Text>
        <Text style={styles.detailRating}>Đánh giá: {field.rating} ★</Text>
        <Text style={styles.detailTotalFields}>
          Tổng số sân: {field.totalFields}
        </Text>
      </View>

      {/* Chọn ngày */}
      {/* Chọn ngày, Giờ bắt đầu và Giờ kết thúc trên cùng một hàng */}
      <View style={styles.pickerWrapper}>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowDate(true)}
        >
          <Text style={styles.timeText}>
            <Ionicons name="calendar-outline" size={18} />{" "}
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowStartTime(true)}
        >
          <Text style={styles.timeText}>
            {/* <Ionicons name="time-outline" size={18} /> Giờ bắt đầu:{" "} */}
            {` ${startTime.toLocaleTimeString()}`}
          </Text>
        </TouchableOpacity>
        <Ionicons name="chevron-forward-outline" size={24} color="gray" />
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowEndTime(true)}
        >
          <Text style={styles.timeText}>
            {/* <Ionicons name="time-outline" size={18} /> Giờ kết thúc:{" "} */}
            {`${endTime.toLocaleTimeString()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePicker cho ngày */}
      {showDate && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* DateTimePicker cho giờ bắt đầu */}
      {showStartTime && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeStartTime}
        />
      )}

      {/* DateTimePicker cho giờ kết thúc */}
      {showEndTime && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeEndTime}
        />
      )}

      {/* Nút đặt sân */}
      <View style={styles.buttonContainer}>
        <Button title="Đặt sân" onPress={() => setShowModal(true)} />
      </View>

      {/* Phần đánh giá từ người dùng */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Đánh giá từ người dùng:</Text>
        {field.reviews.map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <Text style={styles.reviewUser}>{review.user}</Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewRating}>Đánh giá: {review.rating} ★</Text>
          </View>
        ))}
      </View>

      {/* Modal để hiển thị thông tin xác nhận */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận đặt sân</Text>
            <Text style={styles.modalText}>Người đặt: Mock User</Text>
            <Text style={styles.modalText}>
              Ngày đặt: {selectedDate.toLocaleDateString()}
            </Text>
            <Text style={styles.modalText}>
              Giờ đặt: {startTime.toLocaleTimeString()} -{" "}
              {endTime.toLocaleTimeString()}
            </Text>
            <Button
              title="Xác nhận"
              onPress={() => alert("Đặt sân thành công!")}
            />
            <Button title="Hủy" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  detailName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailLocation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  detailPrice: {
    fontSize: 18,
    color: "#28a745",
    marginBottom: 5,
  },
  detailRating: {
    fontSize: 18,
    color: "#f39c12",
    marginBottom: 5,
  },
  detailTotalFields: {
    fontSize: 16,
    color: "#3498db",
  },

  // Đặt phần chọn ngày và giờ trên cùng một hàng
  pickerWrapper: {
    flexDirection: "row", // Đặt các phần tử theo hàng ngang
    justifyContent: "space-between", // Căn chỉnh đều các phần tử
    alignItems: "center",
    marginBottom: 20,
  },
  timeButton: {
    flex: 1, // Đảm bảo mỗi phần tử chiếm cùng tỷ lệ
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc", // Thêm border thay vì nền
    borderWidth: 1, // Border width
    marginHorizontal: 5, // Thêm khoảng cách giữa các phần tử
    alignItems: "center", // Căn giữa văn bản trong nút
  },
  timeText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#333", // Chỉnh màu chữ
    fontWeight: "bold",
  },

  // Đặt phần đánh giá xuống dưới cùng
  reviewContainer: {
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  reviewUser: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewComment: {
    fontSize: 14,
    marginTop: 5,
    color: "#333",
  },
  reviewRating: {
    fontSize: 14,
    color: "#f39c12",
  },

  buttonContainer: {
    marginBottom: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default FieldDetailScreen;
