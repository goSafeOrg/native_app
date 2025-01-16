import { error800, neutral100, neutral300, neutral500, neutral600, neutral800, primary200, primary300 } from "@/utils/constants/colors";
import { closedEye, viewIcon } from "@/utils/constants/images";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface InputBoxProps{
    label:string;
    placeholder:string;
    value:string;
    type:string;
    borderColor?:string;
    onChange:(text:string)=>void;
    mandatory?:boolean;
}

export default function InputBox(props: InputBoxProps) {
  const isPassword = props.type === "password";
  const [dontShowPassword, setDontShowPassword] = useState(true);
  return (
    <View>
      {
        props.label!=='' && <View style={{flexDirection:'row', alignItems:'center'}}><Text style={{fontSize:18,marginVertical:8}} className=" lg:text-xl">{props.label}</Text><Text style={{color:error800}}>{props.mandatory ? " *" : ''}</Text></View>
      }
      <View
        style={{backgroundColor:neutral100}}  className={`border border-neutral-500 rounded-lg p-2 flex flex-row justify-between`}
      >
        {
          props.type==='phoneno' && <View style={{alignItems:'center', justifyContent:'center'}}><Text>+91</Text></View>
        }
        <TextInput
          keyboardType={props.type==='phoneno' ? "number-pad" : "default"}
          className="lg:text-xl"
          secureTextEntry={isPassword && dontShowPassword}
          placeholderTextColor= {neutral600}
          style={styles.input}
          value={props.value}
          placeholder={props.placeholder}
          maxLength={props.type==='phoneno' ? 10 : props.type==='pincode' ? 6 : 64}
          onChangeText={(text) => {
            props.onChange( props.type==='phoneno'|| props.type==='pincode' ? text.replace(/[^0-9]/g, '') : text);
          }}
        />
        {isPassword ? (
          <TouchableOpacity
          style={{alignItems:'center',justifyContent:'center'}}
            onPress={() => setDontShowPassword((prev) => !prev)}
          >
            
            <Image
              className="w-6 mr-2 h-46" style={{resizeMode:'contain'}}
              source= { dontShowPassword? viewIcon :closedEye}
            />
          </TouchableOpacity>
        ) : (
          <View className="w-6 h-6" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "93%",
    outlineStyle: "none",
    padding:4,
    fontSize:15,
    
  },
});
