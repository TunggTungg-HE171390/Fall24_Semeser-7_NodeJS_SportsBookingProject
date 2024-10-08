import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";

const Dashboard = () => {
  const pieData = [
    {
      name: "Desktop",
      population: 63,
      color: "#6a5acd",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Tablet",
      population: 15,
      color: "#f39c12",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Phone",
      population: 22,
      color: "#2ecc71",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>MONTHLY RECURING REVENUE</Text>
          <FontAwesome5 name="dollar-sign" size={24} color="#6a5acd" />
        </View>
        <Text style={styles.cardValue}>$15k</Text>
        <Text style={styles.cardChangePositive}>↑ 12% Since last month</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL PROFIT</Text>
          <FontAwesome5 name="file-invoice-dollar" size={24} color="#6a5acd" />
        </View>
        <Text style={styles.cardValue}>$24k</Text>
        <Text style={styles.cardChangeNegative}>↓ 16% Since last month</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL FIELD OWNERS</Text>
          <MaterialIcons name="group" size={24} color="#2ecc71" />
        </View>
        <Text style={styles.cardValue}>30</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL CUSTOMERS</Text>
          <MaterialIcons name="list" size={24} color="#f39c12" />
        </View>
        <Text style={styles.cardValue}>1.6K</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Traffic source</Text>
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieData}
            width={300}
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
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pieChartContainer: {},
  pieLabels: {
    marginTop: 20,
  },
  pieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pieLabelItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default Dashboard;
