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
  //Ngay lam viec
  const showDatePickerStart = () => {
    setStartDatePickerVisible(true);
  };
  const hideDatePickerStart = () => {
    setStartDatePickerVisible(false);
  };
  const handleConfirmStart = (val) => {
    hideDatePickerStart();
    setFromDate(moment(val).format("DD/MM/YYYY"));
    setColorFrom(null);
    getNhaAn(moment(val).format("DD/MM/YYYY"), selectCodeMeal);
  };
  useEffect(() => {
    getData();
  }, []);
  const confirmSend = () => {
    let cntAnswer = 0;
    let cntQues = 0;
    let flagCheck = true;
    let alertQuesNum = "";
    dataCriteriaValue.forEach(function (item) {
      if (item.selected) {
        cntAnswer++;
        if (item.extend_yn == "Y" && item.content_extend.trim() == "") {
          flagCheck = false;
          alertQuesNum +=
            dataCriteriaName.filter((x) => x.pk == item.parent_pk)[0].ques_num +
            ", ";
        }
      }
    });
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

    if (fromDate == "dd/mm/yyyy") {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn ngày ăn",
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
    } else if (selectCodeMeal == "") {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn ca ăn",
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
    } else if (!flagCheckQues) {
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
    } else if (!flagCheck) {
      Alert.alert(
        "Thông báo",
        "Vui lòng điền câu trả lời cho câu hỏi " + alertQuesNum,
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
        strExtend += (item.content_extend ? item.content_extend : " ") + "+|+";
      }
    });
    strParentPK = strParentPK.slice(0, -3);
    strCode = strCode.slice(0, -3);
    strExtend = strExtend.slice(0, -3);
    sysFetch(
      API,
      {
        pro: "UPDHRSV002000",
        in_par: {
          p1_varchar2: "INSERT",
          p2_varchar2: "",
          p3_varchar2: moment(moment(fromDate, "DD/MM/YYYY")).format(
            "YYYYMMDD"
          ),
          p4_varchar2: selectCodeMeal,
          p5_varchar2: selectCodeCanteen,
          p6_varchar2: thr_emp_pk,
          p7_varchar2: cntAns,
          p8_varchar2: strParentPK,
          p9_varchar2: strCode,
          p10_varchar2: strExtend,
          p11_varchar2: APP_VERSION,
          p12_varchar2: crt_by,
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
            errors = "Lỗi: đăng ký không thành công.";
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
            "Gửi phiếu thành công",
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          setSendStatus(res.data.showDialog);
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
  const selectTieuChi = (code, parent_pk, extend_yn) => {
    let newData = [...dataCriteriaValue];
    if (extend_yn == "Y") {
      setCurrentItem(
        dataCriteriaValue.filter(
          (x) => x.code == code && x.parent_pk == parent_pk
        )[0]
      );
      if (
        !dataCriteriaValue.filter(
          (x) => x.code == code && x.parent_pk == parent_pk
        )[0].selected
      ) {
        setModalVisibleExtend(true);
      }
    }
    newData.forEach(function (item) {
      if (item.code != code && item.parent_pk == parent_pk) {
        if (item.selected) {
          item.selected = !item.selected;
          item.content_extend = "";
        }
      }
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
    setFromDate("dd/mm/yyyy");
    setColorFrom("#B2B2B2");
    setSelectCodeMeal("");
    setSelectNameMeal("Chọn ca ăn");
    setColorMeal("#B2B2B2");
    setSelectCodeCanteen("");
    setSelectNameCanteen("Nhà ăn");
    setColorMeal("#B2B2B2");
    getData();
  };
  const [selectNameCanteen, setSelectNameCanteen] = useState("Nhà ăn");
  const [selectCodeCanteen, setSelectCodeCanteen] = useState("");
  const [colorCanteen, setColorCanteen] = useState("#B2B2B2");
  const [dataMeal, setDataMeal] = useState([]);
  const [selectNameMeal, setSelectNameMeal] = useState("Chọn ca ăn");
  const [selectCodeMeal, setSelectCodeMeal] = useState("");
  const onChangeMeal = (result) => {
    setSelectNameMeal(result.code_nm);
    setSelectCodeMeal(result.code);

    setModalVisibleMeal(false);
    setColorMeal(null);
    getNhaAn(fromDate, result.code);
  };
  const [colorMeal, setColorMeal] = useState("#B2B2B2");
  const [modalVisibleMeal, setModalVisibleMeal] = useState(false);
  const modalMeal = (
    <TVSControlPopup
      title={"Chọn ca ăn"}
      isShow={modalVisibleMeal}
      onHide={() => setModalVisibleMeal(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleMeal(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataMeal}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeMeal(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );
  const [dataCriteriaName, setDataCriteriaName] = useState([]);
  const [dataCriteriaValue, setDataCriteriaValue] = useState([]);
  const getData = () => {
    sysFetch(
      API,
      {
        pro: "SELHRSV002000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "meal",
          p2_sys: "criteria_name",
          p3_sys: "criteria_value",
        },
      },
      tokens
    )
      .then((res) => {
        setDataMeal(res.data.meal);
        setDataCriteriaName(res.data.criteria_name);
        setDataCriteriaValue(res.data.criteria_value);
      })
      .catch((error) => {});
  };
  const renderRadioCircle = (isSelected) => {
    let circleSize = 20;
    const outerSize = circleSize > 11 ? circleSize : 11;
    const innerSize = circleSize - 7;
    return (
      <View
        style={{
          width: outerSize,
          height: outerSize,
          margin: 5,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: outerSize / 2,
          borderWidth: 2,
          borderColor: Color.mainColor,
        }}
      >
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: isSelected ? Color.mainColor : "transparent",
          }}
        />
      </View>
    );
  };
  const getNhaAn = (date, shift) => {
    if (date != "dd/mm/yyyy" && shift != "") {
      sysFetch(
        API,
        {
          pro: "SELHRSV002001",
          in_par: {
            p1_varchar2: thr_emp_pk,
            p2_varchar2: moment(moment(date, "DD/MM/YYYY")).format("YYYYMMDD"),
            p3_varchar2: shift,
            p4_varchar2: APP_VERSION,
            p5_varchar2: crt_by,
          },
          out_par: {
            p1_sys: "canteen",
          },
        },
        tokens
      )
        .then((res) => {
          if (res.data.canteen.length > 0) {
            res.data.canteen;
            setSelectCodeCanteen(res.data.canteen[0].code);
            setSelectNameCanteen(res.data.canteen[0].code_nm);
            if (res.data.canteen[0].code == "") {
              setColorCanteen("#B2B2B2");
            } else {
              setColorCanteen(null);
            }
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor={Color.gray}>
      <View
        style={{
          paddingHorizontal: 5,
          marginHorizontal: 10,
          marginTop: 5,
          backgroundColor: "#FFFFFFFF",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ margin: 5, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Chọn ngày ăn</Text>
            </View>
            <Button
              nextScreen={() => showDatePickerStart()}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorFrom }}>{fromDate}</Text>
              </View>
              <View style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon
                  name={"calendar-month-outline"}
                  color={Color.mainColor}
                  size={25}
                />
              </View>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={startDatePickerVisible}
              mode="date"
              hideTitleContainerIOS={false}
              date={
                fromDate !== "dd/mm/yyyy"
                  ? new Date(moment(fromDate, "DD/MM/YYYY"))
                  : new Date()
              }
              locale="vi_VN"
              onConfirm={handleConfirmStart}
              onCancel={hideDatePickerStart}
            />
          </View>
          <View style={{ margin: 5, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Chọn ca ăn</Text>
            </View>
            <Button
              nextScreen={() => setModalVisibleMeal(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorMeal }}>{selectNameMeal}</Text>
              </View>
              <View style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </View>
            </Button>
            {modalMeal}
          </View>
          {modalMeal}
        </View>
        <View style={{ margin: 5 }}>
          <View
            style={{
              flexDirection: "row",
              paddingBottom: 5,
              paddingLeft: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ color: Color.mainColor }}>Nhà ăn</Text>
          </View>
          <Button
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: Color.gray,
              borderRadius: 6,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingLeft: 10,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: colorCanteen }}>{selectNameCanteen}</Text>
            </View>
          </Button>
        </View>
      </View>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 5,
          marginHorizontal: 10,
          backgroundColor: "#FFFFFFFF",
        }}
      >
        <View>
          {dataCriteriaName.length > 0
            ? dataCriteriaName.map((item) => (
                <View style={{ margin: 5 }}>
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
                    {dataCriteriaValue &&
                      dataCriteriaValue
                        .filter((x) => x.parent_pk == item.pk)
                        .map((y) => (
                          <View style={{ flexDirection: "row" }}>
                            <TouchableWithoutFeedback
                              key={y.tieu_chi + "" + y.code}
                              onPress={() =>
                                selectTieuChi(y.code, y.parent_pk, y.extend_yn)
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
                                  {renderRadioCircle(y.selected)}
                                  <View style={{ marginLeft: 3 }}>
                                    <Text style={{ opacity: 0.8 }}>
                                      {"" + y.code_nm}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                            {y.extend_yn == "Y" ? (
                              <TouchableOpacity
                                onPress={() => {
                                  setCurrentItem(y);
                                  setModalVisibleExtend(true);
                                }}
                              >
                                {y.selected ? (
                                  <Icon
                                    name={"comment-edit-outline"}
                                    color={
                                      y.selected && y.content_extend == ""
                                        ? "red"
                                        : "green"
                                    }
                                    size={20}
                                  />
                                ) : null}
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        ))}
                  </View>
                </View>
              ))
            : null}
        </View>
      </ScrollView>
      {modalExtend}
      <View
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
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          backgroundColor: "#FFFFFF",
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
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
