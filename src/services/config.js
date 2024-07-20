import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDtWseUbsCL6pq-Ct4iVQdaJP89Sw2HLz0",
    authDomain: "seabugdb-5f6f8.firebaseapp.com",
    databaseURL: "https://seabugdb-5f6f8-default-rtdb.firebaseio.com",
    projectId: "seabugdb-5f6f8",
    storageBucket: "seabugdb-5f6f8.appspot.com",
    messagingSenderId: "612151336650",
    appId: "1:612151336650:web:cdc92a48aa877ee7045e33",
    measurementId: "G-81Y45SLCC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const imageDb = getStorage(app);