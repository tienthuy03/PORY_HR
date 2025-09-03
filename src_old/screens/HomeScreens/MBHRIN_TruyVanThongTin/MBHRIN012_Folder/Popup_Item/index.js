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
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";

const styles = StyleSheet.create({});
const resources = "";
const PopupItem = ({ isShow, onHide, title, folderPK }) => {
  const { width, height } = Dimensions.get("screen");
  useEffect(() => {
    console.log("folderPK ", folderPK);
  }, [folderPK]);

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
            backgroundColor: "white",
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
              <View style={{ marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalItemVisible(true);
                    setFolderPK(item.pk);
                    setFolderName(item.folder_name);
                  }}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 5,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  {/* render item text */}
                  <View
                    style={{
                      flexDirection: "row",
                      minHeight: 60,
                    }}
                  >
                    <View
                      style={{
                        minWidth: 60,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "transparent",
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon name={"folder"} size={50} />
                        </View>
                        <LinearGradient
                          colors={["#F9BC3B", "#FFA800"]}
                          style={{ flex: 1 }}
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <Text>Test</Text>
                  </View>
                  <View
                    style={{
                      minWidth: 5,
                      minHeight: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 2,
                      paddingHorizontal: 5,
                      marginLeft: 1,
                      marginVertical: 15,
                      marginHorizontal: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFA800",
                        fontSize: 17,
                      }}
                    >
                      1
                    </Text>
                  </View>
                  <View style={{ justifyContent: "center" }}>
                    <Icon
                      name={"chevron-right"}
                      color={Color.mainColor}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              </View>
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

export default PopupItem;
