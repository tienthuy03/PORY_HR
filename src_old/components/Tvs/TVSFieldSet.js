import React, { useState } from "react";
import { View, Text } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
const TVSFieldSet = ({
  children,
  label,
  hasLabel = true,
  opacity = 1,
  colorLabel = Color.mainColor,
  hasIcon = false,
  icon,
  visibleChildren = true,
  onPress,
  textSize = 14,
  fontWeight = "bold",
}) => {
  return (
    <View
      border={1}
      paddingVertical={10}
      borderColor={"lightgray"}
      radius={6}
      borderWidth={0.5}
      borderRadius={8}
      style={{ marginHorizontal: 5, marginTop: 10 }}
    >
      <View
        row
        style={{
          position: "absolute",
          top: -12,
          backgroundColor: "white",
          left: 10,
        }}
      >
        <TouchableOpacity onPress={onPress}>
          <View>
            <Text
              style={{
                fontSize: textSize,
                fontWeight: fontWeight,
                color: colorLabel,
                opacity: opacity,
              }}
            >
              {label}
              {hasIcon ? " " : null}
              {hasIcon ? (
                <Icon name={icon} color={Color.mainColor} size={20} />
              ) : null}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {visibleChildren ? (
        <View style={{ marginTop: 5 }}>{children}</View>
      ) : null}
    </View>
  );
};

export default TVSFieldSet;
