import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

const DetailedPostModal = ({ visible, event, onClose }) => {
  if (!event) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                <X color="#000" size={24} />
            </TouchableOpacity>

          <Image source={event.image} style={styles.eventImage} />
          <Text style={styles.eventTitle}>Title: {event.title}</Text>
          <Text style={styles.eventGenre}>Genre: {event.genre}</Text>
          <Text style={styles.eventDate}>Date: {event.date}</Text>
          <Text style={styles.eventLocation}>Location: {event.location}</Text>

          <TouchableOpacity style={styles.editButton} onPress={onClose}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    position: 'relative',
    paddingTop: 40,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventGenre: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DetailedPostModal;
