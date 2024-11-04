import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { useSelector } from "react-redux"; // Import useSelector
import { useNavigation } from "@react-navigation/native";

const PRIMARY_COLOR = "#1E90FF"; // Blue color for selected slot
const SECONDARY_COLOR = "#f0f0f0"; // Light grey for unselected slot

// Helper function to format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const FieldDetailScreen = ({ route }) => {
  console.log(route.params);

  const { field } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openSubFieldPicker, setOpenSubFieldPicker] = useState(false);
  const [selectedSubField, setSelectedSubField] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // Track selected slot

  // Get customerId from Redux store
  const customerId = useSelector((state) => state.auth.user.id);

  const navigation = useNavigation();

  // Format date to 'YYYY-MM-DD' for the API
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch available slots when both date and subfield are selected
  useEffect(() => {
    if (selectedDate && selectedSubField) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedSubField]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.0.104:3000/field-order/fields/${field._id}/available-slots`,
        {
          params: {
            date: formatDate(selectedDate),
            subFieldId: selectedSubField,
          },
        }
      );

      console.log(response.data);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      alert("Failed to fetch available slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedSubField || !selectedDate) {
      Alert.alert(
        "Missing Information",
        "Please select a date, subfield, and slot."
      );
      return;
    }

    const bookingData = {
      customerId,
      fieldId: field._id,
      subFieldId: selectedSubField,
      price: field.price,
      slotId: selectedSlot,
      orderDate: selectedDate.toISOString(),
      status: "Pending",
    };

    console.log("bookingData: ", bookingData);

    try {
      const response = await axios.post(
        "http://192.168.0.104:3000/field-order",
        bookingData
      );
      if (response.status === 201) {
        Alert.alert(
          "Booking Successful",
          "Your booking has been successfully placed!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset navigation stack to the same screen to refresh it
                navigation.reset({
                  index: 0,
                  routes: [{ name: "BookingList" }], // Replace with your current screen name
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error making booking:", error);
      Alert.alert(
        "Booking Failed",
        "An error occurred while placing your booking."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Field Information */}
      <Text style={styles.name}>{field.name}</Text>
      <Text style={styles.sportName}>Môn: {field.sportName}</Text>
      <Text style={styles.address}>Địa chỉ: {field.address}</Text>
      <Text style={styles.price}>{field.price.toLocaleString()} VND / Ca</Text>
      <Text style={styles.totalFields}>Tổng số sân: {field.totalFields}</Text>

      {/* Field Images */}
      <FlatList
        data={field.image}
        horizontal
        keyExtractor={(imageUrl, index) => `${imageUrl}-${index}`}
        renderItem={({ item: imageUrl }) => (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
        style={styles.imageGallery}
      />

      {/* Row for Date Picker Button and Subfield Dropdown Picker */}
      <View style={styles.filterRow}>
        {/* Date Picker Button */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {selectedDate ? selectedDate.toDateString() : "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        {/* Display Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
            minimumDate={new Date()} // Disables past dates
          />
        )}

        {/* Subfield Dropdown Picker */}
        <DropDownPicker
          open={openSubFieldPicker}
          value={selectedSubField}
          items={field.subFields.map((subField) => ({
            label: subField.name,
            value: subField._id,
          }))}
          setOpen={setOpenSubFieldPicker}
          setValue={setSelectedSubField}
          placeholder="Chọn sân nhỏ"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          textStyle={{
            color: "#333",
          }}
        />
      </View>

      {/* Available Slots Display */}
      {availableSlots.length > 0 && (
        <View style={styles.availableSlotsContainer}>
          <Text style={styles.sectionTitle}>Thời gian trống</Text>
          <View style={styles.slotButtonContainer}>
            {availableSlots[0].availableSlots.map((timeSlot) => (
              <TouchableOpacity
                key={timeSlot._id}
                style={[
                  styles.slotButton,
                  {
                    backgroundColor:
                      selectedSlot === timeSlot._id
                        ? PRIMARY_COLOR
                        : SECONDARY_COLOR,
                  },
                ]}
                onPress={() => setSelectedSlot(timeSlot._id)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    {
                      color: selectedSlot === timeSlot._id ? "#FFFFFF" : "#333",
                    },
                  ]}
                >
                  {timeSlot.start} - {timeSlot.end}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Book Button */}
      <TouchableOpacity
        style={[
          styles.bookButton,
          { backgroundColor: selectedSlot ? PRIMARY_COLOR : SECONDARY_COLOR },
        ]}
        onPress={handleBooking}
        disabled={!selectedSlot}
      >
        <Text style={styles.bookButtonText}>Đặt sân</Text>
      </TouchableOpacity>
      {/* Feedback Section */}
      <Text style={styles.sectionTitle}>Feedback</Text>
      {field.feedback && field.feedback.length > 0 ? (
        <FlatList
          data={field.feedback}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{item.comment}</Text>
              <Text style={styles.feedbackDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFeedbackText}>No feedback available</Text>
      )}
    </View>
  );
};

export default FieldDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  sportName: {
    fontSize: 16,
    color: "#1E90FF",
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    color: "#E74C3C",
    marginVertical: 6,
  },
  totalFields: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  availableSlotsContainer: {
    marginTop: 16,
  },
  slotButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  slotButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
    alignItems: "center",
  },
  timeSlotText: {
    fontSize: 14,
  },
  bookButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  feedbackContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: "#333",
  },
  feedbackDate: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  noFeedbackText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
