import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const EquipmentListScreen = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const [equipmentName, setEquipmentName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState(1);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const fetchEquipment = async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.0.104:3000/equipment?page=${page}&limit=10&search=${searchTerm}`
      );
      const { equipments, totalPages } = response.data;
      setEquipment(equipments);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://192.168.0.104:3000/equipment/delete/${id}`);
      fetchEquipment(page, search);
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const openModal = (equipment = null) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setEquipmentName(equipment.equipmentName);
      setPrice(equipment.price.toString());
      setQuantity(equipment.quantity.toString());
      setStatus(equipment.status);
      setImages(equipment.image || []); // Load existing images
    } else {
      setEditingEquipment(null);
      setEquipmentName("");
      setPrice("");
      setQuantity("");
      setStatus(1); // Default to Available
      setImages([]); // Reset image selection
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handlePickImages = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Enable multiple selection
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const selectedImages = result.assets || [];

      const imageUris = selectedImages.map((image) => image.uri);
      setImages([...images, ...imageUris]); // Append new images to the current list
    } catch (error) {
      console.error("Error picking images:", error);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Remove the image at the specific index
    setImages(newImages); // Update the images array
  };

  const handleSubmit = async () => {
    const payload = {
      equipmentName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      status,
      image: images, // Send selected images
    };

    try {
      if (editingEquipment) {
        await axios.put(
          `http://192.168.0.104:3000/equipment/update/${editingEquipment._id}`,
          payload
        );
      } else {
        await axios.post("http://192.168.0.104:3000/equipment", payload);
      }
      fetchEquipment(page, search);
      closeModal();
    } catch (error) {
      console.error("Error saving equipment:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image[0] }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.equipmentName}>{item.equipmentName}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text
          style={[
            styles.status,
            item.status === 1
              ? styles.availableStatus
              : styles.unavailableStatus,
          ]}
        >
          {item.status === 1 ? "Available" : "Unavailable"}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openModal(item)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            item.status === 0 && styles.disabledDeleteButton, // Disable button if status is 0
          ]}
          disabled={item.status === 0} // Disable delete button
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading equipment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />
        <Ionicons name="search" size={20} color="#333" />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipment List</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal(null)}
        >
          <Ionicons name="add-circle-outline" size={30} color="#007bff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={equipment}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.pageButton}
          disabled={page === 1}
          onPress={handlePrevPage}
        >
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={page === 1 ? "#ccc" : "#007bff"}
          />
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Page {page} of {totalPages}
        </Text>
        <TouchableOpacity
          style={styles.pageButton}
          disabled={page === totalPages}
          onPress={handleNextPage}
        >
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={page === totalPages ? "#ccc" : "#007bff"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-outline" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {editingEquipment ? "Edit Equipment" : "Add Equipment"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Equipment Name"
              value={equipmentName}
              onChangeText={setEquipmentName}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            {editingEquipment && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Status</Text>
                <Picker
                  selectedValue={status}
                  style={styles.picker}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                >
                  <Picker.Item label="Available" value={1} />
                  <Picker.Item label="Unavailable" value={0} />
                </Picker>
              </View>
            )}

            {/* Camera Icon to pick images */}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={handlePickImages}
            >
              <Ionicons name="camera-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <ScrollView horizontal style={styles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={30}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007bff",
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  availableStatus: {
    color: "green",
  },
  unavailableStatus: {
    color: "red",
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
  },
  disabledDeleteButton: {
    backgroundColor: "#ccc",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    marginBottom: 20,
  },
  pageButton: {
    paddingHorizontal: 16,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  picker: {
    height: 50,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  iconContainer: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2, // Add some padding for visibility
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginVertical: 12,
  },
  previewImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
});

export default EquipmentListScreen;
