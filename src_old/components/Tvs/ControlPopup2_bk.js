import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";
import TVSButton from "./Button";
const TVSControlPopup = ({
  isShow,
  onHide,
  children,
  bottom,
  title,
  maxHeight = 400,
  minHeight,
  backgroundColor = "white",
}) => {
  return (
    <Modal
      transparent={true}
      visible={isShow}
      style={[
        {
          justifyContent: "flex-end",
          margin: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
      ]}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></View>
      <View
        style={{
          // flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <HideArea onHide={onHide} />
        <AMT.View
          duration={300}
          animation={"fadeInUp"}
          style={{
            // marginHorizontal: 10,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
          }}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              backgroundColor: "rgba(00,00,00,.03)",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}
          >
            <PopupTitle>{title}</PopupTitle>
            <TouchableOpacity onPress={onHide}>
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 10,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              maxHeight,
              minHeight,
              // backgroundColor: "red",
            }}
          >
            {children}
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              backgroundColor: "rgba(00,00,00,.03)",
              justifyContent: "center",
            }}
          >
            {bottom}
          </View>
        </AMT.View>
        <HideArea onHide={onHide} />
      </View>
    </Modal>
  );
};
const PopupTitle = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          textTransform: "uppercase",
          color: Color.mainColor,
        }}
      >
        {children}
      </Text>
    </View>
  );
};
const HideArea = ({ onHide }) => {
  return <TouchableOpacity style={{ flex: 1 }} onPress={onHide} />;
};

export default TVSControlPopup;
