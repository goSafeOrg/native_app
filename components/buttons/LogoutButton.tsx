import { error800 } from '@/utils/constants/colors';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
interface logoutButtonProps {
    label: string;
    onPress?: () => void;
  }
export default function LogoutButton({label,onPress}:logoutButtonProps) {
  return (
    <>
    <TouchableOpacity 
        onPress={onPress} 
        style={{
            width: '100%',
            padding: 12,
            borderWidth: 1,
            borderColor: error800,
            borderRadius: 24
        }}
    >
        <Text 
            style={{
                fontWeight: 'bold', 
                textAlign: 'center', 
                color: error800
            }}
        >
            {label}
        </Text>
    </TouchableOpacity>
</>

  )
}
