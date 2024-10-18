import { neutral100, primary500, primary800 } from '@/utils/constants/colors'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface SecondaryButtonProps{
    label:string
    onClick?:()=>void
}

export default function SecondaryButton({label,onClick}:SecondaryButtonProps) {
  return (
    <TouchableOpacity 
    onPress={onClick} 
    style={{
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderRadius: 24,
        borderColor: primary500,
        backgroundColor:neutral100
    }}
>
    <Text 
        style={{
            textAlign: 'center', 
            color: primary800 ,
            fontSize:12
        }}
    >
        {label}
    </Text>
</TouchableOpacity>

  )
}