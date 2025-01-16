// import { View, Text, SafeAreaView, ScrollView, Image, FlatList } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import NotificationCard from '@/components/card/NotificationCard';
// import { Nonotification } from '@/utils/constants/images';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Loader from '@/components/Loader/Loader';
// import { getNotifications } from '@/api/notifications';
// import { useIsFocused } from '@react-navigation/native';
// import AlcoholAlertCard from '@/components/card/AlcoholNotificationCard';


// export interface INotification {
//     id: string;
//     name: string;
//     date: string;
//     time: string;
//     status: string;
//     image:string
//     description:string;
//     from:string;
// }

// export default function Notifications() {
//     const [notifications, setNotifications] = useState<INotification[]>();
//     const [loading, setLoading] = useState(true);
//     const isFocused=useIsFocused()


//     useEffect(() => {
//         // Fetch notifications from the database
//         const fetchNotifications = async () => {
//             try {
//                 const userId = await AsyncStorage.getItem('id'); // Get user ID from storage
//                 if (userId) {
//                     const fetchedNotifications = await getNotifications(userId);
                    
//                     // Map the fetched notifications to match the INotification interface
//                     const formattedNotifications = fetchedNotifications.map((notification: any) => ({
//                         id: notification.id,
//                         name: notification.name,
//                         date: notification.created_at.split('T')[0], 
//                         time: notification.created_at, 
//                         status: notification.status || 'Pending',
//                         image:notification.image,
//                         from:notification.from,
//                         description:notification.description
//                     }));
                    
//                     setNotifications(formattedNotifications);
//                 }
//             } catch (error) {
//                 console.error('Error fetching notifications:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchNotifications();
//     }, [isFocused]);

//     // Empty state image display when no notifications
//     const EmptyNotifications = () => (
//         <View className="items-center justify-center flex-1 mt-20">
//             <Image source={Nonotification} className="mb-5 w-60 h-60" />
//             <Text className="text-lg font-semibold text-gray-600">No Notifications Yet!</Text>
//         </View>
//     );

//     return (
//         <SafeAreaView className="h-full bg-neutral-50">
//             <ScrollView>
//                 <Loader isOpen={loading}></Loader>
//                 <View>
                    
//                     {/* <TouchableOpacity onPress={()=>router.push('/(protected)/history/test')}><Text>rumn</Text></TouchableOpacity> */}
//                     <View className="p-4">
//                         { notifications&& notifications.length > 0 ? (
//                             notifications.map((notification) => (
//                                 <View>
                                    
                            
//                                 <NotificationCard
//                                 image={notification.image}
//                                     key={notification.id}
//                                     id={notification.id}
//                                     name={notification.name}
//                                     date={notification.date}
//                                     time={notification.time}
//                                     status={notification.status}
//                                     description={notification.description}
//                                     from={notification.from}
                                    
//                                 />
//                                 <AlcoholAlertCard id={notification.id} name={notification.name} date={notification.date} time={notification.time} status={''} image={notification.image} description={'95mg'} from={notification.from}></AlcoholAlertCard>
//                                 </View>
//                             ))
//                         ) : (
//                             <EmptyNotifications />
//                         )}
//                     </View>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import NotificationCard from '@/components/card/NotificationCard';
import AlcoholAlertCard from '@/components/card/AlcoholNotificationCard';
import { Nonotification } from '@/utils/constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader/Loader';
import { getNotifications } from '@/api/notifications';
import { useIsFocused } from '@react-navigation/native';

export interface INotification {
    id: string;
    name: string;
    date: string;
    time: string;
    status: string;
    image: string;
    description: string;
    from: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<INotification[]>();
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('All'); // Tab state: 'All', 'Approvals', or 'Violations'
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = await AsyncStorage.getItem('id');
                if (userId) {
                    const fetchedNotifications = await getNotifications(userId);
                    const formattedNotifications = fetchedNotifications.map((notification: any) => ({
                        id: notification.id,
                        name: notification.name,
                        date: notification.created_at.split('T')[0],
                        time: notification.created_at,
                        status: notification.status || 'Pending',
                        image: notification.image,
                        from: notification.from,
                        description: notification.description
                    }));
                    setNotifications(formattedNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [isFocused]);

    // Filter notifications based on current tab
    const filteredNotifications = notifications?.filter((notification) => {
        if (currentTab === 'All') return true;
        if (currentTab === 'Approvals') return notification.status && notification.status !== 'Alcohol';
        if (currentTab === 'Violations') return !notification.status || notification.status === 'Alcohol';
        return true;
    });

    const EmptyNotifications = () => (
        <View className="items-center justify-center flex-1 mt-20">
            <Image source={Nonotification} className="mb-5 w-60 h-60" />
            <Text className="text-lg font-semibold text-gray-600">No Notifications Yet!</Text>
        </View>
    );

    return (
        <SafeAreaView className="h-full bg-neutral-50">
            <ScrollView>
                <Loader isOpen={loading}></Loader>
                <View>
                    {/* Tab Selection */}
                    <View className="flex flex-row justify-around py-4 bg-white shadow-md">
                        {['All', 'Approvals', 'Violations'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setCurrentTab(tab)}
                                className={`px-4 py-2 ${currentTab === tab ? 'border-b-2 border-purple-600' : ''}`}
                            >
                                <Text className={`text-lg font-semibold ${currentTab === tab ? 'text-purple-600' : 'text-gray-600'}`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Notifications Content */}
                    <View className="p-4">
                        {filteredNotifications && filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <View key={notification.id}>
                                    {notification.status==="Alcohol" ?
                                   
                                        <AlcoholAlertCard
                                        id={notification.id}
                                        name={notification.name}
                                        date={notification.date}
                                        time={notification.time}
                                        status={''}
                                        image={notification.image}
                                        description={notification.description}
                                        from={notification.from}
                                    />:
                                    <NotificationCard
                                    image={notification.image}
                                    id={notification.id}
                                    name={notification.name}
                                    date={notification.date}
                                    time={notification.time}
                                    status={notification.status}
                                    description={notification.description}
                                    from={notification.from}
                                    />

}
                                    {/* Display AlcoholAlertCard only for Violations */}
                                    {currentTab === 'Violations' && notification.status=='Alcohol' && (
                                        <AlcoholAlertCard
                                            id={notification.id}
                                            name={notification.name}
                                            date={notification.date}
                                            time={notification.time}
                                            status={''}
                                            image={notification.image}
                                            description={notification.description}
                                            from={notification.from}
                                        />
                                    )}
                                </View>
                            ))
                        ) : (
                            <EmptyNotifications />
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

