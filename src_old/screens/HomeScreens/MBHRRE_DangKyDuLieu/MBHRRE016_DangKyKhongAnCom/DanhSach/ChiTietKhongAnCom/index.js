/************************************************ START: IMPORT ************************************************/
import NetInfo from "@react-native-community/netinfo";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import Block from "../../../../../../components/Block";
import TVSHeader from "../../../../../../components/Tvs/Header";
import Typography from "../../../../../../components/Text";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../../../config/Pro";
import TVSButton from "../../../../../../components/Tvs/Button";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Load from "../../../../../../components/Loading";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import TVSList from "../../../../../../components/Tvs/TVSList";
/************************************************ END: IMPORT ************************************************/

const ChiTiet = ({ navigation: { goBack }, route }) => {
  //************************************************ START: VARIABLE ************************************************
  const { item, onRefresh } = route.params;
  const navigation = useNavigation();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  // Theme Color
  const Color = useSelector((s) => s.SystemReducer.theme);
  // Reducers info login
  const loginReducers = useSelector((state) => state.loginReducers);
  // Reducers menu
  const menuReducer = useSelector((state) => state.menuReducer);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk;
  let tokenLogin;
  let fullname;
  let crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  const screenWidth = Dimensions.get("window").width;

  //******************************************************************** END: VARIABLE ********************************************************************

  //************************************************ START: STATE ************************************************
  const [modalVisibleCaLamViec, setModalVisibleCaLamViec] = useState(false);
  const [dataCaLamViec, setDataCaLamViec] = useState([]);
  const [caLamViec_code, setCaLamViec_code] = useState("");
  const [caLamViec_code_nm, setCaLamViec_code_nm] = useState("Chọn ca");
  const [caLamViec_code_mm, setCaLamViec_code_mm] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [fromDate, setFromDate] = useState(moment().format("DD/MM/YYYY"));
  const [toDate, setToDate] = useState(moment().format("DD/MM/YYYY"));
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [showHide, setShowHide] = useState(false);
  const styles = StyleSheet.create({
    titleText2: {
      flex: 1,
    },
    container2: {
      flexDirection: "row",
      marginBottom: 5,
      alignItems: "center",
      borderBottomWidth: 1,
      radius: 6,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      borderColor: "#F4F6F7",
    },
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleContainer2: {
      flex: 1,
      paddingHorizontal: 5,
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    warning: {
      color: "#ffc107",
    },
    success: {
      color: "#28a745",
    },
    danger: {
      color: "#dc3545",
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

  //************************************************ START: HANDLE FUNCTION ***********************************************

  useEffect(() => {
    getData();
    if (item) {
      dataCaLamViec.forEach((element) => {
        if (element.code === item.meal_shift) {
          setCaLamViec_code(element.code);
          setCaLamViec_code_nm(element.code_nm);
          setCaLamViec_code_mm(element.code_mm);
        }
      });
      setLyDo(item.reason);
      setGhiChu(item.description);
      setFromDate(moment(item.start_dt).format("DD/MM/YYYY"));
      setToDate(moment(item.end_dt).format("DD/MM/YYYY"));
    }
  }, [item]);

  //Từ ngày
  const showDatePickerFrom = () => {
    setFromDatePickerVisible(true);
  };
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
    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày hiện tại");
      return;
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

  const getStateCaLamViec = (result) => {
    setCaLamViec_code(result.code);
    setCaLamViec_code_nm(result.code_nm);
    setCaLamViec_code_mm(result.code_mm);
    setModalVisibleCaLamViec(false);
  };

  const validate = () => {
    if (
      convertDate(fromDate, "/") ===
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      if (
        moment(new Date().getTime()).format("HH:mm") >
        moment(caLamViec_code_mm, "HH:mm").format("HH:mm")
      ) {
        dialogError(
          `Đã hết thời gian đăng ký không ăn cơm ca ${caLamViec_code_nm} ngày hôm nay!`
        );
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
  console.log("item", item);
  const getData = () => {
    const pro = "SELHRRE016000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
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
          p1_sys: "lst_calamviec",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRRE016000", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataCaLamViec(rs.data.lst_calamviec);
            if (rs.data.lst_calamviec.length > 0) {
              rs.data.lst_calamviec.forEach((element) => {
                if (element.code == item.meal_shift) {
                  setCaLamViec_code(element.code);
                  setCaLamViec_code_nm(element.code_nm);
                  setCaLamViec_code_mm(element.code_mm);
                }
              });
            }
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const convertDate = (datetime, characterSplit) => {
    const year = datetime.split(characterSplit)[2];
    const month = datetime.split(characterSplit)[1];
    const date = datetime.split(characterSplit)[0];
    const datetimeConvert = year + "" + month + "" + date;
    if (datetimeConvert == "yyyymmdd") {
      return "";
    } else return datetimeConvert;
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    if (item.edit_yn === "N") {
      dialogNoti(item.noti_edit_yn);
      return;
    }
    sysFetch(
      API,
      {
        pro: "UPDHRRE016000",
        in_par: {
          p1_varchar2: "UPDATE",
          p2_varchar2: item.pk,
          p3_varchar2: item.meal_shift,
          p4_varchar2: thr_emp_pk,
          p5_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
          p6_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
          p7_varchar2: lyDo,
          p8_varchar2: ghiChu,
          p9_varchar2: APP_VERSION,
          p10_varchar2: crt_by,
        },
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
          if (rs.data.status == item.pk) {
            dialogNoti("Cập nhật thành công");
            onRefresh();
          } else {
            dialogNoti("Cập nhật thất bại");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalCaLamViec = (
    <TVSControlPopup
      title={"Chọn ca làm việc"}
      isShow={modalVisibleCaLamViec}
      onHide={() => setModalVisibleCaLamViec(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleCaLamViec(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataCaLamViec}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateCaLamViec(item);
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
  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <Block flex>
      <TVSHeader goBack={goBack}>Chi tiết không ăn cơm</TVSHeader>
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
                  {/* START: CONTROL FROM DATE - TO DATE */}
                  <Block
                    style={{
                      flex: 1,
                      paddingHorizontal: 5,
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <Block style={{ flex: 1, marginRight: 5 }}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Từ ngày</Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <TVSDate
                        // onPress={() => showDatePickerFrom()}
                        colorText={fromDate == "dd/mm/yyyy" ? "#B2B2B2" : null}
                        date={fromDate}
                        modalVisible={fromDatePickerVisible}
                        onConfirm={handleConfirmFromDate}
                        onCancel={hidePickerFromDate}
                      />
                    </Block>

                    <Block style={{ flex: 1 }}>
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
                  {/* END: CONTROL FROM DATE - TO DATE */}
                </Block>

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Chọn ca</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    disabled={true}
                    onPress={() => setModalVisibleCaLamViec(true)}
                    colorText={
                      caLamViec_code_nm == "Chọn ca" ? "#B2B2B2" : null
                    }
                    code_nm={caLamViec_code_nm}
                  />
                </Block>

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
              {modalCaLamViec}
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default ChiTiet;
