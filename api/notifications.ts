import { supabase } from "../utils/supabase";

import {  Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ReverseMonthMapper } from '@/utils/constants/variables'; // Assuming you have a month mapper defined

export const getNotifications = async (userId: string) => {
   
    const { data: utilityData, error: utilityError } = await supabase
      .from('utility')
      .select('notifications') 
      .eq('userId', userId);
  
    if (utilityError) {
      console.error('Error fetching notifications from utility table:', utilityError);
      throw utilityError;
    }
  
    if (!utilityData || utilityData.length === 0 || !utilityData[0].notifications) {
      console.error('No notifications found for the user.');
      return [];
    }
  
    const notificationIds = utilityData[0].notifications;
  
  
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .in('id', notificationIds) 
      .order('created_at', { ascending: false }); 
  
    if (notificationsError) {
      console.error('Error fetching notifications from notification table:', notificationsError);
      throw notificationsError;
    }
  
    return notificationsData;
  };
  


  // Function to accept the request
  export const onAcceptRequest = async (id: string) => {
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .update({ status: 'Accepted' })  // Update status to 'Accepted'
      .eq('id', id);  // Match the notification with the provided ID
  
    if (notificationsError) {
      console.error('Error updating notification status to Accepted:', notificationsError);
      throw notificationsError;
    }
  
    return notificationsData;
  };
  
  // Function to reject the request
  export const onRejectRequest = async (id: string) => {
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .update({ status: 'Rejected' })  // Update status to 'Rejected'
      .eq('id', id);  // Match the notification with the provided ID
  
    if (notificationsError) {
      console.error('Error updating notification status to Rejected:', notificationsError);
      throw notificationsError;
    }
  
    return notificationsData;
  };
  

  
  // Helper function to get the ordinal suffix for a day (e.g., "1st", "2nd", "3rd")
  const getOrdinalSuffix = (day: number) => {
      const j = day % 10,
          k = day % 100;
      if (j === 1 && k !== 11) {
          return `${day}ST`;
      }
      if (j === 2 && k !== 12) {
          return `${day}ND`;
      }
      if (j === 3 && k !== 13) {
          return `${day}RD`;
      }
      return `${day}TH`;
  };
  
  // Helper function to format the date and time
  const formatDateTime = (date: Date) => {
      const dayOfWeekNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
      const day = date.getDate();
      const month = ReverseMonthMapper[String(date.getMonth() + 1).padStart(2, '0')];
      console.log(date.getMonth(),month )
      const year = date.getFullYear();
      const dayOfWeek = dayOfWeekNames[date.getDay()]; // Get day of the week name
  
      // Format time in 12-hour format
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  
      // Format the time string with leading zero for minutes
      const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
      // Return the final formatted date string
      return `${getOrdinalSuffix(day)} ${month} ${year} ${dayOfWeek} ${timeString}`;
  };
  
  // Main function to get accepted notifications and format the response
  export const getAcceptedNotifications = async (userId: string) => {
      try {
          // Step 1: Fetch the notification IDs from the 'utility' table
          const { data: utilityData, error: utilityError } = await supabase
              .from('utility')
              .select('notifications')
              .eq('userId', userId)
              .single();
  
          if (utilityError) {
              throw new Error(`Error fetching from utility table: ${utilityError.message}`);
          }
  
          if (!utilityData || !utilityData.notifications) {
              return []; // Return empty if no notifications found
          }
  
          const notificationIds = utilityData.notifications;
  
          // Step 2: Fetch notification details from the 'notifications' table where status is 'accepted'
          const { data: notificationData, error: notificationError } = await supabase
              .from('notifications')
              .select('created_at, name, license_id, image') // Fetching only relevant columns
              .in('id', notificationIds)
              .eq('status', 'Accepted');
  
          if (notificationError) {
              throw new Error(`Error fetching from notifications table: ${notificationError.message}`);
          }
  
          if (!notificationData || notificationData.length === 0) {
              return []; // No accepted notifications found
          }
  
          // Step 3: Format the notification data
          const formattedNotifications = notificationData.map((notification) => {
              const createdAt = new Date(notification.created_at);
              return {
                  time: formatDateTime(createdAt), // Format the created_at timestamp
                  name: notification.name,
                  license_id: notification.license_id,
                  image:notification.image
              };
          });
  
          // Return the formatted notifications
          return formattedNotifications;
      } catch (error) {
          console.error('Error in getAcceptedNotifications function:', error);
          return null; // Return null in case of error
      }
  };
  





//EXPO NOTIFICATONS

export async function setExpoToken(userId:string) {
    if (!userId) {
      throw new Error("Invalid inputs");
    }

 
     let token = await registerForPushNotificationsAsync();
     
  
      // Store the new token in the database
      const { error: tokenData } = await supabase
        .from('Users')
        .update({ expo_token: token?.data })
        .eq("id", userId);
  
      if (tokenData) {
        throw new Error(tokenData.message);
      }
      
    
  }

  export async function removeExpoToken(userId:string) {
    if (!userId) {
      throw new Error("Invalid inputs");
    }
  
      const { error: tokenData } = await supabase
        .from('Users')
        .update({ expo_token: null })
        .eq("userId", userId);
  
      if (tokenData) {
        throw new Error(tokenData.message);
      }
      
    
  }

  export async function getExpoToken(userId:string) {
    if (!userId) {
      throw new Error("Invalid inputs");
    }
  
      // Store the new token in the database
      const { data:tokenData ,error: tokenError } = await supabase
        .from('Users')
        .select('expo_token')
        .eq("userId", userId);
  
      if (tokenError) {
        throw new Error(tokenError.message);
      }
      return tokenData;
    
  }

  export async function registerForPushNotificationsAsync() {
    let token;
    
    // Check if the device is a physical device, as push notifications won't work on emulators
    if (Device.isDevice) {
      // Ask for permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log(status)
      }
  
      // If permission is granted, get the token
      if (finalStatus !== 'granted') {
       
        alert('Failed to get push token for push notifications!');
        return;
      }
  
      // Get the Expo push token
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: "7a72c9e2-4a78-467f-b8b3-092d19331a10",
      }));
      console.log('Expo Push Token:', token);
    } else {
      alert('Must use a physical device for Push Notifications');
    }
  
    // If on Android, configure the notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
     
    }
  
    return token;
  }