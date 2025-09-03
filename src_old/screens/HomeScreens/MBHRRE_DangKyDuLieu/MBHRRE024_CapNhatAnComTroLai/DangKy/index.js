import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import ShowError from "../../../../../services/errors";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import Icon_time from "../../../../../icons/Datev";
import Calender from "../../../../../components/Calendes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function DK({ onCallbackReload }) {
  //get status isLoading
  const [expanded, setExpanded] = useState(false);
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);

  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      height: 120,
      justifyContent: "center",
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      borderStyle: "dashed",
      height: 120,
      justifyContent: "center",
    },
    blockApproveInfo: {
      marginTop: 10,
    },
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
    },

    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      height: 120,
      justifyContent: "center",
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      borderStyle: "dashed",
      height: 120,
      justifyContent: "center",
    },
    blockApproveInfo: {
      marginTop: 10,
    },
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
    },

    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: "#5A94E7",
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
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
  });

  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);

  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  let thr_emp_pk = "";
  let tokenLogin = "";
  let limit_reg_dt;
  let hide_time = "N";
  let send_mail = "N";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  const [load, setLoad] = useState(false);

  const [fromDatePhieu, setFromDatePhieu] = useState("");
  const [toDatePhieu, setToDatePhieu] = useState("");
  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const [toDate, setToDate] = useState("dd/mm/yyyy");
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("01/MM/YYYY")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("DD/MM/YYYY")
  );
  const [daySelect, setDateSelect] = useState(startDate + " - " + endDate);
  const [modalVisible, setModalVisible] = useState(false);

  const [modalVisiblePhieu, setModalVisiblePhieu] = useState(false);
  const [dataPhieu, setDataPhieu] = useState([]);
  const [phieu_code, setPhieu_code] = useState("");
  const [phieu_code_nm, setPhieu_code_nm] = useState("Chọn phiếu");
  const [lyDo, setLyDo] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [checkedAll, setCheckedAll] = useState("N");
  const [waiting, setWaiting] = useState(false);
  const [dataDateEatRice, setDataDateEatRice] = useState([]);

  useEffect(() => {
    getData(
      moment(startDate, "DD/MM/YYYY").format("YYYYMMDD"),
      moment(endDate, "DD/MM/YYYY").format("YYYYMMDD")
    );
  }, []);

  useEffect(() => {
    getDataRiceVegetarian(fromDate, toDate);
  }, [fromDate, toDate]);

  //Từ ngày
  const showDatePickerFrom = () => {
    setFromDatePickerVisible(true);
  };
  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };
  const handleConfirmFromDate = (val) => {
    hidePickerFromDate();
    if (phieu_code == "") {
      dialogNoti("Vui lòng chọn phiếu", "error");
      return;
    }

    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogNoti("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại", "error");
      return;
    } else {
      if (moment(val).format("YYYYMMDD") < fromDatePhieu) {
        dialogNoti(
          "Vui lòng chọn ngày lớn hơn hoặc bằng từ ngày trong phiếu",
          "error"
        );
        return;
      } else {
        if (moment(val).format("YYYYMMDD") > toDatePhieu) {
          console.log(moment(val).format("YYYYMMDD"), toDatePhieu);
          dialogNoti(
            "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu",
            "error"
          );
          return;
        } else {
          setFromDate(moment(val).format("DD/MM/YYYY"));
        }
      }
    }

    //check fromdate > todate set todate = fromdate
    if (
      moment(val).format("YYYYMMDD") >
      moment(toDate, "DD/MM/YYYY").format("YYYYMMDD")
    ) {
      setToDate(moment(val).format("DD/MM/YYYY"));
    }
    setFromDate(moment(val).format("DD/MM/YYYY"));
  };
  //Đến ngày
  const showDatePickerTo = () => {
    setToDatePickerVisible(true);
  };
  const hidePickerToDate = () => {
    setToDatePickerVisible(false);
  };
  const handleConfirmToDate = (val) => {
    hidePickerToDate();
    if (phieu_code == "") {
      dialogNoti("Vui lòng chọn phiếu", "error");
      return;
    }
    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogNoti("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại", "error");
      return;
    } else {
      if (moment(val).format("YYYYMMDD") > toDatePhieu) {
        dialogNoti(
          "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu",
          "error"
        );
        return;
      } else {
        if (moment(val).format("YYYYMMDD") < fromDatePhieu) {
          dialogNoti(
            "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu",
            "error"
          );
          return;
        } else {
          setToDate(moment(val).format("DD/MM/YYYY"));
        }
      }
    }

    //check todate < fromdate set fromdate = todate
    if (
      moment(val).format("YYYYMMDD") <
      moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
    ) {
      setFromDate(moment(val).format("DD/MM/YYYY"));
    }
    setToDate(moment(val).format("DD/MM/YYYY"));
  };

  const dialogNoti = (text, type) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        type == "error"
          ? {
              text: "Ok",
              style: "cancel",
            }
          : {
              text: "Đóng",
              onPress: () => {},
            },
        ,
      ],
      { cancelable: false }
    );
  };

  const validate = () => {
    if (phieu_code == "") {
      dialogNoti("Vui lòng chọn phiếu", "error");
      return;
    }
    Alert.alert(
      "Thông báo",
      "Bạn có muốn sao lưu không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                onSave();
              } else {
                ShowError("No internet");
              }
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const refreshNewToken = (obj) => {
    axios
      .post(API + "User/RefreshToken/", {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then((response) => {
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.token,
            key: "tokenLogin",
          })
        );
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.refreshToken,
            key: "refreshToken",
          })
        );
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
      })
      .catch((error) => {
        if (error == "AxiosError: Request failed with status code 400") {
          Alert.alert(
            "Thông báo",
            "Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống",
            [
              {
                text: "Đóng",
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            { cancelable: true }
          );
        }
        console.log(error);
      });
  };

  const onResetForm = () => {
    setPhieu_code("");
    setPhieu_code_nm("Chọn phiếu");
    setFromDate("dd/mm/yyyy");
    setToDate("dd/mm/yyyy");
    setLyDo("");
    setGhiChu("");
    setDataDateEatRice([]);
  };

  const getStatePhieu = (result) => {
    console.log(result);
    if (result.edit_yn == "N") {
      dialogNoti(result.noti_edit_yn);
      return;
    }
    onResetForm();
    setPhieu_code(result.code);
    setPhieu_code_nm(result.code_nm);
    setModalVisiblePhieu(false);
    setFromDatePhieu(result.start_dt);
    setToDatePhieu(result.end_dt);
    setFromDate(moment(result.start_dt).format("DD/MM/YYYY"));
    setToDate(moment(result.end_dt).format("DD/MM/YYYY"));
  };

  const modalPhieu = (
    <TVSControlPopup
      title={"Chọn phiếu"}
      isShow={modalVisiblePhieu}
      onHide={() => setModalVisiblePhieu(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePhieu(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPhieu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePhieu(item);
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

  const getData = (startDate, endDate) => {
    setLoad(true);
    const pro = "SELHRRE024000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: startDate,
      p3_varchar2: endDate,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_phieu",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataPhieu(rs.data.lst_phieu);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const getDataRiceVegetarian = () => {
    setLoad(true);
    const pro = "SELHRRE024002";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p3_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_rice_vegetarian",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataDateEatRice(rs.data.lst_rice_vegetarian);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const onSave = () => {
    var arrSave = [...dataDateEatRice];
    let lst_sel = "";
    let lst_vegetarian_dt = "";
    let lst_rice_vegetarian_pk = "";

    arrSave.forEach(function (item) {
      lst_sel += item.sel + "|";
      lst_vegetarian_dt += item.vegetarian_dt + "|";
      lst_rice_vegetarian_pk +=
        item.rice_vegetarian_pk == ""
          ? "0" + "|"
          : item.rice_vegetarian_pk + "|";
    });

    const pro = "UPDHRRE024000";
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: thr_emp_pk,
      p4_varchar2: phieu_code.toString(),
      p5_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p6_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p7_varchar2: lyDo,
      p8_varchar2: ghiChu,
      p9_varchar2: lst_sel,
      p10_varchar2: lst_vegetarian_dt,
      p11_varchar2: lst_rice_vegetarian_pk,
      p12_varchar2: arrSave.length,
      p13_varchar2: APP_VERSION,
      p14_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_varchar2: "status",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs save ", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: Đăng ký không thành công.";
          }
          dialogNoti(errors);
        } else {
          if (rs.data.status == "1") {
            dialogNoti("Đăng ký thành công");
            onResetForm();
          } else {
            dialogNoti("Đăng ký thất bại");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStateCalendar = async (result) => {
    setModalVisible(false);
    setDateSelect(result.daySelecteds);
    setStartDate(
      moment(result.startingDays, "YYYY/MM/DD").format("DD/MM/YYYY")
    );
    setEndDate(moment(result.endingDays, "YYYY/MM/DD").format("DD/MM/YYYY"));

    onResetForm();

    await getData(result.startingDays, result.endingDays);
  };

  const modal = (
    <TVSControlPopup
      title={"Chọn ngày"}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}
      maxHeight={500}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisible(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Calender
        getState={getStateCalendar}
        startDayss={moment(startDate, "DD/MM/YYYY").format("YYYY/MM/DD")}
        endDayss={moment(endDate, "DD/MM/YYYY").format("YYYY/MM/DD")}
      />
    </TVSControlPopup>
  );

  const OnChecked = (itemPk, status) => {
    let newLst = [...dataDateEatRice];
    newLst = newLst.map((obj) => {
      if (obj.vegetarian_dt === itemPk) {
        {
          return { ...obj, sel: status };
        }
      } else {
        return obj;
      }
    });
    setDataDateEatRice(newLst);
  };

  const OnCheckedAll = (status) => {
    dataDateEatRice.map((item) => {
      setCheckedAll(status);
      let newLst = [...dataDateEatRice];
      newLst = newLst.map((obj) => {
        return { ...obj, sel: status };
      });
      setDataDateEatRice(newLst);
    });
  };

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block
                  marginHorizontal={5}
                  marginBottom={10}
                  radius={8}
                  backgroundColor={Color.gray}
                >
                  <Button
                    nextScreen={() => {
                      setModalVisible(!modalVisible);
                    }}
                    row
                    alignCenter
                    justifyContent={"space-between"}
                  >
                    <Icon_time style={{ marginLeft: 20 }} />
                    <Text
                      center
                      color={Color.mainColor}
                      flex
                      size={14}
                      padding={10}
                    >
                      Ngày {daySelect}
                    </Text>
                    <Text marginRight={10} />
                  </Button>
                </Block>

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Phiếu</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisiblePhieu(true)}
                    colorText={phieu_code_nm == "Chọn phiếu" ? "#B2B2B2" : null}
                    code_nm={phieu_code_nm == "" ? "Chọn phiếu" : phieu_code_nm}
                  />
                </Block>

                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Từ ngày</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSDate
                      onPress={() => showDatePickerFrom()}
                      colorText={fromDate == "dd/mm/yyyy" ? "#B2B2B2" : null}
                      date={fromDate}
                      modalVisible={fromDatePickerVisible}
                      onConfirm={handleConfirmFromDate}
                      onCancel={hidePickerFromDate}
                    />
                  </Block>
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Đến ngày</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSDate
                      onPress={() => showDatePickerTo()}
                      colorText={toDate == "dd/mm/yyyy" ? "#B2B2B2" : null}
                      date={toDate}
                      modalVisible={toDatePickerVisible}
                      onConfirm={handleConfirmToDate}
                      onCancel={hidePickerToDate}
                    />
                  </Block>
                </Block>

                {dataDateEatRice.length > 0 ? (
                  <View style={{ padding: 8 }}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{ borderRadius: 2 }}
                    >
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              width: 40,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingVertical: 2,
                              paddingHorizontal: 5,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                OnCheckedAll(checkedAll == "Y" ? "N" : "Y");
                              }}
                            >
                              <View
                                style={
                                  checkedAll == "Y"
                                    ? styles.CheckBoxSquareY
                                    : styles.CheckBoxSquareN
                                }
                              >
                                {checkedAll == "Y" ? (
                                  <Icon
                                    name={"check"}
                                    color={Color.mainColor}
                                  />
                                ) : null}
                              </View>
                            </TouchableOpacity>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              flex: 1,
                              width: 150,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                            }}
                          >
                            <Text>Ngày ăn chay</Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 200,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                            }}
                          >
                            <Text>Tồn tại</Text>
                          </View>
                        </View>
                        <ScrollView>
                          {waiting ? (
                            <ActivityIndicator color="gray" />
                          ) : (
                            dataDateEatRice.map((item) => (
                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "center",
                                    width: 40,
                                    borderWidth: 0.2,
                                    borderColor: "#BDBDBD",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingVertical: 2,
                                    paddingHorizontal: 5,
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      OnChecked(
                                        item.vegetarian_dt,
                                        item.sel == "Y" ? "N" : "Y"
                                      );
                                    }}
                                  >
                                    <View
                                      style={
                                        item.sel == "Y"
                                          ? styles.CheckBoxSquareY
                                          : styles.CheckBoxSquareN
                                      }
                                    >
                                      {item.sel == "Y" ? (
                                        <Icon
                                          name={"check"}
                                          color={Color.mainColor}
                                        />
                                      ) : null}
                                    </View>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      paddingHorizontal: 10,
                                      width: 150,
                                      borderBottomColor: "#BDBDBD",
                                      borderBottomWidth: 0.2,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderLeftColor: "#BDBDBD",
                                      borderLeftWidth: 0.2,
                                      borderRightColor: "#BDBDBD",
                                      borderRightWidth: 0.2,
                                    }}
                                  >
                                    <Text>
                                      {moment(item.vegetarian_dt).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      paddingHorizontal: 10,
                                      width: 200,
                                      borderBottomColor: "#BDBDBD",
                                      borderBottomWidth: 0.2,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderLeftColor: "#BDBDBD",
                                      borderLeftWidth: 0.2,
                                      borderRightColor: "#BDBDBD",
                                      borderRightWidth: 0.2,
                                    }}
                                  >
                                    <Text>{item.exist_yn}</Text>
                                  </View>
                                </View>
                              </View>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                ) : null}

                {/* Control Text Area */}
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Lý do</Text>
                  </Block>
                  <Block
                    style={{
                      backgroundColor: Color.gray,
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      borderRadius: 6,
                      minHeight: 50,
                    }}
                  >
                    <TextInput
                      multiline={true}
                      placeholder={"Nhập lý do"}
                      value={lyDo}
                      onChangeText={setLyDo}
                    />
                  </Block>
                </Block>

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Ghi chú</Text>
                  </Block>
                  <Block
                    style={{
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
                      value={ghiChu}
                      onChangeText={setGhiChu}
                    />
                  </Block>
                </Block>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <TVSButton
                      onPress={onResetForm}
                      buttonStyle={"3"}
                      type={"secondary"}
                      icon={"sync"}
                      minWidth={150}
                    >
                      Đăng ký mới
                    </TVSButton>
                  </View>
                  <View>
                    <TVSButton
                      onPress={validate}
                      icon={"content-save"}
                      buttonStyle={"3"}
                      minWidth={150}
                    >
                      Sao lưu
                    </TVSButton>
                  </View>
                </View>
                {modalPhieu}
              </Block>
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
      {modal}
    </Block>
  );
}
