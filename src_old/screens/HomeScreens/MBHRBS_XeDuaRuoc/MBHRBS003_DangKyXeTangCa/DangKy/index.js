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
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
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
import RequestSendNotification from "../../../../../services/notification/send";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import IconDate from "../../../../../icons/Datev";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

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

  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [tablePK, setTablePK] = useState("");
  const [isPickupDisabled, setIsPickupDisabled] = useState(false);
  const [isReturnDisabled, setIsReturnDisabled] = useState(false);
  //HINT
  const [dataHint, setDataHint] = useState([]);
  const [hintPosition, setHintPosition] = useState(-100);
  //NOTE
  const [dataNote, setDataNote] = useState([]);
  const [dataDefault, setDataDefault] = useState([]);
  //LOAI DANG KY
  const [modalVisibleRegType, setModalVisibleRegType] = useState(false);
  const [dataRegType, setDataRegType] = useState([]);
  const [regType_code, setRegType_code] = useState("");
  const [regType_code_nm, setRegType_code_nm] = useState("Chọn loại đăng ký");

  //DIEM DON
  const [modalVisibleDiemDon, setModalVisibleDiemDon] = useState(false);
  const [dataDiemDon, setDataDiemDon] = useState([]);
  const [diemDon_code, setDiemDon_code] = useState("");
  const [diemDon_code_nm, setDiemDon_code_nm] = useState("Chọn điểm đón");

  //DIEM TRA
  const [modalVisibleDiemTra, setModalVisibleDiemTra] = useState(false);
  const [dataDiemTra, setDataDiemTra] = useState([]);
  const [diemTra_code, setDiemTra_code] = useState("");
  const [diemTra_code_nm, setDiemTra_code_nm] = useState("Chọn điểm trả");

  const [ghiChu, setGhiChu] = useState("");

  useEffect(() => {
    getData();
  }, []);

  //Từ ngày
  const [weekdays, setWeekdays] = useState("");
  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };
  const handleConfirmFromDate = (val) => {
    hidePickerFromDate();
    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày hiện tại");
      return;
    }

    setFromDate(moment(val).format("DD/MM/YYYY"));
    getDataApprove(moment(val).format("YYYYMMDD"));
    getData2(moment(val).format("YYYYMMDD"));
  };

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

  const getStateRegType = (result) => {
    if (result.flag == "Y") {
      console.log("cancel");
      console.log("data ", dataDefault);
      if (dataDefault.length > 0) {
        setDiemDon_code(dataDefault[0].pickup_code);
        setDiemDon_code_nm(dataDefault[0].pickup_code_nm);
        setDiemTra_code(dataDefault[0].return_code);
        setDiemTra_code_nm(dataDefault[0].return_code_nm);
        setIsPickupDisabled(true);
        setIsReturnDisabled(true);
      } else {
        setIsPickupDisabled(false);
        setIsReturnDisabled(false);
      }
    } else {
      setIsPickupDisabled(false);
      setIsReturnDisabled(false);
      setDiemDon_code("");
      setDiemDon_code_nm("Chọn điểm đón");
      setDiemTra_code("");
      setDiemTra_code_nm("Chọn điểm trả");
    }
    setRegType_code(result.code);
    setRegType_code_nm(result.code_nm);
    setModalVisibleRegType(false);
  };

  const getStateDiemDon = (result) => {
    setDiemDon_code(result.code);
    setDiemDon_code_nm(result.code_nm);
    setModalVisibleDiemDon(false);
  };

  const getStateDiemTra = (result) => {
    setDiemTra_code(result.code);
    setDiemTra_code_nm(result.code_nm);
    setModalVisibleDiemTra(false);
  };

  const validate = () => {
    if (diemDon_code_nm == "" || diemDon_code == "") {
      dialogError("Vui lòng chọn điểm đón");
      return;
    }

    if (diemTra_code == "" || diemTra_code_nm == "") {
      dialogError("Vui lòng chọn điểm trả");
      return;
    }

    if (fromDate === "dd/mm/yyyy") {
      dialogError("Vui lòng chọn từ ngày.");
      return;
    }

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
        // if (obj == 'updateExperience') {
        //   updateExperience();
        // }
        // if (obj == 'getData') {
        //   getData();
        // }
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
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRBS003000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_note",
          p2_sys: "lst_reg_type",
          p3_sys: "lst_diemdon",
          p4_sys: "lst_diemtra",
          p5_sys: "lst_default",
          p6_sys: "hint",
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
            console.log(rs.data.hint);
            setDataHint(rs.data.hint);
            if (rs.data.hint.length > 0) {
              setHintPosition(rs.data.hint[0].position);
            }
            setDataNote(rs.data.lst_note);
            if (rs.data.lst_note.length > 0) {
              setFromDate(rs.data.lst_note[0].code_nm);
            }

            setDataRegType(rs.data.lst_reg_type);
            setDataDiemDon(rs.data.lst_diemdon);
            setDataDiemTra(rs.data.lst_diemtra);
            setDataDefault(rs.data.lst_default);
            getData2(
              moment(rs.data.lst_note[0].code_nm, "DD/MM/YYYY").format(
                "YYYYMMDD"
              )
            );
            getDataApprove(
              moment(rs.data.lst_note[0].code_nm, "DD/MM/YYYY").format(
                "YYYYMMDD"
              )
            );
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const [workgroup_code, setWorkgroup_code] = useState("");

  const [workgroup_code_nm, setWorkgroup_code_nm] = useState("");

  const getData2 = (date) => {
    console.log("par_in ", {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: date,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRBS003001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: date,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            // [{"date_type": "Ngày thường", "workgroup_code": 3, "workgroup_code_nm": "Nhóm kíp C"}]
            console.log(rs.data.lst_data);
            if (rs.data.lst_data.length > 0) {
              setWorkgroup_code(rs.data.lst_data[0].workgroup_code);
              setWorkgroup_code_nm(rs.data.lst_data[0].workgroup_code_nm);
              setWeekdays(" - " + rs.data.lst_data[0].date_type);
            } else {
              setWorkgroup_code("");
              setWorkgroup_code_nm("");
            }
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const getDataApprove = (date) => {
    setCurrentSelectedLevel({ arr: [], name: "Chọn vai trò phê duyệt" });
    setCurrentSelectedPerson({ approve_name: "Chọn người phê duyệt" });
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: date,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRBS003002",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: date,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_approve",
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
            // limit_reg_dt = rs.data.limit_reg_dt;
            hanleApproveInfo(rs.data.lst_approve);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const onResetForm = () => {
    setTablePK("");

    setRegType_code("");
    setRegType_code_nm("Chọn loại đăng ký");
    setDiemDon_code("");
    setDiemDon_code_nm("Chọn điểm đón");
    setDiemTra_code("");
    setDiemTra_code_nm("Chọn điểm trả");
    // setFromDate("dd/mm/yyyy");
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
    const pro = "UPDHRBS003000";
    const in_par = {
      p1_varchar2: tablePK !== "" ? "UPDATE" : "INSERT",
      p2_varchar2: tablePK,
      p3_varchar2: thr_emp_pk,
      p4_varchar2: diemDon_code.toString(),
      p5_varchar2: diemTra_code.toString(),
      p6_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      // p7_varchar2: regType_code.toString(),
      p7_varchar2: ghiChu,
      p8_varchar2: currentSelectedPerson.approve_role_type,
      p9_varchar2: currentSelectedPerson.thr_emp_pk.toString(),
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
          p2_sys: "noti",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs.results == "F") {
          showAlert(rs.errorData);
        } else {
          if (tablePK == "") {
            RequestSendNotification(rs.data.noti, API, tokenLogin);
            dialogNoti("Đăng ký thành công");
          } else {
            dialogNoti("Cập nhật thành công");
          }
          setTablePK(rs.data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalLoaiDangKy = (
    <TVSControlPopup
      title={"Chọn loại đăng ký"}
      isShow={modalVisibleRegType}
      onHide={() => setModalVisibleRegType(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleRegType(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataRegType}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateRegType(item);
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

  const modalDiemDon = (
    <TVSControlPopup
      title={"Chọn điểm đón"}
      isShow={modalVisibleDiemDon}
      onHide={() => setModalVisibleDiemDon(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleDiemDon(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataDiemDon}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateDiemDon(item);
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

  const modalDiemTra = (
    <TVSControlPopup
      title={"Chọn điểm trả"}
      isShow={modalVisibleDiemTra}
      onHide={() => setModalVisibleDiemTra(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleDiemTra(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataDiemTra}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateDiemTra(item);
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
  const [modalVisibleNPD, setModalVisibleNPD] = useState(false);
  const [dataSelectedApprove, setDataSelectedApprove] = useState([]);
  const [dataInsertApprove, setDataInsertApprove] = useState([]);
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

  const modalNPD = (
    <TVSControlPopup
      title={"Chọn người phê duyệt"}
      isShow={modalVisibleNPD}
      minHeight={500}
      onHide={() => setModalVisibleNPD(false)}
      onAccept={() => onUpdateApprove()}
      bottom={
        <TVSButton
          onPress={() => setModalVisibleNPD(false)}
          buttonStyle={"3"}
          type={"danger"}
          icon={"close"}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Block borderWidth={1}>
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
    </TVSControlPopup>
  );

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <MenuProvider>
                  <Block
                    style={{
                      padding: 5,
                      marginBottom: 5,
                      width: "100%",
                    }}
                  >
                    <Menu placement={"top"}>
                      <MenuTrigger>
                        {dataHint.length > 0 ? (
                          <Text style={{ color: Color.red }}>
                            {dataHint[0].note}
                          </Text>
                        ) : null}
                      </MenuTrigger>
                      <MenuOptions
                        style={{
                          width: 300,
                          backgroundColor: "white",
                          position: "absolute",
                          top: hintPosition,
                          left: 0,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.5,
                          shadowRadius: 3.84,
                        }}
                      >
                        {dataHint.length > 0
                          ? dataHint.map((item) => {
                              return (
                                <MenuOption>
                                  <Text>{item.code_nm}</Text>
                                </MenuOption>
                              );
                            })
                          : null}
                      </MenuOptions>
                    </Menu>
                  </Block>
                  {/* {dataNote.length > 0 ? (
                  <Block
                    style={{
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                    }}
                  >
                    <Text style={{ color: "red" }} fontStyle={"italic"}>
                      {dataNote[0].note}
                    </Text>
                  </Block>
                ) : null} */}

                  <Block
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <Block style={[styles.titleContainer]}>
                      <Block flex={1}>
                        <Button
                          nextScreen={() => {
                            setFromDatePickerVisible(true);
                          }}
                          column
                        >
                          <Block style={styles.titleText}>
                            <Text color={Color.mainColor}>
                              Ngày bố trí đi xe
                            </Text>
                            <Text color={Color.red}> *</Text>
                          </Block>
                          <Block
                            radius={6}
                            backgroundColor={Color.gray}
                            row
                            justifyContent={"space-between"}
                            alignCenter
                            padding={8}
                          >
                            <Text>
                              {fromDate}

                              {weekdays}
                            </Text>
                            <IconDate />
                          </Block>
                        </Button>
                      </Block>

                      <DateTimePickerModal
                        cancelTextIOS="Hủy bỏ"
                        confirmTextIOS="Xác nhận"
                        isVisible={fromDatePickerVisible}
                        mode="date"
                        hideTitleContainerIOS={false}
                        date={
                          fromDate !== "dd/mm/yyyy"
                            ? new Date(moment(fromDate, "DD/MM/YYYY"))
                            : new Date()
                        }
                        locale="vi_VN"
                        onConfirm={handleConfirmFromDate}
                        onCancel={hidePickerFromDate}
                      />
                    </Block>
                  </Block>
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Ca kíp</Text>
                      {/* <Text color={Color.red}> *</Text> */}
                    </Block>
                    <Block
                      style={{
                        backgroundColor: Color.gray,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        borderRadius: 6,
                        minHeight: 40,
                        overflow: "hidden",
                      }}
                    >
                      <Text numberOfLines={1}>{workgroup_code_nm}</Text>
                    </Block>
                  </Block>
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Điểm đón</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSList
                      disabled={isPickupDisabled}
                      onPress={() => setModalVisibleDiemDon(true)}
                      colorText={
                        diemDon_code_nm == "Chọn điểm đón" ? "#B2B2B2" : null
                      }
                      code_nm={diemDon_code_nm}
                    />
                  </Block>

                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Điểm trả tại công ty</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSList
                      disabled={isReturnDisabled}
                      onPress={() => setModalVisibleDiemTra(true)}
                      colorText={
                        diemTra_code_nm == "Chọn điểm trả" ? "#B2B2B2" : null
                      }
                      code_nm={diemTra_code_nm}
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

                  {/* approve info start */}
                  <Block>
                    <Block style={styles.blockApproveInfo}>
                      {/* approve info start */}
                      <Block
                        border={1}
                        padding={10}
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
                </MenuProvider>
              </Block>
              {/* {modalTuyenDuong} */}
              {modalLoaiDangKy}
              {modalDiemDon}
              {modalDiemTra}
              {modalNPD}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
}
