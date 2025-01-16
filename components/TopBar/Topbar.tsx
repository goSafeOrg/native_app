import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { BellIcon, logo, logo2 } from '@/utils/constants/images'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserDevices } from '@/api/user'
import Loader from '../Loader/Loader'


export interface Idevice {
  id: string;
  name: string;
}

export default function Topbar({ Devices, selectedDevice, setSelectedDevice }: { Devices: Idevice[], selectedDevice: Idevice, setSelectedDevice: React.Dispatch<React.SetStateAction<Idevice >> }) {
  const [dropdownVisible, setDropdownVisible] = useState(false); // To toggle dropdown visibility
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true); // For red dot visibility
  // const [selectedDevice, setSelectedDevice] = useState<Idevice>(); // Default to the first device
  const [loading, setloading] = useState(true);


  // useEffect(() => {
  //   const setDevices = async () => {
  //     try {
  //       if (Devices) {
  //         setSelectedDevice(Devices[0]); // Set the first device as selected
  //         AsyncStorage.setItem("device", JSON.stringify(Devices[0]))
  //       }
  //       else {
  //         setDevices()
  //       }
  //     } catch (e) {
  //       console.error('Error fetching devices:', e);
  //     } finally {
  //       setloading(false); // Set loading to false regardless of success or failure
  //     }
  //   };

  //   setDevices(); // Call the function when the component mounts
  // }, [Devices]);



  const handleDeviceSelect = (device: { id: string, name: string }) => {
    setSelectedDevice(device);
    AsyncStorage.setItem("device", JSON.stringify(device))
    setDropdownVisible(false); // Close the dropdown after selection
  }


  return (

    <View className='flex flex-row items-start justify-between bg-purple-400 h-52 h-min-52 rounded-bl-3xl rounded-br-3xl'>
     
      <View className='p-1 mt-20 ml-5 rounded-full bg-neutral-50'>
        <Image className='w-10 h-10 rounded-full ' source={logo}></Image>
      </View>

      <View className='relative flex-col items-center justify-center mt-20'>
        <Text className='font-bold text-white text-md'>Current Device</Text>

        {/* Device Selection - Dropdown */}
        <TouchableOpacity
          onPress={() => setDropdownVisible(!dropdownVisible)}
          className='flex-row items-center'
        >
          {selectedDevice && <Text className='mr-2 text-xl font-bold text-white'>
            {selectedDevice!.name}
          </Text>}
          <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={20} color="white" />
        </TouchableOpacity>

        {/* Dropdown Options */}
        {dropdownVisible && (
          <View className="absolute w-48 bg-purple-700 rounded-lg shadow-lg top-16">
            <FlatList
              data={Devices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-2 border border-b border-purple-300"
                  onPress={() => handleDeviceSelect(item)}
                >
                  <Text className="text-lg font-bold text-white">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Notification Bell with Red Dot */}
      <View className='relative items-center justify-center p-3 mt-20 mr-4 bg-purple-600 rounded-full'>
        <TouchableOpacity onPress={() => router.push("/(protected)/home/Notifications")}>
          <Image style={{ width: 25, height: 25, tintColor: "white" }} source={BellIcon} />
        </TouchableOpacity>

        {/* Red Dot for Unread Notifications */}
        {hasUnreadNotifications && (
          <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </View>
    </View>
  )
}
