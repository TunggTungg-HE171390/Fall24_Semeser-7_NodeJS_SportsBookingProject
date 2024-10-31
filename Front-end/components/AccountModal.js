import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { isValidEmail, isValidPhone, isValidField } from "../utils/validation";
import PropTypes from "prop-types";

const AccountModal = ({ visible, onClose, onSubmit, data }) => {
  const isEditMode = !!data;
  const [name, setName] = useState("");
  const [role, setRole] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      setName(data.profile.name);
      setEmail(data.account.email);
      setPhone(data.profile.phone);
      setRole(data.role);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setRole(1);
      setErrors({});
    }
  }, [data, isEditMode, visible]);

  const handleSubmit = () => {
    const newErrors = {};

    if (!isValidField(email)) {
      newErrors.email = "Email is required";
    }

    if (email && !isValidEmail(email)) {
      newErrors.email = "Email must contain @ and .";
    }

    if (phone && !isValidPhone(phone)) {
      newErrors.phone = "Phone number must be 10-11 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accountData = {
      account: {
        email,
        password: "1",
      },
      role,
      profile: {
        name,
        phone,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/sdn302-42d07.appspot.com/o/files%2Favatar.png%202024-10-29%200%3A28%3A22?alt=media&token=ba83b026-e17d-46ed-8682-f5fd0973747a",
      },
    };

    if (isEditMode) {
      const editedAccount = {
        id: data._id,
        name: name,
        phone: phone,
        role: role,
      };
      onSubmit(editedAccount);
    } else {
      const newAccount = accountData;
      onSubmit(newAccount);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>
                {isEditMode ? "Edit Account" : "Add New Account"}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {!isEditMode && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Email <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
              )}

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Role:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={role}
                    style={styles.picker}
                    onValueChange={(itemValue) => setRole(itemValue)}
                  >
                    <Picker.Item label="Customer" value={1} />
                    <Picker.Item label="Field Owner" value={2} />
                    <Picker.Item label="Admin" value={3} />
                  </Picker>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>
                    {isEditMode ? "Save" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {},
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 50,
    justifyContent: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#B0B0B0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#FD6326",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

AccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default AccountModal;
