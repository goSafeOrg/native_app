import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from '@/api/auth'
import LogoutButton from '@/components/buttons/LogoutButton'

export default function index() {
    return (
        <View>
            <LogoutButton label={'Logout'}></LogoutButton>
            <Text>profile</Text>
        </View>
    )
}