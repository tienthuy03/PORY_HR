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
  Keyboard,
} from "react-native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import ShowError from "../../../../../services/errors";
import RequestSendNotification from "../../../../../services/notification/send";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import TVSDateTime from "../../../../../components/Tvs/TVSDateTime";
import ModalChonNhanVien from "../ModalChonNhanVien";

export default function DK({ onCallbackReload }) {
  //get status isLoading
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

    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
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

  //DIEM DON
  const [modalVisibleLyDoDieuDong, setModalVisibleLyDoDieuDong] =
    useState(false);
  const [dataLyDoDieuDong, setDataLyDoDieuDong] = useState([]);
  const [lyDoDieuDong_code, setLyDoDieuDong_code] = useState("");
  const [lyDoDieuDong_code_nm, setLyDoDieuDong_code_nm] = useState(
    "Chọn lý do điều động"
  );

  const [ghiChu, setGhiChu] = useState("");
  const [noiDi, setNoiDi] = useState("");
  const [noiDen, setNoiDen] = useState("");

  const [time2, setTime2] = useState("hh:mm");
  const [date2, setDate2] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const onChangeTime2 = (val) => {
    setTime2(moment(val).format("HH:mm"));
  };
  const onChangeDate2 = (val) => {
    setDate2(moment(val).format("DD/MM/YYYY"));
  };

  const [time1, setTime1] = useState("hh:mm");
  const [date1, setDate1] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const onChangeTime1 = (val) => {
    setTime1(moment(val).format("HH:mm"));
  };
  const onChangeDate1 = (val) => {
    setDate1(moment(val).format("DD/MM/YYYY"));
  };

  const [dataEmployeeIns, setDataEmployeeIns] = useState([]);
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);
  const [dataPhongBan, setDataPhongBan] = useState([]);

  const showPopupSelectEmp = () => {
    setModalVisibleEmp(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const dialogError = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Thoát",
          onPress: () => {
            setLoad(false);
          },
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  const getStateLyDoDieuDong = (result) => {
    setLyDoDieuDong_code(result.code);
    setLyDoDieuDong_code_nm(result.code_nm);
    setModalVisibleLyDoDieuDong(false);
  };

  const validate = () => {
    if (approveInfo.length > 0) {
      if (currentSelectedLevel.arr.length === 0) {
        dialogError("Bạn chưa chọn vai trò phê duyệt.");
        return;
      }

      if (!currentSelectedPerson.thr_emp_pk) {
        dialogError("Bạn chưa chọn người phê duyệt.");
        return;
      }
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

  const getData = () => {
    const pro = "SELHRRE025000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_reason_emergency",
          p2_sys: "lst_approve",
          p3_sys: "lst_org",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRRE025000", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataLyDoDieuDong(rs.data.lst_reason_emergency);
            hanleApproveInfo(rs.data.lst_approve);
            setDataPhongBan(rs.data.lst_org);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const onResetForm = () => {
    setNoiDi("");
    setNoiDen("");
    setTime1("hh:mm");
    setDate1(moment(new Date()).format("DD/MM/YYYY"));
    setTime2("hh:mm");
    setDate2(moment(new Date()).format("DD/MM/YYYY"));
    setLyDoDieuDong_code("");
    setLyDoDieuDong_code_nm("");
    setDataEmployeeIns([]);
    setGhiChu("");
    setCurrentSelectedLevel({ arr: [], name: "Chọn vai trò phê duyệt" });
    setCurrentSelectedPerson({ approve_name: "Chọn người phê duyệt" });
  };
  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    let emp_pk = "";
    let emp_id = "";
    let emp_full_nm = "";
    dataEmployeeIns.map((item) => {
      emp_pk += item.pk + "|";
      emp_id += item.emp_id + "|";
      emp_full_nm += item.full_nm + "|";
    });
    const pro = "UPDHRRE025000";
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: "",
      p4_varchar2: thr_emp_pk,
      p5_varchar2: time1,
      p6_varchar2: moment(date1, "DD/MM/YYYY").format("YYYYMMDD"),
      p7_varchar2: time2,
      p8_varchar2: moment(date2, "DD/MM/YYYY").format("YYYYMMDD"),
      p9_varchar2: noiDi,
      p10_varchar2: noiDen,
      p11_varchar2: lyDoDieuDong_code,
      p12_varchar2: ghiChu,

      p13_varchar2: dataEmployeeIns.length,
      p14_varchar2: emp_pk,
      p15_varchar2: emp_id,
      p16_varchar2: emp_full_nm,

      p17_varchar2: currentSelectedPerson.approve_role_type,
      p18_varchar2: currentSelectedPerson.thr_emp_pk.toString(),

      p19_varchar2: APP_VERSION,
      p20_varchar2: crt_by,
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
        console.log("rs UPDHRRE025000 ", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: đăng ký không thành công.";
          }
          dialogNoti(errors);
        } else {
          if (rs.data.status == "1") {
            dialogNoti("Đăng ký thành công");
          } else {
            dialogNoti("Cập nhật thành công");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalLyDoDieuDong = (
    <TVSControlPopup
      title={"Chọn lý do điều động"}
      isShow={modalVisibleLyDoDieuDong}
      onHide={() => setModalVisibleLyDoDieuDong(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleLyDoDieuDong(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataLyDoDieuDong}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateLyDoDieuDong(item);
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

  const [approveInfo, setApproveInfo] = useState([]);
  const [approveDefault, setApproveDefault] = useState([]);
  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: "Chọn vai trò phê duyệt",
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: "Chọn người phê duyệt",
  });
  //handle when approve level changed
  const onChangeSelectedLevel = (value) => {
    setCurrentSelectedLevel(value);
  };
  //handle when approve person change
  const onChangeSelectedPerson = (value) => {
    setCurrentSelectedPerson(value);
  };
  const hanleApproveInfo = (arrayData) => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    arrayData.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = arrayData.filter((y) => {
        return y.level_name === x;
      });
      let default_yn = null;
      let required_yn = false;
      tempArr.map((z) => {
        if (z.required_yn === "Y") {
          required_yn = true;
        }
        if (default_yn === null && z.default_yn === "Y") {
          default_yn = z;
        }
      });
      if (!required_yn && default_yn !== null) {
        arrApproveDefault = arrApproveDefault.filter(
          (item) => item.approve_role_type !== default_yn.approve_role_type
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === "Y") {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    setApproveInfo(arrApproveInfo);
    setApproveDefault(arrApproveDefault);
  };

  const SelectLevelApprove = ({
    onChangeSelectedPerson,
    currentSelectedLevel,
    onChangeSelectedLevel,
    approveInfo,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text flexWrap={"wrap"} color={Color.mainColor}>
          Vai trò phê duyệt <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            backgroundColor: Color.gray,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 5,
            borderBottomColor: Color.inputBackgroundColor,
            borderBottomWidth: 1,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedLevel.name === "Chọn vai trò phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedLevel.name}
              </Text>
            </View>
            <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              {approveInfo.map((item, index) => {
                if (item.name === currentSelectedLevel.name) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedLevel(item);
                      onChangeSelectedPerson({
                        approve_name: "Chọn người phê duyệt",
                      });
                    }}
                    key={index.toString()}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      backgroundColor: "white",
                      marginBottom: 5,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      flex={1}
                      flexWrap={"wrap"}
                      paddingLeft={5}
                      paddingRight={5}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };
  const SelectApprovePerson = ({
    currentSelectedPerson,
    onChangeSelectedPerson,
    currentSelectedLevel,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text
          flexWrap={"wrap"}
          paddingLeft={5}
          paddingRight={5}
          color={Color.mainColor}
        >
          Người phê duyệt <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            backgroundColor: Color.gray,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 5,
            borderBottomColor: Color.inputBackgroundColor,
            borderBottomWidth: 1,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedPerson.approve_name ===
                    "Chọn người phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedPerson.approve_name}
              </Text>
            </View>
            <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              {currentSelectedLevel.arr.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedPerson(item);
                    }}
                    key={index.toString()}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      backgroundColor: "white",
                      marginBottom: 5,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      flex={1}
                      flexWrap={"wrap"}
                      paddingLeft={5}
                      paddingRight={5}
                    >
                      {item.approve_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block style={styles.titleContainer}>
                  <TVSDateTime
                    mode={"datetime"}
                    required={true}
                    label={"Từ thời gian"}
                    value={time1}
                    onChangeDateTime={(val) => onChangeTime1(val)}
                    value2={date1}
                    onChangeDateTime2={(val) => onChangeDate1(val)}
                  />
                </Block>

                <Block style={styles.titleContainer}>
                  <TVSDateTime
                    mode={"datetime"}
                    required={true}
                    label={"Đến thời gian"}
                    value={time2}
                    onChangeDateTime={(val) => onChangeTime2(val)}
                    value2={date2}
                    onChangeDateTime2={(val) => onChangeDate2(val)}
                  />
                </Block>

                {/* Control Text Area */}
                <Block flex row paddingHorizontal={5} marginBottom={10}>
                  <Block style={{ flex: 1, marginRight: 5 }}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Nơi đi</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <Block
                      style={{
                        backgroundColor: Color.gray,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        borderRadius: 6,
                      }}
                    >
                      <TextInput
                        placeholder={"Nhập nơi đi"}
                        value={noiDi}
                        onChangeText={setNoiDi}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                      />
                    </Block>
                  </Block>

                  <Block style={{ flex: 1 }}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Nơi đến</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <Block
                      style={{
                        backgroundColor: Color.gray,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        borderRadius: 6,
                      }}
                    >
                      <TextInput
                        placeholder={"Nhập nơi đến"}
                        value={noiDen}
                        onChangeText={setNoiDen}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                      />
                    </Block>
                  </Block>
                </Block>

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Lý do điều động</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisibleLyDoDieuDong(true)}
                    colorText={
                      lyDoDieuDong_code_nm == "Chọn lý do điều động"
                        ? "#B2B2B2"
                        : null
                    }
                    code_nm={lyDoDieuDong_code_nm}
                  />
                </Block>

                {/* Control Text Area */}
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
                    }}
                  >
                    <TextInput
                      placeholder={"Nhập ghi chú"}
                      value={ghiChu}
                      onChangeText={setGhiChu}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                    />
                  </Block>
                </Block>

                {/* START: CONTROL DS NHÂN VIÊN */}
                <View
                  border={1}
                  paddingVertical={10}
                  borderColor={Color.gray}
                  radius={6}
                  borderWidth={1}
                  borderRadius={8}
                  style={{
                    marginHorizontal: 5,
                    flex: 1,
                    marginBottom: 10,
                    marginTop: 12,
                  }}
                >
                  <View row style={styles.fieldsetTitle}>
                    <View
                      style={{
                        borderBottomColor: Color.mainColor,
                        borderBottomWidth: 0.2,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          showPopupSelectEmp();
                        }}
                      >
                        <Text fontWeight={"bold"} color={Color.mainColor}>
                          Thông tin người đi xe{"  "}
                          <Icon
                            name={"pencil-outline"}
                            color={Color.mainColor}
                            size={15}
                          />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 5 }}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View>
                        <View style={{ flexDirection: "row" }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 120,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                              paddingVertical: 5,
                            }}
                          >
                            <Text>Mã NV</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 250,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                              paddingVertical: 5,
                            }}
                          >
                            <Text>Họ tên</Text>
                          </View>
                        </View>
                        <ScrollView>
                          {dataEmployeeIns.map((item) => (
                            <View
                              style={{
                                flexDirection: "row",
                                paddingVertical: 2,
                                borderBottomColor: "#BDBDBD",
                                borderLeftWidth: 0.2,
                                borderLeftColor: "#BDBDBD",
                                borderRightWidth: 0.2,
                                borderRightColor: "#BDBDBD",
                                borderBottomWidth: 0.2,
                              }}
                            >
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 120,
                                }}
                              >
                                <Text>{item.emp_id}</Text>
                              </View>
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 250,
                                }}
                              >
                                <Text>{item.full_nm}</Text>
                              </View>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                </View>
                {/* END: CONTROL DS NHÂN VIÊN */}

                {/* approve info start */}
                <Block>
                  <Block style={styles.blockApproveInfo}>
                    {/* approve info start */}
                    <Block
                      border={1}
                      paddingHorizontal={10}
                      borderColor={Color.gray}
                      radius={6}
                      marginBottom={10}
                      marginLeft={5}
                      marginRight={5}
                    >
                      <Block
                        padding={3}
                        radius={4}
                        height={40}
                        alignCenter
                        row
                        style={styles.approveIntoTitle}
                        marginHorizontal={5}
                      >
                        <Text fontWeight={"bold"} color={Color.mainColor}>
                          Thông tin người phê duyệt
                        </Text>
                      </Block>
                      <Block>
                        <SelectLevelApprove
                          onChangeSelectedPerson={onChangeSelectedPerson}
                          currentSelectedLevel={currentSelectedLevel}
                          approveInfo={approveInfo}
                          onChangeSelectedLevel={onChangeSelectedLevel}
                        />
                        <SelectApprovePerson
                          currentSelectedLevel={currentSelectedLevel}
                          currentSelectedPerson={currentSelectedPerson}
                          onChangeSelectedPerson={onChangeSelectedPerson}
                        />
                      </Block>
                    </Block>
                    {/* approve info end */}
                  </Block>
                </Block>
                {/* approve info end */}

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
              {modalLyDoDieuDong}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
        <ModalChonNhanVien
          isShow={modalVisibleEmp}
          handleShow={setModalVisibleEmp}
          dataPhongBan={dataPhongBan}
          dataEmployeeIns={dataEmployeeIns}
          setDataEmployeeIns={setDataEmployeeIns}
        ></ModalChonNhanVien>
      </Block>
    </Block>
  );
}
