import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function FieldListScreen() {
  const ownerId = useSelector((state) => state.auth.user.id);

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sportName: "Football",
    address: "",
    ownerId: ownerId || "",
    feedBackId: [],
    totalFields: "",
    price: "",
    openingTime: "",
    closingTime: "",
    slotDuration: "",
    status: "ACTIVE",
    image: [],
  });
  const navigation = useNavigation();
  const api = process.env.REACT_APP_IP_Address;

  useEffect(() => {
    fetchFields(page);
  }, [page]);

  useEffect(() => {
    // Update formData with ownerId from Redux when it changes
    setFormData((prev) => ({ ...prev, ownerId }));
  }, [ownerId]);

  const fetchFields = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${api}/field?page=${currentPage}&limit=4`
      );
      const responseData = response.data;
      const fieldsData = responseData.data;
      const pages = responseData.totalPages;

      setFields(fieldsData);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
    setLoading(false);
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access images is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets.map((img) => img.uri) });
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      if (isEdit) {
        console.log(selectedField._id);

        // Update the existing field
        const response = await axios.put(
          `${apiEndpoint}/${selectedField._id}`,
          formData
        );
        if (response.data) {
          // Show success alert
          Alert.alert("Success", "Field updated successfully!", [
            {
              text: "OK",
              onPress: () => {
                // Reload the data after the alert is closed
                fetchFields(page);
              },
            },
          ]);
        } else {
          Alert.alert("Error", "Failed to update the field. Please try again.");
          return;
        }
      } else {
        // Create a new field
        const response = await axios.post(apiEndpoint, formData);
        if (response.data) {
          Alert.alert("Success", "Field updated successfully!", [
            {
              text: "OK",
              onPress: () => {
                // Reload the data after the alert is closed
                fetchFields(page);
              },
            },
          ]);
        } else {
          Alert.alert(
            "Error",
            "Failed to save the new field. Please try again."
          );
          return;
        }
      }
      fetchFields(page);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to save the field. Please check your input or try again later."
      );

      console.error("Error saving field:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sportName: "Football",
      address: "",
      ownerId: ownerId || "",
      feedBackId: [],
      totalFields: "",
      price: "",
      openingTime: "",
      closingTime: "",
      slotDuration: "",
      status: "ACTIVE",
      image: [],
    });
  };

  const handleDelete = async (fieldId) => {
    Alert.alert("Delete Field", "Are you sure you want to delete this field?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${apiEndpoint}/${fieldId}`);
            fetchFields(page);
          } catch (error) {
            console.error("Error deleting field:", error);
          }
        },
      },
    ]);
  };

  const openModal = (field = null) => {
    if (field) {
      setIsEdit(true);
      setSelectedField(field);

      setFormData({
        name: field.name || "",
        sportName: field.sportName || "Football",
        address: field.address || "",
        ownerId: field.ownerId || "",
        feedBackId: field.feedBackId || [],
        totalFields: field.totalFields ? field.totalFields.toString() : "",
        price: field.price ? field.price.toString() : "",
        openingTime: field.openingTime || "",
        closingTime: field.closingTime || "",
        slotDuration: field.slotDuration || "",
        status: field.status || "ACTIVE",
        image: field.image || [],
      });

      // console.log(JSON.stringify(formData, null, 2));
    } else {
      setIsEdit(false);
      resetForm();
    }
    setModalVisible(true);
  };

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+ Add New Field</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={fields}
          keyExtractor={(item) => {
            return item._id.toString();
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FieldAdminDetail", { field: item })
              }
            >
              <View style={styles.fieldCard}>
                <Image
                  source={{ uri: item.image[0] }}
                  style={styles.fieldImage}
                />
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldName}>{item.name}</Text>
                  <Text style={styles.fieldType}>Sport: {item.sportName}</Text>
                  <Text style={styles.fieldAddress}>
                    Address: {item.address}
                  </Text>
                  <Text style={styles.fieldPrice}>Price: {item.price} VND</Text>
                  <Text style={styles.fieldStatus}>
                    Status: {item.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openModal(item)}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item._id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Pagination controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
          onPress={handlePrevPage}
          disabled={page === 1}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Page {page} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageButton,
            page === totalPages && styles.disabledButton,
          ]}
          onPress={handleNextPage}
          disabled={page === totalPages}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for add/edit field */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEdit ? "Edit Field" : "Add New Field"}
            </Text>
            <TextInput
              placeholder="Field Name"
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <Picker
              selectedValue={formData.sportName}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, sportName: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Football" value="Football" />
              <Picker.Item label="Volleyball" value="Volleyball" />
              <Picker.Item label="Badminton" value="Badminton" />
              <Picker.Item label="Tennis" value="Tennis" />
              <Picker.Item label="Table Tennis" value="Table Tennis" />
            </Picker>
            <TextInput
              placeholder="Address"
              style={styles.input}
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
            />
            <TextInput
              placeholder="Total Fields"
              style={styles.input}
              value={formData.totalFields}
              onChangeText={(text) =>
                setFormData({ ...formData, totalFields: text })
              }
            />
            <TextInput
              placeholder="Price"
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
            <TextInput
              placeholder="Opening Time (e.g., 08:00)"
              style={styles.input}
              value={formData.openingTime}
              onChangeText={(text) =>
                setFormData({ ...formData, openingTime: text })
              }
            />
            <TextInput
              placeholder="Closing Time (e.g., 22:00)"
              style={styles.input}
              value={formData.closingTime}
              onChangeText={(text) =>
                setFormData({ ...formData, closingTime: text })
              }
            />
            <TextInput
              placeholder="Slot Duration (in minutes)"
              style={styles.input}
              value={formData.slotDuration}
              onChangeText={(text) =>
                setFormData({ ...formData, slotDuration: text })
              }
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={handleImagePick}
            >
              <Text style={styles.imagePickerText}>Pick Images</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {formData.image.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.previewImage}
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddOrUpdate}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
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
    padding: 20,
    backgroundColor: "#f9f9f9",
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
  loading: {
    marginTop: 20,
  },
  fieldCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    padding: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  fieldImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  fieldContent: {
    flex: 1,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  fieldType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  fieldAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  fieldPrice: {
    fontSize: 14,
    color: "#27ae60",
    marginBottom: 4,
  },
  fieldStatus: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
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
    marginRight: 5,
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pageButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  pageText: {
    fontSize: 16,
    color: "#333",
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
  picker: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePicker: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
