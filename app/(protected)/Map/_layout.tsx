import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, Tabs, router } from 'expo-router'
import { neutral50, purple600 } from '@/utils/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { socketManager } from '@/hooks/Socket';

export default function _layout() {
    const socket = socketManager.getSocket();
    const deviceId = socketManager.getDevice();
    const requestLocation = () => {
        // Request location from the server
        if (socket) {
            console.log('requested loc');
            socket.emit('requestLocation', { deviceId: deviceId });
        }
    };
    return (
        //   <View className={` ${Platform.OS === 'android' ? '' : ''}`}>
        <Stack
            screenOptions={{
                headerShown: true,
                header: () => (
                    <View style={{ height: 100, backgroundColor: neutral50, justifyContent: 'center', marginTop: 48 }}>
                        <View className="flex-row items-center justify-between m-4">
                            <View className='flex flex-row'>

                                <TouchableOpacity onPress={() => { router.back(); }} className='mt-1'>
                                    <Ionicons name="arrow-back" size={24} color={purple600} />
                                </TouchableOpacity>
                                <Text className="ml-3 text-2xl font-bold">Maps</Text>
                            </View>
                            <View></View>
                            <TouchableOpacity className='' onPress={requestLocation}><Ionicons name="refresh" size={26} color={purple600} /></TouchableOpacity>
                            
                        </View>
                    </View>
                ),
                headerStyle:
                {

                    backgroundColor: neutral50,

                },
                headerTitle: '', // Remove the title (empty string or null)
                headerTintColor: 'transparent', // If there are any title icons, set them to transparent
                headerShadowVisible: false,


            }}
        >
            <Stack.Screen name="index" />
        </Stack>
        //   </View>
    );
}
