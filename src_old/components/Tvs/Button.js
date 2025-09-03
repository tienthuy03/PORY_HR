import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Color } from "../../colors/colorhp";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const TVSButton = ({
  children,
  buttonStyle = "1",
  icon,
  type = "primary",
  onPress = null,
  disabled = false,
  flex = 0,
  paddingHorizontal = 10,
  paddingVertical = 10,
  borderRadius = 20,
  minWidth = 120,
}) => {
  return buttonStyle == "1" ? (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
        }}
        activeOpacity={disabled ? 1 : 0.7}
        onPress={disabled ? null : onPress}
      >
        <LinearGradient
          style={{
            flex,
            borderRadius: borderRadius,
          }}
          colors={disabled ? Color.disableButton : Color[type + "Button"]}
          start={{
            x: 0,
            y: 0.5,
          }}
          end={{
            x: 1,
            y: 1,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              paddingHorizontal,
              paddingVertical,
              color: "white",
              fontWeight: "bold",
            }}
          >
            {icon && <Icon name={icon} size={16} />} {children}{" "}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  ) : buttonStyle == "2" ? (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        // borderColor: disabled ? Color.disableButton2 : Color[type + 'Text'],
        // borderWidth: 1,
        borderRadius: borderRadius,
        backgroundColor: disabled
          ? Color.disableButton2
          : Color["primaryButton2"],
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
        }}
        activeOpacity={disabled ? 1 : 0.7}
        onPress={disabled ? null : onPress}
      >
        <Text
          style={{
            textAlign: "center",
            paddingHorizontal,
            paddingVertical,
            fontWeight: "bold",
            color: disabled ? "white" : Color[type + "Text"],
          }}
        >
          {icon && (
            <Icon
              name={icon}
              size={16}
              color={disabled ? "white" : Color[type + "Text"]}
            />
          )}{" "}
          {children}{" "}
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 2,
        borderColor: disabled ? Color.disableButton2 : Color[type + "Text"],
        borderWidth: 1,
        borderRadius: borderRadius,
        minWidth: minWidth,
      }}
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? null : onPress}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            paddingHorizontal,
            paddingVertical,
            fontWeight: "bold",
            color: disabled ? Color.disableButton2 : Color[type + "Text"],
          }}
        >
          {icon && (
            <Icon
              name={icon}
              size={15}
              color={disabled ? Color.disableButton2 : Color[type + "Text"]}
            />
          )}{" "}
          {children}{" "}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TVSButton;
