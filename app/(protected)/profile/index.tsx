import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Image, TouchableOpacity, Text, ScrollView, Modal, Platform, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import { DriverIcon, HistoryTab, Person, background, loader, p1, p2, p3, phone, women } from '@/utils/constants/images';
import { purple600 } from '@/utils/constants/colors';
import { router } from 'expo-router';
import useLogout from '@/hooks/useLogout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, getMembers } from '@/api/user';
import InputBox from '@/components/Input/InputBox';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Loader from '@/components/Loader/Loader';
import { useIsFocused } from '@react-navigation/native';

// Interface for Family Member
export interface IMember {
    id: string;
    name: string;
    phone_no: string;
    license_id: string;
    image: string;
    dob: string;
}

// Interface for editFields to allow dynamic indexing
interface IEditFields {
    [key: string]: {
        name: boolean;
        phone_no: boolean;
        license_id: boolean;
    };
}

export default function Index() {
    const [family, setFamily] = useState<IMember[]>([]);
    const [user, setUser] = useState<IMember>();
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused()

    useEffect(() => {
        const fetchProfileAndFamily = async () => {
            try {
                const userId = await AsyncStorage.getItem("id");
                if (userId) {
                    const userProfile = await getUserProfile(userId) as IMember;
                    const familyMembers = await getMembers(userId) as unknown as IMember[]
                    console.log(familyMembers)
                    setUser(userProfile);
                    setFamily(familyMembers); // Update the family state with fetched members
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndFamily();
    }, [isFocused]);

    // State to track which family member is selected
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [modal, setModal] = useState(false);


    // State to track which fields are editable per member
    const [editFields, setEditFields] = useState<IEditFields>({});

    // Toggle edit mode for the specified field and member
    // const toggleEditField = (memberId: string, field: keyof IMember) => {
    //     setEditFields((prev) => ({
    //         ...prev,
    //         [memberId]: { ...prev[memberId], [field]: !prev[memberId][field] },
    //     }));
    // };

    return (
        <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', }}>
            <SafeAreaView className={`flex-1  `}>
                <ScrollView className=''>
                    <Loader isOpen={loading}></Loader>


                    <View className="flex flex-col justify-around">
                        <View className="w-full bg-neutral-50 h-80">
                            {user?.image ?
                                <Image source={{ uri: user?.image }} className="w-full h-80" /> :
                                <Loader isOpen={true}></Loader>
                            }

                        </View>
                        <View className="p-4 bg-white w-80">
                            <Text className="mt-2 text-4xl font-bold">{user?.name}</Text>
                            <Text className="mt-1 text-xl">AXCD-12343DFTGHHT</Text>
                            <View className="flex flex-row">
                                <View className="flex flex-row items-center justify-center">
                                    <Image className="mt-1" style={{ tintColor: purple600 }} source={HistoryTab} />
                                    <Text className="mt-2 mr-4 text-md">{user?.dob}</Text>
                                </View>
                                <View className="flex flex-row items-center justify-center">
                                    <Image className="w-4 h-4 mt-2 mr-1" style={{ tintColor: purple600 }} source={phone} />
                                    <Text className="mt-2 text-md">{user?.phone_no}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Family Members */}
                    <View className="flex flex-row p-2 m-4">
                        <Text className="text-2xl font-bold">Family</Text>
                        <TouchableOpacity onPress={() => router.push("/(protected)/profile/AddMember")} className="items-center justify-center w-8 ml-4 bg-purple-600 rounded-full">
                            <Text className="text-xl font-bold text-neutral-50">+</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-around">
                        {/* {family &&<Image source={family[0].image ? { uri: family[0].image } :  p2} className="w-24 rounded-full h-60" />} */}

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {family && family.map((member) => (

                                <TouchableOpacity className="flex flex-col justify-center w-full, items-center m-2" key={member.id} onPress={() => { setSelectedMember(member.id); setModal(true); console.log(member.image) }}>

                                    <Image style={{ width: 130, height: 130, resizeMode: 'cover' }} source={member.image ? { uri: member.image } : p2} className="rounded-full " />

                                    <Text className="mt-2 text-center">{member.name}</Text>

                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Modal for Editing Details */}
                    {selectedMember && modal && (
                        <Modal
                            visible={modal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setModal(false)}

                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                {family.filter((member) => member.id === selectedMember).map((member) => (
                                    <View key={member.id} style={{ width: '80%', paddingBottom: 20, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                                        <View className="flex flex-row items-center justify-between h-16 p-4 mb-5 bg-purple-500 w-100 rounded-bl-md rounded-br-md">

                                            <View></View>
                                            <Text className="text-lg text-white">View Details</Text>

                                            <TouchableOpacity className="justify-center w-6 h-6 mt-1 ml-4 bg-red-500 rounded-full item-center" onPress={() => setModal(false)}>
                                                <View className="flex items-center justify-center ">

                                                    <Text className="font-bold text-white text-md">
                                                        x
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Editable Fields */}
                                        <Text>Name</Text>
                                        <View className="flex-row items-center mb-3">
                                            <TextInput
                                                value={member.name}
                                                editable={editFields[member.id]?.name}
                                                className={`flex-1 border border-gray-300 px-3 py-2 rounded-lg ${editFields[member.id]?.name ? 'bg-white' : 'bg-gray-100'}`}
                                                onChangeText={(value) => {
                                                    // Update the family state immutably
                                                    setFamily((prev) =>
                                                        prev.map((m) =>
                                                            m.id === member.id ? { ...m, name: value } : m
                                                        )
                                                    );
                                                }}
                                            />
                                            {/* <TouchableOpacity onPress={() => toggleEditField(member.id, 'name')} className="ml-3">
                                            <Ionicons name="pencil" size={20} color="blue" />
                                        </TouchableOpacity> */}
                                        </View>

                                        <Text>Phone Number</Text>
                                        <View className="flex-row items-center mb-3">
                                            <View className='flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'>

                                                <Text>{member.phone_no}</Text>
                                            </View>

                                            {/* <TextInput
                                            value={member.phone_no}
                                            editable={editFields[member.id]?.phone_no}
                                            className={`flex-1 border border-gray-300 px-3 py-2 rounded-lg ${editFields[member.id]?.phone_no ? 'bg-white' : 'bg-gray-100'}`}
                                            onChangeText={(value) => {
                                                setFamily((prev) =>
                                                    prev.map((m) =>
                                                        m.id === member.id ? { ...m, phone: value } : m
                                                    )
                                                );
                                            }}
                                        /> */}

                                            {/* <TouchableOpacity onPress={() => toggleEditField(member.id, 'phone')} className="ml-3">
                                            <Ionicons name="pencil" size={20} color="blue" />
                                        </TouchableOpacity> */}
                                        </View>

                                        <Text>License Number</Text>
                                        <View className="flex-row items-center">
                                            <TextInput
                                                value={member.license_id}
                                                editable={editFields[member.id]?.license_id}
                                                className={`flex-1 border border-gray-300 px-3 py-2 rounded-lg ${editFields[member.id]?.license_id ? 'bg-white' : 'bg-gray-100'}`}
                                                onChangeText={(value) => {
                                                    setFamily((prev) =>
                                                        prev.map((m) =>
                                                            m.id === member.id ? { ...m, license_id: value } : m
                                                        )
                                                    );
                                                }}
                                            />
                                            {/* <TouchableOpacity onPress={() => toggleEditField(member.id, 'license_id')} className="ml-3">
                                            <Ionicons name="pencil" size={20} color="blue" />
                                        </TouchableOpacity> */}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Modal>
                    )}
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}


