// CaptchaComponent.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Svg, { Rect, Line } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CaptchaComponent = ({ onCaptchaChange, onRefresh }) => {
  const [captchaText, setCaptchaText] = useState(generateCaptchaText());
  const [key, setKey] = useState(0);
  useEffect(() => {
    onCaptchaChange(captchaText);
  }, [captchaText]);
  function generateCaptchaText() {
    const characters =
      // abcdefghijklmnopqrstuvwxyz
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 6;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const regenerateCaptcha = () => {
    const newCaptchaText = generateCaptchaText();
    setCaptchaText(newCaptchaText);
    setKey((prevKey) => prevKey + 1);
    onCaptchaChange(newCaptchaText); // Notify the parent component about the new captcha text
  };
  return (
    <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
      <View style={{ justifyContent: "center" }}>
        <Svg key={key} height="35" width="120" style={styles.svgContainer}>
          <Rect x="0" y="0" width="120" height="35" fill="lightgray" />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 35,
            }}
          >
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontFamily: "verdana",
                fontSize: 16,
              }}
            >
              {captchaText}
            </Text>
          </View>
        </Svg>
      </View>
      <View style={{ justifyContent: "center", marginLeft: 5 }}>
        <TouchableOpacity
          onPress={regenerateCaptcha}
          style={{ flexDirection: "row" }}
        >
          <Icon size={20} color={"#143678"} name={"refresh"} />

          {/* <View style={{ justifyContent: "center" }}>
            <Text style={{ color: "#143678" }}>Refresh</Text>
          </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    // marginTop: 10,
  },
});

export default CaptchaComponent;
