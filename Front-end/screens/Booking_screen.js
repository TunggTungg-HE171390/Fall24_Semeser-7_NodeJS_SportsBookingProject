import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const BookingScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [selectedSport, setSelectedSport] = useState(null); // Sport filter
  const [openSport, setOpenSport] = useState(false); // State for DropDownPicker

  // Fetch data from API
  const fetchFields = async (newPage = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.70:3000/field`, {
        params: {
          page: newPage,
          limit: 2,
          searchQuery,
          sortOrder,
          sportName: selectedSport,
        },
      });
      console.log("Response:", response.data);

      const { data: fields, currentPage, totalPages } = response.data;

      if (newPage === 1) {
        setData(fields); // Reset data on new search
      } else {
        setData((prevData) => [...prevData, ...fields]);
      }

      setPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when searchQuery, sortOrder, or selectedSport changes
  useEffect(() => {
    fetchFields();
  }, [searchQuery, sortOrder, selectedSport]);

  // Load more data when reaching the end of the list
  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      fetchFields(page + 1);
    }
  };

  const renderField = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("FieldDetail", { field: item })}
      style={styles.card}
    >
      <Image source={{ uri: item.image[0] }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sportName}>Môn: {item.sportName}</Text>
        <Text style={styles.address}>Địa chỉ: {item.address}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} VND / Ca</Text>
        <Text style={styles.totalFields}>Tổng số sân: {item.totalFields}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.filterRow}>
        {/* Search bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm sân..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        {/* Sort by price button */}
        <TouchableOpacity
          onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          style={styles.sortButton}
        >
          <Text style={styles.sortText}>Giá</Text>
          <Ionicons
            name={
              sortOrder === "asc" ? "arrow-up-outline" : "arrow-down-outline"
            }
            size={16}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Sport filter dropdown */}
      <DropDownPicker
        open={openSport}
        value={selectedSport}
        items={[
          { label: "Tất cả", value: null },
          { label: "Football", value: "Football" },
          { label: "Volleyball", value: "Volleyball" },
          { label: "Badminton", value: "Badminton" },
          { label: "Tennis", value: "Tennis" },
        ]}
        setOpen={setOpenSport}
        setValue={setSelectedSport}
        placeholder="Chọn môn thể thao"
        containerStyle={styles.dropdownContainer}
      />

      {/* Field list */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderField}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && <ActivityIndicator size="large" color="#0000ff" />
        }
      />
    </View>
  );
};

export default BookingScreen;

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Shadow for Android
  },
  searchBar: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#ffffff",
    fontSize: 14,
    marginRight: 10,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sortText: {
    fontSize: 14,
    color: "#333",
    marginRight: 4,
  },

  list: {
    marginTop: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  sportName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E90FF",
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E74C3C",
    marginVertical: 6,
  },
  totalFields: {
    fontSize: 12,
    color: "#777777",
    marginTop: 4,
  },
};
