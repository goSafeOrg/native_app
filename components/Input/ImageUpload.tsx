import { neutral500 } from "@/utils/constants/colors";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import SecondaryButton from "../buttons/SecondaryButton";

interface ImageUploadProps {
  setBlob: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  imageUrl?:string
}

export default function ImageUpload({ setBlob, label,imageUrl }: ImageUploadProps) {
  const [image, setImage] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web" && Constants.platform) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraRollStatus.status !== "granted") {
          alert("Sorry, we need permission to make this work!");
        }
      }
    })();
  }, [isFocused]);

  useEffect(()=>{
    if(imageUrl) {
      setImage(imageUrl);
    }
  },[imageUrl])

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const a = document.getElementById("fileInput");
      if (a) a.click();
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    try {
      if (pickerResult.canceled) {
        alert("Upload cancelled");
        return;
      } else {
        const imgUri = pickerResult.assets[0].uri;
        const imgBase64 = pickerResult.assets[0].base64;
        if (!imgUri) {
          alert("Please try again");
          return;
        }
        setImage(imgUri);
        if (!imgBase64) {
          alert("Please try again");
          return;
        }
        setBlob(imgBase64);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed");
    }
  };

  const handleWebImagePicked = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        setBlob(base64Data);
        const imgUri = URL.createObjectURL(file);
        setImage(imgUri);
      };
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 18, marginVertical: 8 }}>{label}</Text>
      <View
        style={{
          borderWidth: 4,
          borderStyle: "dashed",
          borderColor: neutral500,
          padding: 20,
          borderRadius: 20,
        }}
      >
        {!image && (
          <View style={{alignItems:'center'}}>
            <View style={{ width: "40%" }}>
              <SecondaryButton label="Browse Files" onClick={pickImage} />
            </View>

            {Platform.OS === "web" && (
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleWebImagePicked}
              />
            )}
          </View>
        )}
        {image && (
          <View
            style={{
              flex: 1,
              gap: 8,
              justifyContent: "space-between",
              flexDirection: "row-reverse",
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  setImage("");
                  setBlob("");
                }}
              >
                <Text style={{ fontSize: 20 }}>x</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: 200,
                resizeMode: "contain",
                marginTop: 20,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
