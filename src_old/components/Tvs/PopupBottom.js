// import React, { useState } from "react";
import React, { useEffect, useContext, useState, useRef } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";
import Block from "../Block";
import { Color } from "../../colors/colortv";
const TVSPopupBottom = ({
  isShow,
  onHide,
  children,
  title,
  onSwipeComplete = null,
  backgroundColor = "white",
  bottom,
}) => {
  const [modalVisible, setModalVisible] = useState(isShow);
  useEffect(() => {
    console.log("effect");
    console.log("effect", isShow);
    console.log("effect", modalVisible);
    setModalVisible(isShow);
  }, [isShow]);
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
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
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: Color.mainColor,
                textAlign: "left",
              }}
            >
              Tìm kiếm nâng cao
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Icon size={20} color={Color.mainColor} name={"close"} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Phòng ban</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderColor: Color.mainColor,
                borderWidth: 0.5,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{}}>Chọn phòng ban</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </TouchableOpacity>
            {/* {modalOrg} */}
          </Block>
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Phòng ban</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderColor: Color.mainColor,
                borderWidth: 0.5,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{}}>Chọn phòng ban</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </TouchableOpacity>
            {/* {modalOrg} */}
          </Block>
        </View>
      </AMT.View>
    </Modal>
  );
};

export default TVSPopupBottom;
