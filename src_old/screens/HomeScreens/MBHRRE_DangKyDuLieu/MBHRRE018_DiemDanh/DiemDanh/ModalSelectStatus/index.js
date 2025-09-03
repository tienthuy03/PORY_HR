import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Color } from "../../../../../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";
import TVSButton from "../../../../../../components/Tvs/Button";
import Typography from "../../../../../../components/Text";
import axios from "axios";
import { useSelector } from "react-redux";
import Block from "../../../../../../components/Block";

axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";

const ModalSelectStatus = ({
  title,
  isShow,
  data,
  index,
  onHide,
  backgroundColor = "white",
  onSave,
  item,
}) => {
  const [workStatusCode, setWorkStatusCode] = useState("1");
  const [workStatusCodeName, setWorkStatusCodeName] = useState("Đi làm");
  const [prevWorkStatus, setPrevWorkStatus] = useState("");
  const [riceStatus, setRiceStatus] = useState("Y");
  const [description, setDescription] = useState("");
  const [disableView, setDisableView] = useState(false);
  const Color = useSelector((s) => s.SystemReducer.theme);

  useEffect(() => {
    setDisableView(false);
    setDescription(item?.description);
    setWorkStatusCode(item?.work_status_code);
    setWorkStatusCodeName(item?.work_status_code_nm);
    setRiceStatus(item?.rice_status);
  }, [isShow]);

  const onCheckedWorkStatus = (statusWork) => {
    if (statusWork === prevWorkStatus) {
      setWorkStatusCode("1");
      setRiceStatus("Y");
      setPrevWorkStatus("");
      setDisableView(false);
    } else {
      setWorkStatusCode(statusWork);
      setRiceStatus("N");
      setPrevWorkStatus(statusWork);

      //set disable rice status
      if (statusWork === "K" || statusWork === "1P" || statusWork === "NV") {
        setDisableView(true);
      } else {
        setDisableView(false);
      }
    }
  };

  const onCheckedRiceStatus = (statusRice) => {
    setRiceStatus(statusRice);
  };

  const onResetForm = () => {
    setWorkStatusCode("1");
    setRiceStatus("Y");
    setWorkStatusCodeName("Đi làm");
    setPrevWorkStatus("");
    setDescription("");
  };
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    column: {
      flex: 1,
    },
    itemContainer: {
      margin: 10,
    },
    fieldsetTitle: {
      position: "absolute",
      top: -16,
      left: 10,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },

    CheckBoxSquareDisable: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.gray,
    },

    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },

    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },

    disableView: {
      color: "gray",
    },
  });

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
          duration={500}
          animation={"fadeInUp"}
          style={{
            backgroundColor: backgroundColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
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
              backgroundColor: "rgba(00,00,00,.06)",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              alignItems: "flex-end",
              height:
                Platform.OS == "ios"
                  ? Dimensions.get("screen").height / 20
                  : Dimensions.get("screen").height / 20,
            }}
          >
            <PopupTitle>{title}</PopupTitle>
            <TouchableOpacity
              onPress={() => {
                onHide();
                onResetForm();
              }}
            >
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
          <View
            backgroundColor={Color.gray}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View>
              <View
                border={1}
                paddingVertical={10}
                borderColor={Color.white}
                backgroundColor={Color.white}
                radius={6}
                borderWidth={2}
                borderRadius={8}
                style={{ marginHorizontal: 5, marginTop: 20 }}
              >
                <View row style={styles.fieldsetTitle}>
                  <View>
                    <Typography medium={true} size={18} color={Color.mainColor}>
                      {"Trạng thái"}
                    </Typography>
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.column}>
                    {data.slice(0, data.length / 2).map((item, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            onCheckedWorkStatus(item.code);
                            setWorkStatusCodeName(item.code_nm);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={
                                workStatusCode == item.code
                                  ? styles.CheckBoxSquareY
                                  : styles.CheckBoxSquareN
                              }
                            >
                              {workStatusCode == item.code ? (
                                <Icon name={"check"} color={Color.mainColor} />
                              ) : null}
                            </View>
                            <Typography marginLeft={5}>
                              {item.code_nm}
                            </Typography>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <View style={styles.column}>
                    {data.slice(data.length / 2).map((item, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            onCheckedWorkStatus(item.code);
                            setWorkStatusCodeName(item.code_nm);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={
                                workStatusCode == item.code
                                  ? styles.CheckBoxSquareY
                                  : styles.CheckBoxSquareN
                              }
                            >
                              {workStatusCode == item.code ? (
                                <Icon name={"check"} color={Color.mainColor} />
                              ) : null}
                            </View>
                            <Typography marginLeft={5}>
                              {item.code_nm}
                            </Typography>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View
              border={1}
              paddingVertical={10}
              borderColor={Color.white}
              backgroundColor={Color.white}
              radius={6}
              borderWidth={2}
              borderRadius={8}
              style={{ marginHorizontal: 5, marginTop: 20 }}
            >
              <View row style={styles.fieldsetTitle}>
                <View>
                  <Typography medium={true} size={18} color={Color.mainColor}>
                    {"Nhận cơm"}
                  </Typography>
                </View>
              </View>
              <View
                pointerEvents={
                  workStatusCode === "1" || workStatusCode === "1/2P"
                    ? "auto"
                    : "none"
                }
                style={styles.container}
              >
                <View style={styles.column}>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        onCheckedRiceStatus("N");
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={
                            riceStatus == "N"
                              ? styles.CheckBoxSquareY
                              : styles.CheckBoxSquareN
                          }
                        >
                          {riceStatus == "N" ? (
                            <Icon name={"check"} color={Color.mainColor} />
                          ) : null}
                        </View>
                        <Typography marginLeft={5}>Không ăn cơm</Typography>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.column}>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        onCheckedRiceStatus("Y");
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={
                            riceStatus == "Y"
                              ? styles.CheckBoxSquareY
                              : disableView
                              ? styles.CheckBoxSquareDisable
                              : styles.CheckBoxSquareN
                          }
                        >
                          {riceStatus == "Y" ? (
                            <Icon name={"check"} color={Color.mainColor} />
                          ) : null}
                        </View>
                        <Typography
                          color={disableView ? Color.grayPlahoder : null}
                          marginLeft={5}
                        >
                          Ăn cơm
                        </Typography>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View
              border={1}
              paddingVertical={10}
              borderColor={Color.white}
              backgroundColor={Color.white}
              radius={6}
              borderWidth={2}
              borderRadius={8}
              style={{ marginHorizontal: 5, marginTop: 20 }}
            >
              <View row style={styles.fieldsetTitle}>
                <View>
                  <Typography medium={true} size={18} color={Color.mainColor}>
                    {"Ghi chú"}
                  </Typography>
                </View>
              </View>

              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemContainer}>
                    <Block
                      style={{
                        width: "100%",
                        backgroundColor: Color.gray,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        borderRadius: 6,
                        minHeight: 50,
                      }}
                    >
                      <TextInput
                        multiline={true}
                        placeholder={"Nhập ghi chú"}
                        value={description}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onChangeText={setDescription}
                      />
                    </Block>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 3,
              }}
            >
              <View
                style={{
                  borderRadius: 20,
                  backgroundColor: "white",
                }}
              >
                <TVSButton
                  onPress={() => {
                    onHide();
                    onResetForm();
                  }}
                  buttonStyle={"3"}
                  type={"danger"}
                  icon={"close"}
                  minWidth={150}
                >
                  Đóng lại
                </TVSButton>
              </View>
              <View
                style={{
                  borderRadius: 20,
                  backgroundColor: "white",
                }}
              >
                <TVSButton
                  onPress={async () => {
                    if (workStatusCode == "1") {
                      await onSave(
                        index,
                        workStatusCode,
                        riceStatus,
                        "Đi làm",
                        description
                      );
                    } else {
                      await onSave(
                        index,
                        workStatusCode,
                        riceStatus,
                        workStatusCodeName,
                        description
                      );
                    }
                    onResetForm();
                  }}
                  icon={"check"}
                  buttonStyle={"3"}
                  minWidth={150}
                  type={"success"}
                >
                  Xác nhận
                </TVSButton>
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

export default ModalSelectStatus;
