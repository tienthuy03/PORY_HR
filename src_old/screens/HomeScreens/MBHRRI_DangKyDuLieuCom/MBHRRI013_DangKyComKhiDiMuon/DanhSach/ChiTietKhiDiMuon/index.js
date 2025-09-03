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
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
/************************************************ END: IMPORT ************************************************/

const ChiTiet = ({ navigation: { goBack }, route }) => {
  //************************************************ START: VARIABLE ************************************************
  const { item, onRefresh } = route.params;
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
  const [modalVisibleCaAn, setModalVisibleCaAn] = useState(false);
  const [dataCaAn, setDataCaAn] = useState([]);
  const [caAn_code, setCaAn_code] = useState("");
  const [caAn_code_nm, setCaAn_code_nm] = useState("Chọn ca");
  const [caAn_code_mm, setCaAn_code_mm] = useState("");

  const [tablePK, setTablePK] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [load, setLoad] = useState(false);

  const [fromDate, setFromDate] = useState(
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  // const [showHide, setShowHide] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    //set code, code_nm, code_mm ca lam viec
    dataCaAn.find((item) => {
      if (item.code == "ALL") {
        setCaAn_code(item.code);
        setCaAn_code_nm(item.code_nm);
        setCaAn_code_mm(item.code_mm);
      }
    });
    // setShowHide(true);
    getData();
  }, [fromDate]);

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
      dialogError("Vui lòng chọn ngày ăn lớn hơn hoặc bằng ngày hiện tại");
      return;
    }
    setFromDate(moment(val).format("DD/MM/YYYY"));
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

  const getStateCaAn = (result) => {
    setCaAn_code(result.code);
    setCaAn_code_nm(result.code_nm);
    setCaAn_code_mm(result.code_mm);
    setModalVisibleCaAn(false);
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
  const [dataHint, setDataHint] = useState([]);
  const [hintPosition, setHintPosition] = useState(-50);
  useEffect(() => {
    getData();
    if (item) {
      setCaAn_code(item.meal_code);
      setCaAn_code_nm(item.meal_code_nm);
      // setCaAn_code_mm(item.code_mm);
      setGhiChu(item.description);
      setFromDate(item.meal_dt);

      //   {
      //     "_ca ăn":"Sáng",
      //     "_ghi chú":"vv",
      //     "_ngày tạo dữ liệu":"29-01-2024 11:38",
      //     "checked":"N",
      //     "description":"vv",
      //     "label":"30-01-2024",
      //     "meal_code":"01",
      //     "meal_code_nm":"Sáng",
      //     "meal_dt":"30/01/2024",
      //     "pk":48460
      //  }

      console.log(moment(new Date().getTime()).format("DD/MM/YYYY"));
      console.log("item route ", item);
    }
  }, [item]);
  const getData = () => {
    const pro = "SELHRRI013000";
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
          p1_sys: "lst_CaAn",
          p2_sys: "hint",
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
            setDataHint(rs.data.hint);
            if (rs.data.hint.length > 0) {
              setHintPosition(rs.data.hint[0].position_2);
            }
            // if (rs.data.lst_CaAn.length > 0) {
            //   setCaAn_code(rs.data.lst_CaAn[0].code);
            //   setCaAn_code_nm(rs.data.lst_CaAn[0].code_nm);
            //   setCaAn_code_mm(rs.data.lst_CaAn[0].code_mm);
            // } else {
            //   setCaAn_code("");
            //   setCaAn_code_nm("Chọn ca");
            //   setCaAn_code_mm("");
            // }
            setDataCaAn(rs.data.lst_CaAn);
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
    setCaAn_code("");
    setCaAn_code_nm("Chọn ca");
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
            // onResetForm();
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
      p3_varchar2: thr_emp_pk,
      p4_varchar2: caAn_code.toString(),
      p5_varchar2: convertDate(fromDate, "/"),
      p6_varchar2: ghiChu,

      p7_varchar2: APP_VERSION,
      p8_varchar2: crt_by,
    });

    sysFetch(
      API,
      {
        pro: "UPDHRRI013000",
        in_par: {
          p1_varchar2: "UPDATE",
          p2_varchar2: item.pk,
          p3_varchar2: thr_emp_pk,
          p4_varchar2: caAn_code.toString(),
          p5_varchar2: convertDate(fromDate, "/"),
          p6_varchar2: ghiChu,

          p7_varchar2: APP_VERSION,
          p8_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "pk",
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
            errors = "Lỗi: sao lưu không thành công.";
          }
          dialogNoti(errors);
        } else {
          dialogNoti("Sao lưu thành công");
          setTablePK(rs.data.pk);
          onRefresh();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalCaAn = (
    <TVSControlPopup
      title={"Chọn ca ăn"}
      isShow={modalVisibleCaAn}
      onHide={() => setModalVisibleCaAn(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleCaAn(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataCaAn}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateCaAn(item);
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
      <TVSHeader goBack={goBack}>Chi tiết đăng ký cơm khi đi muộn</TVSHeader>
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
                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Ngày ăn</Text>
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
                      {/* END: CONTROL FROM DATE - TO DATE */}
                    </Block>
                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Chọn ca</Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <TVSList
                        // disabled={showHide}
                        onPress={() => setModalVisibleCaAn(true)}
                        colorText={caAn_code_nm == "Chọn ca" ? "#B2B2B2" : null}
                        code_nm={caAn_code_nm}
                      />
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
                  </MenuProvider>
                </Block>
                {modalCaAn}
                <Load visible={load} />
              </ScrollView>
            )}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ChiTiet;
