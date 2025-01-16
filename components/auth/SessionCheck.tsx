import { View, Text } from 'react-native'
import React from 'react'
import Loader from '../Loader/Loader'

export default function SessionCheck() {
  return (
    <View className='bg-yellow-200'>
      <Loader isOpen={true}></Loader>
    </View>
  )
}