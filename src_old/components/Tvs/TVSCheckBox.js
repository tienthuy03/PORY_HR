import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../Button";
const TVSCheckBox = ({
  children,
  disabled = false,
  value = "N",
  onPress,
  size = "M",
}) => {
  const styles = StyleSheet.create({
    CheckBoxY: {
      width: size == "M" ? 30 : 20,
      height: size == "M" ? 30 : 20,
      borderRadius: size == "M" ? 5 : 3,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxN: {
      width: size == "M" ? 30 : 20,
      height: size == "M" ? 30 : 20,
      borderRadius: size == "M" ? 5 : 3,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });

  return (
    <View
      style={{
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <Button nextScreen={onPress} row alignCenter>
        <View style={value == "Y" ? styles.CheckBoxY : styles.CheckBoxN}>
          {value == "Y" ? (
            <Icon
              name={"check"}
              color={Color.mainColor}
              size={size == "M" ? 20 : 15}
            />
          ) : null}
        </View>
      </Button>
    </View>
  );
};

export default TVSCheckBox;
