import React from "react";
import { 
  Text, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
  marginBottom = 10,
  marginTop = 10,
}) => {
  return (
    <Block style={{
      margin: 10,
      marginBottom: marginBottom,
      marginTop: marginTop,
    }}>
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
        height={45}
        style={{
          backgroundColor: Color.gray,
          paddingHorizontal: 5,
          paddingVertical: Platform.OS == "ios" ? 10 : 0,
          borderRadius: 6,
          // minHeight: multiLine ? 70 : null,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1,}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput
              value={value}
              placeholder={placeholder}
              editable={disabled ? false : true}
              // multiline={multiLine}
              onChangeText={(text) => changeValue(text)}
              keyboardType={keyboardType}
            />
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* <TextInput
          value={value}
          placeholder={placeholder}
          editable={disabled ? false : true}
          // multiline={multiLine}
          onChangeText={(text) => changeValue(text)}
          keyboardType={keyboardType}
        /> */}
      </Block>
    </Block>
  );
};

export default TVSTextInput;
