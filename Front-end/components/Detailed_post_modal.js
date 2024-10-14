import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const DetailedPostModal = ({ visible, event, onClose }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!event) return null;

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={{ uri: event.image[0] }} style={styles.eventImage} />
          <Text style={styles.eventDescription}>{event.description}</Text>
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.eventDescription}>
              {isDescriptionExpanded
                ? event.description
                : truncateDescription(event.description, 100)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.eventDate}>
            Date: {new Date(event.date).toLocaleDateString()}
          </Text>
          <Text style={styles.eventLocation}>Location: {event.location}</Text>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 18,
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "grey",
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: "grey",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DetailedPostModal;
