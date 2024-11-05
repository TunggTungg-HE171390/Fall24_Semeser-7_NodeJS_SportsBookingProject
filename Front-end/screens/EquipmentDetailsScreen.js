import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  HeartOff,
  X,
  Plus,
  Minus,
} from "lucide-react-native";

const EquipmentDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [equipment, setEquipment] = useState(null);
  const [relatedEquipment, setRelatedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rentQuantity, setRentQuantity] = useState(1);
  const api = process.env.REACT_APP_IP_Address;
  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.104:3000/equipment/${id}`
        );
        setEquipment(response.data);
        setMainImage(response.data.image[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchRelatedEquipment = async () => {
      try {
        const response = await axios.get(`http://192.168.0.104:3000/equipment`);
        const filteredEquipment = response.data.equipments.filter(
          (item) => item._id !== id
        );
        setRelatedEquipment(filteredEquipment);
      } catch (err) {
        console.error("Failed to load related equipment:", err.message);
      }
    };

    fetchEquipmentDetails();
    fetchRelatedEquipment();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Failed to load equipment details: {error}
        </Text>
      </View>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleRent = () => {
    if (rentQuantity > equipment.quantity) {
      Alert.alert(
        "Quantity Exceeded",
        `Only ${equipment.quantity} items available for rent.`
      );
      return;
    }
    alert(`You have rented ${rentQuantity} of ${equipment.equipmentName}`);
  };

  const incrementQuantity = () => {
    if (rentQuantity < equipment.quantity) {
      setRentQuantity(rentQuantity + 1);
    } else {
      Alert.alert("Limit Reached", "Cannot exceed available quantity.");
    }
  };

  const decrementQuantity = () => {
    if (rentQuantity > 1) {
      setRentQuantity(rentQuantity - 1);
    }
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const renderRelatedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.relatedItem}
      onPress={() => alert(`View details of ${item.equipmentName}`)}
    >
      <Image source={{ uri: item.image[0] }} style={styles.relatedImage} />
      <Text style={styles.relatedName}>{item.equipmentName}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{equipment.equipmentName}</Text>
      <TouchableOpacity onPress={openModal}>
        <Image source={{ uri: mainImage }} style={styles.mainImage} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <X size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: mainImage }} style={styles.fullscreenImage} />
        </View>
      </Modal>

      <ScrollView
        horizontal
        style={styles.thumbnailContainer}
        showsHorizontalScrollIndicator={false}
      >
        {equipment.image.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => setMainImage(img)}>
            <Image source={{ uri: img }} style={styles.thumbnailImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <Text style={styles.price}>
          Price: {equipment.price.toLocaleString()} VND/h
        </Text>
        <Text style={styles.quantity}>
          Available Quantity: {equipment.quantity}
        </Text>
        <Text style={styles.status}>
          Status: {equipment.status === 1 ? "Available" : "Unavailable"}
        </Text>

        {/* Enhanced Quantity Selector */}
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            onPress={decrementQuantity}
            style={styles.quantityControlButton}
          >
            <Minus size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityText}>{rentQuantity}</Text>
          </View>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={styles.quantityControlButton}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Rent & Favorite Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
            <ShoppingCart color="#fff" size={20} />
            <Text style={styles.rentButtonText}>Rent Equipment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            {isFavorite ? (
              <Heart color="red" size={20} />
            ) : (
              <HeartOff color="black" size={20} />
            )}
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? "Remove Favorites" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Related Equipment Section */}
      <Text style={styles.relatedHeader}>Related Equipment</Text>
      <FlatList
        data={relatedEquipment}
        renderItem={renderRelatedItem}
        keyExtractor={(item) => item._id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.relatedContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  thumbnailContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },
  quantity: {
    fontSize: 16,
    marginBottom: 10,
    color: "#2ecc71",
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    color: "#d32f2f",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rentButton: {
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  favoriteButton: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  favoriteButtonText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullscreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  quantitySelector: {
    flexDirection: "row",
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  quantityControlButton: {
    backgroundColor: "#ff7f50",
    padding: 12,
    borderRadius: 50,
  },
  quantityDisplay: {
    marginHorizontal: 20,
    minWidth: 40,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  relatedHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  relatedContainer: {
    paddingLeft: 20,
  },
  relatedItem: {
    marginRight: 15,
    width: 130,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 40,
  },
  relatedImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  relatedName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default EquipmentDetailScreen;
