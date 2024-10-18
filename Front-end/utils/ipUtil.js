import NetInfo from "@react-native-community/netinfo";

export const getIpAddress = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    if (netInfo.type === "wifi" && netInfo.details.ipAddress) {
      console.log(netInfo.details.ipAddress);
      return netInfo.details.ipAddress;
    }
    throw new Error("Unable to get IP address");
  } catch (error) {
    console.error("Error getting IP address:", error);
    return null;
  }
};
