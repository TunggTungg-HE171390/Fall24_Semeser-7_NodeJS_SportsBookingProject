import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  ShoppingCart,
  Heart,
  HeartOff,
  Ban,
  Filter,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Swiper from "react-native-swiper";

const timeFilters = ["Soccer", "Volleyball", "Badminton", "All sports"];

const RentalEquipmentScreen = () => {
  const [favorites, setFavorites] = useState({});
  const [equipmentData, setEquipmentData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetchEquipmentData();
  }, [page]);

  const fetchEquipmentData = async () => {
    if (loading || !hasMoreData) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.13:3000/equipment?page=${page}&limit=10`
      );
      const newEquipments = response.data.equipments;

      if (newEquipments.length > 0) {
        setEquipmentData((prevData) => [...prevData, ...newEquipments]);
      } else {
        setHasMoreData(false); // No more data to load
      }
    } catch (error) {
      console.error("Failed to fetch equipment data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!loading && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleFavorite = (itemId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [itemId]: !prevFavorites[itemId],
    }));
  };

  const renderEquipmentImages = (images) => {
    return (
      <Swiper style={styles.imageSwiper} showsPagination={false}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </Swiper>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by equipment name..."
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#757575" />
        </TouchableOpacity>
      </View>

      {/* Time Filter Menu */}
      <View style={styles.filterMenu}>
        {timeFilters.map((filter, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={equipmentData.filter((item) => item.status !== 0)} // Hide items with status 0
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("EquipmentDetail", { id: item._id })
            } // Pass the id here
          >
            <View style={styles.cardContent}>
              {/* Swiper for multiple images */}
              {renderEquipmentImages(item.image)}

              <View style={styles.cardDetails}>
                <Text style={styles.equipmentName}>{item.equipmentName}</Text>
                <Text style={styles.price}>
                  {item.price.toLocaleString()} VND/h
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>{item.quantity}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>
                    {item.quantity <= 0 ? (
                      <Text style={styles.rented}>Unavailable</Text>
                    ) : (
                      <Text style={styles.available}>Available</Text>
                    )}
                  </Text>
                </View>
              </View>

              {/* Favorite and Rental Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconButton}>
                  {item.quantity > 0 ? (
                    <ShoppingCart size={24} color="#4caf50" />
                  ) : (
                    <Ban size={24} color="#d32f2f" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => toggleFavorite(item._id)}
                >
                  {favorites[item.id] ? (
                    <Heart size={24} color="#ff1744" />
                  ) : (
                    <HeartOff size={24} color="#424242" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  filterMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    borderColor: "#b0bec5",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  filterButtonText: {
    color: "#212121",
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#b0bec5",
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: "#ffffff",
  },
  card: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageSwiper: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  cardDetails: {
    flex: 1,
    marginLeft: 10,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  price: {
    color: "#B8860B",
    marginTop: 5,
    fontSize: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#757575",
    fontSize: 14,
  },
  detailValue: {
    marginLeft: 5,
    color: "#424242",
    fontSize: 14,
  },
  available: {
    color: "#388e3c",
  },
  rented: {
    color: "#d32f2f",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconButton: {
    padding: 5,
    alignItems: "center",
  },
});

export default RentalEquipmentScreen;
