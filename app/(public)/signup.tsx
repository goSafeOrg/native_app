import React, { useState } from 'react';
import { View, TextInput, Alert, Text, SafeAreaView, TouchableOpacity, ScrollView, Platform,Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { signUp } from '@/api/auth';
import { blue300, blue800, primary100 } from '@/utils/constants/colors';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import DisabledButton from '@/components/buttons/DisabledButton';
import InputBox from '@/components/Input/InputBox';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { background } from '@/utils/constants/images';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Helper function to validate email format
export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Helper function to validate phone number format (basic check)
export const isValidPhoneNumber = (phoneNo: string) => {
    return /^\d{10}$/.test(phoneNo); // Checks for a 10-digit phone number
};

export default function Signup() {
    const [fullname, setFullname] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [license_id, setLicense_id] = useState('');
    const [dob, setDob] = useState<Date | undefined>();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setloading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [image, setImage] = useState<string | null>(null); // For storing selected image
    const [image_base64, setImage_base64] = useState<string | null>(null); // For storing selected image

    const router = useRouter();
    // TODO:
    const authenticateCredentials = (license_id: string, dob: Date) => {
        try {
            return true;
        } catch (e) {
            console.log(e);
        }
    };

    const handleSignUp = async () => {
        console.log("init")
        setloading(true)
        if (!isValidEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        if (!isValidPhoneNumber(phoneNo)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await signUp(image_base64!,fullname, deviceId, email, Number(phoneNo), password, license_id, dob);
            if (res) {

                await AsyncStorage.setItem('id', res.user!.id)
                Alert.alert('Success', 'User signed up successfully!');
                setTimeout(() => router.replace('/(protected)/home'), 600);
            }
            else {
                Alert.alert("Error Signing in Please try again")
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setloading(false)
        }
    };

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
    const onChangeDob = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios'); // Keep the picker open on iOS, close on Android
        setDob(currentDate);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', }}>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <Text className="mt-6 ml-6 text-3xl">Sign Up</Text>
                    <View className="justify-center flex-1 p-6">
                        {/* Error Message */}
                        {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}
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
                        {/* Full Name Input */}
                        <InputBox label={'Full Name'} placeholder={'John Doe'} value={fullname} type={''} onChange={setFullname} />

                        {/* Device ID Input */}
                        <InputBox label={'DeviceId'} placeholder={'abx-123'} value={deviceId} type={''} onChange={setDeviceId} />

                        {/* Email Input */}
                        <InputBox label={'Email'} placeholder={'abc@gmail.com'} value={email} type={''} onChange={setEmail} />

                        {/* License Id Input */}
                        <InputBox label={'License Id'} placeholder={'TS10820210002536'} value={license_id} type={''} onChange={setLicense_id} />

                        {/* Phone Number Input */}
                        <InputBox label={'Phone'} placeholder={'1234567890'} value={phoneNo} type={''} onChange={setPhoneNo} />
                        {/* Date of Birth Input */}
                        <View className="mt-4">
                            <Text className="mb-2 text-gray-600">Date of Birth</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    padding: 10,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text>{dob ? dob.toDateString() : 'Select Date'}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dob || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDob}
                                    maximumDate={new Date()} // Disable future dates
                                />
                            )}
                        </View>

                        {/* Password Input */}
                        <InputBox label={'Password'} placeholder={'Your Password'} value={password} type={'password'} onChange={setPassword} />

                        {/* Confirm Password Input */}
                        <InputBox label={'Confirm Password'} placeholder={'Enter Your Password Again'} value={confirmPassword} type={'password'} onChange={setConfirmPassword} />



                        {/* Sign Up Button */}
                        <View className="mt-10 mb-4">
                            {fullname && deviceId && email && phoneNo && password && confirmPassword && dob ? (
                                <PrimaryButton onClick={handleSignUp} label="SIGN UP" />
                            ) : (
                                <DisabledButton label="SIGN UP" />
                            )}
                        </View>

                        {/* Sign In Redirect */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-gray-500">Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.replace('/')}>
                                <Text className="font-semibold text-blue-800">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}
