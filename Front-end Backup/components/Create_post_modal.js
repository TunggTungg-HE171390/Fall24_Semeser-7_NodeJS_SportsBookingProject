import React from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Pressable, Alert } from 'react-native';
import { X } from 'lucide-react-native';

const CreatePostModal = ({ visible, onClose, onAdd }) => {
  const [newEvent, setNewEvent] = React.useState({ title: '', date: '', location: '', genre: '', image: require('../assets/images/san-nhan-tao.jpg') });

  const handleAddPost = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.genre) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    onAdd(newEvent);
    setNewEvent({ title: '', genre: '', location: '', genre: '', image: require('../assets/images/san-nhan-tao.jpg') });
  };

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
          <Text style={styles.modalTitle}>Add New Event</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={newEvent.date}
              onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={newEvent.location}
              onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              placeholder="Genre"
              value={newEvent.genre}
              onChangeText={(text) => setNewEvent({ ...newEvent, genre: text })}
            />
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleAddPost}
          >
            <Text style={styles.textStyle}>Add Event</Text>
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

export default CreatePostModal;