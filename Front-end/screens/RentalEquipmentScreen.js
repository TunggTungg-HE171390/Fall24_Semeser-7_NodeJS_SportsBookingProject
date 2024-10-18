import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import {
  ShoppingCart,
  Heart,
  HeartOff,
  Ban,
  Filter,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

// Sample equipment data
const equipmentData = [
  {
    id: "1",
    name: "Tennis Racket",
    price: "50,000 VND/h",
    brand: "Wilson",
    condition: "Excellent",
    rating: "4.5",
    availability: "Available",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmQRI2Y6AHsFYkKQWqdLosIP20N4Pg3gjbzA&s",
  },
  {
    id: "2",
    name: "Badminton Racket",
    price: "30,000 VND/h",
    brand: "Yonex",
    condition: "Good",
    rating: "4.2",
    availability: "Rented",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmQRI2Y6AHsFYkKQWqdLosIP20N4Pg3gjbzA&s",
  },
  {
    id: "3",
    name: "Football",
    price: "20,000 VND/h",
    brand: "Nike",
    condition: "Fair",
    rating: "4.8",
    availability: "Available",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmQRI2Y6AHsFYkKQWqdLosIP20N4Pg3gjbzA&s",
  },
];

// Array of time filter options
const timeFilters = ["Soccer", "Volleyball", "Badminton", "All sports"];

const RentalEquipmentScreen = () => {
  const [favorites, setFavorites] = useState({});
  const navigation = useNavigation(); // Initialize the navigation

  // Function to toggle favorite status
  const toggleFavorite = (itemId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [itemId]: !prevFavorites[itemId],
    }));
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
        data={equipmentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("EquipmentDetail", { item })} // Navigate to details
          >
            <View style={styles.cardContent}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardDetails}>
                <Text style={styles.equipmentName}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Brand:</Text>
                  <Text style={styles.detailValue}>{item.brand}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Condition:</Text>
                  <Text style={styles.detailValue}>{item.condition}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Rating:</Text>
                  <Text style={styles.detailValue}>
                    {item.rating}
                    <Text style={styles.starValue}> ★</Text>
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Availability:</Text>
                  <Text style={styles.detailValue}>
                    {item.availability === "Available" ? (
                      <Text style={styles.available}>Available</Text>
                    ) : (
                      <Text style={styles.rented}>Out of stock</Text>
                    )}
                  </Text>
                </View>
              </View>

              {/* Favorite and Rental Buttons */}
              <View style={styles.actionButtons}>
                {/* Rental Button */}
                <TouchableOpacity style={styles.iconButton}>
                  {item.availability === "Available" ? (
                    <ShoppingCart size={24} color="#4caf50" />
                  ) : (
                    <Ban size={24} color="#d32f2f" />
                  )}
                </TouchableOpacity>

                {/* Favorite Button with Toggle */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  {favorites[item.id] ? (
                    <Heart size={24} color="#ff1744" />
                  ) : (
                    <HeartOff size={24} color="#424242" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity> // Make the entire card pressable
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  filterMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30, // Increased margin for more space
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
  },
  detailRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#757575",
  },
  detailValue: {
    marginLeft: 5,
    color: "#424242",
  },
  starValue: {
    color: "#EEC900",
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
  },
  iconButton: {
    padding: 5,
    alignItems: "center",
  },
});

export default RentalEquipmentScreen;
