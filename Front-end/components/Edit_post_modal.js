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
import * as ImagePicker from "expo-image-picker";

const EditPostModal = ({ visible, onClose, post, onUpdate }) => {
  const [updatedPost, setUpdatedPost] = React.useState({
    title: "",
    address: "",
    description: "",
    images: [],
  });

  const [originalImages, setOriginalImages] = React.useState([]);

  React.useEffect(() => {
    if (visible && post) {
      setUpdatedPost({
        title: post.title || "",
        address: post.location?.address || "No Address Provided",
        description: post.description || "",
        images: post.image || [],
      });
      setOriginalImages(post.image || []);
    }
  }, [post, visible]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUpdatedPost((prevState) => ({
        ...prevState,
        images: [
          ...prevState.images,
          ...result.assets.map((asset) => asset.uri),
        ],
      }));
    }
  };

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

  const removeImage = (index) => {
    setUpdatedPost((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleUpdatePost = async () => {
    if (
      !updatedPost.title ||
      !updatedPost.address ||
      !updatedPost.description
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", updatedPost.title);
    formData.append("address", updatedPost.address);
    formData.append("description", updatedPost.description);

    const postId = post._id;
    console.log("In modal: ", postId);
    const imagesToKeep = updatedPost.images.filter((image) =>
      originalImages.includes(image)
    );

    //formData.append("imagesToKeep", JSON.stringify(imagesToKeep));
    formData.append("imagesToKeep", imagesToKeep);
    console.log("imagesToKeep", imagesToKeep);

    updatedPost.images
      .filter((imageUri) => !originalImages.includes(imageUri))
      .forEach((imageUri, index) => {
        const uniqueName = () => {
          return `${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        };
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: uniqueName(),
        });
      });
    await onUpdate(formData, postId);
    // Reset state after editing

    // setUpdatedPost({
    //   title: "",
    //   address: "",
    //   description: "",
    //   images: [],
    // });
    // setOriginalImages([]);
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
          <Text style={styles.modalTitle}>Edit Event</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={updatedPost?.title}
              onChangeText={(text) =>
                setUpdatedPost({ ...updatedPost, title: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={updatedPost?.address}
              onChangeText={(text) =>
                setUpdatedPost({ ...updatedPost, address: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={updatedPost?.description}
              onChangeText={(text) =>
                setUpdatedPost({ ...updatedPost, description: text })
              }
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={pickImages}>
            <Text style={styles.textStyle}>Select Images</Text>
          </TouchableOpacity>

          {/* Preview Selected Images */}
          <ScrollView horizontal={true} style={styles.imagePreviewContainer}>
            {updatedPost.images.map((imageUri, index) => (
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
            onPress={handleUpdatePost}
          >
            <Text style={styles.textStyle}>Edit Event</Text>
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

export default EditPostModal;
