const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyClm2-3aLhWwPX4XirXC39HEFHhgLyxues",
  authDomain: "sportbooking-ab160.firebaseapp.com",
  projectId: "sportbooking-ab160",
  storageBucket: "sportbooking-ab160.appspot.com",
  messagingSenderId: "430635879239",
  appId: "1:430635879239:web:167ea5038f24893245da62",
  measurementId: "G-2JPVR00F91",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
