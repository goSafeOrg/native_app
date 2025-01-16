import { socketManager } from '@/hooks/Socket';
import { purple600 } from '@/utils/constants/colors';
import { background } from '@/utils/constants/images';
import React, { useEffect, useState } from 'react';
import { Button, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Index = () => {
  const [location, setLocation] = useState({
    latitude: 0, // Default latitude
    longitude: 0, // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const socket = socketManager.getSocket();
  const deviceId = socketManager.getDevice();

  useEffect(() => {
    // Connect to the Socket.IO server and listen for location updates
    if (socket) {
      requestLocation();
      socket.on('locationDetails', (locationData) => {
        console.log('Location update received:', locationData);
        setLocation({
          ...location,
          latitude: locationData.loc[0],
          longitude: locationData.loc[1],
        });

        socket.on('boom_res', (res) => {
          console.log(res);
        });
      });
    }

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const requestLocation = () => {
    // Request location from the server
    if (socket) {
      console.log('requested loc');
      socket.emit('requestLocation', { deviceId: deviceId });
    }
};

  return (
    <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center' }}>
      <View className="h-full" style={{ flex: 1 }}>
       
        <MapView
          style={{ flex: 1 }}
          region={
            location.latitude === 0 && location.longitude === 0
            ? {
              latitude: 20.5937, // Latitude for India's center
              longitude: 78.9629, // Longitude for India's center
              latitudeDelta: 10.0, // Wider zoom for a whole-country view
              longitudeDelta: 10.0,
            }
            : location
          }
        >
          {location.latitude !== 0 && location.longitude !== 0 ? (
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Current Location"
              description="This is where your device is."
            />
          ) : null}
        </MapView>
      </View>
    </ImageBackground>
  );
};

export default Index;
