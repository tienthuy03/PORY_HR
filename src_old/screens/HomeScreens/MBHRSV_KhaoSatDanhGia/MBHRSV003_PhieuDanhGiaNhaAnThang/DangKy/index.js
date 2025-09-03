import moment, { months } from "moment";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import Button from "../../../../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MonthPicker from "react-native-month-year-picker";
import Icon_calendar from "../../../../../icons/Datev";

const PDG = () => {
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk = "";
  let tokens = "";
  let fullname = "";
  let crt_by = "";
  // let arr = [];

  // let p_from_date = moment(moment(fromDate, "DD/MM/YYYY")).format("YYYYMMDD");
  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }

  //
  useEffect(() => {
    console.log("effet");
    getData();
  }, []);

  const confirmSend = () => {
    console.log("cntQues ", dataCriteriaName.length);
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
    console.log("cntAnswer ", cntAnswer);
    let flagCheckQues = true;
    dataCriteriaName
      .filter((x) => x.require_yn == "Y")
      .forEach(function (item) {
        flagCheckQues = false;
        dataCriteriaValue.forEach(function (item2) {
          if (item2.parent_pk == item.pk) {
            if (item2.selected) {
              console.log("has choosen");
              flagCheckQues = true;
            }
          }
        });
      });
    if (selectCodeCanteen == "") {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn nhà ăn",
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
    console.log({
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: month,
      p4_varchar2: selectCodeCanteen,
      p5_varchar2: thr_emp_pk,
      p6_varchar2: cntAns,
      p7_varchar2: strParentPK,
      p8_varchar2: strCode,
      p9_varchar2: strExtend,
      p10_varchar2: APP_VERSION,
      p11_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "UPDHRSV003000",
        in_par: {
          p1_varchar2: "INSERT",
          p2_varchar2: "",
          p3_varchar2: month,
          p4_varchar2: selectCodeCanteen,
          p5_varchar2: thr_emp_pk,
          p6_varchar2: cntAns,
          p7_varchar2: strParentPK,
          p8_varchar2: strCode,
          p9_varchar2: strExtend,
          p10_varchar2: APP_VERSION,
          p11_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "showDialog",
        },
      },
      tokens
    )
      .then((res) => {
        console.log("res ", res);
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
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };

  const setContentExtent = (value, code, parent_pk) => {
    console.log(code + "|" + parent_pk);
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
      console.log("extend");
      console.log(
        "filter",
        dataCriteriaValue.filter(
          (x) => x.code == code && x.parent_pk == parent_pk
        )[0].selected
      );

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
    console.log(code + "|" + parent_pk);
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
    setSelectCodeCanteen("");
    setSelectNameCanteen("Nhà ăn");
    setColorCanteen("#B2B2B2");
    getData();
  };
  const [dataCanteen, setDataCanteen] = useState([]);
  const [selectNameCanteen, setSelectNameCanteen] = useState("Nhà ăn");
  const [selectCodeCanteen, setSelectCodeCanteen] = useState("");
  const onChangeCanteen = (result) => {
    setSelectNameCanteen(result.code_nm);
    setSelectCodeCanteen(result.code);

    setModalVisibleCanteen(false);
    setColorCanteen(null);
  };
  const [colorCanteen, setColorCanteen] = useState("#B2B2B2");
  const [modalVisibleCanteen, setModalVisibleCanteen] = useState(false);
  const modalCanteen = (
    <TVSControlPopup
      title={"Chọn nhà ăn"}
      isShow={modalVisibleCanteen}
      onHide={() => setModalVisibleCanteen(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleCanteen(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataCanteen}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeCanteen(item);
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
        pro: "SELHRSV003000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "canteen",
          p2_sys: "meal",
          p3_sys: "criteria_name",
          p4_sys: "criteria_value",
        },
      },
      tokens
    )
      .then((res) => {
        console.log("res criteria_name ", res.data.criteria_name);
        console.log("res criteria_value ", res.data.criteria_value);
        setDataCanteen(res.data.canteen);
        setDataMeal(res.data.meal);
        setDataCriteriaName(res.data.criteria_name);
        setDataCriteriaValue(res.data.criteria_value);
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
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
      console.log("getDate");

      console.log(
        "date ",
        moment(moment(date, "DD/MM/YYYY")).format("YYYYMMDD")
      );
      console.log("shift ", shift);
      sysFetch(
        API,
        {
          pro: "SELHRSV003001",
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
          console.log("res canteen ", res.data.canteen);
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
        .catch((error) => {
          console.log("error");
          console.log(error);
        });
    }
  };
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth()))
  );
  const [dateString, setDateString] = useState(
    moment(new Date().setMonth(new Date().getMonth())).format("MM-YYYY")
  );
  const [month, setMonth] = useState(
    moment(new Date().setMonth(new Date().getMonth())).format("YYYYMM")
  );
  const [show, setShow] = useState(false);
  const onValueChange = async (event, newDate) => {
    setShow(false);
    setDate(newDate);
    setDateString(moment(newDate).format("MM-YYYY"));
    setMonth(moment(newDate).format("YYYYMM"));
    // getData(moment(newDate).format("YYYYMM"));
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
              <Text style={{ color: Color.mainColor }}>Chọn tháng</Text>
            </View>
            <View style={{ backgroundColor: Color.gray }}>
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                <View>
                  <Icon_calendar color={Color.mainColor} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: Color.mainColor,
                    }}
                  >
                    Tháng {dateString}
                  </Text>
                </View>
                <View>
                  <Text style={{ paddingLeft: 10 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
            <Text style={{ color: Color.mainColor }}>Chọn nhà ăn</Text>
          </View>
          <Button
            nextScreen={() => setModalVisibleCanteen(true)}
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
            <View style={{ justifyContent: "center", paddingRight: 10 }}>
              <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
            </View>
          </Button>
          {modalCanteen}
        </View>
      </View>
      <ScrollView
        style={styles.titleContainer}
        contentContainerStyle={{
          flexGrow: 1,
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
                          // fontSize: 16,
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
        {/* <Text style={{ color: "red" }}>Đã gửi</Text> */}
      </View>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={new Date(date)}
          // maximumDate={new Date()}
          enableAutoDarkMode={Platform.OS === "ios" ? true : false}
        />
      )}
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
};

const styles = StyleSheet.create({
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    // marginTop: 5,
    backgroundColor: "#FFFFFFFF",
    // borderRadius: 8,
  },
  titleText: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  formCheck: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  radioDanhGia: {
    flexDirection: "row",
  },
});
export default PDG;
