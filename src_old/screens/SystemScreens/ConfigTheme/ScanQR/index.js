/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
  View,
  Platform,
} from "react-native";
import { Color } from "../../../../colors/colortv";
// import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const ScanQR = ({ checkApi }) => {
  const [isShow, setIsShow] = useState(false);

  const onSuccess = (e) => {
    try {
      checkApi(e.data.split("*|*")[0], e.data.split("*|*")[1]);
      setIsShow(false);
    } catch (error) {
      Alert.alert("Thông báo", "Quét mã thất bại. Xin thử lại.");
      setIsShow(false);
    }
  };
  const cameraRef = useRef(null);
  return (
    <>
      <Modal visible={isShow}>
        {/* <QRCodeScanner
          onRead={onSuccess}
          topContent={
            <Text style={{ fontSize: 20, color: Color.mainColor }}>
              Hãy quét mã QR
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: Color.backgroundColor,
              }}
              onPress={() => setIsShow(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Đóng</Text>
            </TouchableOpacity>
          }
        /> */}
        <RNCamera
          ref={cameraRef}
          style={{ flex: 1 }}
          // maxZoom={0.5}
          // zoom={Platform.OS === "ios" ? 0 : 0.5}
          zoom={0}
          onBarCodeRead={onSuccess}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: "20%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
              <View
                style={{
                  borderWidth: 2,
                  flex: 1,
                  borderColor: Color.mainColor,
                }}
              />
              <View
                style={{
                  width: "20%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
              }}
            />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                padding: 16,
                textAlign: "center",
              }}
            >
              Di chuyển camera gần mã QR để quét
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 20,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: Color.mainColor,
              }}
              onPress={() => setIsShow(false)}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </Modal>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => setIsShow(true)}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Icon size={50} color={Color.black} name={"qrcode-scan"} />
        </View>
        <Text style={{ color: Color.mainColor, textAlign: "center" }}>
          Cấu hình bằng mã QR
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default ScanQR;
