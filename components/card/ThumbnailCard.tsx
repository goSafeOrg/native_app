
import { neutral500 } from "@/utils/constants/colors";
// import { comingSoonIcon, rcaThumbnail2 } from "@/utils/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";

export default function ThumbnailCard({
  deviceName,
  image,
  deviceId,
}: {
  deviceName: string;
  image?: any;
  deviceId: string;
}) {
 
  return (
    <View 
    className="w-60 ml-4"
      style={{
       
        borderRadius: 16,
        borderWidth: 1,
        borderColor: neutral500,
        height: 250,
        padding: 16,
      }}
    >
      { (
        <>
          <Image
            source={image }
            style={{
              borderRadius: 8,
              resizeMode: "stretch",
              padding: 20,
              width: "100%",
              height: 150,
            }}
          />
          <Text
            style={{
              padding: 4,
              marginTop: 8,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {deviceName}
          </Text>

          <Text
            style={{
              padding: 4,
              marginTop: 8,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {deviceId}
          </Text>

          
        </>
      ) }
    </View>
  );
}
