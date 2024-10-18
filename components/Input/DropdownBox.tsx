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
}
 
export default function DropdownBox({
  search,
  searchPlaceholder,
  value,
  setValue,
  items,
  placeholder,
  label,
  mandatory
}: DropdownProps) {
  return (
    <>
      <View style={{flexDirection:'row'}}>
      <Text style={{ fontSize: 14, marginTop: 8, marginBottom: 4 }}>
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
            padding: 12,
            borderRadius: 10,
            borderColor: neutral500,
            borderWidth: 1,
          }}
          labelField="label"
          valueField="value"
          value={value}
          onChange={(value) => setValue(value.value)}
          data={items}
        />
      ) : (
        <Dropdown
          placeholder={placeholder}
          style={{
            backgroundColor: neutral100,
            padding: 12,
            borderRadius: 10,
            borderColor: neutral500,
            borderWidth: 1,
          }}
          labelField="label"
          valueField="value"
          value={value}
          onChange={(value) => setValue(value.value)}
          data={items}
        />
      )}
    </>
  );
}