import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import FieldFormModal from "./FieldFormModal"; // Import form modal cho thêm/sửa sân
import { useNavigation } from "@react-navigation/native";

// Dữ liệu mẫu
const initialFields = [
  {
    id: "1",
    name: "Sân Tennis",
    type: "Tennis",
    location: "Hoa Lac",
    price: 100000,
    image: require("../assets/images/san-tennis.jpg"),
    rating: 4.5,
    totalFields: 5,
    reviews: [
      { user: "User1", comment: "Sân sạch sẽ, thoáng mát", rating: 4 },
      { user: "User2", comment: "Giá hợp lý, dịch vụ tốt", rating: 5 },
      { user: "User3", comment: "Sân rất tốt, tuy nhiên hơi xa", rating: 4 },
    ],
  },
  {
    id: "2",
    name: "Football",
    type: "Football",
    location: "Hoa Lac",
    price: 200000,
    image: require("../assets/images/san-nhan-tao.jpg"),
    rating: 4.8,
    totalFields: 3,
    reviews: [
      {
        user: "User1",
        comment: "Sân lớn, sạch sẽ, nhưng giá hơi cao",
        rating: 4,
      },
      { user: "User2", comment: "Thích hợp cho nhóm đông người", rating: 5 },
      { user: "User3", comment: "Sân rộng, chất lượng tốt", rating: 5 },
    ],
  },
  {
    id: "3",
    name: "Badminton",
    type: "Badminton",
    location: "Cau Giay",
    price: 150000,
    image: require("../assets/images/san-cau-long.jpg"),
    rating: 4.2,
    totalFields: 7,
    reviews: [
      { user: "User1", comment: "Sân đẹp, có điều hòa", rating: 4 },
      { user: "User2", comment: "Khá đông vào cuối tuần", rating: 3 },
      { user: "User3", comment: "Giá cả hợp lý, dịch vụ ổn", rating: 4 },
    ],
  },
];

export default function FieldListScreen() {
  const [fields, setFields] = useState(initialFields);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  const handleFieldSubmit = (newField) => {
    let updatedFields;
    if (newField.id) {
      updatedFields = fields.map((field) =>
        field.id === newField.id ? newField : field
      );
    } else {
      updatedFields = [...fields, { ...newField, id: Date.now() }];
    }
    setFields(updatedFields);
    setModalVisible(false);
    setSelectedField(null);
  };

  const confirmDeleteField = (field) => {
    setSelectedField(field);
    setDeleteModalVisible(true); // Hiển thị modal xác nhận
  };

  const handleDelete = () => {
    setFields(fields.filter((field) => field.id !== selectedField.id));
    setDeleteModalVisible(false);
    setSelectedField(null); // Đóng modal và reset trạng thái
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Thêm sân mới</Text>
      </TouchableOpacity>
      <FlatList
        data={fields}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("FieldAdminDetail", { field: item })
            }
          >
            <View style={styles.fieldCard}>
              <Image source={item.image} style={styles.fieldImage} />
              <View style={styles.fieldContent}>
                <Text style={styles.fieldName}>{item.name}</Text>
                <Text style={styles.fieldType}>{item.type}</Text>
                <Text style={styles.fieldPrice}>Giá: {item.price}</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setSelectedField(item);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDeleteField(item)}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bạn có chắc chắn muốn xóa sân này không?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#e74c3c" }]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FieldFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFieldSubmit}
        field={selectedField}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fieldCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  fieldImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  fieldContent: {
    flex: 1,
    padding: 15,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  fieldType: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  fieldPrice: {
    fontSize: 16,
    color: "#27ae60",
    marginVertical: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#2980b9",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
