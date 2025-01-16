import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import InputBox from '@/components/Input/InputBox';
import DisabledButton from '@/components/buttons/DisabledButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { addMember } from '@/api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader/Loader';
import { useIsFocused } from '@react-navigation/native';


export default function AddMember() {
    const [fullname, setFullname] = useState('');
    const [license_id, setLicense_id] = useState('');
    const [dob, setDob] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [image, setImage] = useState<string | null>(null); // For storing selected image
    const [image_base64, setImage_base64] = useState<string | null>(null); // For storing selected image
    const [error, setError] = useState<string | null>(null);
    const [loading, setloading] = useState(false);



    const router = useRouter();

    // Function to pick image from gallery
    const pickImageFromGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'You need to grant camera roll permissions to select an image.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri!);
            setImage_base64(result.assets[0].base64!);
        }
    };

    // Function to take a photo using the camera
    const takePhotoWithCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'You need to grant camera permissions to take a photo.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri!);
            setImage_base64(result.assets[0].base64!);
        }
    };

    const handleSignUp = async () => {
        setloading(true)
        // Validate fields
        if (!fullname || !license_id || !phoneNo || !dob || !image) {
            setError('All fields are required, including the profile picture.');
            return;
        }


        try {

            // Call the addMember function
            const userId = await AsyncStorage.getItem('id');
            const fileName = `${fullname}-${license_id}`; // Create a unique file name
            // const response = await fetch(image);
            // const blob = await response.blob();
            // console.log(blob)
            const result = await addMember(userId!, fullname, phoneNo, license_id, dob, image_base64!, fileName);
            if (result) {
                Alert.alert('Success', result); // Success message from addMember
                // Reset form or navigate as needed
                router.back(); // Navigate back or reset the form here
            }
        } catch (error) {
            setError('An error occurred while adding the member. Please try again.');
            console.error('Error in handleSignUp:', error);
        }
        finally {
            setloading(false)
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <Loader isOpen={loading}></Loader>


                {/* Image Picker Options */}
                <View className="mt-4 ">
                    <Text className="mb-2 text-lg font-bold"></Text>
                    {/* Display the selected image */}
                    <View className="items-center mb-4">
                        {image && (
                            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        )}
                        <View className="flex-row justify-around">
                            <TouchableOpacity onPress={takePhotoWithCamera} className="items-center justify-center p-3 bg-purple-600 rounded-full ">
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImageFromGallery} className="items-center justify-center p-3 bg-purple-600 rounded-full">
                                <Ionicons name="image" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="justify-center flex-1 p-6">
                    {/* Error Message */}
                    {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

                    {/* Full Name Input */}
                    <InputBox label={'Full Name'} placeholder={'John Doe'} value={fullname} type={''} onChange={setFullname} />

                    {/* Phone Number Input */}
                    <InputBox label={'Phone'} placeholder={'1234567890'} value={phoneNo} type={''} onChange={setPhoneNo} />

                    {/* License ID Input */}
                    <InputBox label={'License Id'} placeholder={'TS2021ABJHX1Y'} value={license_id} type={''} onChange={setLicense_id} />

                    {/* Date of Birth Input */}
                    <InputBox label={'Date Of Birth'} placeholder={'DD-MM-YYYY'} value={dob} type={''} onChange={setDob} />

                    {/* Save Button */}
                    <View className="mt-10 mb-4">
                        {fullname && license_id && phoneNo && dob && image ? (
                            <PrimaryButton onClick={handleSignUp} label="SIGN UP" />
                        ) : (
                            <DisabledButton label="Authenticate and Save" />
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
