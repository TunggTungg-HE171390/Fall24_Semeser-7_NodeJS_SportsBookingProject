import React, { useState } from "react";
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
import { ROUTER, ROLE_NAME } from "../utils/contant";
import { AccountsData } from "../db/db";

const ManageAccount = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState(AccountsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 6;
  const [selectedRoles, setSelectedRoles] = useState([]);

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
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === accountData.id ? accountData : account
        )
      );
    } else {
      setAccounts((prevAccounts) => [accountData, ...prevAccounts]);
      setCurrentPage(1);
    }
  };

  const handleDeleteAccountConfirm = (prevAccounts, accountId) => {
    const updatedAccounts = prevAccounts.filter(
      (account) => account.id !== accountId
    );
    return updatedAccounts;
  };

  const handleDeleteAccount = (accountId) => {
    Alert.alert(
      "Confirm Deletion",
      "Do you want to delete this account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setAccounts((prevAccounts) => {
              const updatedAccounts = handleDeleteAccountConfirm(
                prevAccounts,
                accountId
              );
              const newTotalPages = Math.ceil(
                updatedAccounts.length / accountsPerPage
              );
              if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
              }
              return updatedAccounts;
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = (item, index) => (
    <View style={styles.card} key={item.id}>
      <Text style={styles.orderText}>
        {index + 1 + (currentPage - 1) * accountsPerPage}
      </Text>
      <Image source={item.profile.avatar} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.nameText}>{item.profile.name}</Text>
        <Text style={styles.infoText}>
          Role: {ROLE_NAME[item.role] || "Unknown Role"}
        </Text>
      </View>
      <View style={styles.actionCell}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate(ROUTER.ACCOUNT_DETAIL, { account: item })
          }
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
          onPress={() => handleDeleteAccount(item.id)}
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

      {/* Multi-select Roles */}
      <View style={styles.roleSelectionContainer}>
        <Text style={styles.roleSelectionTitle}>Select Roles:</Text>
        <View style={styles.rolesContainer}>
          {Object.keys(ROLE_NAME).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => toggleRoleSelection(key)}
              style={[
                styles.roleButton,
                selectedRoles.includes(key) && styles.selectedRoleButton,
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRoles.includes(key) && styles.selectedRoleButtonText,
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
