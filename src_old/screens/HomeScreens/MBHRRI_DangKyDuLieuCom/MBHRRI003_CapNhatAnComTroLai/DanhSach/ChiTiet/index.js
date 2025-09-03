/************************************************ START: IMPORT ************************************************/
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Block from "../../../../../../components/Block";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../../config/Pro";
import TVSButton from "../../../../../../components/Tvs/Button";
import moment from "moment";
import Load from "../../../../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSHeader from "../../../../../../components/Tvs/Header";
import NetInfo from "@react-native-community/netinfo";
import { setHeaderChil2 } from "../../../../../../Language";
import TVSList from "../../../../../../components/Tvs/TVSList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/************************************************ END: IMPORT ************************************************/

const ChiTiet = ({ navigation: { goBack }, route }) => {
  const { item, onRefresh } = route.params;
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
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

  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let limit_reg_dt;
  let hide_time = "N";
  let send_mail = "N";
  let userPk;
  let refreshToken;
  let crt_by = "";
  let dataMenuMBHRs = [];
  let language;
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

  const [fromDatePhieu, setFromDatePhieu] = useState("");
  const [toDatePhieu, setToDatePhieu] = useState("");
  const [fromDate, setFromDate] = useState(
    moment(item.start_dt, "YYYYMMDD").format("DD/MM/YYYY")
  );
  const [toDate, setToDate] = useState(
    moment(item.end_dt, "YYYYMMDD").format("DD/MM/YYYY")
  );
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);

  const [phieu_code_nm, setPhieu_code_nm] = useState("");
  const [phieu_meal_shift, setPhieu_meal_shift] = useState("");

  const [lyDo, setLyDo] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [checkedAll, setCheckedAll] = useState("N");
  const [waiting, setWaiting] = useState(false);
  const [dataDateEatRice, setDataDateEatRice] = useState([]);

  useEffect(() => {
    setFromDatePhieu(item.start_dt_old);
    setToDatePhieu(item.end_dt_old);
    setFromDate(moment(item.start_dt, "YYYYMMDD").format("DD/MM/YYYY"));
    setToDate(moment(item.end_dt, "YYYYMMDD").format("DD/MM/YYYY"));
    setLyDo(item.reason);
    setGhiChu(item.description);

    setPhieu_code_nm(item.code_nm);
    setPhieu_meal_shift(item.meal_shift);
  }, [item]);

  useEffect(() => {
    getDataRiceVegetarian(fromDate, toDate);
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
      dialogNoti("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại", "error");
      return;
    } else {
      if (moment(val).format("YYYYMMDD") < fromDatePhieu) {
        dialogNoti(
          "Vui lòng chọn ngày lớn hơn hoặc bằng từ ngày trong phiếu",
          "error"
        );
        return;
      } else {
        if (moment(val).format("YYYYMMDD") > toDatePhieu) {
          console.log(moment(val).format("YYYYMMDD"), toDatePhieu);
          dialogNoti(
            "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu",
            "error"
          );
          return;
        } else {
          setFromDate(moment(val).format("DD/MM/YYYY"));
        }
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
    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogNoti("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại", "error");
      return;
    } else {
      if (moment(val).format("YYYYMMDD") > toDatePhieu) {
        dialogNoti(
          "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu",
          "error"
        );
        return;
      } else {
        if (moment(val).format("YYYYMMDD") < fromDatePhieu) {
          dialogNoti(
            "Vui lòng chọn ngày nhỏ hơn hoặc bằng đến ngày trong phiếu",
            "error"
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

  const dialogNoti = (text, type) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        type == "error"
          ? {
              text: "Ok",
              style: "cancel",
            }
          : {
              text: "Đóng",
              onPress: () => {},
            },
        ,
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    if (item.edt_yn == "N") {
      dialogNoti(item.noti_edt_yn);
      return;
    }

    var arrSave = [...dataDateEatRice];
    let lst_sel = "";
    let lst_vegetarian_dt = "";
    let lst_rice_vegetarian_pk = "";
    let lst_meal_shift = "";

    arrSave.forEach(function (item) {
      console.log(item);
      lst_sel += item.sel + "|";
      lst_vegetarian_dt += item.vegetarian_dt + "|";
      lst_rice_vegetarian_pk +=
        item.rice_vegetarian_pk == ""
          ? "0" + "|"
          : item.rice_vegetarian_pk + "|";
      lst_meal_shift += item.meal_shift + "|";
    });

    const pro = "UPDHRRI003000";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: item.pk,
      p3_varchar2: thr_emp_pk,
      p4_varchar2: "",
      p5_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p6_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p7_varchar2: lyDo,
      p8_varchar2: ghiChu,
      p9_varchar2: lst_sel,
      p10_varchar2: lst_vegetarian_dt,
      p11_varchar2: lst_rice_vegetarian_pk,
      p12_varchar2: arrSave.length,
      p13_varchar2: lst_meal_shift,
      p14_varchar2: APP_VERSION,
      p15_varchar2: crt_by,
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
        console.log("rs UPDHRRI003000 ", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: Điều chỉnh không thành công.";
          }
          dialogNoti(errors);
        } else {
          if (rs.data.status == "1") {
            dialogNoti("Cập nhật chi tiết thành công");
            onRefresh();
            getDataRiceVegetarian();
          } else {
            dialogNoti("Cập nhật chi tiết thất bại");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDataRiceVegetarian = () => {
    setLoad(true);
    const pro = "SELHRRI003002";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p3_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p4_varchar2: phieu_meal_shift,
      p5_varchar2: APP_VERSION,
      p6_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_rice_vegetarian",
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
            setDataDateEatRice(rs.data.lst_rice_vegetarian);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const OnChecked = (itemPk, mealShift, status) => {
    let newLst = [...dataDateEatRice];
    newLst = newLst.map((obj) => {
      if (obj.vegetarian_dt === itemPk && obj.meal_shift == mealShift) {
        {
          return { ...obj, sel: status };
        }
      } else {
        return obj;
      }
    });
    console.log(newLst);
    setDataDateEatRice(newLst);
  };

  const OnCheckedAll = (status) => {
    dataDateEatRice.map((item) => {
      setCheckedAll(status);
      let newLst = [...dataDateEatRice];
      newLst = newLst.map((obj) => {
        return { ...obj, sel: status };
      });
      setDataDateEatRice(newLst);
    });
  };

  return (
    <Block paddingBottom={10} flex>
      <TVSHeader goBack={goBack}>
        Chi tiết{" "}
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRRI003",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRI003")[0]
            .p_pk
        )
          .toString()
          .toLowerCase()}
      </TVSHeader>
      <Block flex paddingTop={5}>
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
                    disabled={true}
                    // onPress={() => setModalVisiblePhieu(true)}
                    colorText={"#B2B2B2"}
                    code_nm={phieu_code_nm}
                  />
                </Block>

                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Block style={styles.titleContainer}>
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
                </Block>

                {dataDateEatRice.length > 0 ? (
                  <View style={{ padding: 8 }}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{ borderRadius: 2 }}
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
                              alignItems: "center",
                              justifyContent: "center",
                              flex: 1,
                              width: 120,
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
                            <Text>Hết hạn</Text>
                          </View>
                        </View>
                        <ScrollView>
                          {waiting ? (
                            <ActivityIndicator color="gray" />
                          ) : (
                            dataDateEatRice.map((item) => (
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
                                        item.vegetarian_dt,
                                        item.meal_shift,
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
                                      width: 120,
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
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderLeftColor: "#BDBDBD",
                                      borderLeftWidth: 0.2,
                                      borderRightColor: "#BDBDBD",
                                      borderRightWidth: 0.2,
                                    }}
                                  >
                                    <Text>{item.meal_shift_nm}</Text>
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
                                    <Text>{item.exist_yn}</Text>
                                  </View>
                                </View>
                              </View>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                ) : null}

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
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default ChiTiet;
