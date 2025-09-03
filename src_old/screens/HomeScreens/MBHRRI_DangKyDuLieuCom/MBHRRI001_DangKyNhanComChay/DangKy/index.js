/**************** START: IMPORT ****************/
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import ShowError from "../../../../../services/errors";
import RequestSendNotification from "../../../../../services/notification/send";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import Icon_calendar from "../../../../../icons/Datev";
import MonthPicker from "react-native-month-year-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/**************** END: IMPORT ****************/

export default function DKNCC({ onCallbackReload }) {
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

  const [lyDo, setLyDo] = useState("");
  const [ghiChu, setGhiChu] = useState("");

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

  //************ START: STATE ************
  const [load, setLoad] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [tablePK, setTablePK] = useState("");
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth())).toDate()
  );
  const [show, setShow] = useState(false);
  const showPicker = useCallback((value) => setShow(value), []);
  const [checkedAll, setCheckedAll] = useState("N");
  const [waiting, setWaiting] = useState(false);
  const [dataDateEatRice, setDataDateEatRice] = useState([]);
  const [note, setNote] = useState("");

  //************ END: STATE ************

  //****************************************** START: HANDLE FUNCTIONS ******************************************
  const dialogError = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Ok",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  const validate = () => {
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
    setLyDo("");
    setGhiChu("");
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => {
            onResetForm();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    var arrSave = [...dataDateEatRice];
    let sel = "";
    let vegetarian_dt = "";
    let meal_shift_code = "";
    let dataDateEatRice_Y_length = 0;

    arrSave.forEach(function (item) {
      if (item.edit_yn == "Y" && item.sel == "Y") {
        sel += item.sel + "|";
        vegetarian_dt += item.vegetarian_dt + "|";
        meal_shift_code += item.meal_shift_code + "|";
        dataDateEatRice_Y_length++;
      }
    });

    if (dataDateEatRice_Y_length == 0) {
      dialogError("Bạn chưa chọn ngày ăn chay");
      return;
    }

    const pro = "UPDHRRI001000";
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: sel,
      p4_varchar2: vegetarian_dt,
      p5_varchar2: lyDo.trim(),
      p6_varchar2: ghiChu.trim(),
      p7_varchar2: dataDateEatRice.length,
      p8_varchar2: thr_emp_pk,
      p9_varchar2: meal_shift_code,
      p10_varchar2: APP_VERSION,
      p11_varchar2: crt_by,
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
            errors = "Lỗi: đăng ký không thành công.";
          }
          dialogNoti(errors);
        } else {
          dialogNoti("Đăng ký nhận cơm chay thành công");
          getDataDateEatRice();
          setTablePK(rs.data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onValueChange = useCallback(
    async (event, newDate) => {
      console.log(newDate);
      const dt = moment(newDate).format("YYYY-MM-DD");
      console.log(dt);
      showPicker(false);
      setDate(dt);
    },
    [date, showPicker]
  );

  useEffect(() => {
    getDataDateEatRice();
  }, [date, showPicker]);

  const getDataDateEatRice = () => {
    setWaiting(true);
    const pro = "SELHRRI001002";
    const in_par = {
      p1_varchar2: moment(date).format("YYYYMM").toString(),
      p2_varchar2: thr_emp_pk,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "data",
          p2_sys: "note",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs", rs);
        setWaiting(false);
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataDateEatRice(rs.data.data);
            setNote(rs.data.note[0].note);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const OnChecked = (itemPk, status) => {
    let newLst = [...dataDateEatRice];
    console.log(itemPk);
    newLst = newLst.map((obj) => {
      if (obj.pk === itemPk) {
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
      if (item.edit_yn == "Y") {
        setCheckedAll(status);
        let newLst = [...dataDateEatRice];
        newLst = newLst.map((obj) => {
          return { ...obj, sel: status };
        });
        setDataDateEatRice(newLst);
      }
    });
  };
  //****************************************** START: HANDLE FUNCTIONS ******************************************

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  {/************ START: MonthPicker /************/}
                  <Block
                    flex={1}
                    margin={10}
                    radius={8}
                    backgroundColor={Color.gray}
                  >
                    <Button
                      nextScreen={() => setShow(true)}
                      row
                      alignCenter
                      padding={10}
                      justifyContent={"space-between"}
                    >
                      <Icon_calendar color={Color.mainColor} marginLeft={20} />
                      <Text
                        size={14}
                        paddingRight={20}
                        center
                        color={Color.mainColor}
                        flex
                        paddingLeft={10}
                        height={60}
                      >
                        Tháng {moment(date).format("MM-YYYY")}
                      </Text>
                      <Text marginRight={10} />
                    </Button>
                  </Block>
                </Block>
                {/************ END: MonthPicker /************/}

                {/************ START: List Date Eat Rice /************/}
                <View style={{ padding: 8 }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ borderRadius: 2, maxHeight: 200 }}
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
                                <Icon name={"check"} color={Color.mainColor} />
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
                            width: 70,
                            borderWidth: 0.2,
                            borderColor: "#BDBDBD",
                          }}
                        >
                          <Text>Thứ</Text>
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
                            flex: 1,
                            width: 100,
                            borderWidth: 0.2,
                            borderColor: "#BDBDBD",
                          }}
                        >
                          <Text>Ca ăn</Text>
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
                          <Text>Hiệu lực</Text>
                        </View>
                      </View>
                      <ScrollView>
                        {waiting ? (
                          <ActivityIndicator color="gray" />
                        ) : (
                          dataDateEatRice.map((item) =>
                            item.edit_yn != "Y" ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  height: 30,
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
                                ></View>
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
                                      width: 70,
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
                                    <Text>{item.day_type}</Text>
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
                                      {/* {item.edit_yn} */}
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
                                      width: 100,
                                      borderBottomColor: "#BDBDBD",
                                      borderBottomWidth: 0.2,
                                      // alignItems: "center",
                                      // justifyContent: "center",
                                      borderLeftColor: "#BDBDBD",
                                      borderLeftWidth: 0.2,
                                      borderRightColor: "#BDBDBD",
                                      borderRightWidth: 0.2,
                                    }}
                                  >
                                    <Text style={{}}>{item.meal_shift}</Text>
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
                                    <Text style={{ color: Color.red }}>
                                      {item.expired}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            ) : (
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
                                        item.pk,
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
                                      width: 70,
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
                                    <Text>{item.day_type}</Text>
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
                                      width: 100,
                                      borderBottomColor: "#BDBDBD",
                                      borderBottomWidth: 0.2,
                                      // alignItems: "center",
                                      // justifyContent: "center",
                                      borderLeftColor: "#BDBDBD",
                                      borderLeftWidth: 0.2,
                                      borderRightColor: "#BDBDBD",
                                      borderRightWidth: 0.2,
                                    }}
                                  >
                                    <Text style={{}}>{item.meal_shift}</Text>
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
                                    <Text>{item.expired}</Text>
                                  </View>
                                </View>
                              </View>
                            )
                          )
                        )}
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
                {/************ END: List Date Eat Rice /************/}

                {/* START: NOTE */}
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.red}>{note}</Text>
                  </Block>
                </Block>
                {/* END: NOTE */}

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
              </Block>
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>

      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={new Date(date)}
          okButton="Chọn"
          cancelButton="Huỷ"
          enableAutoDarkMode={Platform.OS === "ios" ? true : false}
        />
      )}
    </Block>
  );
}
