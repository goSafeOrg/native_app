// // firebase.js

// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken } from 'firebase/messaging';
// import Constants from 'expo-constants';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAE4aW4uaeczHUsP256KcHUqZ-sfzKSHB0",
//   authDomain: "gosafe-60533.firebaseapp.com",
//   projectId: "gosafe-60533",
//   storageBucket: "gosafe-60533.appspot.com",
// //   messagingSenderId: "YOUR_SENDER_ID",
// //   appId: "YOUR_APP_ID",
// //   measurementId: "YOUR_MEASUREMENT_ID"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firebase Cloud Messaging (for Push Notifications)
// const messaging = getMessaging(app);

// // Function to get the FCM token for notifications
// export const getExpoPushToken = async () => {
//   try {
//     const token = await getToken(messaging, {
//       vapidKey: Constants.manifest.extra.firebaseVapidKey,
//     });
//     return token;
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//   }
// };

// export default firebaseApp;
