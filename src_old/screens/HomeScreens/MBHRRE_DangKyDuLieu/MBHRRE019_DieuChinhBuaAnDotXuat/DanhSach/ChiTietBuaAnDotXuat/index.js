/************************************************ START: IMPORT ************************************************/
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
  Dimensions,
  Keyboard,
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
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSList from "../../../../../../components/Tvs/TVSList";
import TextInput from "../../../../../../components/TextInput";
import { setHeaderChil2 } from "../../../../../../Language";

/************************************************ END: IMPORT ************************************************/

const ChiTiet = ({ navigation: { goBack }, route }) => {
  //************************************************ START: VARIABLE ************************************************
  const { item, onRefresh } = route.params;
  const navigation = useNavigation();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  // Theme Color
  const Color = useSelector((s) => s.SystemReducer.theme);
  // Reducers info login
  const loginReducers = useSelector((state) => state.loginReducers);
  // Reducers menu
  const menuReducer = useSelector((state) => state.menuReducer);
  let user_language = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
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
  const [dataEmp, setDataEmp] = useState([]);
  const [lengthDataEmployeeIns, setLengthDataEmployeeIns] = useState(0);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [modalVisibleViTriAnDieuChinh, setModalVisibleViTriAnDieuChinh] =
    useState(false);
  const [viTriAnDieuChinh_code, setViTriAnDieuChinh_code] = useState("");
  const [viTriAnDieuChinh_code_nm, setViTriAnDieuChinh_code_nm] = useState(
    "Chọn vị trí ăn điều chỉnh"
  );

  const [modalVisibleCaAn, setModalVisibleCaAn] = useState(false);
  const [caAn_code, setCaAn_code] = useState("");
  const [caAn_code_nm, setCaAn_code_nm] = useState("Chọn ca ăn");

  const [modalVisibleLoai, setModalVisibleLoai] = useState(false);
  const [loai_code, setLoai_code] = useState("");
  const [loai_code_nm, setLoai_code_nm] = useState("Chọn loại");

  const [checkedAll, setCheckedAll] = useState("N");
  const [ghiChu, setGhiChu] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [dataViTriAnDieuChinh, setDataViTriAnDieuChinh] = useState([]);
  const [warning, setWarning] = useState("");
  const [dataHint, setDataHint] = useState([]);
  const [dataCaAn, setDataCaAn] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);
  const [dataViTriAnDongHop, setDataViTriAnDongHop] = useState([]);

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
    setFromDate(moment(item.start_dt, "YYYYMMDD").format("DD/MM/YYYY"));
    dataCaAn.map((itemData) => {
      if (itemData.code == item.meal_shift) {
        setCaAn_code(itemData.code);
        setCaAn_code_nm(itemData.code_nm);
      }
    });

    setLoai_code(item.rice_type_code);
    setLoai_code_nm(item.rice_type_code_nm);

    dataViTriAnDieuChinh.map((itemData) => {
      if (itemData.code == item.new_canteen_code) {
        setViTriAnDieuChinh_code(itemData.code);
        setViTriAnDieuChinh_code_nm(itemData.code_nm);
      }
    });
    setLyDo(item.reason);
    setGhiChu(item.description);
    setDataViTriAnDieuChinh(dataViTriAnDongHop);
  }, [item, dataCaAn, dataLoai, dataViTriAnDieuChinh]);

  useEffect(() => {
    // getDataEmp();
    getData();
  }, []);

  const getData = () => {
    const pro = "SELHRRE019000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: userPk,
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
          p1_sys: "lst_org",
          p2_sys: "lst_meal_shift",
          p3_sys: "lst_meal_method",
          p4_sys: "lst_canteen",
          p5_sys: "lst_box_canteen",
          p6_sys: "lst_hint",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRRE019000", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataViTriAnDongHop(rs.data.lst_box_canteen);
            setDataCaAn(rs.data.lst_meal_shift);
            setDataLoai(rs.data.lst_meal_method);
            setWarning(rs.data.lst_hint[0].note);
            setDataHint(rs.data.lst_hint);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const dialogNoti = (text, goBack) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Ok",
          onPress: () => {
            onRefresh();

            if (lengthDataEmployeeIns == 1 && goBack) {
              navigation.goBack();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmOnSave = () => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn lưu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            onSave(), setLoading(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    const pro = "UPDHRRE019001";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: item.pk,
      p3_varchar2: thr_emp_pk,
      p4_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p5_varchar2: caAn_code,
      p6_varchar2: viTriAnDieuChinh_code,
      p7_varchar2: lyDo,
      p8_varchar2: ghiChu,
      p9_varchar2: APP_VERSION,
      p10_varchar2: crt_by,
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
        console.log("rs", rs);
        if (rs.results === "S" && rs.data.status === "1") {
          dialogNoti("Sao lưu thành công");
        } else {
          let newText = rs.errorData.split("ORA");
          let errors = "";
          try {
            errors = newText[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: sao lưu.";
          }
          dialogNoti(errors);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStateViTriAnDieuChinh = (result) => {
    setViTriAnDieuChinh_code(result.code);
    setViTriAnDieuChinh_code_nm(result.code_nm);
    setModalVisibleViTriAnDieuChinh(false);
  };

  const getStateCaAn = (result) => {
    setCaAn_code(result.code);
    setCaAn_code_nm(result.code_nm);
    setModalVisibleCaAn(false);
  };

  const getStateLoai = (result) => {
    setLoai_code(result.code);
    setLoai_code_nm(result.code_nm);
    setModalVisibleLoai(false);
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

  //Từ ngày
  const showDatePickerFrom = () => {
    setFromDatePickerVisible(true);
  };
  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };
  const handleConfirmFromDate = (val) => {
    hidePickerFromDate();
    if (moment(val).format("YYYYMMDD") < moment().format("YYYYMMDD")) {
      dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày quy định");
      return;
    }

    setFromDate(moment(val).format("DD/MM/YYYY"));
  };
  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        Chi tiết{" "}
        {setHeaderChil2(
          user_language,
          menuReducer.data.data.menu,
          "MBHRRE019",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRE019")[0]
            .p_pk
        ).toLowerCase()}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <Block
          backgroundColor={"#FFFFFF"}
          alignCenter
          margin={10}
          padding={10}
          radius={10}
        >
          <Typography
            size={20}
            center
            color={Color.mainColor}
            fontFamily={"Roboto-Bold"}
          >
            {item.phongban_nm}
          </Typography>
        </Block>
        <Block paddingTop={5} paddingBottom={10} flex>
          <Block flex>
            <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  borderRadius: 8,
                  padding: 4,
                  backgroundColor: "#fff",
                }}
              >
                <MenuProvider>
                  {/* START: CONTROL FROM DATE - TO DATE */}
                  <Block
                    style={{
                      flexDirection: "row",
                      marginBottom: 5,
                    }}
                  >
                    <Block style={{ flex: 1, marginRight: 5 }}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Ngày</Text>
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
                  </Block>
                  {/* END: CONTROL FROM DATE - TO DATE */}

                  {/* START: NOTE */}
                  <Block
                    style={{
                      padding: 5,
                      marginBottom: 5,
                      width: "100%",
                    }}
                  >
                    <Menu placement={"top"}>
                      <MenuTrigger>
                        <Text style={{ color: Color.red }}>{warning}</Text>
                      </MenuTrigger>
                      <MenuOptions
                        style={{
                          width: 250,
                          backgroundColor: "white",
                          position: "absolute",
                          top: -120,
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
                  {/* END: NOTE */}

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      marginBottom: 10,
                    }}
                  >
                    {/* START: CONTROL SELECT */}
                    <Block style={{ marginBottom: 5 }}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Ca ăn</Text>
                      </Block>
                      <TVSList
                        onPress={() => setModalVisibleCaAn(true)}
                        colorText={
                          caAn_code_nm == "Chọn ca ăn" ? "#B2B2B2" : null
                        }
                        code_nm={caAn_code_nm}
                      />
                    </Block>
                    {/* END: CONTROL SELECT */}

                    <Block row marginBottom={5}>
                      <Block style={{ flex: 0.4, marginRight: 5 }}>
                        <Block style={styles.titleText}>
                          <Text color={Color.mainColor}>Loại</Text>
                        </Block>
                        <TVSList
                          maxHeight={40}
                          disabled={true}
                          onPress={() => setModalVisibleLoai(true)}
                          colorText={
                            loai_code_nm == "Chọn loại" ? "#B2B2B2" : null
                          }
                          code_nm={loai_code_nm}
                        />
                      </Block>

                      <Block style={{ flex: 0.6 }}>
                        <Block style={styles.titleText}>
                          <Text color={Color.mainColor}>
                            Vị trí ăn điều chỉnh
                          </Text>
                        </Block>
                        <TVSList
                          maxHeight={Platform.OS == "ios" ? null : 40}
                          onPress={() => setModalVisibleViTriAnDieuChinh(true)}
                          colorText={
                            viTriAnDieuChinh_code_nm ==
                            "Chọn vị trí ăn điều chỉnh"
                              ? "#B2B2B2"
                              : null
                          }
                          code_nm={viTriAnDieuChinh_code_nm}
                        />
                      </Block>
                    </Block>

                    {/* START: CONTROL TEXT INPUT LÝ DO */}
                    <Block style={{ marginBottom: 10 }}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Lý do</Text>
                      </Block>
                      <Block
                        style={{
                          backgroundColor: Color.gray,
                          paddingHorizontal: 5,
                          paddingVertical: Platform.OS == "ios" ? 10 : 0,
                          borderRadius: 6,
                          justifyContent: "center",
                          maxHeight: 40,
                        }}
                      >
                        <TextInput
                          placeholder={"Nhập lý do"}
                          value={lyDo}
                          onChangeText={setLyDo}
                          returnKeyType={"done"}
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </Block>
                    </Block>
                    {/* END: CONTROL TEXT INPUT LÝ DO */}

                    {/* START: CONTROL TEXT INPUT GHI CHÚ */}
                    <Block style={{ marginBottom: 10 }}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Ghi chú</Text>
                      </Block>
                      <Block
                        style={{
                          backgroundColor: Color.gray,
                          paddingHorizontal: 5,
                          paddingVertical: Platform.OS == "ios" ? 10 : 0,
                          borderRadius: 6,
                          justifyContent: "center",
                          maxHeight: 40,
                        }}
                      >
                        <TextInput
                          placeholder={"Nhập ghi chú"}
                          value={ghiChu}
                          onChangeText={setGhiChu}
                          returnKeyType={"done"}
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </Block>
                    </Block>
                    {/* END: CONTROL TEXT INPUT GHI CHÚ */}

                    {/* START: CONTROL TABLE NHÂN VIÊN */}
                    <View style={{ flex: 1, marginTop: 10 }}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View>
                          <View style={{ flexDirection: "row" }}>
                            <View
                              style={{
                                width: 40,
                                borderWidth: 0.2,
                                borderColor: "#BDBDBD",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                paddingVertical: 2,
                                paddingHorizontal: 5,
                                position: "relative",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  // OnCheckedAll(checkedAll == "Y" ? "N" : "Y");
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
                                alignItems: "center",
                                justifyContent: "center",
                                width: 80,
                                borderWidth: 0.2,
                                borderColor: "#BDBDBD",
                              }}
                            >
                              <Text>Mã NV</Text>
                            </View>

                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                                width: 240,
                                borderWidth: 0.2,
                                borderColor: "#BDBDBD",
                              }}
                            >
                              <Text>Họ tên</Text>
                            </View>
                          </View>
                          <ScrollView>
                            {
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginTop: 5,
                                }}
                              >
                                <View
                                  style={{
                                    paddingHorizontal: 5,
                                    justifyContent: "center",
                                    width: 40,
                                    alignItems: "center",
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      // OnChecked(
                                      //   item.pk,
                                      //   item.checked == "Y" ? "N" : "Y"
                                      // );
                                    }}
                                  >
                                    <View
                                      style={
                                        item.checked == "Y"
                                          ? styles.CheckBoxSquareY
                                          : styles.CheckBoxSquareN
                                      }
                                    >
                                      {item.checked == "Y" ? (
                                        <Icon
                                          name={"check"}
                                          color={Color.mainColor}
                                        />
                                      ) : null}
                                    </View>
                                  </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      width: 80,
                                      borderBottomColor: "#BDBDBD",
                                      borderBottomWidth: 0.2,
                                    }}
                                  >
                                    <Text>{item.emp_id}</Text>
                                  </View>

                                  <View
                                    style={{
                                      alignItems: "center",
                                      width: 240,
                                      borderBottomColor: "#BDBDBD",
                                      borderBottomWidth: 0.2,
                                      paddingLeft: 10,
                                    }}
                                  >
                                    <Text>{item.full_nm}</Text>
                                  </View>
                                </View>
                              </View>
                            }
                          </ScrollView>
                        </View>
                      </ScrollView>
                    </View>
                    {/* END: CONTROL TABLE NHÂN VIÊN */}
                  </View>
                </MenuProvider>
                {/* START: CONTROL MODAL VỊ TRÍ ĂN ĐIỀU CHỈNH */}
                <TVSControlPopup
                  title={"Chọn vị trí ăn điều chỉnh"}
                  isShow={modalVisibleViTriAnDieuChinh}
                  onHide={() => setModalVisibleViTriAnDieuChinh(false)}
                  bottom={
                    <TVSButton
                      type={"danger"}
                      icon={"close"}
                      buttonStyle={"3"}
                      onPress={() => setModalVisibleViTriAnDieuChinh(false)}
                    >
                      Đóng lại
                    </TVSButton>
                  }
                >
                  <FlatList
                    data={dataViTriAnDieuChinh}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            getStateViTriAnDieuChinh(item);
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
                {/* END: CONTROL MODAL VỊ TRÍ ĂN ĐIỀU CHỈNH */}

                {/* START: CONTROL MODAL CA ĂN*/}
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
                {/* END: CONTROL MODAL CA ĂN */}

                {/* START: CONTROL MODAL CA ĂN*/}
                <TVSControlPopup
                  title={"Chọn loại"}
                  isShow={modalVisibleLoai}
                  onHide={() => setModalVisibleLoai(false)}
                  bottom={
                    <TVSButton
                      type={"danger"}
                      icon={"close"}
                      buttonStyle={"3"}
                      onPress={() => setModalVisibleLoai(false)}
                    >
                      Đóng lại
                    </TVSButton>
                  }
                >
                  <FlatList
                    data={dataLoai}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            getStateLoai(item);
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
                {/* END: CONTROL MODAL CA ĂN */}

                {/* START: CONTROL BUTTON */}
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "white",
                    paddingVertical: 5,
                  }}
                >
                  <TVSButton
                    onPress={confirmOnSave}
                    icon={"content-save"}
                    buttonStyle={"3"}
                  >
                    Sao lưu
                  </TVSButton>
                </View>
                {/* END: CONTROL BUTTON */}
              </View>
            </Block>
          </Block>
        </Block>
        <Load visible={loading} />
      </Block>
    </Block>
  );
};

export default ChiTiet;
