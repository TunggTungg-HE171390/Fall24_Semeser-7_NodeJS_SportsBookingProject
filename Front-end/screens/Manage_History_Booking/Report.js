import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

export default function Report() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [fieldDetail, setFieldDetail] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [updatedRating, setUpdatedRating] = useState(0);
  const [updatedDetail, setUpdatedDetail] = useState("");
  const [selectedStarFilter, setSelectedStarFilter] = useState("all");

  const userId = useSelector((state) => state.auth.user?.id);
  const api = process.env.REACT_APP_IP_Address;
  useEffect(() => {
    if (userId) {
      getFeedbackByCustomerId();
    }
  }, [userId]);

  useEffect(() => {
    filterReviews();
  }, [selectedStarFilter, reviews]);

  const getFieldByFeedbackId = async (feedbackId) => {
    try {
      const res = await axios.get(`${api}/field/fieldDetail/${feedbackId}`);
      setFieldDetail(res.data);
      setDetailsModalVisible(true);
    } catch (error) {
      console.log("Error fetching field detail:", error);
      Alert.alert("Error", "Không thể tải thông tin chi tiết của sân.");
    }
  };

  const handleDetailsPress = (feedbackId) => {
    getFieldByFeedbackId(feedbackId);
  };

  const getFeedbackByCustomerId = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`${api}/feedback/${userId}`);
      setReviews(res.data.feedbacks);
      setFilteredReviews(res.data.feedbacks);
    } catch (error) {
      console.log("Error fetching feedback:", error);
    }
  };

  const filterReviews = () => {
    if (selectedStarFilter === "all") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter(
          (review) => review.starNumber === parseInt(selectedStarFilter)
        )
      );
    }
  };

  const handleEditPress = (review) => {
    setSelectedReview(review);
    setUpdatedRating(review.starNumber);
    setUpdatedDetail(review.detail);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedReview) return;

      const updatedReview = {
        starNumber: updatedRating,
        detail: updatedDetail,
      };

      await axios.put(
        `http://192.168.0.104:3000/feedback/update/${selectedReview._id}`,
        updatedReview
      );
      Alert.alert("Success", "Feedback has been updated successfully");

      setReviews(
        reviews.map((review) =>
          review._id === selectedReview._id
            ? { ...review, ...updatedReview }
            : review
        )
      );
      setFilteredReviews(
        filteredReviews.map((review) =>
          review._id === selectedReview._id
            ? { ...review, ...updatedReview }
            : review
        )
      );
      setEditModalVisible(false);
      setSelectedReview(null);
    } catch (error) {
      console.log("Error updating feedback:", error);
    }
  };

  const handleDeletePress = (review) => {
    setSelectedReview(review);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedReview) return;

      await axios.delete(
        `http://192.168.0.104:3000/feedback/delete/${selectedReview._id}`
      );
      setReviews(reviews.filter((review) => review._id !== selectedReview._id));
      setDeleteModalVisible(false);
      setSelectedReview(null);

      Alert.alert("Success", "Feedback has been deleted successfully");
    } catch (error) {
      console.log("Error deleting feedback:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Đánh giá về các sân</Text>

      <View style={styles.filterOptions}>
        <Text style={styles.title}>Lọc số sao</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedStarFilter(value)}
          items={[
            { label: "Tất cả", value: "all" },
            { label: "1 sao", value: "1" },
            { label: "2 sao", value: "2" },
            { label: "3 sao", value: "3" },
            { label: "4 sao", value: "4" },
            { label: "5 sao", value: "5" },
          ]}
          value={selectedStarFilter}
          placeholder={{ label: "Lọc số sao", value: "all" }}
          style={pickerSelectStyles}
        />
      </View>

      <ScrollView
        style={styles.reviewContainer}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
          filteredReviews.slice(0, 10).map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <Image
                source={{
                  uri: review.image || "https://via.placeholder.com/80",
                }}
                style={styles.reviewImage}
              />
              <View style={styles.reviewTextContainer}>
                <Text style={styles.reviewRating}>
                  Đánh giá: {review.starNumber} ⭐
                </Text>
                <Text style={styles.reviewFeedback}>{review.detail}</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.editButtonDetail}
                    onPress={() => handleDetailsPress(review._id)}
                  >
                    <Text style={styles.editButtonText}>Chi tiết</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(review)}
                  >
                    <Text style={styles.editButtonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButtonDelete}
                    onPress={() => handleDeletePress(review)}
                  >
                    <Text style={styles.editButtonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>Không có đánh giá nào</Text>
        )}
      </ScrollView>

      {/* Modal for Editing */}
      {isEditModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Chỉnh sửa đánh giá</Text>

              <View style={styles.starContainerHorizontal}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setUpdatedRating(index + 1)}
                  >
                    <Icon
                      name="star"
                      size={30}
                      color={index < updatedRating ? "#FFD700" : "#ccc"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, { height: 80 }]}
                value={updatedDetail}
                onChangeText={setUpdatedDetail}
                placeholder="Nhập nội dung đánh giá"
                multiline
              />

              <View style={styles.modalButtonContainer}>
                <Button title="Lưu" onPress={handleSaveEdit} />
                <Button
                  title="Hủy"
                  color="red"
                  onPress={() => setEditModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Viewing Field Details */}
      {isDetailsModalVisible && fieldDetail && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDetailsModalVisible}
          onRequestClose={() => setDetailsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Thông tin chi tiết sân</Text>
              <Text>Tên sân: {fieldDetail.fieldName}</Text>
              <Text>Địa chỉ: {fieldDetail.address}</Text>
              <Text>Tên chủ sân: {fieldDetail.ownerName || "N/A"}</Text>
              <Text>Số lượng sân: {fieldDetail.totalFields}</Text>
              <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
                {fieldDetail.image &&
                  fieldDetail.image.map((img, index) => (
                    <Image
                      key={index}
                      source={{ uri: img }}
                      style={styles.reviewImage}
                    />
                  ))}
              </ScrollView>
              <Text>Các đánh giá:</Text>
              <ScrollView style={{ maxHeight: 200 }}>
                <View>
                  {fieldDetail.feedback && fieldDetail.feedback.length > 0 ? (
                    fieldDetail.feedback.map((feedback, index) => (
                      <View
                        key={index}
                        style={[styles.feedbackContainer, { marginBottom: 15 }]}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          {feedback.customerName}
                        </Text>
                        <Text>
                          {Array.from({ length: feedback.starNumber }).map(
                            (_, i) => (
                              <Text key={i}>⭐</Text>
                            )
                          )}
                        </Text>
                        <Text>Đánh giá: {feedback.detail}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>Không có đánh giá nào</Text>
                  )}
                </View>
              </ScrollView>
              <Button
                title="Đóng"
                onPress={() => setDetailsModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Xác nhận xóa</Text>
              <Text>Bạn có chắc chắn muốn xóa đánh giá này không?</Text>
              <View style={styles.modalButtonContainer}>
                <Button title="Có" onPress={handleConfirmDelete} />
                <Button
                  title="Không"
                  color="red"
                  onPress={() => setDeleteModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  label: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  reviewContainer: {
    width: "100%",
  },
  scrollContentContainer: {
    paddingBottom: 8,
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewFeedback: {
    fontSize: 16,
  },
  editButtonDetail: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "green",
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  editButtonDelete: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  starContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#555",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterText: {
    color: "#ccc",
    fontSize: 14,
  },
  filterOptions: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "white",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  feedbackContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 19,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 23,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 20,
    color: "black",
    backgroundColor: "#fff",
  },
});
