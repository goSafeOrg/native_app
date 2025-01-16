import useScreenSize from "@/hooks/useScreenSize";
import { neutral700, primary500, purple200, purple600 } from "@/utils/constants/colors";
import { Image, ImageSourcePropType, Platform, Text, View } from "react-native";

export default function TabIcon({
  focused,
  icon,
  name,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  name: string;
}) {
  const isMobile = useScreenSize();
  return (
    <View
      style={{ alignItems: "center", gap: 4, marginBottom: Platform.OS==='web' ? 0 : 10 }}
    >
      {isMobile && (
        <View
          style={{
            borderBottomWidth: focused ? 5 : 0,
            width: 65,
            borderBlockColor: purple600,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            marginBottom: 6,
            marginTop:0
          }}
        >
          <Text></Text>
        </View>
      )}
      {isMobile && (
        <Image
          source={icon}
          style={{ width: 30, height: 30, tintColor:focused ? purple600 : neutral700 }}
        />
      )}
      <View style={{ flexDirection: "row" }}>
      <Text
        numberOfLines={ 2}
        style={{
          flex: 1,
          textAlign:'center',
          fontSize: isMobile ? 13 : 18,
          color:focused ? purple600 : neutral700
        }}
      >
        {name}
      </Text>
      </View>
      {!isMobile && (
        <View
          style={{
            borderBottomWidth: focused ? 5 : 0,
            width: 65,
            borderBlockColor: purple600,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            marginTop: 10,
          }}
        >
          <Text></Text>
        </View>
      )}
    </View>
  );
}
