import useScreenSize from "@/hooks/useScreenSize";
import { error800, neutral100, neutral500 } from "@/utils/constants/colors";
import React from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
 
interface DropdownProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  items: { label: string; value: string }[];
  placeholder: string;
  label: string;
  search: boolean;
  searchPlaceholder?: string;
  mandatory?:boolean
  onChange?:(value:{label:string,value:string})=>void
}
 
export default function DropdownBox({
  search,
  searchPlaceholder,
  value,
  setValue,
  items,
  placeholder,
  label,
  onChange,
  mandatory
}: DropdownProps) {
  const isMobile = useScreenSize()
  return (
    <View style={{padding:isMobile ? 2 : 4}}>
      <View style={{flexDirection:'row'}}>
      <Text style={{ fontSize: 18, marginTop: 8, marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{color:error800}}>{mandatory ? " *" : ''}</Text>
      </View>
      {search ? (
        <Dropdown
          search
          searchPlaceholder={searchPlaceholder}
          placeholder={placeholder}
          style={{
            backgroundColor: neutral100,
            padding: isMobile ? 12 : 16,
            borderRadius: 10,
            borderColor: neutral500,
            borderWidth: 1,
          }}
          labelField="label"
          valueField="value"
          value={value}
          onChange={onChange ? (value)=>{onChange(value);setValue(value.value)} : (value) => setValue(value.value)}
          data={items}
          minHeight={48}
        />
      ) : (
        <Dropdown
          placeholder={placeholder}
          style={{
            backgroundColor: neutral100,
            padding: isMobile ? 12 : 16,
            borderRadius: 10,
            borderColor: neutral500,
            borderWidth: 1,
          }}
          labelField="label"
          valueField="value"
          value={value}
          onChange={onChange ? (value)=>{onChange(value);setValue(value.value)} : (value) => setValue(value.value)}
          data={items}
        />
      )}
    </View>
  );
}