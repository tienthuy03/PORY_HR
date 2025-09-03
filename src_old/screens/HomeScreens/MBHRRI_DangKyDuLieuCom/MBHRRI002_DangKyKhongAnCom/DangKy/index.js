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

export default function DKKAC({ onCallbackReload }) {
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
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
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
  const [modalVisibleCaLamViec, setModalVisibleCaLamViec] = useState(false);
  const [dataCaLamViec, setDataCaLamViec] = useState([]);
  const [caLamViec_code, setCaLamViec_code] = useState("");
  const [caLamViec_code_nm, setCaLamViec_code_nm] = useState("Chọn ca");
  const [caLamViec_code_mm, setCaLamViec_code_mm] = useState("");

  const [tablePK, setTablePK] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [load, setLoad] = useState(false);

  const [fromDate, setFromDate] = useState(
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );
  const [toDate, setToDate] = useState(
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [showHide, setShowHide] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (fromDate == toDate) {
      setShowHide(false);
    } else {
      //set code, code_nm, code_mm ca lam viec
      dataCaLamViec.find((item) => {
        if (item.code == "ALL") {
          setCaLamViec_code(item.code);
          setCaLamViec_code_nm(item.code_nm);
          setCaLamViec_code_mm(item.code_mm);
        }
      });
      setShowHide(true);
    }
    getData();
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
    // if (
    //   convertDate(fromDate, "/") ===
    //   moment(new Date().getTime()).format("YYYYMMDD")
    // ) {
    //   if (
    //     moment(new Date().getTime()).format("HH:mm") >
    //     moment(caLamViec_code_mm, "HH:mm").format("HH:mm")
    //   ) {
    //     dialogError(
    //       `Đã hết thời gian đăng ký không ăn cơm ca ${caLamViec_code_nm} ngày hôm nay!`
    //     );
    //     return;
    //   }
    // }

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
    const pro = "SELHRRI002000";
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
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataCaLamViec(rs.data.lst_calamviec);
            console.log("data::::::::::::;", rs.data.lst_calamviec);

            if (rs.data.lst_calamviec.length > 0) {
              //filter rs.data.lst_calamviec set default code, code_nm, code_mm
              rs.data.lst_calamviec.map((item) => {
                if (item.code == "ALL") {
                  setCaLamViec_code(item.code);
                  setCaLamViec_code_nm(item.code_nm);
                  setCaLamViec_code_mm(item.code_mm);
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

  const onResetForm = () => {
    setFromDate(moment(new Date().getTime()).format("DD/MM/YYYY"));
    setToDate(moment(new Date().getTime()).format("DD/MM/YYYY"));
    setCaLamViec_code("");
    setCaLamViec_code_nm("Chọn ca");
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
    console.log({
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: "3",
      p4_varchar2:
        caLamViec_code.toString() == "" ? "ALL" : caLamViec_code.toString(),
      p5_varchar2: thr_emp_pk,
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
        pro: "UPDHRRI002000",
        in_par: {
          p1_varchar2: "INSERT",
          p2_varchar2: "",
          p3_varchar2:
            caLamViec_code.toString() == "" ? "ALL" : caLamViec_code.toString(),
          p4_varchar2: thr_emp_pk,
          p5_varchar2: convertDate(fromDate, "/"),
          p6_varchar2:
            toDate != "dd/mm/yyyy"
              ? convertDate(toDate, "/")
              : convertDate(fromDate, "/"),
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
          console.log("tablePK", tablePK);
          if (tablePK == "") {
            RequestSendNotification(rs.data.noti, API, tokenLogin);
            dialogNoti("Đăng ký không ăn cơm thành công");
          } else {
            dialogNoti("Cập nhật không ăn cơm thành công");
          }
          setTablePK(rs.data.status);
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
                        onPress={() => showDatePickerFrom()}
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
                    disabled={showHide}
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
              {modalCaLamViec}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
}
