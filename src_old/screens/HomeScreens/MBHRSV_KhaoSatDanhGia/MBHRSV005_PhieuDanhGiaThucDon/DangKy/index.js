import moment from "moment";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import Button from "../../../../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";

export default function DGNAN() {
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const [colorFrom, setColorFrom] = useState("#B2B2B2");
  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk = "";
  let tokens = "";
  let crt_by = "";
  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  useEffect(() => {
    getData();
  }, []);
  const confirmSend = () => {
    let cntQues = 0;
    let flagCheck = true;
    let alertQuesNum = "";
    if (alertQuesNum != "") {
      alertQuesNum = alertQuesNum.slice(0, -2);
    }
    let flagCheckQues = true;
    dataCriteriaName
      .filter((x) => x.require_yn == "Y")
      .forEach(function (item) {
        flagCheckQues = false;
        dataCriteriaValue.forEach(function (item2) {
          if (item2.parent_pk == item.pk) {
            if (item2.selected) {
              flagCheckQues = true;
            }
          }
        });
      });

    if (!flagCheckQues) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn đủ các câu trả lời",
        [
          {
            text: "Đóng",
            onPress: () => {
              return;
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert("Thông báo", "Bạn có muốn gửi phiếu không ?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => onSend() },
      ]);
    }
  };
  const [sendStatus, setSendStatus] = useState("");
  const onSend = () => {
    let cntAns = 0;
    let strParentPK = "";
    let strCode = "";
    let strExtend = "";
    dataCriteriaValue.forEach(function (item) {
      if (item.selected) {
        cntAns++;
        strParentPK += item.parent_pk + "+|+";
        strCode += item.code + "+|+";
      }
    });
    strParentPK = strParentPK.slice(0, -3);
    strCode = strCode.slice(0, -3);
    strExtend = strExtend.slice(0, -3);

    console.log("strParentPK ", strParentPK);
    console.log("strCode ", strCode);
    sysFetch(
      API,
      {
        pro: "UPDHRSV005000",
        in_par: {
          p1_varchar2: "INSERT",
          p2_varchar2: "",
          p3_varchar2: thr_emp_pk,
          p4_varchar2: cntAns,
          p5_varchar2: strParentPK,
          p6_varchar2: strCode,
          p7_varchar2: APP_VERSION,
          p8_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "showDialog",
        },
      },
      tokens
    )
      .then((res) => {
        // setComfirmSent()
        if (res.results == "F") {
          let newText = res.errorData.split("ORA");
          let errors = "";
          try {
            errors = newText[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: gửi phiếu không thành công.";
          }
          Alert.alert(
            "Thông báo",
            errors,
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Thông báo",
            res.data.showDialog,
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          // setSendStatus(res.data.showDialog);
        }
      })
      .catch((error) => {});
  };
  const setContentExtent = (value, code, parent_pk) => {
    let newData = [...dataCriteriaValue];
    newData.forEach(function (item) {
      if (item.code == code && item.parent_pk == parent_pk) {
        item.content_extend = value;
      }
    });
    setDataCriteriaValue(newData);
  };
  const selectTieuChi = (code, parent_pk) => {
    let newData = [...dataCriteriaValue];
    newData.forEach(function (item) {
      if (item.code == code && item.parent_pk == parent_pk) {
        item.selected = !item.selected;
      }
    });
    setDataCriteriaValue(newData);
  };
  const [modalVisibleExtend, setModalVisibleExtend] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const modalExtend = (
    <TVSControlPopup
      title={"Nhập thông tin"}
      isShow={modalVisibleExtend}
      onHide={() => setModalVisibleExtend(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleExtend(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <View>
        <View>
          {currentItem ? <Text>{currentItem.descrition_extend}</Text> : null}
        </View>
        <View>
          {currentItem ? (
            <TextInput
              value={currentItem.content_extend}
              onChangeText={(e) => {
                setContentExtent(e, currentItem.code, currentItem.parent_pk);
              }}
              style={{
                backgroundColor: Color.gray,
                paddingBottom: 10,
                paddingHorizontal: 10,
                paddingTop: 12,
                borderRadius: 5,
                marginVertical: 10,
              }}
              multiline
              placeholder={"..."}
            />
          ) : null}
        </View>
      </View>
    </TVSControlPopup>
  );
  const loadNew = () => {
    getData();
  };
  const [dataCriteriaName, setDataCriteriaName] = useState([]);
  const [dataCriteriaValue, setDataCriteriaValue] = useState([]);
  const getData = () => {
    sysFetch(
      API,
      {
        pro: "SELHRSV005000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "criteria_name",
          p2_sys: "criteria_value",
        },
      },
      tokens
    )
      .then((res) => {
        if (res.results == "S") {
          setDataCriteriaName(res.data.criteria_name);
          setDataCriteriaValue(res.data.criteria_value);
        } else showAlert(res.errorData);
      })
      .catch((error) => {});
  };
  const onLoadMore = (pk) => {
    console.log("onLoadMore ", pk);
    let newData = [...dataCriteriaName];
    newData.forEach(function (item) {
      if (item.pk == pk) {
        item.selected = !item.selected;
      }
    });
    setDataCriteriaName(newData);
  };
  const onCollapse = (pk) => {
    console.log("onCollapse ", pk);
    let newData = [...dataCriteriaName];
    newData.forEach(function (item) {
      if (item.pk == pk) {
        item.selected = !item.selected;
      }
    });
    setDataCriteriaName(newData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor={Color.gray}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingHorizontal: 5,
          // marginHorizontal: 10,
          backgroundColor: Color.gray, //"#FFFFFFFF",
        }}
      >
        <View>
          {dataCriteriaName.length > 0
            ? dataCriteriaName.map((item) => (
                <View
                  style={{
                    margin: 5,
                    backgroundColor: "#FFFFFFFF",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: 10,
                    }}
                    color={Color.mainColor}
                  >
                    {item.ques_num}
                    {item.require_yn == "Y" ? (
                      <Text
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </Text>
                    ) : null}
                    . {item.title}{" "}
                  </Text>
                  <View>
                    {dataCriteriaValue && item.selected
                      ? dataCriteriaValue
                          .filter((x) => x.parent_pk == item.pk)
                          .sort((a, b) => {
                            if (a.selected && !b.selected) {
                              return -1;
                            } else if (!a.selected && b.selected) {
                              return 1;
                            } else {
                              return 0;
                            }
                          })
                          .map((y) => (
                            <View style={{ flexDirection: "row" }}>
                              <TouchableWithoutFeedback
                                key={y.tieu_chi + "" + y.code}
                                onPress={() =>
                                  selectTieuChi(y.code, y.parent_pk)
                                }
                              >
                                <View>
                                  <View
                                    style={{
                                      padding: 2.5,
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Icon
                                      style={{ opacity: 0.7 }}
                                      name={
                                        y.selected
                                          ? "checkbox-marked-outline"
                                          : "checkbox-blank-outline"
                                      }
                                      color={Color.mainColor}
                                      size={25}
                                    />
                                    <View style={{ marginLeft: 3 }}>
                                      <Text style={{ opacity: 0.8 }}>
                                        {"" + y.code_nm}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          ))
                      : dataCriteriaValue
                          .filter((x) => x.parent_pk == item.pk)
                          .sort((a, b) => {
                            if (a.selected && !b.selected) {
                              return -1;
                            } else if (!a.selected && b.selected) {
                              return 1;
                            } else {
                              return 0;
                            }
                          })
                          .slice(
                            0,
                            dataCriteriaValue.filter(
                              (z) =>
                                z.parent_pk == item.pk && z.selected == true
                            ).length > 5
                              ? dataCriteriaValue.filter(
                                  (z) =>
                                    z.parent_pk == item.pk && z.selected == true
                                ).length
                              : 5
                          )
                          .map((y) => (
                            <View style={{ flexDirection: "row" }}>
                              <TouchableWithoutFeedback
                                key={y.tieu_chi + "" + y.code}
                                onPress={() =>
                                  selectTieuChi(y.code, y.parent_pk)
                                }
                              >
                                <View>
                                  <View
                                    style={{
                                      padding: 2.5,
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Icon
                                      style={{ opacity: 0.7 }}
                                      name={
                                        y.selected
                                          ? "checkbox-marked-outline"
                                          : "checkbox-blank-outline"
                                      }
                                      color={Color.mainColor}
                                      size={25}
                                    />
                                    <View style={{ marginLeft: 3 }}>
                                      <Text style={{ opacity: 0.8 }}>
                                        {"" + y.code_nm}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          ))}
                    {dataCriteriaValue && (
                      <TouchableOpacity
                        onPress={() => {
                          item.selected
                            ? onCollapse(item.pk)
                            : onLoadMore(item.pk);
                        }}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: Color.mainColor,
                            // textDecorationStyle: "dashed",
                            textDecorationLine: "underline",
                          }}
                        >
                          {item.selected ? "Thu gọn" : "Xem thêm"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            : null}
        </View>
      </ScrollView>
      {modalExtend}
      {/* <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 5,
        }}
      >
        <Text style={{ color: "red" }}>{sendStatus}</Text>
      </View> */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          backgroundColor: "#FFFFFF",
          // borderBottomRightRadius: 10,
          // borderRadius: 50,
        }}
      >
        <View style={{ flex: 1 }}>
          <TVSButton
            buttonStyle="3"
            onPress={loadNew}
            type={"secondary"}
            icon={"sync"}
          >
            Làm mới
          </TVSButton>
        </View>
        <View style={{ flex: 1 }}>
          <TVSButton
            buttonStyle="3"
            onPress={() => confirmSend()}
            icon={"check"}
          >
            Gửi phiếu
          </TVSButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
