import Topbar, { Idevice } from "@/components/TopBar/Topbar";
import ThumbnailCard from "@/components/card/ThumbnailCard";
import QuickMessage from "@/components/card/QuickMessage";
import InputBox from "@/components/Input/InputBox";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDevices } from "@/api/user";
import Loader from "@/components/Loader/Loader";
import * as DocumentPicker from "expo-document-picker";
import { uploadDocument, fetchUserDocuments } from "@/api/user";
import { DocumentPickerAsset } from "expo-document-picker";

import {
    View,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
    Linking,
    Alert,
    Image,
    ActivityIndicator,
    Button,
    ImageBackground,
} from "react-native";
import React, { useEffect, useId, useState } from "react";
import { background, demoImg, image, p1, pdf } from "@/utils/constants/images";
import * as FileSystem from "expo-file-system";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import WebView from "react-native-webview";
import { blue300, purple600 } from "@/utils/constants/colors";
import { setExpoToken } from "@/api/notifications";
import io from 'socket.io-client';
import { useSocket } from "@/hooks/useSocket";
import { socketManager } from "@/hooks/Socket";


export default function Home() {
    // const [modalVisible, setModalVisible] = useState(false);
    const [customMessage, setCustomMessage] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [Devices, setDevices] = useState<Idevice[]>();
    const [modalVisible, setModalVisible] = useState(false);
    const [messagemodalVisible, setmessageModalVisible] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentPicker.DocumentResult | null>(null);
    const [type, settype] = useState("");
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [docmodalVisible, setdocModalVisible] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [selectedtype, setSelectedtype] = useState("");
    const [refresh, setrefresh] = useState(false);
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const [selectedDevice, setSelectedDevice] = useState<Idevice>({ id: 'demo', name: 'demo' })
    const deviceId = AsyncStorage.getItem('device').then((device) => JSON.parse(device!))


    useEffect(() => {

        socketManager.disconnect();
        socketManager.connect(selectedDevice);

        return () => {
            // Clean up on component unmount
            socketManager.disconnect();
        };
    }, [selectedDevice ,refresh])

    // const { isConnected, sendMessage, error } = useSocket(selectedDevice);

    // useEffect(() => {
    //     if (error) {
    //         console.error('Socket error:', error);
    //         // Handle error (maybe show an alert or retry connection)
    //     }
    // }, [error]);  
    useEffect(() => {
        const getDocuments = async () => {
            try {
                const user_id = await AsyncStorage.getItem("id");
                const docs = await fetchUserDocuments(user_id!);

                setDocuments(docs);
            } catch (e) {
                console.error("Error fetching documents:", e);
            } finally {
                setLoading(false);
            }
        };
        getDocuments();
    }, []);



    const handleMessage = (message: string) => {


        socketManager.sendMessage({ message });

    };

    const handleDocumentUpload = async () => {
        const doc = await DocumentPicker.getDocumentAsync({});

        if (!doc.canceled) {
            console.log(doc);
            settype(doc.assets![0].mimeType!);
            const base64 = await FileSystem.readAsStringAsync(doc.assets![0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setSelectedDocument(base64);
            setModalVisible(true);
        }
    };


    const handleSaveDocument = async () => {
        try {
            if (selectedDocument && documentName) {
                setLoading(true);
                const user_id = await AsyncStorage.getItem("id");
                await uploadDocument(user_id!, selectedDocument, documentName, type);
                setModalVisible(false);
                setDocumentName("");
                setSelectedDocument(null);
                // Fetch updated documents after upload
                const docs = await fetchUserDocuments(user_id!);
                setDocuments(docs);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const openDocument = (url: string, type: string) => {
        setSelectedUrl(url); // Set the URL of the document to be opened
        setSelectedtype(type);
        setdocModalVisible(true); // Show the modal
    };

    useEffect(() => {
        const getDevices = async () => {
            try {
                const user_id = await AsyncStorage.getItem("id");

                // Simulate a fetch of devices
                const devices = (await getUserDevices(
                    user_id!
                )) as unknown as Idevice[]; // Cast the response

                // Ensure the devices data is an array and has the Idevice structure
                if (
                    Array.isArray(devices) &&
                    devices.every((device) => "id" in device && "name" in device)
                ) {
                    setDevices(devices); // Set the devices array
                    setSelectedDevice(devices[0])
                    await AsyncStorage.setItem("device", JSON.stringify(devices[0]))
                } else {
                    console.error("Fetched devices do not match the expected format.");
                }
            } catch (e) {
                console.error("Error fetching devices:", e);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        getDevices(); // Call the function when the component mounts
    }, []);

    const handleSend = () => {
        // Set the selected message to the custom message
        setSelectedMessage(customMessage);
        setModalVisible(false); // Close the modal
        setCustomMessage(""); // Clear the input
    };

    const UploadFile = () => {
        const pickDocument = async () => {
            let result = await DocumentPicker.getDocumentAsync({});
            console.log(result.output);
            console.log(result);
        };
    };
    const click = async () => {
        const user_id = await AsyncStorage.getItem("id");
        await setExpoToken(user_id!)
    }

    return (
        <View className="h-full bg-neutral-100">
            <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', }}>
                {<Topbar Devices={Devices!} selectedDevice={selectedDevice!} setSelectedDevice={setSelectedDevice} />}
                <ScrollView>
                    <Loader isOpen={loading}></Loader>
                    {/* <TouchableOpacity onPress={click}><Text>click</Text></TouchableOpacity> */}
                    <View className="flex flex-col m-4">
                        <View className="h-full ">

                            <Loader isOpen={loading} />
                            <View className="flex flex-col m-2">
                                <View className="flex flex-row mt-4 ">
                                    <Text className="text-2xl font-bold">My Documents</Text>
                                    <TouchableOpacity className="justify-center w-6 h-6 mt-1 ml-4 bg-purple-600 rounded-full item-center" onPress={handleDocumentUpload}>
                                        <View className="flex items-center justify-center ">

                                            <Text className="font-bold text-white text-md">
                                                +
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View className="mt-6" style={{ minHeight: documents ? 0 : 0 }}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {
                                            documents && documents.map((doc, index) => (
                                                <TouchableOpacity
                                                    style={{ minHeight: 100 }}
                                                    key={index}
                                                    onPress={() => openDocument(doc.url, doc.type)}
                                                >
                                                    <View
                                                        style={{ marginRight: 16, alignItems: "center", minHeight: 100, }}
                                                    >
                                                        <Image
                                                            source={doc.type === 'application/pdf' ? pdf : image

                                                            }
                                                            style={{
                                                                width: 100,
                                                                height: 100,
                                                                borderRadius: 8,
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                marginTop: 8,
                                                                textAlign: "center",
                                                                width: 100,
                                                            }}
                                                        >
                                                            {doc.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                    </ScrollView>

                                    {/* Modal to display the document in WebView */}
                                    <Modal
                                        visible={docmodalVisible}
                                        animationType="slide"
                                        onRequestClose={() => setdocModalVisible(false)}
                                    >
                                        <Loader isOpen={true}></Loader>
                                        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                                            {loading && (
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <ActivityIndicator size="large" color="purple" />
                                                </View>
                                            )}
                                            <WebView
                                                source={{
                                                    uri:
                                                        selectedtype === "application/pdf"
                                                            ? `http://docs.google.com/gview?embedded=true&url=${selectedUrl}`
                                                            : selectedUrl,
                                                }}
                                                style={{ flex: 1 }}
                                                onLoadStart={() => setLoading(true)}
                                                onLoadEnd={() => setLoading(false)}
                                                onHttpError={(syntheticEvent) => {
                                                    const { nativeEvent } = syntheticEvent;
                                                    console.warn("HTTP Error: ", nativeEvent);
                                                }}
                                                onError={(syntheticEvent) => {
                                                    const { nativeEvent } = syntheticEvent;
                                                    console.warn("WebView error: ", nativeEvent);
                                                }}
                                            />
                                            <TouchableOpacity
                                                style={{
                                                    padding: 10,
                                                    backgroundColor: purple600,
                                                    alignItems: "center",
                                                }}
                                                onPress={() => setdocModalVisible(false)} // Close the modal
                                            >
                                                <Text style={{ color: "white" }}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Modal>
                                </View>
                            </View>


                            <View className="mt-10 ml-3">
                                <View className="flex flex-row">
                                    
                                <Text className="text-2xl font-bold">Quick Messages</Text>
                                {socketManager.isSocketConnected()?<View className="w-2 h-2 bg-green-400 rounded-full"></View>:<View className="w-2 h-2 bg-red-500 rounded-full h "><Text className="text-white">{socketManager.isSocketConnected()}</Text></View>}
                                <TouchableOpacity className="w-16 h-4 ml-4 bg-purple-600" onPress={()=>{setrefresh(!refresh)}}><Text className="text-white ">Retry</Text></TouchableOpacity>
                                </View>
                                <View className="flex flex-col mt-6">
                                    <View className="flex flex-row justify-between">


                                        <QuickMessage message={"Ring"} send={handleMessage} />


                                        <QuickMessage message={"Call Me"} send={handleMessage} />

                                    </View>
                                    <View className="flex flex-row justify-between">

                                        <QuickMessage message={"Send Location"} send={handleMessage} />


                                        <TouchableOpacity
                                            onPress={() => setmessageModalVisible(!messagemodalVisible)}
                                        >
                                            <View
                                                className={`w-32 bg-purple-600 border-purple-600  border-2 m-4 p-4 h-16 rounded-lg items-center justify-center`}
                                            >
                                                <Text className={`text-lg font-bold  text-neutral-100 `}>
                                                    Custom
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {/* Modal for document name input */}
                            <Modal
                                visible={modalVisible}
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "80%",
                                            paddingBottom: 20,
                                            backgroundColor: "white",
                                            borderRadius: 10,
                                        }}
                                    >
                                        <View className="items-center justify-center h-16 bg-purple-500 w-100 rounded-bl-xl rounded-br-xl">
                                            <Text className="text-lg text-white">Upload Document</Text>
                                        </View>
                                        <View className="p-4">
                                            <InputBox
                                                label={""}
                                                placeholder={"Enter document name"}
                                                value={documentName}
                                                type={""}
                                                onChange={setDocumentName}
                                            />
                                            <View className="flex flex-row justify-between mt-4 ml-10 mr-10">
                                                <PrimaryButton
                                                    label={"Cancel"}
                                                    onClick={() => setModalVisible(false)}
                                                />
                                                <PrimaryButton
                                                    label={"Save"}
                                                    onClick={handleSaveDocument}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>

                    </View>
                    {/* Modal for custom message input */}
                    <Modal
                        visible={messagemodalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setmessageModalVisible(false)}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <View
                                style={{
                                    width: "80%",
                                    paddingBottom: 20,
                                    backgroundColor: "white",
                                    borderRadius: 10,
                                }}
                            >
                                <View className="items-center justify-center h-16 bg-purple-500 w-100 rounded-bl-xl rounded-br-xl ">
                                    <Text className="text-lg text-white">Send Custom Message</Text>
                                </View>
                                <View className="p-4">
                                    <InputBox
                                        label={""}
                                        placeholder={"Enter your message"}
                                        value={customMessage}
                                        type={""}
                                        onChange={setCustomMessage}
                                    ></InputBox>
                                    <View className="flex flex-row justify-between mt-4 ml-10 mr-10">
                                        <PrimaryButton
                                            label={"Cancel"}
                                            onClick={() => { setCustomMessage(""); setmessageModalVisible(false) }}
                                        ></PrimaryButton>
                                        <PrimaryButton
                                            label={"Send"}
                                            onClick={() => handleMessage(customMessage)}
                                        ></PrimaryButton>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>

            </ImageBackground>
        </View>
    );
}
