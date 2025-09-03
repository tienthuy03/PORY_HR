import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";
import TVSButton from "./Button";
const TVSControlPopup = ({
  isShow,
  onHide,
  children,
  title,
  maxHeight = 550,
  minHeight,
  onAccept = null,
  backgroundColor = "white",
  scrollable = false,
  showCloseButton = true, // Thêm thuộc tính để quyết định hiển thị nút "Đóng lại"
}) => {
  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(00,00,00,.1)",
        }}
      >
        <HideArea onHide={onHide} />
        <AMT.View
          duration={300}
          animation={"fadeInUp"}
          style={{
            marginHorizontal: 10,
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
          {scrollable ? (
            <ScrollView
              style={{
                padding: 20,
                borderTopColor: Color.borderColor,
                borderTopWidth: 1,
                borderBottomColor: Color.borderColor,
                borderBottomWidth: 1,
                maxHeight,
                minHeight,
              }}
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={{
                padding: 20,
                borderTopColor: Color.borderColor,
                borderTopWidth: 1,
                borderBottomColor: Color.borderColor,
                borderBottomWidth: 1,
                maxHeight,
                minHeight,
              }}
            >
              {children}
            </View>
          )}
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              backgroundColor: "rgba(00,00,00,.03)",
              justifyContent: "center",
            }}
          >
            {showCloseButton && ( // Kiểm tra showCloseButton trước khi hiển thị nút "Đóng lại"
              <TVSButton type={"danger"} icon={"close"} onPress={onHide}>
                Đóng lại
              </TVSButton>
            )}
            {onAccept && (
              <TVSButton
                icon={"check"}
                onPress={() => {
                  onHide();
                  onAccept();
                }}
              >
                Xác nhận
              </TVSButton>
            )}
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
