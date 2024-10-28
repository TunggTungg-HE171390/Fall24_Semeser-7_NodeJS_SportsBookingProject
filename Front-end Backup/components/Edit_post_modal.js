import React from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Pressable, Alert } from 'react-native';
import { X } from 'lucide-react-native';

const EditPostModal = ({ visible, onClose, post, onUpdate }) => {
  // Set initial state based on the post being edited
  const [updatedEvent, setUpdatedEvent] = React.useState(post);

  const handleUpdatePost = () => {
    if (!updatedEvent.title || !updatedEvent.date || !updatedEvent.location || !updatedEvent.genre) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    onUpdate(updatedEvent); // Call the update function passed as a prop
    onClose(); // Close the modal after updating
  };

  React.useEffect(() => {
    if (post) {
      // Reset state when post changes (e.g. when a different post is selected)
      setUpdatedEvent(post);
    }
  }, [post]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Event</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={updatedEvent.title}
              onChangeText={(text) => setUpdatedEvent({ ...updatedEvent, title: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={updatedEvent.date}
              onChangeText={(text) => setUpdatedEvent({ ...updatedEvent, date: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={updatedEvent.location}
              onChangeText={(text) => setUpdatedEvent({ ...updatedEvent, location: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              placeholder="Genre"
              value={updatedEvent.genre}
              onChangeText={(text) => setUpdatedEvent({ ...updatedEvent, genre: text })}
            />
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleUpdatePost}
          >
            <Text style={styles.textStyle}>Update Event</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
    width: '90%', 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: "orange", 
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditPostModal;
