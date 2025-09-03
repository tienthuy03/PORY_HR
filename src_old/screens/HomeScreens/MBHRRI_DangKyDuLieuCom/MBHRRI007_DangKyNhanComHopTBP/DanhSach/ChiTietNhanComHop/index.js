/************************************************ START: IMPORT ************************************************/
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Dimensions,
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
import ChinhSuaChiTiet from "./ChinhSuaChiTiet";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Load from "../../../../../../components/Loading";
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
  const [dataEmp, setDataEmp] = useState([]);
  const [lengthDataEmployeeIns, setLengthDataEmployeeIns] = useState(0);
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(true);
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
    getDataEmp();
  }, []);

  const getDataEmp = () => {
    setWaiting(true);
    const pro = "SELHRRI007003";
    const in_par = {
      p1_varchar2: item.sequence_dt,
      p2_varchar2: thr_emp_pk,
      p3_varchar2: item.tco_org_pk,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "dataEmp",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs);
        if (rs == "Token Expired") {
          // refreshNewToken("getData", fromday, enday);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataEmp(rs.data.dataEmp);
            setLengthDataEmployeeIns(rs.data.dataEmp.length);
          }
        }
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Ok",
          onPress: () => {
            onRefresh();

            if (lengthDataEmployeeIns == 1) {
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

  const comfirmAlert = (pk, full_nm) => {
    Alert.alert(
      "Thông báo",
      "Bạn muốn xoá " + full_nm + " ?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => OnDelete(pk),
        },
      ],
      { cancelable: false }
    );
  };

  const OnDelete = (pk) => {
    const pro = "UPDHRRI007001";
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: pk + "|",
      p3_varchar2: "",
      p4_varchar2: "",
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: 1,
      p8_varchar2: APP_VERSION,
      p9_varchar2: crt_by,
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
        if (rs.results === "S") {
          dialogNoti("Xóa thành công");

          let newLst = [...dataEmp];
          newLst = newLst.filter((x) => x.pk != pk);
          setDataEmp(newLst);
          setLengthDataEmployeeIns(lengthDataEmployeeIns - 1);
        } else {
          let newText = rs.errorData.split("ORA");
          let errors = "";
          try {
            errors = newText[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: xóa không thành công.";
          }
          dialogNoti(errors);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSave = () => {
    var arrSave = [...dataEmp];
    let lst_thr_rice_reg_emp_pk = "";
    let lst_from_dt = "";
    let lst_to_dt = "";
    let lst_reason = "";
    let lst_note = "";

    arrSave.forEach(function (item) {
      lst_thr_rice_reg_emp_pk += item.pk + "|";
      lst_from_dt +=
        moment(item.from_dt, "DD/MM/YYYY").format("YYYYMMDD") + "|";
      lst_to_dt += moment(item.to_dt, "DD/MM/YYYY").format("YYYYMMDD") + "|";
      lst_reason += item.reason + "|";
      lst_note += item.note + "|";
    });

    const pro = "UPDHRRI007001";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: lst_thr_rice_reg_emp_pk,
      p3_varchar2: lst_from_dt,
      p4_varchar2: lst_to_dt,
      p5_varchar2: lst_reason,
      p6_varchar2: lst_note,
      p7_varchar2: arrSave.length,
      p8_varchar2: APP_VERSION,
      p9_varchar2: crt_by,
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
        if (rs.results === "S") {
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
  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Chi tiết nhận cơm hộp</TVSHeader>
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
                {/* START: CONTROL DS NHÂN VIÊN */}
                <View
                  border={1}
                  paddingVertical={10}
                  borderColor={Color.gray}
                  radius={6}
                  borderWidth={2}
                  borderRadius={8}
                  style={{
                    marginHorizontal: 5,
                    flex: 1,
                    marginBottom: 5,
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
                      <TouchableOpacity onPress={() => {}}>
                        <Text style={{ color: Color.mainColor }}>
                          Danh sách nhân viên{"  "}
                          <Text style={{ color: "red" }}>
                            {lengthDataEmployeeIns}
                          </Text>
                          {"  "}
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
                              width: 50,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                              paddingVertical: 5,
                            }}
                          >
                            <Text>Xóa</Text>
                          </View>
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
                              width: 200,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                              paddingVertical: 5,
                            }}
                          >
                            <Text>Họ tên</Text>
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
                            <Text>Ngày bắt đầu</Text>
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
                            <Text>Ngày kết thúc</Text>
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
                            <Text>Lý do</Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 150,
                              borderWidth: 0.2,
                              borderColor: "#BDBDBD",
                            }}
                          >
                            <Text>Ghi chú</Text>
                          </View>
                        </View>
                        <ScrollView>
                          {waiting ? (
                            <View
                              style={{
                                alignItems: "center",
                                width: screenWidth,
                              }}
                            >
                              <ActivityIndicator style={{}} color="gray" />
                            </View>
                          ) : (
                            dataEmp.map((item) => (
                              <View
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: 2,
                                  borderBottomColor: "#BDBDBD",
                                  borderBottomWidth: 0.2,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: 50,
                                    justifyContent: "center",
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      if (item.edt_yn == "Y") {
                                        comfirmAlert(item.pk, item.full_nm);
                                      } else {
                                        dialogNoti(
                                          "Nhân viên " +
                                            item.full_nm +
                                            " không được phép xóa"
                                        );
                                      }
                                    }}
                                  >
                                    <View>
                                      <Icon
                                        name={"trash-can-outline"}
                                        color={"#F64E60"}
                                        size={25}
                                      />
                                    </View>
                                  </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onPress={() => {
                                    if (item.edt_yn == "Y") {
                                      setModalVisibleEmp(true);
                                      setItemSelected(item);
                                    } else {
                                      dialogNoti(
                                        "Nhân viên " +
                                          item.full_nm +
                                          " không được phép chỉnh sửa"
                                      );
                                    }
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 120,
                                      paddingLeft: 5,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.edt_yn == "N" ? "red" : null,
                                      }}
                                    >
                                      {item.emp_id}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 200,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.edt_yn == "N" ? "red" : null,
                                      }}
                                    >
                                      {item.full_nm}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.edt_yn == "N" ? "red" : null,
                                      }}
                                    >
                                      {item.from_dt}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.edt_yn == "N" ? "red" : null,
                                      }}
                                    >
                                      {item.to_dt}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.edt_yn == "N" ? "red" : null,
                                      }}
                                    >
                                      {item.reason}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      width: 150,
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.edt_yn == "N" ? "red" : null,
                                      }}
                                    >
                                      {item.note}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                </View>

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
                    onPress={() => getDataEmp()}
                    icon={"reload"}
                    buttonStyle={"3"}
                    type={"secondary"}
                  >
                    Làm mới
                  </TVSButton>
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
        <ChinhSuaChiTiet
          isShow={modalVisibleEmp}
          handleShow={setModalVisibleEmp}
          dataEmployeeIns={dataEmp}
          setDataEmployeeIns={setDataEmp}
          item={itemSelected}
        ></ChinhSuaChiTiet>
        <Load visible={loading} />
      </Block>
    </Block>
  );
};

export default ChiTiet;
