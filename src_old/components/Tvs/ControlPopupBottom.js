import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Color } from "../../colors/colortv";
import Modal from "react-native-modal";
import Text from "../Text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const TVSControlPopup = ({
  isShow,
  onHide,
  children,
  bottom,
  title,
  maxHeight = 600,
  minHeight,
  backgroundColor = "white",
  callBack,
}) => {
  const [modalVisible, setModalVisible] = useState(isShow);
  useEffect(() => {
    setModalVisible(isShow);
  }, [isShow]);
  return (
    <Modal
      isVisible={modalVisible}
      style={[
        {
          justifyContent: "flex-end",
          margin: 0,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: backgroundColor,
          padding: 20,
          borderRadius: 4,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          maxHeight: maxHeight,
          minHeight: minHeight,
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: "bold",
              textTransform: "uppercase",
              color: Color.mainColor,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                onHide();
                setModalVisible(!modalVisible);
              }}
            >
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
        </View>
        {children}
      </View>
    </Modal>
  );
};

export default TVSControlPopup;
