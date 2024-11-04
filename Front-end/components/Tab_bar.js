import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const getNavItems = (role) => {
  const commonItems = [{ name: "Profile", icon: "user" }];

  const roleSpecificItems = {
    1: [
      { name: "Explore", icon: "compass" },
      { name: "Booking", icon: "ticket" },
      { name: "Equipment", icon: "list" },
    ],
    2: [
      { name: "Field", icon: "plus" },
      {
        name: "EquipmentStack",
        icon: "list",
      },
    ],
    3: [{ name: "Admin", icon: "dashboard" }],
  };

  return [...(roleSpecificItems[role] || []), ...commonItems];
};

const TabBarComponent = ({ state, descriptors, navigation }) => {
  const role = useSelector((state) => state.auth.user?.role);
  const navItems = getNavItems(role);

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const navItem = navItems.find(
          (item) => item.name.toLowerCase() === route.name.toLowerCase()
        );
        if (!navItem) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <FontAwesome
              name={navItem.icon}
              size={24}
              color={isFocused ? "orange" : "gray"}
            />
            <Text
              style={[styles.text, { color: isFocused ? "orange" : "gray" }]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 5,
  },
});

export default TabBarComponent;
