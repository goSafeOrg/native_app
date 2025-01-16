import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'


export default function QuickMessage({ message ,send}: { message: string ,send: (message: string) => void }) {
    const [isPressed, setisPressed] = useState(false)
    return (
        <TouchableOpacity onPress={()=>{
            setisPressed(true)
            send(message)
            setTimeout(()=>setisPressed(false),150)
        }}>

            <View className={`w-32 ${ isPressed? "bg-purple-600 border-purple-600 ":"bg-neutral-100 text-black border-neutral-500"} border-2 m-4 p-4 h-16 rounded-lg items-center justify-center`}>
                <Text className={`text-lg font-bold ${isPressed? "text-neutral-100":"text-black"} ` }>{message}</Text>
            </View>
        </TouchableOpacity>
    )
}