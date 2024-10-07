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

const RentalEquipmentScreen = () => {
  const [favorites, setFavorites] = useState({}); // State to manage favorite status for each item

  const toggleFavorite = (itemId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [itemId]: !prevFavorites[itemId], // Toggle favorite status
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
          {/* <Icon name="filter-list" type="material" /> */}
        </TouchableOpacity>
      </View>

      {/* Equipment List */}
      <FlatList
        data={equipmentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
                    <Text style={styles.starValue}>★</Text>
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
                  {/* {item.availability === "Available" ? (
                    <Icon
                      name="shopping-cart"
                      type="material"
                      color="#4caf50"
                    />
                  ) : (
                    <Icon name="outofstock" type="material" color="#d32f2f" />
                  )} */}
                </TouchableOpacity>
                {/* Favorite Button with Toggle */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  {/* <Icon
                    name="favorite"
                    type="material"
                    color={favorites[item.id] ? "#ff1744" : "#424242"} // Change color based on favorite status
                  /> */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light background for better contrast
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#b0bec5", // Lighter border color
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: "#ffffff", // White background for search input
  },
  filterButton: {
    marginLeft: 10,
  },
  card: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: "#ffffff", // White background for cards
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
    color: "#212121", // Darker text for better readability
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
    color: "#757575", // Gray for labels
  },
  detailValue: {
    marginLeft: 5,
    color: "#424242", // Dark gray for values
  },
  starValue: {
    color: "#EEC900",
  },
  available: {
    color: "#388e3c", // Dark green for available
  },
  rented: {
    color: "#d32f2f", // Red for rented
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
  buttonLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },
});

export default RentalEquipmentScreen;
