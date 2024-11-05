import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

export default function FieldAdminDetailScreen({ route }) {
  const { field } = route.params;
  console.log("Field: ", field);
  return (
    <View style={styles.container}>
      <Image source={{ uri: field.image[0] }} style={styles.fieldImage} />
      <Text style={styles.fieldName}>{field.name}</Text>
      <Text style={styles.fieldType}>Loại: {field.type}</Text>
      <Text style={styles.fieldLocation}>Địa điểm: {field.location}</Text>
      <Text style={styles.fieldPrice}>Giá thuê: {field.price} VND/giờ</Text>
      <Text style={styles.fieldRating}>Đánh giá: {field.rating}/5</Text>
      <Text style={styles.totalFields}>Tổng số sân: {field.totalFields}</Text>

      <Text style={styles.reviewTitle}>Đánh giá từ người dùng:</Text>
      <FlatList
        data={field.reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewUser}>{item.user}</Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <Text style={styles.reviewRating}>Đánh giá: {item.rating}/5</Text>
          </View>
        )}
      />
    </View>
    // <>
    //   <Text>Test</Text>
    // </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  fieldImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  fieldName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  fieldType: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  fieldLocation: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  fieldPrice: {
    fontSize: 18,
    color: "#27ae60",
    marginBottom: 10,
  },
  fieldRating: {
    fontSize: 18,
    color: "#f1c40f",
    marginBottom: 10,
  },
  totalFields: {
    fontSize: 18,
    color: "#2c3e50",
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewComment: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  reviewRating: {
    fontSize: 14,
    color: "#f1c40f",
  },
});
