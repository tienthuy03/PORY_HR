import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as AMT from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Color } from "../../../../../colors/colortv";
// import PDFView from "react-native-view-pdf";
import Pdf from 'react-native-pdf';

import axios from "axios";
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";

const styles = StyleSheet.create({});
const resources = "";
// const source = { uri: `data:application/pdf;base64,${dataPDF}` };
const PopupPDF = ({
  isShow,
  onHide,
  title,
  dataPDF,
  maxHeight = Dimensions.get("screen").height,
  minHeight = Dimensions.get("screen").height,
  backgroundColor = "white",
}) => {
  const { width, height } = Dimensions.get("screen");
  useEffect(() => {
  }, []);

  const [pdfError, setPdfError] = useState(false);

  const handlePdfError = (error) => {
    console.log('PDF Error:', error);
    setPdfError(true);
  };


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
              {pdfError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Không thể tải tệp FDF.</Text>
                </View>
              ) : (
                <Pdf
                  source={{ uri: `data:application/pdf;base64,${dataPDF}` }}
                  onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                  }}
                  onError={handlePdfError}
                  onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                  }}
                  style={styles.pdf}
                />
              )}
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
