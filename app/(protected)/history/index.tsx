import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Modal,
  Button,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import UserCard from '@/components/card/UserCard';
import SearchBar from '@/components/Input/Search';
import DateTimePicker from '@react-native-community/datetimepicker'; // For date picker
import { monthMapper } from '@/utils/constants/variables';
import { getAcceptedNotifications } from '@/api/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { background } from '@/utils/constants/images';
import { purple600 } from '@/utils/constants/colors';

interface IHistory {
  time: string;
  name: string;
  license_id: string;
  image: string;
}
export default function Index() {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

  const [search, setSearch] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(''); // Start date for filtering (empty initially)
  const [endDateFilter, setEndDateFilter] = useState(''); // End date for filtering (empty initially)

  // Temporary state for modal selection
  const [tempStartDate, setTempStartDate] = useState(today); // Initial start date in the modal
  const [tempEndDate, setTempEndDate] = useState(today); // Initial end date in the modal

  const [showModal, setShowModal] = useState(false); // For modal visibility
  const [showStartPicker, setShowStartPicker] = useState(false); // Start date picker visibility
  const [showEndPicker, setShowEndPicker] = useState(false); // End date picker visibility

  // State to store fetched notifications
  const [users, setUsers] = useState<IHistory[]>([]);

  // Fetch the accepted notifications on component mount

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = await AsyncStorage.getItem('id'); // Replace with actual userId
      const notifications = await getAcceptedNotifications(userId!) as unknown as IHistory[]
      console.log(notifications)

      if (notifications) {
        setUsers(notifications.reverse()!); // Set notifications data as 'users'
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures this runs once on mount

  // Helper function to parse date string
  const parseDate = (dateString: string) => {
    const [dayWithSuffix, month, year, , time] = dateString.split(' ');

    // Remove ordinal suffix (e.g., "1ST" -> "1")
    const day = dayWithSuffix.replace(/\D/g, ''); // Removes non-digit characters

    const formattedDate = `${year}-${monthMapper[month]}-${day}`;

    return new Date(formattedDate);
  };

  // Filter logic for search and date range
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());

    // Parse and filter based on date range if the filter is applied
    const userDate = parseDate(user.time);

    const start = startDateFilter ? new Date(startDateFilter) : null;
    const end = endDateFilter ? new Date(endDateFilter) : null;

    const matchesDateRange =
      (!start || userDate >= start) && (!end || userDate <= end);

    return matchesSearch && matchesDateRange;
  });

  // Handlers for Date Pickers
  const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setTempStartDate(selectedDate.toISOString().split('T')[0]); // Update temp start date with selected date
    }
    setShowStartPicker(false); // Hide picker after selection
  };

  const onEndDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setTempEndDate(selectedDate.toISOString().split('T')[0]); // Update temp end date with selected date
    }
    setShowEndPicker(false); // Hide picker after selection
  };

  // Handle applying the date range
  const applyDateRange = () => {
    setStartDateFilter(tempStartDate);
    setEndDateFilter(tempEndDate);
    setShowModal(false); // Close modal after applying
  };

  return (
                  <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', }}>
    <SafeAreaView className="flex ">

      <ScrollView className='h-full '>
        {/* <TouchableOpacity onPress={()=>router.push('/(protected)/history/test')}><Text>ds</Text></TouchableOpacity> */}
        

        <View className="p-1 px-1">
          {/* Search Input */}
          <SearchBar
            onSearch={(text) => setSearch(text)} // Handle search input
            onFilter={() => setShowModal(true)} // Open filter modal
          />

          {/* Filtered User Cards */}
          <View className="flex flex-col items-center justify-center mt-5">
            {filteredUsers.map((user, index) => (
              <View className="m-2" key={index}>
                <UserCard
                  time={user.time}
                  name={user.name}
                  license_id={user.license_id}
                  image={user.image}
                />
              </View>
            ))}
          </View>

          {/* Modal for Date Filters */}
          <Modal
            transparent={true}
            visible={showModal}
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View
                style={{
                 backgroundColor:'white',
                 
                  borderRadius: 10,
                  width: '80%',
                  paddingBottom:10
                }}
              >
                <View className='flex flex-row justify-center p-3 bg-purple-600 rounded-lg rounded-b-none'>
                  
                <Text className='font-bold text-white text-md'>Select Date Range</Text>
                </View>
                <View className='p-3'>
                  
              
                {/* Start Date Picker */}
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text style={{ marginVertical: 10 }} className='text-lg font-bold '>
                    Start Date: {tempStartDate || 'Select Start Date'}
                  </Text>
                </TouchableOpacity>

                {showStartPicker && (
                  <DateTimePicker
                    value={tempStartDate ? new Date(tempStartDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}

                {/* End Date Picker */}
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Text style={{ marginVertical: 10 }} className='text-lg font-bold '>
                    End Date: {tempEndDate || 'Select End Date'}
                  </Text>
                </TouchableOpacity>

                {showEndPicker && (
                  <DateTimePicker
                    value={tempEndDate ? new Date(tempEndDate) : new Date()}
                    themeVariant="dark"
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                   
                  />
                )}

                {/* Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Button title="Apply" color={purple600} onPress={applyDateRange} />
                  <Button title="Cancel" color={purple600}  onPress={() => setShowModal(false)} />
                </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
      </ImageBackground>
  );
}
