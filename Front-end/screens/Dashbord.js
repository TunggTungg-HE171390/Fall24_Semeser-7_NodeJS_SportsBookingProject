import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { PieChart, LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
const Dashboard = () => {
  const api = process.env.REACT_APP_IP_Address;
  const [quantity, setQuantity] = useState({});
  const [profit, setProfit] = useState({});
  const fetchAccountsData = async () => {
    try {
      const response = await axios.get(
        `${api}/user/list-from-admin?countRole=count`
      );
      setQuantity(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfitData = async () => {
    try {
      const response = await axios.get(`${api}/field-order/dasboard`);
      // console.log(`Data: `, response.data);
      setProfit(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   fetchAccountsData();
  // }, []);
  useEffect(() => {
    fetchAccountsData();
    fetchProfitData();
  }, []);
  const [selectedYear, setSelectedYear] = useState("2024");

  const years = ["2022", "2023", "2024", "2025"];

  // Dữ liệu cho PieChart
  const pieData = [
    {
      name: "Recuring",
      population: 1800,
      color: "#6a5acd",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Transact",
      population: 2900,
      color: "#2ecc71",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  // Dữ liệu cho LineChart (doanh thu hàng tháng)
  const monthlyRevenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [
          3000, 4500, 5000, 7000, 8000, 11000, 13000, 12000, 10000, 9000, 8000,
        ],
      },
    ],
  };

  // Dữ liệu cho danh sách field owner có doanh thu cao nhất

  return (
    <ScrollView style={styles.container}>
      {/* Card cho Monthly Recurring Revenue */}
      {/* <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>MONTHLY RECURING REVENUE</Text>
          <FontAwesome5 name="dollar-sign" size={24} color="#6a5acd" />
        </View>
        <Text style={styles.cardValue}>$15k</Text>
        <Text style={styles.cardChangePositive}>↑ 12% Since last month</Text>
      </View> */}

      {/* Card cho Total Profit */}
      {/* <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL PROFIT</Text>
          <FontAwesome5 name="file-invoice-dollar" size={24} color="#6a5acd" />
        </View>
        <Text style={styles.cardValue}>$24k</Text>
        <Text style={styles.cardChangeNegative}>↓ 16% Since last month</Text>
      </View> */}

      {/* Card cho Total Field Owners */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL FIELD OWNERS</Text>
          <MaterialIcons name="group" size={24} color="#2ecc71" />
        </View>
        <Text style={styles.cardValue}>{quantity?.fieldOwner}</Text>
      </View>

      {/* Card cho Total Customers */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL CUSTOMERS</Text>
          <MaterialIcons name="list" size={24} color="#f39c12" />
        </View>
        <Text style={styles.cardValue}>{quantity?.customer}</Text>
      </View>

      {/* <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Traffic Source</Text>
        <PieChart
          data={pieData}
          width={340}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View> */}

      {/* Biểu đồ Line cho Monthly Revenue */}
      {/* <View style={styles.chartCard}>
        <View style={styles.monthlyRevenueContainer}>
          <Text style={styles.sectionTitle}>Monthly Revenue</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              {years.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>
        <LineChart
          data={monthlyRevenueData}
          width={340} // Hoặc thay đổi theo ý muốn
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
          }}
          bezier
        />
      </View> */}

      {/* Bảng hiển thị 5 field owner có doanh thu cao nhất */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Top Field Owners by Revenue</Text>
        {profit?.result?.map((item) => (
          <View style={styles.row} key={item.ownerName}>
            <Text style={styles.rowText}>{item.ownerName}</Text>
            <Text style={styles.rowText}>${item.totalAmount} VND</Text>
          </View>
        ))}
        <Text style={styles.earn}>We earn:{profit.threePercentOfTotal}VND</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  earn: {
    marginTop: 15,
    alignSelf: "flex-end",
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: "bold",
    color: "#7f8c8d",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cardChangePositive: {
    fontSize: 14,
    color: "#27ae60",
  },
  cardChangeNegative: {
    fontSize: 14,
    color: "#e74c3c",
  },
  chartCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  monthlyRevenueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#7f8c8d",
    borderRadius: 5,
    overflow: "hidden",
    marginLeft: 20,
  },
  picker: {
    height: 20,
    width: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowText: {
    fontSize: 14,
  },
});

export default Dashboard;
