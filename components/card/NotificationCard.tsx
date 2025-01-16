import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { INotification } from '@/app/(protected)/home/Notifications';
import moment from 'moment'; // To calculate time difference
import { p1 } from '@/utils/constants/images';
import { onAcceptRequest, onRejectRequest } from '@/api/notifications';
import { router } from 'expo-router';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/hooks/Socket';


export default function  NotificationCard({ id, name, description, from, date, time, status, image }: INotification) {
  
  const timeAgo = moment(time).fromNow(); // e.g. '5 minutes ago'

  // Use state to manage the status of the notification
  const [tempStatus, setTempStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const socket=socketManager.getSocket()
  const deviceId=socketManager.getDevice()
  useEffect(() => {
    
    
    const rel=()=>{
        
      
    }
    rel()
  }, [tempStatus])
  
  // Function to get status color for Accepted/Rejected
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600'; // Green for accepted
      case 'Rejected':
        return 'text-red-600'; // Red for rejected
      default:
        return 'text-gray-600'; // Gray for pending or default
    }
  };

  const accept = async () => {
    setLoading(true); // Start loading
    try {
      const res = await onAcceptRequest(id); // Call API to accept
      if(socket){
        
        socket.emit('requestStatus',{status:'Accepted',deviceId:deviceId})
      }
      
        setTempStatus('Accepted'); // Update status to Accepted
     
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false); // End loading
    }
  };

  const reject = async () => {
    setLoading(true); // Start loading
    try {
      const res = await onRejectRequest(id); // Call API to reject
   
        setTempStatus('Rejected'); // Update status to Rejected
        
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View className="flex flex-row p-4 mb-4 bg-white rounded-lg shadow-md">
      {/* If image is a URL, use it directly; otherwise, fall back to a default image */}
      <Image
        source={image ? { uri: image } : p1} 
        className="w-12 h-12 mr-4 rounded-full"
        resizeMode="cover"
      />
      <View className="flex flex-1">
        <Text className="mb-2 text-base font-semibold text-gray-800">
          {name} {description} {from}
        </Text>

        {/* Conditionally render buttons or status based on the status value */}
        {tempStatus === 'Pending' ? (
          <View className="flex flex-row space-x-4">
            <TouchableOpacity
              className="px-4 py-2 border rounded-md bg-neutral-100 border-neutral-500"
              onPress={reject}
              disabled={loading} // Disable buttons while loading
            >
              <Text className="font-semibold text-neutral-700">Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-purple-600 rounded-md"
              onPress={accept}
              disabled={loading} // Disable buttons while loading
            >
              <Text className="font-semibold text-white">Accept</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Display the status (Accepted/Rejected) with appropriate color
          <Text className={`font-semibold ${getStatusColor(tempStatus)}`}>
            {tempStatus}
          </Text>
        )}
      </View>
      <View className="ml-4">
        <Text className="text-sm text-gray-500">{timeAgo}</Text>
      </View>
    </View>
  );
}
