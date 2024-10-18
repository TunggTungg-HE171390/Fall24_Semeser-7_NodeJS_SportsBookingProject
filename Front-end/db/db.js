/**
 * Role:
 * 1-Customer
 * 2-Staff
 * 3-Field Owner
 * 4-Admin
 */

export const AccountsData = [
  {
    id: "1",
    account: {
      email: "vinay@example.com",
      password: "1",
    },
    role: 1,
    profile: {
      name: "Vinay Singh",
      phone: "0963101234",
      avatar: require("../assets/images/avatar/avatar.png"),
    },
    status: 1,
  },
  {
    id: "2",
    account: {
      email: "john@example.com",
      password: "1",
    },
    role: 4,
    profile: {
      name: "John Smith",
      phone: "0945678901",
      avatar: require("../assets/images/avatar/avatar-1.png"),
    },
    status: 1,
  },
  {
    id: "3",
    account: {
      email: "bruce@example.com",
      password: "1",
    },
    role: 3,
    profile: {
      name: "Bruce Wayne",
      phone: "0334567890",
      avatar: require("../assets/images/avatar/avatar-2.png"),
    },
    status: 1,
  },
  {
    id: "4",
    account: {
      email: "bob@example.com",
      password: "1",
    },
    role: 2,
    profile: {
      name: "Bob Brown",
      phone: "0445678901",
      avatar: require("../assets/images/avatar/avatar-3.png"),
    },
    status: 1,
  },
  {
    id: "5",
    account: {
      email: "mary@example.com",
      password: "1",
    },
    role: 1,
    profile: {
      name: "Mary Jane",
      phone: "0987654321",
      avatar: require("../assets/images/avatar/avatar-4.png"),
    },
    status: 1,
  },
  {
    id: "6",
    account: {
      email: "samail@example.com",
      password: "1",
    },
    role: 4,
    profile: {
      phone: "0998765432",
      avatar: require("../assets/images/avatar/avatar-5.png"),
      name: "Samail Khan",
    },
    status: 1,
  },
  {
    id: "7",
    account: {
      email: "lucy@example.com",
      password: "1",
    },
    role: 3,
    profile: {
      name: "Lucy White",
      phone: "0112345678",
      avatar: require("../assets/images/avatar/avatar-6.png"),
    },
    status: 1,
  },
  {
    id: "8",
    account: {
      email: "olivia@example.com",
      password: "1",
    },
    role: 2,
    profile: {
      name: "Olivia Johnson",
      phone: "0223456789",
      avatar: require("../assets/images/avatar/avatar-7.png"),
    },
    status: 1,
  },
];
