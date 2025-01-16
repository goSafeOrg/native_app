import { View, Text, Image } from 'react-native';
import React from 'react';
import useScreenSize from '@/hooks/useScreenSize';
import { DriverIcon } from '@/utils/constants/images';
import { neutral100, neutral50, neutral600, purple600 } from '@/utils/constants/colors';

interface IUserProps {
  time: string;
  name: string;
  license_id: string;
  image:string;
}

export default function UserCard({ name, time, license_id,image }: IUserProps) {
  const isMobile = useScreenSize();

  return (
    <View style={{ width: isMobile ? 410 : 200  }}>
      <View
        style={{
          flexDirection: isMobile ? 'row' : 'column',
          borderWidth: 1,
          borderRadius: 10,
          height: isMobile ? 120 : 200,
          alignItems: 'center',
          backgroundColor: 'white',
          borderColor: neutral50,
          shadowColor: '#000',          // Shadow color 
          shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
          shadowOpacity: 0.25,          // Shadow opacity for iOS
          shadowRadius: 3.84,           // Shadow radius for iOS
          elevation: 1,                 // Shadow elevation for Android
          padding: 16,                  // Add some padding inside the card
        }}
      >
        <View>
          <Image
            source={{uri:image}}
            style={{
              width: isMobile ? 100 : 80,
              height: isMobile ? 100 : 80,
              borderRadius: 15,
              resizeMode:'cover'
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            marginTop: isMobile ? 0 : 16,
            justifyContent: 'center',
            alignItems: isMobile ? 'flex-start' : 'center', // Adjust alignment based on screen size
            marginLeft: isMobile ? 50 : 0, // Add marginLeft only for mobile
          }}
        >
          <Text style={{ fontSize: 16, color: purple600, margin: 2,marginBottom:4}}>{time}</Text>
          <Text style={{ fontSize: 26 }}>{name}</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{license_id}</Text>
        </View>
      </View>
    </View>
  );
}
