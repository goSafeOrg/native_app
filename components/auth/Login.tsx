import React, { useState } from 'react';
import { View, Text, TextInput,Image, TouchableOpacity, SafeAreaView, ScrollView, Switch, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { signIn } from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBox from '../Input/InputBox';
import PrimaryButton from '../buttons/PrimaryButton';
import DisabledButton from '../buttons/DisabledButton';
// Import for icons if using React Native Vector Icons or similar
import { MaterialIcons } from '@expo/vector-icons';
import { blue300, blue800, primary100, purple100, purple200, purple600 } from '@/utils/constants/colors';
import {  setExpoToken } from '@/api/notifications';
import Loader from '../Loader/Loader';
import { background, logo, logo2 } from '@/utils/constants/images';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setloading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setloading(true)
        try {
            const user = await signIn(email, password);
            console.log("hey")
            if(!user){
                alert("Incorrect Username or Password")
            }
            await AsyncStorage.setItem('id', user.id);
            await AsyncStorage.setItem('email', user.email!);
            if (Platform.OS !== "web") setExpoToken(user.id);
            router.replace('/(protected)/home');
        } catch (err: any) {
            alert(err.message)
            setError(err.message);
        }finally{
            setloading(false)
        }
    };

    return (
       
            
       
        <SafeAreaView className="flex-1 " >
             <ImageBackground source={background} style={{ flex: 1,justifyContent: 'center',}}>
         
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <Loader isOpen={loading}></Loader>
                <View className="justify-center flex-1 p-6">
                    {/* Logo */}
                    <View className="flex items-center mb-8">
                        <Image source={logo} className='w-40 h-40'></Image>
                        <Text className="mt-4 text-3xl font-bold text-black">GOSAFE</Text>
                    </View>

                    {/* Email Input */}
                    <InputBox
                        value={email}
                        placeholder="abc@email.com"
                        label="Email"
                        onChange={(text) => setEmail(text)}
                        type="text"
                    />

                    {/* Password Input */}
                    <View className="my-4">
                        <InputBox
                            type="password"
                            value={password}
                            placeholder="Your password"
                            label="Password"
                            onChange={(text) => setPassword(text)}
                        />
                    </View>

                    {/* Remember Me and Forgot Password */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Switch
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                trackColor={{ false: primary100, true: purple100 }}
                                
                                thumbColor={ rememberMe ? purple100 : primary100}
                                
                            />
                            <Text className="ml-2 text-black">Remember Me</Text>
                        </View>
                        <TouchableOpacity onPress={() => console.log("Forgot Password Pressed")}>
                            <Text className="text-purple-600">Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <View className="mb-4">
                        {email && password ? (
                            <PrimaryButton
                                onClick={() => {
                                    handleSubmit();
                                }}
                                label="SIGN IN"
                            />
                        ) : (
                            <DisabledButton label="SIGN IN" />
                        )}
                    </View>

                    {/* OR Divider */}
                    <View className="flex-row items-center justify-center mb-4">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="px-2 text-gray-500">OR</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    {/* Google Login Button */}
                    {/* <TouchableOpacity
                        onPress={() => console.log("Google Login Pressed")}
                        className="flex-row items-center justify-center p-3 bg-white border border-gray-300 rounded-lg"
                    >
                        <MaterialIcons name="google" size={24} color="#4285F4" />
                        <Text className="ml-2 font-medium text-black">Login with Google</Text>
                    </TouchableOpacity> */}

                    {/* Sign Up Text */}
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-gray-500">Don’t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(public)/Signup')}>
                            <Text className="font-semibold text-purple-600">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            </ImageBackground>
        </SafeAreaView>
      
    );
};

export default Login;
