import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Pagination = ({
  dataLength,
  dataPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(dataLength / dataPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
        style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
      >
        <Text style={styles.pageButtonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageIndicator}>
        Page {currentPage} of {totalPages}
      </Text>
      <TouchableOpacity
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
        style={[
          styles.pageButton,
          currentPage === totalPages && styles.disabledButton,
        ]}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  pageButton: {
    backgroundColor: "#FD6326",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    minWidth: 90,
  },
  pageButtonText: {
    color: "white",
  },
  disabledButton: {
    backgroundColor: "#B0B0B0",
  },
  pageIndicator: {
    fontWeight: "bold",
  },
});

export default Pagination;
