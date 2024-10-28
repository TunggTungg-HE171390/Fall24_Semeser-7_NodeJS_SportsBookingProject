import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker"; // Import DropDownPicker
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
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc"); // Mặc định sắp xếp tăng dần
  const [openFilter, setOpenFilter] = useState(false);
  const [openSport, setOpenSport] = useState(false); // Trạng thái dropdown môn thể thao
  const [openLocation, setOpenLocation] = useState(false); // Trạng thái dropdown địa chỉ

  const navigation = useNavigation();

  // Đảm bảo chỉ một dropdown mở tại một thời điểm
  const closeAllDropdowns = () => {
    setOpenFilter(!openFilter);
    setOpenSport(false);
    setOpenLocation(false);
  };

  // Hàm thay đổi thứ tự sắp xếp giá
  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) =>
      prevSortOrder === "price-asc" ? "price-desc" : "price-asc"
    );
  };

  const filterData = data
    .filter((item) => {
      const matchesSport =
        selectedSport === null || item.sport === selectedSport;
      const matchesLocation =
        selectedLocation === null || item.location === selectedLocation;
      const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
      const matchesSearchQuery =
        searchQuery === "" ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesSport && matchesLocation && matchesPrice && matchesSearchQuery
      );
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      if (sortOrder === "price-desc") return b.price - a.price;
      return 0;
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
        {/* Search bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm theo tên..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // Đóng các dropdown khi tìm kiếm
        />

        {/* Nút sắp xếp theo giá */}
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Text style={styles.sortText}>Giá</Text>
          <Ionicons
            name={
              sortOrder === "price-asc"
                ? "arrow-up-outline"
                : "arrow-down-outline"
            }
            size={16}
            color="gray"
          />
        </TouchableOpacity>

        {/* Nút mở/đóng bộ lọc */}
        <TouchableOpacity onPress={closeAllDropdowns}>
          <Ionicons name="options-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Bộ lọc */}
      {openFilter && (
        <View style={styles.filterContainer}>
          <View style={styles.dropdownRow}>
            {/* Dropdown môn thể thao */}
            <DropDownPicker
              open={openSport}
              value={selectedSport}
              items={[
                { label: "Tất cả", value: null },
                { label: "Tennis", value: "Tennis" },
                { label: "Football", value: "Football" },
                { label: "Badminton", value: "Badminton" },
              ]}
              setOpen={(open) => {
                setOpenSport(open);
              }}
              setValue={setSelectedSport}
              placeholder="Chọn môn thể thao"
              containerStyle={styles.dropdownContainer}
            />

            {/* Dropdown địa chỉ */}
            <DropDownPicker
              open={openLocation}
              value={selectedLocation}
              items={[
                { label: "Tất cả", value: null },
                { label: "Hoa Lac", value: "Hoa Lac" },
                { label: "Cau Giay", value: "Cau Giay" },
              ]}
              setOpen={(open) => {
                setOpenLocation(open);
              }}
              setValue={setSelectedLocation}
              placeholder="Chọn địa chỉ"
              containerStyle={styles.dropdownContainer}
            />
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
        </View>
      )}

      {/* Danh sách sân */}
      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id}
        renderItem={renderField}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<View style={{ height: 10 }} />}
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
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  sortText: {
    fontSize: 14,
    marginRight: 5,
    color: "gray",
  },
  filterContainer: {
    paddingVertical: 10,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
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
