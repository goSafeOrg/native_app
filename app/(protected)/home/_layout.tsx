import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, Tabs, router } from 'expo-router'
import { neutral50, purple600 } from '@/utils/constants/colors';
import { Ionicons } from '@expo/vector-icons';
export default function _layout() {
    return (
        <Stack >
            <Stack.Screen options={{ headerShown: false }} name='index' />
            <Stack.Screen options={{
                headerShown: true,
                header: () => (
                    <View style={{ height: 100, backgroundColor: neutral50, justifyContent: 'center',marginTop:48 }}>
                        <View className="flex-row items-center justify-between m-4">
                            <View className='flex flex-row'>

                                <TouchableOpacity onPress={() => { router.back(); }} className='mt-1'>
                                    <Ionicons name="arrow-back" size={24} color={purple600} />
                                </TouchableOpacity>
                                <Text className="ml-3 text-2xl font-bold">Notifications</Text>
                            </View>
                            <View></View>
                            {/* <View>
            <TouchableOpacity onPress={logout}><MaterialIcons name="logout" size={24} color="red" /></TouchableOpacity>
          </View> */}
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
            name='Notifications' />
        </Stack>
    )
}