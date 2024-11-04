import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AccountModal from "../components/AccountModal";
import Pagination from "../components/Pagination";
import { useNavigation } from "@react-navigation/native";
import { ROUTER, ROLE_NAME } from "../utils/constant";
import axios from "axios";
import { useSelector } from "react-redux";
const ManageAccount = () => {
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.user?.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 6;
  const [selectedRoles, setSelectedRoles] = useState([]);
  const api = process.env.REACT_APP_IP_Address;
  const fetchAccountsData = async () => {
    try {
      const response = await axios.get(`${api}/user/list-from-admin`);
      // console.log("Account Data: ", response.data);
      const accounts = response.data.reverse();
      setAccounts(accounts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAccountsData();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearchQuery = account.profile.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(account.role);
    return matchesSearchQuery && matchesRole;
  });

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const handleAddOrEditAccount = (accountData) => {
    if (selectedAccount) {
      axios
        .put(`${api}/user/edit-user-from-admin`, accountData)
        .then((res) => {
          Alert.alert("Success", "Edit user successfully!");
          fetchAccountsData();
          setIsModalVisible(false);
          setSelectedAccount(null);
        })
        .catch((error) => {
          console.log(error?.response?.data);
          const errorMessage =
            error.response?.data?.message || "Edit user failed";

          Alert.alert("Error", errorMessage);
        });
    } else {
      axios
        .post(`${api}/auth/sign-up`, accountData)
        .then((res) => {
          Alert.alert(
            "Success",
            "Account added successfully. Password will send to email!"
          );
          fetchAccountsData();
          setIsModalVisible(false);
          setSelectedAccount(null);
        })
        .catch((error) => {
          console.log(error?.response?.data);
          const errorMessage =
            error.response?.data?.message ||
            "Add new account failed, Email exists";

          Alert.alert("Error", errorMessage);
        });
      setCurrentPage(1);
    }
  };

  const handleDeleteAccountConfirm = (accountId) => {
    console.log(`Account ID: ${accountId}`);
    console.log(`User ID: ${userId}`);
    if (accountId === userId) {
      Alert.alert("Warning", "You can't delete yourself!");
    } else {
      axios
        .put(`${api}/user/change-status`, {
          id: accountId,
          status: 2,
        })
        .then((res) => {
          fetchAccountsData();
          Alert.alert("Success", "Delete user successfully!");
        })
        .catch((error) => {
          console.log(error?.response?.data);
          const errorMessage =
            error.response?.data?.message || "Delete user failed";

          Alert.alert("Error", errorMessage);
        });
    }
  };

  const handleDeleteAccount = (accountId) => {
    Alert.alert("Confirm Deletion", "Do you want to delete this account?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          handleDeleteAccountConfirm(accountId);
        },
      },
    ]);
  };

  const renderItem = (item, index) => (
    <View style={styles.card} key={item._id}>
      <Text style={styles.orderText}>
        {index + 1 + (currentPage - 1) * accountsPerPage}
      </Text>
      <Image source={{ uri: item.profile.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.nameText}>{item.profile.name}</Text>
        <Text style={styles.infoText}>
          Role: {ROLE_NAME[item.role] || "Unknown Role"}
        </Text>
      </View>
      <View style={styles.actionCell}>
        <TouchableOpacity
          style={styles.iconButton}
          // onPress={() =>
          //   navigation.navigate(ROUTER.ACCOUNT_DETAIL, { account: item })
          // }
        >
          <AntDesign name="eye" size={20} color="#6a5acd" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setSelectedAccount(item);
            setIsModalVisible(true);
          }}
        >
          <AntDesign name="edit" size={20} color="#7bff00" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleDeleteAccount(item._id)}
        >
          <AntDesign name="delete" size={20} color="#ff8000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const toggleRoleSelection = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <AccountModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedAccount(null);
        }}
        onSubmit={handleAddOrEditAccount}
        data={selectedAccount}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedAccount(null);
            setIsModalVisible(true);
          }}
        >
          <View style={styles.addButtonContent}>
            <AntDesign name="plus" size={18} color="white" />
            <Text style={styles.addButtonText}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <AntDesign
          name="search1"
          size={24}
          color="#B0B0B0"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Account..."
          placeholderTextColor="#B0B0B0"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Multi-select role */}
      <View style={styles.roleSelectionContainer}>
        <Text style={styles.roleSelectionTitle}>Select role:</Text>
        <View style={styles.rolesContainer}>
          {Object.keys(ROLE_NAME).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => toggleRoleSelection(parseInt(key))}
              style={[
                styles.roleButton,
                selectedRoles.includes(parseInt(key)) &&
                  styles.selectedRoleButton,
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRoles.includes(parseInt(key)) &&
                    styles.selectedRoleButtonText,
                ]}
              >
                {ROLE_NAME[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.totalAccountsText}>
        Total Accounts: {filteredAccounts.length}
      </Text>

      {currentAccounts.length > 0 ? (
        <View style={styles.cardContainer}>
          {currentAccounts.map((account, index) => renderItem(account, index))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No Data Found</Text>
      )}

      {filteredAccounts.length > 0 && (
        <Pagination
          dataLength={filteredAccounts.length}
          dataPerPage={accountsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#FD6326",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    letterSpacing: 3,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  roleSelectionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  roleSelectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  roleButton: {
    padding: 8,
    margin: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    flex: 1,
    alignItems: "center", // Aligns items in the center horizontally
    justifyContent: "center", // Aligns items in the center vertically
  },
  selectedRoleButton: {
    backgroundColor: "#6a5acd",
  },
  roleButtonText: {
    color: "#000",
  },
  selectedRoleButtonText: {
    color: "#fff",
  },
  totalAccountsText: {
    fontSize: 16,
  },
  cardContainer: {
    marginTop: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderText: {
    fontSize: 16,
    marginRight: 12,
    color: "#333",
    fontWeight: "bold",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  actionCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 8,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
});

export default ManageAccount;
