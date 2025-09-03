import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
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
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import { from } from "form-data";

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
  const [load, setLoad] = useState(false);

  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const [toDate, setToDate] = useState("dd/mm/yyyy");
  const [fromDatePhieu, setFromDatePhieu] = useState("");
  const [toDatePhieu, setToDatePhieu] = useState("");
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [tablePK, setTablePK] = useState("");
  const toggleSwitch = (value) => {
    setSwitchValue(value);
    setToDate(fromDate);
  };

  useEffect(() => {
    getData();
  }, []);

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
      dialogError("Vui lòng chọn phiếu");
      return;
    }
    // if (
    //   moment(val).format("YYYYMMDD") <
    //   moment(new Date().getTime()).format("YYYYMMDD")
    // ) {
    //   dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày hiện tại");
    //   return;
    // }

    // //check fromdate > todate set todate = fromdate
    // if (
    //   moment(val).format("YYYYMMDD") >
    //   moment(toDate, "DD/MM/YYYY").format("YYYYMMDD")
    // ) {
    //   setToDate(moment(val).format("DD/MM/YYYY"));
    // }
    // setFromDate(moment(val).format("DD/MM/YYYY"));

    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogError("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại");
      return;
    } else {
      if (moment(val).format("YYYYMMDD") < fromDatePhieu) {
        dialogError("Vui lòng chọn ngày lớn hơn hoặc bằng từ ngày trong phiếu");
        return;
      } else {
        if (moment(val).format("YYYYMMDD") > toDatePhieu) {
          console.log(moment(val).format("YYYYMMDD"), toDatePhieu);
          dialogError(
            "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu"
          );
          return;
        }
        // else {
        //   setFromDate(moment(val).format("DD/MM/YYYY"));
        // }
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
      dialogError("Vui lòng chọn phiếu");
      return;
    }
    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogError("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại");
      return;
    } else {
      if (moment(val).format("YYYYMMDD") > toDatePhieu) {
        dialogError(
          "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu"
        );
        return;
      } else {
        if (moment(val).format("YYYYMMDD") < fromDatePhieu) {
          dialogError(
            "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu"
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
    if (switchValue === false && fromDate === "dd/mm/yyyy") {
      dialogError("Vui lòng chọn ngày không nhận cơm hộp!");
      return false;
    }
    if (switchValue === true) {
      if (fromDate === "dd/mm/yyyy") {
        dialogError("Vui lòng chọn từ ngày không nhận cơm hộp.");
        return;
      }

      if (toDate === "dd/mm/yyyy") {
        dialogError("Vui lòng chọn đến ngày không nhận cơm hộp.");
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

  const onResetForm = () => {
    setPhieu_code("");
    setPhieu_code_nm("Chọn phiếu");
    setFromDate("dd/mm/yyyy");
    setToDate("dd/mm/yyyy");
    setLyDo("");
    setGhiChu("");
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

  //PHIEU
  const [modalVisiblePhieu, setModalVisiblePhieu] = useState(false);
  const [dataPhieu, setDataPhieu] = useState([]);
  const [phieu_code, setPhieu_code] = useState("");
  const [phieu_code_nm, setPhieu_code_nm] = useState("Chọn phiếu");
  const [colorPhieu, setColorPhieu] = useState("#B2B2B2");

  const getStatePhieu = (result) => {
    setPhieu_code(result.code);
    setPhieu_code_nm(result.code_nm);
    setColorPhieu(null);
    setModalVisiblePhieu(false);
    setFromDatePhieu(result.start_dt);
    setToDatePhieu(result.end_dt);
    setFromDate(moment(result.start_dt).format("DD/MM/YYYY"));
    setToDate(moment(result.start_dt).format("DD/MM/YYYY"));
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

  const getData = () => {
    console.log("SELHRRE017000", {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(new Date().getTime()).format("YYYYMMDD"),
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRRE017000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(new Date().getTime()).format("YYYYMMDD"),
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
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
      });
  };

  const onSave = () => {
    console.log({
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: "4",
      p4_varchar2: thr_emp_pk,
      p5_varchar2: phieu_code.toString(),
      p6_varchar2: convertDate(fromDate, "/"),
      p7_varchar2:
        toDate != "dd/mm/yyyy"
          ? convertDate(toDate, "/")
          : convertDate(fromDate, "/"),
      p8_varchar2: lyDo,
      p9_varchar2: ghiChu,

      p10_varchar2: APP_VERSION,
      p11_varchar2: crt_by,
    });

    sysFetch(
      API,
      {
        pro: "UPDHRRE017000",
        in_par: {
          p1_varchar2: "INSERT",
          p2_varchar2: "",
          p3_varchar2: "4",
          p4_varchar2: thr_emp_pk,
          p5_varchar2: phieu_code.toString(),
          p6_varchar2: convertDate(fromDate, "/"),
          p7_varchar2:
            toDate != "dd/mm/yyyy"
              ? convertDate(toDate, "/")
              : convertDate(fromDate, "/"),
          p8_varchar2: lyDo,
          p9_varchar2: ghiChu,

          p10_varchar2: APP_VERSION,
          p11_varchar2: crt_by,
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
            errors = "Lỗi: Điều chỉnh không thành công.";
          }
          dialogNoti(errors);
        } else {
          if (tablePK == "") {
            RequestSendNotification(rs.data.noti, API, tokenLogin);
            dialogNoti("Điều chỉnh nhận cơm hộp thành công");
          } else {
            dialogNoti("Cập nhật nhận cơm thành công");
          }
          setTablePK(rs.data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Phiếu</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisiblePhieu(true)}
                    colorText={colorPhieu}
                    code_nm={phieu_code_nm == "" ? "Chọn phiếu" : phieu_code_nm}
                  />
                </Block>
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text style={{ flex: 1 }} color={Color.mainColor}>
                      Không nhận cơm hộp nhiều ngày
                    </Text>
                    <Switch
                      style={{ marginRight: 10 }}
                      onValueChange={toggleSwitch}
                      value={switchValue}
                    />
                  </Block>
                </Block>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>
                        {switchValue ? "Từ ngày" : "Chọn ngày"}
                      </Text>
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
                  {switchValue ? (
                    <Block
                      style={{
                        flexDirection: "column",
                        marginBottom: 10,
                      }}
                    >
                      <Block
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            paddingLeft: 10,
                            color: Color.mainColor,
                          }}
                        ></Text>
                      </Block>
                      <Block
                        style={{
                          alignItems: "center",
                          marginLeft: 10,
                          marginRight: 10,
                          justifyContent: "center",
                          flex: 1,
                        }}
                      >
                        <Text>...</Text>
                      </Block>
                    </Block>
                  ) : null}
                  {switchValue ? (
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
                  ) : null}
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
    </Block>
  );
}
