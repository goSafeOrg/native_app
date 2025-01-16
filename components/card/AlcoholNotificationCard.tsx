import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';
import { p1 } from '@/utils/constants/images'; // Default image or placeholder
import { INotification } from '@/app/(protected)/home/Notifications'; // Assuming a similar interface for this type

export default function AlcoholAlertCard({ name, image, date, time ,description}: INotification) {
  
  const timeAgo = moment(time).fromNow(); // e.g., '5 minutes ago'
  
  return (
    <View className="flex flex-row p-4 mb-4 bg-red-100 border border-red-500 rounded-lg shadow-md">
      {/* Display the driver's picture, with a fallback image if none is provided */}
      <Image
        source={image ? { uri: image } : p1}
        className="w-12 h-12 mr-4 border-2 border-red-500 rounded-full"
        resizeMode="cover"
      />
      <View className="flex flex-1">
        <Text className="mb-2 text-base font-semibold text-gray-800">
          {name}
        </Text>
        <Text className="text-lg font-semibold text-red-700">
          High Alcohol Levels Detected - {description}
        </Text>
      </View>
      <View className="ml-4">
        <Text className="text-sm text-gray-500">{timeAgo}</Text>
      </View>
    </View>
  );
}
