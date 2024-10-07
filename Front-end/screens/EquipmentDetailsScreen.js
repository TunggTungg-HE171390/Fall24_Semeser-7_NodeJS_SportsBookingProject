import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ShoppingCart, Heart, HeartOff } from "lucide-react-native";

const relatedItems = [
  {
    id: "1",
    title: "Tennis Ball Set",
    price: "30,000 VND/h",
    image: "https://via.placeholder.com/100",
  },
  {
    id: "2",
    title: "Tennis Net",
    price: "70,000 VND/h",
    image: "https://via.placeholder.com/100",
  },
  {
    id: "3",
    title: "Tennis Shoes",
    price: "120,000 VND/h",
    image: "https://via.placeholder.com/100",
  },
];

const EquipmentDetailScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const availableQuantity = 8;
  const [isFavorite, setIsFavorite] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  const increaseQuantity = () => {
    if (quantity < availableQuantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      Alert.alert(
        "Limit Reached",
        `You can only rent up to ${availableQuantity} items.`
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleRent = () => {
    if (quantity > 0) {
      Alert.alert("Success", `You've rented ${quantity} tennis racket set(s)`);
    } else {
      Alert.alert("Error", "Quantity must be greater than 0");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? "Removed from Favorites" : "Added to Favorites",
      `You have ${
        isFavorite ? "removed" : "added"
      } this item to your favorites.`
    );
  };

  const renderRelatedItem = ({ item }) => (
    <View style={styles.relatedItem}>
      <Image source={{ uri: item.image }} style={styles.relatedItemImage} />
      <Text style={styles.relatedItemTitle}>{item.title}</Text>
      <Text style={styles.relatedItemPrice}>{item.price}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Equipment Detail</Text>
      <Image
        source={{ uri: "https://via.placeholder.com/400x200" }}
        style={styles.image}
      />
      <Text style={styles.title}>Tennis Racket Set</Text>
      <Text style={styles.location}>📍 Sports Center</Text>
      <Text style={styles.price}>Price: 50,000 VND/h</Text>
      <Text style={styles.rating}>⭐ 4.5 (32 reviews)</Text>
      <Text style={styles.availability}>Available: {availableQuantity}</Text>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={decreaseQuantity}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={increaseQuantity}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>Select Date: {date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowStartTimePicker(true)}
      >
        <Text>Start Time: {startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowEndTimePicker(true)}
      >
        <Text>End Time: {endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onEndTimeChange}
        />
      )}

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
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.relatedItemsHeader}>Related Items</Text>
      <FlatList
        data={relatedItems}
        renderItem={renderRelatedItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    marginBottom: 10,
  },
  availability: {
    fontSize: 16,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
  },
  dateButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  timeButton: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rentButton: {
    backgroundColor: "blue",
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
    backgroundColor: "lightgray",
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
  },
  relatedItemsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  relatedItem: {
    marginRight: 10,
    alignItems: "center",
    paddingBottom: 50,
  },
  relatedItemImage: {
    width: 100,
    height: 100,
  },
  relatedItemTitle: {
    fontSize: 14,
    textAlign: "center",
  },
  relatedItemPrice: {
    fontSize: 12,
    color: "gray",
  },
});

export default EquipmentDetailScreen;
