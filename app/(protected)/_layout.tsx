import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

export default function _layout() {
    return (
        // <Stack>
        //     <Stack.Screen name='home' />
        // </Stack>
        <Tabs>
            <Tabs.Screen
                name='home'
            />
            <Tabs.Screen
                name='profile'
            />
            <Tabs.Screen
                name='dashboard'
            />
        </Tabs>
    )
}