import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import TabIcon from '@/components/navigation/TabIcon'
import { HistoryTab, HomeTab, MapTab, ProfileTab } from '@/utils/constants/images'
import { neutral50 } from '@/utils/constants/colors'

export default function _layout() {
    return (
       
        <Tabs 
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: "white",
          tabBarStyle: {
            borderBlockColor: neutral50,
            shadowColor: 'black',           // Shadow color
            shadowOffset: { width: 0, height: -5 }, // Adjust height to -5 for shadow at the top
            shadowOpacity: 0.4,             // Shadow opacity
            shadowRadius: 8,                // Spread of the shadow
            elevation: 5,                   // Elevation (for Android shadows)
            backgroundColor: neutral50,
            height: 75,
            position: "relative",
            top: 0,
            paddingTop: 0,
            paddingBottom: 20,
            paddingHorizontal: 20,
          },
        }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    tabBarIcon: ({ focused }) => (
                      <TabIcon
                      focused={focused}
                      name="Home"
                      icon={HomeTab}
                      />
                    ),
                  }}
            />
             <Tabs.Screen
                name='Map'
                options={{
                    tabBarIcon: ({ focused }) => (
                      <TabIcon
                      focused={focused}
                      name="Map"
                      icon={MapTab}
                      />
                    ),
                  }}
                
            />
            <Tabs.Screen
                name='history'
                options={{
                    tabBarIcon: ({ focused }) => (
                      <TabIcon
                      focused={focused}
                      name="History"
                      icon={HistoryTab}
                      />
                    ),
                  }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    tabBarIcon: ({ focused }) => (
                      <TabIcon
                      focused={focused}
                      name="Profile"
                      icon={ProfileTab}
                      />
                    ),
                  }}
            />
        </Tabs>
    )
}