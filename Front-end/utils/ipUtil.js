import * as Network from "expo-network";
export const getIpAddress = async () => {
  try {
    const ip = await Network.getIpAddressAsync();
    console.log(`IP Address: ${ip}`);
    return ip;
  } catch (error) {
    console.log(error);
  }
};
