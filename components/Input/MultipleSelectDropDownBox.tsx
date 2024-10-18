import { blue50, blue800, neutral100, neutral500, neutral800 } from "@/utils/constants/colors";
import { dropDownIcon } from "@/utils/constants/images";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import InputBox from "./InputBox";

interface DropdownProps {
  value: {label:string,value:string}[];
  setValue: React.Dispatch<React.SetStateAction<{label:string,value:string}[]>>;
  items: { label: string; value: string }[];
  placeholder: string;
  label: string;
  search: boolean;
  searchPlaceholder?: string;
}

export default function MultipleSelectDropDownBox({
  search,
  searchPlaceholder,
  value,
  setValue,
  items,
  placeholder,
  label,
}: DropdownProps) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState<string>("");
  const handleSelect = (item: { label: string; value: string }) => {
    if (value.some((obj)=>obj.value===item.value)) {
      setValue(value.filter((val) => val.value !== item.value));
    } else {
      setValue([...value, item]);
    }
  };

  return (
    <>
      <Text style={{ fontSize: 18, marginTop: 8, marginBottom: 4 }}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setDropdownVisible(!isDropdownVisible)}
        style={{
            backgroundColor: neutral100,
            padding: 12,
            borderRadius: 10,
            borderColor: neutral500,
            borderWidth: 1,
          }}
      >
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <Text>{value.length > 0 ? value.map(item => item.label).join(", ") : placeholder}</Text>
          <Image style={{width:25,height:25, transform:[{rotate:isDropdownVisible ? '180deg' : '0deg'}]}} source={dropDownIcon} />
        </View>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={{
            backgroundColor: neutral100,
            padding: 12,
            borderRadius: 10,
            borderColor: neutral500,
            borderWidth: 1
          }}>
          {search && (
            <ScrollView>
              <InputBox
                label={""}
                placeholder={"🔍 Search for course"}
                value={searchDropdown}
                type={"text"}
                onChange={setSearchDropdown}
              />
              {items
                .filter((item) => item.value.includes(searchDropdown))
                .map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => handleSelect(item)}
                    style={{
                        padding: 8,
                        backgroundColor: value.some((obj)=>obj.value===item.value) ? blue50 : neutral100,
                        borderRadius:8,
                        marginTop:4
                      }}
                  >
                    <Text
                      style={{
                        color: value.some((obj)=>obj.value===item.value) ? blue800 : neutral800,
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}
          {!search && 
            <ScrollView style={{height:110}}>
                {
                    items.map((item) => (
                        <TouchableOpacity
                          key={item.value}
                          onPress={() => handleSelect(item)}
                          style={{
                              padding: 8,
                              backgroundColor: value.some((obj)=>obj.value===item.value) ? blue50 : neutral100,
                              borderRadius:8,
                              marginTop:4
                            }}
                        >
                          <Text
                            style={{
                                color: value.some((obj)=>obj.value===item.value) ? blue800 : neutral800,
                            }}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))
                }
            </ScrollView>
          }
        </View>
      )}
    </>
  );
}
