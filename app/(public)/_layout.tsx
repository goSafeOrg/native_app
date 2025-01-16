import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <View className={` flex-1 ${Platform.OS==='android'? "mt-12":''}`}>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Signup' />
        </Stack>
        </View>
    )
}