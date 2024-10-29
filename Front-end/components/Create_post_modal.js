import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker"; // Import image picker

const CreatePostModal = ({ visible, onClose, onAdd }) => {
  const [newPost, setNewPost] = React.useState({
    title: "",
    address: "",
    description: "",
    images: [],
  });

  // Function to pick images
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewPost((prevState) => ({
        ...prevState,
        images: [
          ...prevState.images,
          ...result.assets.map((asset) => asset.uri),
        ],
      }));
    }
  };

  // Function to confirm removal of an image
  const confirmRemoveImage = (index) => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => removeImage(index),
        },
      ],
      { cancelable: true }
    );
  };

  // Function to remove an image by its index
  const removeImage = (index) => {
    setNewPost((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddPost = async () => {
    if (
      !newPost.title ||
      !newPost.address ||
      !newPost.description ||
      newPost.images.length === 0
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("address", newPost.address);
    formData.append("description", newPost.description);

    newPost.images.forEach((imageUri, index) => {
      const uniqueName = () => {
        return `${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      };
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg",
        name: uniqueName(),
      });
    });
    await onAdd(formData);
    // Reset state after adding
    setNewPost({ title: "", address: "", description: "", images: [] });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Event</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newPost.address}
              onChangeText={(text) => setNewPost({ ...newPost, address: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newPost.description}
              onChangeText={(text) =>
                setNewPost({ ...newPost, description: text })
              }
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={pickImages}>
            <Text style={styles.textStyle}>Select Images</Text>
          </TouchableOpacity>

          {/* Preview Selected Images */}
          <ScrollView horizontal={true} style={styles.imagePreviewContainer}>
            {newPost.images.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => confirmRemoveImage(index)} // Show confirmation alert
              >
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={handleAddPost}
          >
            <Text style={styles.textStyle}>Add Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
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
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 45,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  button: {
    borderRadius: 10,
    padding: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#007BFF",
  },
  buttonClose: {
    backgroundColor: "orange",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default CreatePostModal;
