import { neutral100, primary500 } from "@/utils/constants/colors";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
}

export default function PrimaryButton({ label, onClick }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        backgroundColor: primary500,
        borderColor: primary500,
        borderWidth: 1,
        borderRadius: 24,
        padding: 12,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: neutral100 ,
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
