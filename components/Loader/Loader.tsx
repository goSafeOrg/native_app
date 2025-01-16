
import { loader } from '@/utils/constants/images'
import {  Image, Modal, StyleSheet, View } from 'react-native'
import React from 'react'

export default function Loader({isOpen}:{isOpen:boolean}) {
  return (
      <Modal visible={isOpen} animationType="fade" transparent={true}>
        <View  style={styles.container} >
            <Image  source={loader} style={styles.image} />
        </View>
      </Modal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    width: 144,
    height: 144, 
  },
});