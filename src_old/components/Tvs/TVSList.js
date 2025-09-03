import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Block from "../Block";
import Button from "../Button";
const TVSList = ({
  children,
  onPress = null,
  disabled = false,
  colorText,
  code_nm,
  maxHeight = "auto",
}) => {
  return (
    <Button
      nextScreen={disabled ? null : onPress}
      style={{
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Color.gray,
        borderRadius: 6,
      }}
    >
      <Block
        style={{
          flex: 1,
          justifyContent: "center",
          paddingLeft: 10,
          paddingVertical: 10,
          maxHeight: maxHeight,
        }}
      >
        <Text style={{ color: disabled ? "gray" : colorText }}>{code_nm}</Text>
      </Block>
      <Block style={{ justifyContent: "center", paddingRight: 10 }}>
        <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
      </Block>
    </Button>
  );
};

export default TVSList;
