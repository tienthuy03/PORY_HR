/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import sysFetch from "../../../../services/fetch_v1";
import LinearGradient from "react-native-linear-gradient";
import TVSSelect from "../../../../components/Tvs/Select";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../../components/Button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import TVSControlPopupRegisterFace from "./Popup_DangKyKhuonMat";
import TVSControlPopupMachine from "./Popup_ChonMayChamCong";
import IconDate from "../../../../icons/Datev";
import TVSButton from "../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../config/Pro";
const DangKyKhuonMatHIK = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get("screen");
  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  const menu = useSelector((state) => state.menuReducer.data.data.menu);

  const currentLangue = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );

  const Color = useSelector((s) => s.SystemReducer.theme);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [timesClick, setTimeClick] = useState(0);
  const [typeSelect, setTypeSelect] = useState(0);
  const [noneAvatar, setNoneAvatar] = useState(
    "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"
  );
  const [flag, setFlag] = useState("N");
  const [flagMachine, setFlagMachine] = useState("N");
  const [modalOneItemVisible, setModalOneItemVisible] = useState(false);
  const [modalMachineVisible, setModalMachineVisible] = useState(false);
  const [dataOneItem, setDataOneItem] = useState([]);

  const [arrStatus, setArrStatus] = useState([]);
  const [arrOrg, setArrOrg] = useState([]);
  const [arrPos, setArrPos] = useState([]);
  const [arrDate, setArrDate] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const [toDate, setToDate] = useState("dd/mm/yyyy");
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [DaCoHinh, setDaCoHinh] = useState(true);
  const [ChuaCoHinh, setChuaCoHinh] = useState(true);
  let [dsNhanVien, setDsNhanVien] = useState([]);
  //current data
  const [selectedCurrentEmployee, setSelectedCurrentEmployee] = useState("");

  const [currentOrg, setCurrentOrg] = useState([]);
  const [currentStatus, setCurrentStatus] = useState([]);
  const [currentPos, setCurrentPos] = useState([]);
  const [currentDate, setCurrentDate] = useState([]);
  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    containerItem: {
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 5,
      marginTop: 5,
      flexDirection: "row",
      backgroundColor: Color.white,
      borderRadius: 5,
      flex: 9,
    },
    formView: {
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    bottomView: {
      alignItems: "center",
      width: "100%",
      paddingBottom: 20,
      paddingTop: 5,
      flexDirection: "row",
      borderTopColor: Color.inputBackgroundColor,
      borderTopWidth: 1,
      position: "absolute",
      zIndex: 20,
      backgroundColor: Color.white,
      bottom: 0,
    },
    btnRegister: {
      marginRight: 10,
      marginLeft: 10,
      padding: 10,
      height: 40,
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    viewRegisterAll: {
      borderRadius: 5,
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    flastList: {
      marginBottom: 80,
      zIndex: 1,
    },
    body: {
      height: 300,
    },
    content: {
      width: 300,
      backgroundColor: "white",
      borderRadius: 5,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
    },
    textHeader: {
      fontSize: 20,
      color: Color.mainColor,
      fontWeight: "bold",
    },
    footer: {
      flexDirection: "row",
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    footerLoading: {
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    btnClose: {
      backgroundColor: Color.btnForeign,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: "white",
    },
    input: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    CheckBoxE: {
      width: 30,
      height: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxD: {
      width: 30,
      height: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
    CheckBoxE_1: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxD_1: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
    viewAvatar: {
      width: 75,
      height: 90,
    },
    avatar: {
      resizeMode: "stretch",
      width: "100%",
      height: "100%",
    },
    viewContent: {
      flex: 1,
      padding: 10,
    },
    fullname: {
      fontSize: 14,
      color: Color.mainColor,
      marginBottom: 5,
    },
  });
  useEffect(() => {
    console.log("SELHRTI005000", {
      p1_varchar2: employee_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRTI005000",
        in_par: {
          p1_varchar2: employee_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "org",
          p2_sys: "pos",
          p3_sys: "date",
          p4_sys: "status",
        },
      },
      tokenLogin
    ).then((rs) => {
      console.log(rs);
      if (rs == "Token Expired") {
        refreshNewToken("list", null);
      }
      if (rs != "Token Expired") {
        if (rs.results === "S") {
          setArrOrg(rs.data.org);
          setCurrentOrg({
            code: rs.data.org[0].code,
            code_nm: rs.data.org[0].code_nm,
          });
          setArrStatus(rs.data.status);
          setCurrentStatus({
            code: rs.data.status[1].code,
            code_nm: rs.data.status[1].code_nm,
          });
          setArrPos(rs.data.pos);
          setCurrentPos({
            code: rs.data.pos[0].code,
            code_nm: rs.data.pos[0].code_nm,
          });
          setArrDate(rs.data.date);
          setCurrentDate({
            code: rs.data.date[0].code,
            code_nm: rs.data.date[0].code_nm,
          });
        }
      }
    });
  }, []);
  //current data
  const onResetForSearch = (type) => {
    setDsNhanVien([]);
    setLoading(false);
    setOffset(0);
    setIsListEnd(false);
    console.log("reset");
    // const [loading, setLoading] = useState(false);
    // const [offset, setOffset] = useState(0);
    // const [isListEnd, setIsListEnd] = useState(false);
    onRequestToServer(0, type, 0);
  };

  const onFilter = () => {
    onSetHideAll();
    setTypeSelect(1);

    setIsFilter(false);
    // onRequestToServer(timesClick + 1, 1);
    // onRequestToServer(1, 1);
    onResetForSearch(1);
  };
  const onShowModal = () => {
    setIsFilter(true);
    onSetHideAll();
    setModalVisible(true);
  };
  const onHideModalFilter = () => {
    setIsFilter(false);
    onSetHideAll();
    setModalVisible(false);
  };
  const onSetHideAll = () => {
    setIsShowDate(false);
    setIsShowPos(false);
    setIsShowStatus(false);
  };

  const onCheck = (item) => {
    let newArr = [...dsNhanVien];
    let flag = item.sel_yn == "Y" ? "N" : "Y";
    newArr.forEach(function (dataItem) {
      if (dataItem.pk == item.pk) {
        dataItem.sel_yn = flag;
      }
    });
    setDsNhanVien(newArr);
  };

  const onRequestToServer = (time, type, offsets) => {
    let TempDsNhanvien;
    if (offsets == 0) {
      TempDsNhanvien = [];
      setDsNhanVien([]);
      setOffset(0);
    } else {
      TempDsNhanvien = [...dsNhanVien];
    }
    try {
      if (!loading && !isListEnd) {
        setLoading(true);
        console.log("TYPE", type);
        if (type == 0) {
          console.log("SELHRTI005001", {
            p1_varchar2: "ALL",
            p2_varchar2: selectedCurrentEmployee,
            p3_varchar2: "ALL",
            p4_varchar2: "ALL",
            p5_varchar2: "ALL",
            p6_varchar2: "",
            p7_varchar2: "",
            p8_varchar2: "ALL",
            p9_varchar2: offsets,
            p10_varchar2: APP_VERSION,
            p11_varchar2: crt_by,
          });
          sysFetch(
            API,
            {
              pro: "SELHRTI005001",
              in_par: {
                p1_varchar2: "ALL",
                p2_varchar2: selectedCurrentEmployee,
                p3_varchar2: "ALL",
                p4_varchar2: "ALL",
                p5_varchar2: "ALL",
                p6_varchar2: "",
                p7_varchar2: "",
                p8_varchar2: "ALL",
                p9_varchar2: offsets,
                p10_varchar2: APP_VERSION,
                p11_varchar2: crt_by,
              },
              out_par: {
                p1_sys: "data",
              },
            },
            tokenLogin
          )
            .then((rs) => {
              console.log(rs);
              if (rs == "Token Expired") {
                refreshNewToken("grid", 0);
              }
              if (rs != "Token Expired") {
                if (rs.totalRow > 0) {
                  console.log("1111");
                  setOffset(offsets + 1);
                  console.log("loading");
                  //After the response increasing the offset for the next API call.
                  setDsNhanVien([...TempDsNhanvien, ...rs.data.data]);
                  setLoading(false);
                  setIsListEnd(false);
                } else {
                  console.log("2222");
                  setIsListEnd(true);
                  setLoading(false);
                }
              }
            })
            .catch((error) => {
              console.error("error form");
              console.error(error);
            });
        } else if (type == 1) {
          const characterSplit = "/";
          let flag_img = "ALL";
          if (DaCoHinh && ChuaCoHinh) {
            flag_img = "ALL";
          } else if (DaCoHinh && !ChuaCoHinh) {
            flag_img = "Y";
          } else if (!DaCoHinh && ChuaCoHinh) {
            flag_img = "N";
          }
          console.log("param 2 ", {
            p1_varchar2: currentOrg.code,
            p2_varchar2: selectedCurrentEmployee,
            p3_varchar2: currentPos.code == null ? "ALL" : currentPos.code,
            p4_varchar2:
              currentStatus.code == null ? "ALL" : currentStatus.code,
            p5_varchar2: currentDate.code == null ? "ALL" : currentDate.code,
            p6_varchar2: convertDate(characterSplit, fromDate),
            p7_varchar2: convertDate(characterSplit, toDate),
            p8_varchar2: flag_img,
            p9_varchar2: offsets,
            p10_varchar2: APP_VERSION,
            p11_varchar2: crt_by,
          });
          sysFetch(
            API,
            {
              // pro: 'SELHRTI0051100',
              pro: "SELHRTI005001",
              in_par: {
                p1_varchar2: currentOrg.code,
                p2_varchar2: selectedCurrentEmployee,
                p3_varchar2: currentPos.code == null ? "ALL" : currentPos.code,
                p4_varchar2:
                  currentStatus.code == null ? "ALL" : currentStatus.code,
                p5_varchar2:
                  currentDate.code == null ? "ALL" : currentDate.code,
                p6_varchar2: convertDate(characterSplit, fromDate),
                p7_varchar2: convertDate(characterSplit, toDate),
                p8_varchar2: flag_img,
                p9_varchar2: offsets,
                p10_varchar2: APP_VERSION,
                p11_varchar2: crt_by,
              },
              out_par: {
                p1_sys: "data",
              },
            },
            tokenLogin
          )
            .then((rs) => {
              console.log(rs);
              if (rs == "Token Expired") {
                refreshNewToken("grid", 1);
              }
              if (rs != "Token Expired") {
                if (rs.totalRow > 0) {
                  setOffset(offsets + 1);
                  console.log("loading");
                  //After the response increasing the offset for the next API call.
                  setDsNhanVien([...TempDsNhanvien, ...rs.data.data]);
                  setLoading(false);
                  setIsListEnd(false);
                } else {
                  setIsListEnd(true);
                  setLoading(false);
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const refreshNewToken = (kind, type) => {
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
        if (kind == "grid") {
          onreset();
          onRequestToServer(0, type);
        } else if (kind == "list") {
          sysFetch(
            API,
            {
              // pro: 'SELHRTI0050100',
              pro: "SELHRTI005000",
              in_par: {
                p1_varchar2: employee_pk,
                p2_varchar2: APP_VERSION,
                p3_varchar2: crt_by,
              },
              out_par: {
                p1_sys: "org",
                p2_sys: "pos",
                p3_sys: "date",
                p4_sys: "status",
              },
            },
            tokenLogin
          ).then((rs) => {
            if (rs != "Token Expired") {
              if (rs.results === "S") {
                setArrOrg(rs.data.org);
                setCurrentOrg({
                  code: rs.data.org[0].code,
                  code_nm: rs.data.org[0].code_nm,
                });
                setArrStatus(rs.data.status);
                setCurrentStatus({
                  code: rs.data.status[0].code,
                  code_nm: rs.data.status[0].code_nm,
                });
                setArrPos(rs.data.pos);
                setCurrentPos({
                  code: rs.data.pos[0].code,
                  code_nm: rs.data.pos[0].code_nm,
                });
                setArrDate(rs.data.date);
                setCurrentDate({
                  code: rs.data.date[0].code,
                  code_nm: rs.data.date[0].code_nm,
                });

                // setDataOrg(rs.data.org);
                // setLabelOrg(rs.data.org[0].code_nm);
                // setValueOrg(rs.data.org[0].code);
              }
            }
          });
        }
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

  const convertDate = (characterSplit, datetime) => {
    const year = datetime.split(characterSplit)[2];
    const month = datetime.split(characterSplit)[1];
    const date = datetime.split(characterSplit)[0];
    const datetimeConvert = year + "" + month + "" + date;
    if (datetimeConvert == "yyyymmdd") {
      return "";
    } else return datetimeConvert;
  };

  const onreset = () => {
    setIsListEnd(false);
    setLoading(false);
    setOffset(0);
    setTimeClick(0);
    setDsNhanVien([]);
    // onRequestToServer(1, 1);
  };

  const [isShowOrg, setIsShowOrg] = useState(false);
  const [isShowPos, setIsShowPos] = useState(false);
  const [isShowStatus, setIsShowStatus] = useState(false);
  const [isShowDate, setIsShowDate] = useState(false);
  const showDatePickerStart = () => {
    setStartDatePickerVisible(true);
  };

  const hideDatePickerStart = () => {
    setStartDatePickerVisible(false);
  };

  const handleConfirmStart = (val) => {
    hideDatePickerStart();
    if (toDate !== "dd/mm/yyyy") {
      if (
        moment(val).format("YYYYMMDD") >
        moment(moment(toDate, "DD/MM/YYYY")).format("YYYYMMDD")
      ) {
        setToDate(moment(val).format("DD/MM/YYYY"));
      }
    } else {
      setToDate(moment(val).format("DD/MM/YYYY"));
    }
    setFromDate(moment(val).format("DD/MM/YYYY"));
  };
  const showDatePickerEnd = () => {
    setEndDatePickerVisible(true);
  };

  const hideDatePickerEnd = () => {
    setEndDatePickerVisible(false);
  };

  const handleConfirmEnd = (val) => {
    hideDatePickerEnd();
    if (
      moment(val).format("YYYYMMDD") <
      moment(moment(fromDate, "DD/MM/YYYY")).format("YYYYMMDD")
    ) {
      Alert.alert(
        "Thông báo",
        "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
        [
          {
            text: "Đóng",
          },
        ]
      );
      return;
    }
    setToDate(moment(val).format("DD/MM/YYYY"));
  };
  const handleHideOnSelect = () => {
    setIsShowOrg(false);
    setIsShowPos(false);
    setIsShowStatus(false);
    setIsShowDate(false);
  };
  const modalFilter = (
    <TVSControlPopup
      title={"Tìm kiếm nâng cao"}
      isShow={modalVisible}
      minHeight={400}
      onHide={() => onHideModalFilter()}
      onAccept={() => onFilter()}
    >
      <View>
        <View
          style={{
            zIndex: 4,
          }}
        >
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Phòng ban</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowOrg(!isShowOrg);
                setIsShowPos(false);
                setIsShowDate(false);
                setIsShowStatus(false);
              }}
              style={{
                padding: 10,
                marginTop: 5,
                backgroundColor: Color.gray,
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: Color.mainColor,
                }}
              >
                {currentOrg.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowOrg}
            data={arrOrg}
            onSelected={(item) => {
              console.log("select item ", item);
              setIsShowOrg(false);
              setCurrentOrg(item);
            }}
          />
        </View>
        <View
          style={{
            zIndex: 3,
          }}
        >
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Chức vụ</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowPos(!isShowPos);
                setIsShowDate(false);
                setIsShowStatus(false);
              }}
              style={{
                padding: 10,
                marginTop: 5,
                backgroundColor: Color.gray,
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: Color.mainColor,
                }}
              >
                {currentPos.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowPos}
            data={arrPos}
            onSelected={(item) => {
              setIsShowPos(false);
              setCurrentPos(item);
            }}
          />
        </View>
        <View
          style={{
            zIndex: 2,
          }}
        >
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Trạng thái</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowStatus(!isShowStatus);
                setIsShowDate(false);
              }}
              style={{
                padding: 10,
                marginTop: 5,
                backgroundColor: Color.gray,
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: Color.mainColor,
                }}
              >
                {currentStatus.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowStatus}
            data={arrStatus}
            onSelected={(item) => {
              setIsShowStatus(false);
              setCurrentStatus(item);
            }}
          />
        </View>

        <View
          style={{
            zIndex: 1,
          }}
        >
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Loại ngày</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowDate(!isShowDate);
              }}
              style={{
                padding: 10,
                marginTop: 5,
                backgroundColor: Color.gray,
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: Color.mainColor,
                }}
              >
                {currentDate.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowDate}
            data={arrDate}
            onSelected={(item) => {
              setIsShowDate(false);
              setCurrentDate(item);
              if (item.code == "ALL") {
                setFromDate("dd/mm/yyyy");
                setToDate("dd/mm/yyyy");
              }
            }}
          />
        </View>

        <View style={{ zIndex: 0 }}>
          <Block row justifyContent={"space-between"}>
            <Button nextScreen={showDatePickerStart} column flex>
              <Block row marginBottom={4}>
                <Text>Từ ngày</Text>
              </Block>
              <Block
                row
                justifyContent={"space-between"}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: Color.mainColor }}>{fromDate}</Text>
                <IconDate />
              </Block>
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
            <Block
              alignCenter
              justifyCenter
              paddingTop={20}
              width={20}
              marginLeft={5}
              marginRight={5}
            >
              <Text>...</Text>
            </Block>
            <Button nextScreen={() => showDatePickerEnd()} column flex>
              <Block row marginBottom={4}>
                <Text>Đến ngày</Text>
              </Block>
              <Block
                row
                justifyContent={"space-between"}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 8,
                  color: Color.mainColor,
                }}
              >
                <Text style={{ color: Color.mainColor }}>{toDate}</Text>
                <IconDate />
              </Block>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={endDatePickerVisible}
              hideTitleContainerIOS={false}
              mode="date"
              date={
                toDate !== "dd/mm/yyyy"
                  ? new Date(moment(toDate, "DD/MM/YYYY"))
                  : new Date()
              }
              locale="vi_VN"
              onConfirm={handleConfirmEnd}
              onCancel={hideDatePickerEnd}
            />
          </Block>
        </View>
        <View zIndex={-1} flexDirection={"row"}>
          <Button
            flex
            nextScreen={() => {
              if (ChuaCoHinh) {
                setDaCoHinh(!DaCoHinh);
              }
            }}
            row
            height={40}
            paddingLeft={5}
            paddingTop={10}
            alignCenter
          >
            <View style={DaCoHinh ? styles.CheckBoxE : styles.CheckBoxD}>
              {DaCoHinh ? (
                <MaterialCommunityIcons
                  name={"check"}
                  color={DaCoHinh ? Color.mainColor : Color.white}
                />
              ) : null}
            </View>
            <Text style={{ marginLeft: 10 }}>Đã có hình</Text>
          </Button>
          <Button
            flex
            nextScreen={() => {
              if (DaCoHinh) {
                setChuaCoHinh(!ChuaCoHinh);
              }
            }}
            row
            height={40}
            paddingLeft={30}
            paddingTop={10}
            alignCenter
          >
            <View style={ChuaCoHinh ? styles.CheckBoxE : styles.CheckBoxD}>
              {ChuaCoHinh ? (
                <MaterialCommunityIcons
                  name={"check"}
                  color={ChuaCoHinh ? Color.mainColor : Color.white}
                />
              ) : null}
            </View>
            <Text style={{ marginLeft: 10 }}>Chưa có hình</Text>
          </Button>
        </View>
        <View
          style={{
            zIndex: -2,
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#ccc",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
      </View>
    </TVSControlPopup>
  );

  // const [dataOrg, setDataOrg] = useState([]);
  // const [dataOrgFilter, setDataOrgFilter] = useState([]);
  // const [valueOrg, setValueOrg] = useState('');
  // const [labelOrg, setLabelOrg] = useState('Chọn phòng ban');
  // const [modalOrgVisible, setModalOrgVisible] = useState(false);
  // const getStateOrg = async result => {
  //   setTimeout(() => {
  //     setLabelOrg(result.code_nm);
  //     setValueOrg(result.code);
  //     setModalOrgVisible(false);
  //   }, 100);
  // };
  // const modalOrg = (
  //   <TVSControlPopup
  //     title={'CHỌN PHÒNG BAN'}
  //     maxHeight={400}
  //     isShow={modalOrgVisible}
  //     onHide={() => setModalOrgVisible(false)}>
  //     <View
  //       style={{
  //         flex: 0,
  //         marginBottom: 10,
  //         flexDirection: 'row',
  //       }}>
  //       <View
  //         style={{
  //           flex: 1,
  //         }}>
  //         <TextInput
  //           onChangeText={newText => {
  //             onChangeOrgFilter(newText);
  //           }}
  //           style={{
  //             padding: 10,
  //             marginTop: 5,
  //             backgroundColor: Color.gray,
  //             justifyContent: 'center',
  //             borderRadius: 8,
  //           }}
  //         />
  //       </View>
  //     </View>
  //     <FlatList
  //       data={dataOrgFilter}
  //       keyExtractor={(item, index) => index.toString()}
  //       renderItem={({item}) => {
  //         return (
  //           <TouchableOpacity
  //             onPress={() => {
  //               getStateOrg(item);
  //             }}
  //             style={{
  //               backgroundColor: '#F3F6F9',
  //               padding: 10,
  //               borderRadius: 6,
  //               marginBottom: 3,
  //             }}>
  //             <Text>{item.code_nm}</Text>
  //           </TouchableOpacity>
  //         );
  //       }}
  //     />
  //   </TVSControlPopup>
  // );

  // const onChangeOrgFilter = textFilter => {
  //   let oldArray = dataOrg;
  //   let newArray = [];
  //   newArray = oldArray.filter(item =>
  //     item.code_nm.toLowerCase().includes(textFilter.toLowerCase()),
  //   );
  //   setDataOrgFilter(newArray);
  // };

  const renderFooter = () => {
    return (
      //Footer View with Loader
      <View style={styles.footerLoading}>
        {loading ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <View style={{ flexDirection: "row" }}>
        <View style={styles.containerItem}>
          <TouchableOpacity
            style={{ flex: 10 }}
            onPress={() => onRegisterFace(item.pk)}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.viewAvatar}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri:
                      item.image.length === 0
                        ? "data:image/png;base64, " + noneAvatar
                        : "data:image/png;base64, " + item.image,
                  }}
                />
              </View>
              <View style={styles.viewContent}>
                <Text style={styles.fullname}>
                  <MaterialCommunityIcons name={"account"} size={18} />
                  {"   "}
                  {item.full_name}
                </Text>
                <Text style={{ marginBottom: 5, fontSize: 12 }}>
                  <MaterialCommunityIcons
                    name={"card-account-details"}
                    size={18}
                    color={Color.mainColor}
                  />
                  {"   "}
                  {item.emp_id}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  <MaterialCommunityIcons
                    name={"barcode"}
                    size={18}
                    color={Color.mainColor}
                  />
                  {"   "}
                  {item.id_num}
                </Text>
                {/* <Text style={{fontSize: 12}}>
                  <MaterialCommunityIcons
                    name={'barcode'}
                    size={18}
                    color={Color.mainColor}
                  />
                  {'   '}
                  {item.count_group}
                </Text> */}
              </View>
            </View>
          </TouchableOpacity>
          <View
            flex={1}
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Button
              nextScreen={() => {
                onCheck(item);
              }}
              row
              alignCenter
            >
              <View
                style={
                  item.sel_yn == "Y" ? styles.CheckBoxE_1 : styles.CheckBoxD_1
                }
              >
                {item.sel_yn == "Y" ? (
                  <Icon name={"check"} color={Color.mainColor} size={15} />
                ) : null}
              </View>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          width: "100%",
        }}
      />
    );
  };

  const onOpenPopupMachine = () => {
    let flag = false;
    dsNhanVien.forEach(function (item) {
      if (item.sel_yn == "Y") {
        flag = true;
      }
    });
    if (flag) {
      setModalMachineVisible(true);
      setFlagMachine("Y");
    } else {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn nhân viên để đăng ký",
        [
          {
            text: "Đóng",
          },
        ],
        { cancelable: true }
      );
    }
  };
  const popupMachine = (
    <TVSControlPopupMachine
      title={"CHỌN MÁY CHẤM CÔNG"}
      isShow={modalMachineVisible}
      minHeight={height * 0.7}
      flag={flagMachine}
      onSelect={(item) => onSelectMachine(item)}
      onHide={() => {
        setFlagMachine("N");
        setModalMachineVisible(false);
      }}
    ></TVSControlPopupMachine>
  );

  const onSelectMachine = (dataMachine) => {
    setFlagMachine("N");
    setModalMachineVisible(false);
    console.log("dataMachine machine ", dataMachine);
    let arrNoGroup = [];
    let arrHasGroup = [];
    let arrLstEmpPK = [];
    let lst_machine_pk = "";
    let lst_emp_pk = "";
    dataMachine.forEach(function (item) {
      lst_machine_pk += item.pk + ",";
    });
    lst_machine_pk = lst_machine_pk.substring(0, lst_machine_pk.length - 1);

    dsNhanVien.forEach(function (itemUser) {
      if (itemUser.sel_yn == "Y") {
        if (itemUser.count_group == 0) {
          console.log("push ", itemUser.id_num);
          dataMachine.forEach(function (itemMachine) {
            arrNoGroup.push({
              EMP_ID: itemUser.emp_id,
              ID_NUM: itemUser.id_num,
              BORNTIME: itemUser.borntime,
              IMAGE_FACE: itemUser.image,
              GENDER: itemUser.gender,
              HAS_PHOTO: itemUser.has_photo,
              FULL_NAME: itemUser.full_name,
              FULL_FNAME: itemUser.full_fname,
              CARD_NUM: itemUser.card_num,
              FP_HIK_1: itemUser.fp_hik_1,
              FP_HIK_2: itemUser.fp_hik_2,
              FP_HIK_3: itemUser.fp_hik_3,
              FP_HIK_4: itemUser.fp_hik_4,
              FP_HIK_5: itemUser.fp_hik_5,
              FP_HIK_6: itemUser.fp_hik_6,
              FP_HIK_7: itemUser.fp_hik_7,
              FP_HIK_8: itemUser.fp_hik_8,
              FP_HIK_9: itemUser.fp_hik_9,
              FP_HIK_10: itemUser.fp_hik_10,
              FP_UBIO_1_1: itemUser.fp_ubio_1_1,
              FP_UBIO_1_2: itemUser.fp_ubio_1_2,
              FP_UBIO_2_1: itemUser.fp_ubio_2_1,
              FP_UBIO_2_2: itemUser.fp_ubio_2_2,
              FP_UBIO_3_1: itemUser.fp_ubio_3_1,
              FP_UBIO_3_2: itemUser.fp_ubio_3_2,
              AUTH_FINGER_YN: itemMachine.auth_finger_yn,
              AUTH_CARD_YN: itemMachine.auth_card_yn,
              AUTH_FACE_YN: itemMachine.auth_face_yn,
              FACE_IP: itemMachine.face_ip,
              URL_API: itemMachine.url_api,
              IP: itemMachine.ip,
              PORT: itemMachine.port,
              PASSWORD: itemMachine.password,
              MACHINE_KIND: itemMachine.machine_kind,
              URL_API_SERVER: itemMachine.url_api_server,
              URL_WS: itemMachine.url_ws,
              URL_CALLBACK: itemMachine.url_callback,
              UBIO_URL: itemMachine.ubio_url,
              UBIO_TER_ID: itemMachine.ubio_ter_id,
              UBIO_ADMIN_ID: itemMachine.admin_id,
              UBIO_ADMIN_PASSWORD: itemMachine.admin_password,
            });
          });
        } else if (itemUser.count_group > 0) {
          lst_emp_pk += itemUser.pk + ",";
        }
      }
    });
    if (arrNoGroup.length > 0) {
      onRegisterUserNoGroup(arrNoGroup);
    }
    if (lst_emp_pk.length > 0) {
      arrLstEmpPK.push({
        list_emp_pk: lst_emp_pk.substring(0, lst_emp_pk.length - 1),
        list_machine_pk: lst_machine_pk,
      });
    }
    if (arrLstEmpPK.length > 0) {
      sysFetch(
        API,
        {
          pro: "SELHRTI005005",
          in_par: {
            p1_varchar2: arrLstEmpPK[0].list_emp_pk,
            p2_varchar2: arrLstEmpPK[0].list_machine_pk,
            p3_varchar2: APP_VERSION,
            p4_varchar2: crt_by,
          },
          out_par: {
            p1_sys: "data",
          },
        },
        tokenLogin
      ).then((rs) => {
        console.log(rs.data.data);
        if (rs.data.data.length > 0) {
          rs.data.data.forEach(function (itemEmpGroup) {
            arrHasGroup.push({
              EMP_ID: itemEmpGroup.emp_id,
              ID_NUM: itemEmpGroup.id_num,
              BORNTIME: itemEmpGroup.borntime,
              IMAGE_FACE: itemEmpGroup.image_face,
              GENDER: itemEmpGroup.gender,
              HAS_PHOTO: itemEmpGroup.has_photo,
              FULL_NAME: itemEmpGroup.full_name,
              FULL_FNAME: itemEmpGroup.full_fname,
              CARD_NUM: itemEmpGroup.card_num,
              FP_HIK_1: itemEmpGroup.fp_hik_1,
              FP_HIK_2: itemEmpGroup.fp_hik_2,
              FP_HIK_3: itemEmpGroup.fp_hik_3,
              FP_HIK_4: itemEmpGroup.fp_hik_4,
              FP_HIK_5: itemEmpGroup.fp_hik_5,
              FP_HIK_6: itemEmpGroup.fp_hik_6,
              FP_HIK_7: itemEmpGroup.fp_hik_7,
              FP_HIK_8: itemEmpGroup.fp_hik_8,
              FP_HIK_9: itemEmpGroup.fp_hik_9,
              FP_HIK_10: itemEmpGroup.fp_hik_10,
              FP_UBIO_1_1: itemEmpGroup.fp_ubio_1_1,
              FP_UBIO_1_2: itemEmpGroup.fp_ubio_1_2,
              FP_UBIO_2_1: itemEmpGroup.fp_ubio_2_1,
              FP_UBIO_2_2: itemEmpGroup.fp_ubio_2_2,
              FP_UBIO_3_1: itemEmpGroup.fp_ubio_3_1,
              FP_UBIO_3_2: itemEmpGroup.fp_ubio_3_2,
              AUTH_FINGER_YN: itemEmpGroup.auth_finger_yn,
              AUTH_CARD_YN: itemEmpGroup.auth_card_yn,
              AUTH_FACE_YN: itemEmpGroup.auth_face_yn,
              FACE_IP: itemEmpGroup.face_ip,
              URL_API: itemEmpGroup.url_api,
              IP: itemEmpGroup.ip,
              PORT: itemEmpGroup.port,
              PASSWORD: itemEmpGroup.password,
              MACHINE_KIND: itemEmpGroup.machine_kind,
              URL_API_SERVER: itemEmpGroup.url_api_server,
              URL_WS: itemEmpGroup.url_ws,
              UBIO_URL: itemEmpGroup.ubio_url,
              UBIO_TER_ID: itemEmpGroup.ubio_ter_id,
              UBIO_ADMIN_ID: itemEmpGroup.admin_id,
              UBIO_ADMIN_PASSWORD: itemEmpGroup.admin_password,
            });
          });
          console.log("arrHasGroup ", arrHasGroup);
          onRegisterUserHasGroup(arrHasGroup);
        }
      });
    }
  };
  const onRegisterUserHasGroup = (arrData) => {
    let arrHIK = [];
    let arrUBIO = [];
    arrData.forEach(function (item) {
      if (item.MACHINE_KIND == "HIK") {
        arrHIK.push(item);
      }
      if (item.MACHINE_KIND == "UBIO") {
        arrUBIO.push(item);
      }
    });
    if (arrHIK.length > 0) {
      console.log("registerHik ", arrHIK.length);
      onRegisterHIK(arrHIK);
    }
    if (arrUBIO.length > 0) {
      console.log("registerUBIO", arrUBIO.length);
      onRegisterUBIO(arrUBIO);
    }
  };
  const onRegisterUserNoGroup = (arrData) => {
    let arrHIK = [];
    let arrUBIO = [];
    arrData.forEach(function (item) {
      if (item.MACHINE_KIND == "HIK") {
        arrHIK.push(item);
      }
      if (item.MACHINE_KIND == "UBIO") {
        arrUBIO.push(item);
      }
    });
    if (arrHIK.length > 0) {
      console.log("registerHik ", arrHIK.length);
      onRegisterHIK(arrHIK);
    }
    if (arrUBIO.length > 0) {
      console.log("registerUBIO", arrUBIO.length);
      onRegisterUBIO(arrUBIO);
    }
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
      "content-type": "application/json",
    },
  };
  const onRegisterHIK = (arrData) => {
    let params;
    let urlPost;

    arrData.forEach(function (item) {
      params = JSON.stringify({
        MachineIp: item.IP,
        Password: item.PASSWORD,
        empId: item.EMP_ID,
        name: item.FULL_NAME,
        hasPhoto: item.HAS_PHOTO,
        gender: item.GENDER,
        bornTime: item.BORNTIME,
        FDID: "1",
      });
      urlPost = item.URL_WS + "Face/RegisterUser";
      axios
        .post(
          urlPost,
          params,
          {
            headers: {
              "content-type": "application/json",
            },
          },
          axiosConfig
        )
        .then((res) => {
          if (res.data.Data != null) {
            console.log("res.data.Data.statusCode ", res.data.Data.statusCode);
            if (res.data.Data.statusCode == "1") {
            } else if (res.data.Data.statusCode == "6") {
              params = JSON.stringify({
                MachineIp: item.IP,
                Password: item.PASSWORD,
                empId: item.EMP_ID,
                name: item.FULL_NAME,
                hasPhoto: item.HAS_PHOTO,
                gender: item.GENDER,
                bornTime: item.BORNTIME,
                FDID: "1",
                FaceIP: item.FACE_IP,
              });
              urlPost = item.url_ws + "Face/RegisterPhoto";
              axios
                .post(
                  urlPost,
                  params,
                  {
                    headers: {
                      "content-type": "application/json",
                    },
                  },
                  axiosConfig
                )
                .then((res2) => {
                  console.log("res2.data.Data ", res2.data.Result);
                  if (res2.data.Result == "S") {
                  } else {
                  }
                })
                .catch((err2) => {
                  console.log("err2 HIK ", err2);
                });
            } else {
            }
          } else {
          }
        })
        .catch((err) => {
          console.log("err HIK ", err);
        });
    });
  };

  const onRegisterUBIO = (arrData) => {
    let param;
    let paramDel;
    let paramDownload;
    let urlPost;
    let urlDel;
    let urlDownload;
    arrData.forEach(function (item) {
      console.log(item.IP);
      param =
        '{"param":{"UserID":"' +
        item.ID_NUM +
        '","UserName":"' +
        item.FULL_FNAME +
        '","image":"' +
        item.IMAGE_FACE +
        '","CardNum":"' +
        item.CARD_NUM +
        '","FP_1_1":"' +
        item.FP_UBIO_1_1 +
        '","FP_1_2":"' +
        item.FP_UBIO_1_2 +
        '","FP_2_1":"' +
        item.FP_UBIO_2_1 +
        '","FP_2_2":"' +
        item.FP_UBIO_2_2 +
        '","FP_3_1":"' +
        item.FP_UBIO_3_1 +
        '","FP_3_2":"' +
        item.FP_UBIO_3_2 +
        '","AdminID":"' +
        item.UBIO_ADMIN_ID +
        '","Password":"' +
        item.UBIO_ADMIN_PASSWORD +
        '"}}';
      urlPost = item.UBIO_URL + "/" + "RegisterUser";
      axios
        .post(
          urlPost,
          param,
          {
            headers: {
              "content-type": "application/json",
            },
          },
          axiosConfig
        )
        .then((res) => {
          console.log("res UBIO ", JSON.parse(res.data.d));
          if (JSON.parse(res.data.d).Result.ResultCode == "16777217") {
            //0x01000001
            //ErrorUserDuplicateID
            urlDel = item.UBIO_URL + "/" + "DeleteUser";
            paramDel =
              '{"param":{"UserID":"' +
              item.ID_NUM +
              '","TerminalID":"' +
              item.UBIO_TER_ID +
              '","AdminID":"' +
              item.UBIO_ADMIN_ID +
              '","Password":"' +
              item.UBIO_ADMIN_PASSWORD +
              '"}}';
            axios
              .post(
                urlDel,
                paramDel,
                {
                  headers: {
                    "content-type": "application/json",
                  },
                },
                axiosConfig
              )
              .then((res2) => {
                console.log("res2 Ubio ", JSON.parse(res2.data.d));
                axios
                  .post(
                    urlPost,
                    param,
                    {
                      headers: {
                        "content-type": "application/json",
                      },
                    },
                    axiosConfig
                  )
                  .then((res3) => {
                    console.log("res3 UBio ", JSON.parse(res3.data.d));
                    urlDownload = item.UBIO_URL + "/" + "DownloadUserTerminal";
                    paramDownload =
                      '{"param":{"TerminalID":"' +
                      item.UBIO_TER_ID +
                      '","UserID":"' +
                      item.ID_NUM +
                      '","AdminID":"' +
                      item.UBIO_ADMIN_ID +
                      '","Password":"' +
                      item.UBIO_ADMIN_PASSWORD +
                      '"}}';
                    axios
                      .post(
                        urlDownload,
                        paramDownload,
                        {
                          headers: {
                            "content-type": "application/json",
                          },
                        },
                        axiosConfig
                      )
                      .then((res4) => {
                        console.log(JSON.parse(res4.data.d));
                        if (JSON.parse(res4.data.d).Result.ResultCode == 0) {
                        } else {
                        }
                      })
                      .catch((err4) => {
                        console.log("err4 UBio ", err4);
                      });
                  })
                  .catch((err3) => {
                    console.log("err3 UBio ", err3);
                  });
              })
              .catch((err2) => {
                console.log("err2 UBio ", err2);
              });
          } else if (JSON.parse(res.data.d).Result.ResultCode == "0") {
            urlDownload = item.UBIO_URL + "/" + "DownloadUserTerminal";
            paramDownload =
              '{"param":{"TerminalID":"' +
              item.UBIO_TER_ID +
              '","UserID":"' +
              item.ID_NUM +
              '","AdminID":"' +
              item.UBIO_ADMIN_ID +
              '","Password":"' +
              item.UBIO_ADMIN_PASSWORD +
              '"}}';
            axios
              .post(
                urlDownload,
                paramDownload,
                {
                  headers: {
                    "content-type": "application/json",
                  },
                },
                axiosConfig
              )
              .then((res2) => {
                console.log(JSON.parse(res2.data.d));
                if (JSON.parse(res2.data.d).Result.ResultCode == 0) {
                } else {
                }
              })
              .catch((err2) => {
                console.log("err2 UBio ", err2);
              });
          } else {
          }
        })
        .catch((err) => {
          console.log("err UBio ", err);
        });
    });
  };

  const onRegisterFace = (pk) => {
    setModalOneItemVisible(true);
    const dataFilter = dsNhanVien.filter((x) => x.pk == pk)[0];
    setFlag("Y");
    setDataOneItem(dataFilter);
  };
  const popupRegister = (
    <TVSControlPopupRegisterFace
      title={"ĐĂNG KÝ THÔNG TIN"}
      isShow={modalOneItemVisible}
      minHeight={height}
      // onHide={() => setModalOneItemVisible(false)}
      flag={flag}
      empInfo={dataOneItem}
      onReloadImage={(item) => onReloadImage(item)}
    ></TVSControlPopupRegisterFace>
  );

  const onReloadImage = (imageData) => {
    console.log("reload");
    setModalOneItemVisible(false);
    // Update newState for list dsNhanVien
    if (imageData.flag_change == "Y") {
      console.log("update image");
      let newDs = [...dsNhanVien];
      newDs = newDs.map((obj) => {
        if (obj.pk === imageData.pk) {
          {
            return { ...obj, image: imageData.image };
          }
        } else {
          return obj;
        }
      });
      setDsNhanVien(newDs);
    }
    setFlag("N");
  };
  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {
            menu.filter((x) => x.menu_cd === "MBHRTI005")[0][
              currentLangue.toLowerCase()
            ]
          }
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <View
            zIndex={20}
            style={{
              marginVertical: 5,
              marginHorizontal: 10,
              marginBottom: 0,
            }}
          >
            <View
              style={{
                flex: 0,
                flexDirection: "row",
              }}
            >
              {/* <View
                style={{
                  flex: 1,
                }}>
                <Text>Phòng ban</Text>
                <Button
                  nextScreen={() => {
                    setDataOrgFilter(dataOrg);
                    setModalOrgVisible(true);
                  }}
                  row
                  style={{
                    padding: 8,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Block flex justifyCenter>
                    <Text
                      numberOfLines={1}
                      size={16}
                      style={{
                        color: valueOrg === '' ? '#B2B2B2' : null,
                      }}>
                      {labelOrg}
                    </Text>
                  </Block>
                  <Block justifyCenter>
                    <Icon
                      name={'arrow-down-drop-circle-outline'}
                      color={Color.mainColor}
                      size={24}
                    />
                  </Block>
                </Button>
              </View> */}
              <View style={{ flex: 1, marginBottom: 10 }}>
                <TextInput
                  onChangeText={(newText) =>
                    setSelectedCurrentEmployee(newText)
                  }
                  placeholder={"Tìm kiếm"}
                  placeholderTextColor={"#5A94E7"}
                  style={{
                    padding: Platform.OS === "ios" ? 10 : 6,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: "center",
                    borderRadius: 8,
                  }}
                />
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  marginLeft: 10,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setTypeSelect(0);
                    onResetForSearch(0);
                  }}
                >
                  <LinearGradient
                    colors={["#01acec", "#2E86C1"]}
                    style={{
                      backgroundColor: "red",
                      borderRadius: 10,
                      padding: 8,
                      backgroundColor: Color.gray,
                    }}
                  >
                    <Icon name={"account-search"} size={20} color={"white"} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  marginLeft: 10,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => onShowModal()}
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: Color.white,
                  }}
                >
                  <Icon
                    name={isFilter ? "filter-outline" : "filter"}
                    color={Color.mainColor}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <View
              style={{
                flex: 0,
                marginTop: 5,
                marginBottom: 5,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text>Nhân viên</Text>
                <TextInput
                  onChangeText={newText => setSelectedCurrentEmployee(newText)}
                  style={{
                    padding: Platform.OS === 'ios' ? 10 : 6,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}
                />
              </View>
              <View
                style={{
                  justifyContent: 'flex-end',
                  marginLeft: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setTypeSelect(0);
                    // onreset();
                    // onRequestToServer(1, 0);
                    onResetForSearch(0);
                  }}>
                  <LinearGradient
                    colors={['#01acec', '#2E86C1']}
                    style={{
                      backgroundColor: 'red',
                      borderRadius: 10,
                      padding: 10,
                      backgroundColor: Color.gray,
                    }}>
                    <Icon name={'account-search'} size={20} color={'white'} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
          <SafeAreaView style={{ flex: 1, marginHorizontal: 5 }}>
            <FlatList
              data={dsNhanVien}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}
              ListFooterComponent={renderFooter}
              onEndReached={() => onRequestToServer(0, typeSelect, offset)}
              onEndReachedThreshold={0.5}
            />
          </SafeAreaView>
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TVSButton
              icon={"download"}
              type={"primary"}
              buttonStyle={"2"}
              onPress={() => {
                onOpenPopupMachine();
              }}
            >
              Đăng ký
            </TVSButton>
            <TVSButton
              icon={"upload"}
              type={"primary"}
              buttonStyle={"2"}
              // onPress={() => {
              //   onConfirmRegister();
              // }}
            >
              Cập nhật dữ liệu
            </TVSButton>
          </View>
        </Block>
        {/* {modalOrg} */}
        {modalFilter}
        {popupRegister}
        {popupMachine}
      </Block>
    </>
  );
};
export default DangKyKhuonMatHIK;
