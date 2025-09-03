/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { Text, TouchableOpacity, Linking, Modal, Alert } from "react-native";
import { Color } from "../../../../colors/colortv";
import QRCodeScanner from "react-native-qrcode-scanner";
import { request, PERMISSIONS } from "react-native-permissions";
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
  const CheckPermission = async () => {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    console.log(result);
    if (result === "granted") {
      setIsShow(true);
    }
  };

  return (
    <>
      <Modal visible={isShow}>
        <QRCodeScanner
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
        />
      </Modal>
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => CheckPermission()}
      >
        <Text style={{ color: Color.mainColor, textAlign: "center" }}>
          Cấu hình bằng mã QR
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default ScanQR;
