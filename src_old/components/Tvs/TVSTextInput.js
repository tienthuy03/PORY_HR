import React from "react";
import { Text, TextInput, Dimensions } from "react-native";
import { Color } from "../../colors/colortv";
import Block from "../Block";

const TVSTextInput = ({
  children,
  disabled = false,
  label,
  placeholder,
  value,
  changeValue,
  required = false,
  hasLabel = true,
  keyboardType = "default",
  multiLine = false,
  colorLabel = Color.mainColor,
}) => {
  return (
    <Block style={{ margin: 10 }}>
      {hasLabel ? (
        <Block
          style={{
            flexDirection: "row",
            paddingBottom: 5,
            paddingLeft: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colorLabel }}>{label}</Text>
          {required ? <Text style={{ color: Color.red }}> *</Text> : null}
        </Block>
      ) : null}
      <Block
        style={{
          backgroundColor: Color.gray,
          paddingHorizontal: 5,
          paddingVertical: Platform.OS == "ios" ? 18 : 0,
          borderRadius: 6,
          // minHeight: multiLine ? 70 : null,
        }}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          editable={disabled ? false : true}
          multiline={multiLine}
          onChangeText={(text) => changeValue(text)}
          keyboardType={keyboardType}
        />
      </Block>
    </Block>
  );
};

export default TVSTextInput;
