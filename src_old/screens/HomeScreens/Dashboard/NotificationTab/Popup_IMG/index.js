import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid,
  Dimensions,
  FlatList,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Color } from "../../../../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";

import axios from "axios";
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";

const styles = StyleSheet.create({});
const resources = "";
const PopupPDF = ({
  isShow,
  onHide,
  title,
  dataIMG,
  maxWidth = Dimensions.get("screen").width,
  maxHeight = Dimensions.get("screen").height,
  minHeight = Dimensions.get("screen").height,
  backgroundColor = "white",
}) => {
  const { width, height } = Dimensions.get("screen");
  useEffect(() => {}, []);

  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(00,00,00,.1)",
        }}
      >
        <HideArea onHide={() => onHide()} />
        <AMT.View
          duration={300}
          animation={"fadeInUp"}
          style={{
            backgroundColor: backgroundColor,
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
              alignItems: "flex-end",
              height:
                Platform.OS == "ios"
                  ? (Dimensions.get("screen").height / 20) * 2
                  : Dimensions.get("screen").height / 20,
            }}
          >
            <PopupTitle>{title}</PopupTitle>
            <TouchableOpacity onPress={() => onHide()}>
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 100,
              paddingLeft: 20,
              paddingRight: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              minHeight: Dimensions.get("screen").height,
            }}
          >
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: "data:image/png;base64," + dataIMG }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </AMT.View>
        <HideArea onHide={() => onHide()} />
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

export default PopupPDF;
