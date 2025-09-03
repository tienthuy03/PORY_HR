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
import Person from "../../../../icons/Person";
const DangKyChamCongUBIO = ({ navigation: { goBack } }) => {
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
  const [type, setType] = useState("");
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
    getData();
  }, []);

  const getData = () => {
    const pro = "SELHRTI006000";
    const in_par = {
      p1_varchar2: employee_pk,
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
          p1_sys: "org",
          p2_sys: "pos",
          p3_sys: "date",
          p4_sys: "status",
        },
      },
      tokenLogin
    ).then((rs) => {
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
  };

  const onResetForSearch = (type) => {
    setDsNhanVien([]);
    setLoading(false);
    setOffset(0);
    setIsListEnd(false);
    onRequestToServer(type, 0);
  };

  const onFilter = () => {
    onSetHideAll();
    setTypeSelect(1);

    setIsFilter(false);
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

  const onRequestToServer = (type, offsets) => {
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
        if (type == 0) {
          const pro = "SELHRTI006001";
          const in_par = {
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
          };

          console.log(pro, in_par);

          sysFetch(
            API,
            {
              pro,
              in_par,
              out_par: {
                p1_sys: "data",
              },
            },
            tokenLogin
          )
            .then((rs) => {
              if (rs == "Token Expired") {
                refreshNewToken("grid", 0);
              }
              if (rs != "Token Expired") {
                if (rs.totalRow > 0) {
                  setOffset(offsets + 1);
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
          const pro = "SELHRTI006001";
          const in_par = {
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
          };
          console.log(pro, in_par);
          sysFetch(
            API,
            {
              pro,
              in_par,
              out_par: {
                p1_sys: "data",
              },
            },
            tokenLogin
          )
            .then((rs) => {
              if (rs == "Token Expired") {
                refreshNewToken("grid", 1);
              }
              if (rs != "Token Expired") {
                if (rs.totalRow > 0) {
                  setOffset(offsets + 1);
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
              pro: "SELHRTI006000",
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

  const renderFooter = () => {
    return (
      <View style={styles.footerLoading}>
        {loading ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const ItemView = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={styles.containerItem}>
          <TouchableOpacity
            style={{ flex: 10 }}
            onPress={() => onRegisterFace(item.pk)}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.viewAvatar}>
                {item.image.length === 0 ? (
                  <View style={[styles.avatar, { paddingLeft: 5 }]}>
                    <Person />
                  </View>
                ) : (
                  <Image
                    style={styles.avatar}
                    source={{
                      uri:
                        // item.image.length === 0? "data:image/png;base64, " + noneAvatar :
                        "data:image/png;base64, " + item.image,
                    }}
                  />
                )}
              </View>
              <View style={styles.viewContent}>
                <Text style={styles.fullname}>
                  <MaterialCommunityIcons name={"account"} size={18} />
                  {"   "}
                  {item.full_name}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyItems: "center",
                    alignContent: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 12,
                  }}
                >
                  <Text>
                    <MaterialCommunityIcons
                      name={"card-account-details"}
                      size={18}
                      color={Color.mainColor}
                    />
                    {"   "}
                    {item.emp_id}
                  </Text>
                  <Text style={{ color: item.status_color }}>
                    {item.status}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"barcode"}
                    size={18}
                    color={Color.mainColor}
                  />
                  {"   "}
                  {item.id_num}
                </Text>
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

  const onOpenPopupMachine = (type) => {
    let flag = false;
    dsNhanVien.forEach(function (item) {
      if (item.sel_yn == "Y") {
        flag = true;
      } else {
        item.status = "";
      }
    });
    if (flag) {
      setModalMachineVisible(true);
      setType(type);
    } else {
      dialogNoti("Vui lòng chọn nhân viên");
    }
  };
  const popupMachine = (
    <TVSControlPopupMachine
      title={"CHỌN MÁY CHẤM CÔNG"}
      isShow={modalMachineVisible}
      minHeight={height * 0.7}
      onHide={() => {
        setModalMachineVisible(false);
      }}
      dsNhanVien={dsNhanVien}
      setDsNhanVien={(data) => setDsNhanVien(data)}
      type={type}
    ></TVSControlPopupMachine>
  );

  const onRegisterFace = (pk) => {
    setModalOneItemVisible(true);
    const dataFilter = dsNhanVien.filter((x) => x.pk == pk)[0];
    setDataOneItem(dataFilter);
  };
  const popupRegister = (
    <TVSControlPopupRegisterFace
      title={"ĐĂNG KÝ THÔNG TIN"}
      isShow={modalOneItemVisible}
      minHeight={height}
      empInfo={dataOneItem}
      setDataOneItem={(data) => setDataOneItem(data)}
      dsNhanVien={dsNhanVien}
      setDsNhanVien={(data) => setDsNhanVien(data)}
      setModalOneItemVisible={() => setModalOneItemVisible(false)}
      onRequestToServer={(type, offsets) => onRequestToServer(type, offsets)}
    ></TVSControlPopupRegisterFace>
  );
  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {
            menu.filter((x) => x.menu_cd === "MBHRTI006")[0][
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
          </View>
          <SafeAreaView style={{ flex: 1, marginHorizontal: 5 }}>
            <FlatList
              data={dsNhanVien}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}
              ListFooterComponent={renderFooter}
              onEndReached={() => onRequestToServer(typeSelect, offset)}
              onEndReachedThreshold={0.5}
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <TVSButton
                  icon={"download"}
                  type={"primary"}
                  buttonStyle={"3"}
                  onPress={() => {
                    onOpenPopupMachine("RegisterMultiple");
                  }}
                >
                  Đăng ký
                </TVSButton>
              </View>
              <View style={{ flex: 1 }}>
                <TVSButton
                  icon={"upload"}
                  type={"success"}
                  buttonStyle={"3"}
                  onPress={() => {
                    onOpenPopupMachine("UpdateMultiple");
                  }}
                >
                  Cập nhật dữ liệu
                </TVSButton>
              </View>
            </View>
          </SafeAreaView>

          {/* <View
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
              buttonStyle={"3"}
              onPress={() => {
                onOpenPopupMachine("RegisterMultiple");
              }}
            >
              Đăng ký
            </TVSButton>
            <TVSButton
              icon={"upload"}
              type={"success"}
              buttonStyle={"3"}
              onPress={() => {
                onOpenPopupMachine("UpdateMultiple");
              }}
            >
              Cập nhật dữ liệu
            </TVSButton>
          </View> */}
        </Block>
        {modalFilter}
        {popupRegister}
        {popupMachine}
      </Block>
    </>
  );
};
export default DangKyChamCongUBIO;
