import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { neutral500, neutral700, primary500 } from '@/utils/constants/colors';

interface DisabledButtonProps {
  label: string;
}

export default function DisabledButton({ label }: DisabledButtonProps) {
  return (
    <TouchableOpacity style={{backgroundColor:neutral500,borderRadius:24, padding:12, flex:1, alignItems:'center'}}>
        <Text style={{color:neutral700,fontWeight:'bold'}}>{label}</Text>
    </TouchableOpacity>
  )
}