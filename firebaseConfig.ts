import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Lấy config từ biến môi trường (được inject qua vite.config.ts)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
// Kiểm tra sơ bộ để tránh lỗi crash trắng trang nếu thiếu config
let app;
let db;
let auth;

try {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_")) {
     console.warn("Firebase Config chưa được thiết lập đúng trong file .env");
  }
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Lỗi khởi tạo Firebase:", error);
}

export { db, auth };