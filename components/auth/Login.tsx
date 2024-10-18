import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signIn } from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBox from '../Input/InputBox';
import PrimaryButton from '../buttons/PrimaryButton';
import DisabledButton from '../buttons/DisabledButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const user = await signIn(email, password);
            console.log('Logged in:', user);
            AsyncStorage.setItem('id',user.id)
            AsyncStorage.setItem('email',user.email!)
            router.replace('/(protected)/home');
        } catch (err: any) {
            setError(err.message);
        }
    };

    // return (
    //     <SafeAreaView>
    //         <View>
    //             <Text>Login</Text>
    //             <InputBox label={''} placeholder={'Email'} value={email} type={''} onChange={setEmail}>
    //             </InputBox>
    //             <InputBox label={''} placeholder={'Password'} value={email} type={'password'} onChange={setPassword}>
    //             </InputBox>
    //             <TextInput
    //                 placeholder="Password"
    //                 value={password}
    //                 secureTextEntry
    //                 onChangeText={setPassword}
    //             />
    //             {error && <Text style={{ color: 'red' }}>{error}</Text>}
    //             <Button title="Login" onPress={handleLogin} />
    //             <View></View>
    //             <TouchableOpacity onPress={() => { router.push('/(public)/signup'); }}>
    //                 <Text>Register</Text>
    //             </TouchableOpacity>
    //         </View>
    //     </SafeAreaView>
    // );

    return (
        <SafeAreaView className="flex-1 ">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-neutral-100"
            showsVerticalScrollIndicator={false}
          >
            {/* <Loader isOpen={loading} /> */}
            {/* <ChangePassword isOpen={firstTimeLogin} onClose={() => {setFirstTimeLogin(false)}} hasClose={true} changePasswordFromLogin={role} />
            <ForgotPassword visible={forgotPasswordOpen} onClose={()=>{setForgotPasswordOpen(false)}} /> */}
            <View className="flex-1 lg:flex lg:flex-row lg:p-16 lg:bg-neutral-50 ">
              <View className="lg:flex lg:w-1/2 lg:p-8 lg:bg-primary-500 lg:rounded-2xl lg:items-center lg:justify-center">
                <View className="p-8 bg-primary-500 rounded-b-3xl lg:rounded-xl">
                  <View className="flex items-center">
                    {/* <Image
                      className="w-40 h-40 lg:w-[50%] lg:h-64 rounded-xl"
                      source={homePage}
                    /> */}
                  </View>
                  <View className="flex items-center justify-center mt-4">
                    <Text className="mt-2 text-lg font-bold text-neutral-100 lg:text-3xl lg:font-extrabold">
                      Welcome to EKSAQ
                    </Text>
                    <Text
                      className="mt-2 font-semibold text-neutral-100 lg:text-xl lg:font-semibold"
                      style={{ textAlign: "center" }}
                    >
                      Experience a dynamic, engaging, and adaptive learning,
                      all-in-one platform for a seamless and interactive educational
                      experience.
                    </Text>
                  </View>
                </View>
              </View>
              <View className="-mt-16 lg:flex lg:items-center lg:justify-center lg:w-1/2 lg:p-32">
                <View className="p-4 pb-20 mt-8 lg:items-center lg:w-full lg:rounded-2xl lg:bg-neutral-50">
                  <View className="justify-center p-6 border rounded-lg bg-neutral-100 border-neutral-600 lg:w-full lg:mt-0 lg:border-0 lg:bg-neutral-50">
                    <View className="flex items-center lg:items-start">
                      {/* <Image source={eksaqLogo} /> */}
                    </View>
                    <Text className="my-2 font-bold lg:text-2xl">
                      Hello! Let's Get Started
                    </Text>
                    <View>
                      <InputBox
                        value={email}
                        placeholder="Enter email"
                        label="Username"
                        onChange={(text) => setEmail(text)}
                        type="text"
                      />
                    </View>
                    <View className="my-2">
                      <InputBox
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        label="Password"
                        onChange={(text) => setPassword(text)}
                      />
                    </View>
                    {/* <TouchableOpacity className="flex items-end" onPress={()=>{setForgotPasswordOpen(true)}} >
                      <Text className="text-primary-800 lg:text-lg lg:font-semibold">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                  <View className="mt-4 lg:w-full">
                    {email && password ? (
                      <PrimaryButton
                        onClick={() => {
                          handleSubmit();
                        }}
                        label="Log In"
                      />
                    ) : (
                      <DisabledButton label="Log In" />
                    )}
                  </View>
                </View>
              </View>
            </View>
            {/* {username && <ClarityWebView userId={username} />} */}
          </ScrollView>
        </SafeAreaView>
      );
};

export default Login;
