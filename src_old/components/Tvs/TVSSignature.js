import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Block from "../Block";
import Button from "../Button";
import TVSButton from "./Button";
import SignatureScreen from "react-native-signature-canvas";
import TVSControlPopup from "./ControlPopup2";
const TVSSignature = ({
  children,
  onCallBack,
  bgColor = Color.gray,
  data = null,
}) => {
  const [signature, setSign] = useState(data);

  const handleOK = (signature) => {
    onCallBack(signature.replace("data:image/png;base64,", ""));
    setSign(signature);
    setModalVisible(false);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };
  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };
  const ref = useRef();
  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const [modalVisible, setModalVisible] = useState(false);
  const modal = (
    <TVSControlPopup
      title={"Chữ ký tay"}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}
      minHeight={400}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "red",
        }}
      >
        <SignatureScreen
          onOK={handleOK}
          onEmpty={handleEmpty}
          descriptionText="signature"
          webStyle={style}
          dotSize={3}
          ref={ref}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          // backgroundColor: 'red',
        }}
      >
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={handleClear}
        >
          Clear
        </TVSButton>
        <TVSButton
          type={"primary"}
          icon={"check"}
          buttonStyle={"3"}
          onPress={handleConfirm}
        >
          Confirm
        </TVSButton>
      </View>
    </TVSControlPopup>
  );
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          // width: 335,
          height: 114,
          backgroundColor: bgColor,
          justifyContent: "center",
          alignItems: "center",
          margin: 10,
          borderRadius: 8,
        }}
        onPress={() => setModalVisible(true)}
      >
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        ) : null}
      </TouchableOpacity>
      {modal}
    </View>
  );
};

export default TVSSignature;
