import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

const data = [
  {
    id: "1",
    name: "Sân Tennis",
    sport: "Tennis",
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
    sport: "Football",
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
    sport: "Badminton",
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

const BookingScreen = () => {
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigation = useNavigation();

  const handleSportChange = (itemValue) => {
    setSelectedSport(itemValue);
  };

  const handleLocationChange = (itemValue) => {
    setSelectedLocation(itemValue);
  };

  const filterData = data.filter((item) => {
    const matchesSport = selectedSport === "" || item.sport === selectedSport;
    const matchesLocation =
      selectedLocation === "" || item.location === selectedLocation;
    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
    const matchesSearchQuery =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSport && matchesLocation && matchesPrice && matchesSearchQuery
    );
  });

  const renderField = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("FieldDetail", { field: item })}
    >
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              {item.price.toLocaleString()} VND/h
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="gray" />
              <Text style={styles.location}>{item.location}</Text>
            </View>
            <Text style={styles.rating}>Đánh giá: {item.rating} ★</Text>
            <Text style={styles.totalFields}>
              Tổng số sân: {item.totalFields}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.searchFilterContainer}>
        {/* Search bar và nút mở/đóng bộ lọc */}
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm theo tên..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Bộ lọc ẩn/hiện */}
      {showFilters && (
        <ScrollView contentContainerStyle={styles.filterContainer}>
          <View style={styles.pickerContainer}>
            {/* Sport Picker */}
            <Picker
              selectedValue={selectedSport}
              style={styles.picker}
              onValueChange={handleSportChange}
            >
              <Picker.Item label="All Sports" value="" />
              <Picker.Item label="Tennis" value="Tennis" />
              <Picker.Item label="Football" value="Football" />
              <Picker.Item label="Badminton" value="Badminton" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            {/* Location Picker */}
            <Picker
              selectedValue={selectedLocation}
              style={styles.picker}
              onValueChange={handleLocationChange}
            >
              <Picker.Item label="All Locations" value="" />
              <Picker.Item label="Hoa Lac" value="Hoa Lac" />
              <Picker.Item label="Cau Giay" value="Cau Giay" />
            </Picker>
          </View>

          {/* Price range filter */}
          <View style={styles.priceFilterContainer}>
            <Text>Giá từ: {minPrice.toLocaleString()} VND</Text>
            <Slider
              style={styles.slider}
              minimumValue={50000}
              maximumValue={300000}
              step={10000}
              value={minPrice}
              onValueChange={(value) => setMinPrice(value)}
              minimumTrackTintColor="#1EB1FC"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1EB1FC"
            />
            <Text>Giá đến: {maxPrice.toLocaleString()} VND</Text>
            <Slider
              style={styles.slider}
              minimumValue={50000}
              maximumValue={300000}
              step={10000}
              value={maxPrice}
              onValueChange={(value) => setMaxPrice(value)}
              minimumTrackTintColor="#1EB1FC"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1EB1FC"
            />
          </View>
        </ScrollView>
      )}

      {/* Danh sách sân */}
      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id}
        renderItem={renderField}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<View style={{ height: 10 }} />} // Thêm khoảng cách trên cùng
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  filterContainer: {
    paddingVertical: 10,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  priceFilterContainer: {
    marginVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    resizeMode: "cover",
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: "#28a745",
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  location: {
    marginLeft: 5,
    fontSize: 14,
    color: "gray",
  },
  rating: {
    fontSize: 12,
    color: "#f39c12",
    marginBottom: 5,
  },
  totalFields: {
    fontSize: 12,
    color: "#3498db",
  },
});

export default BookingScreen;
