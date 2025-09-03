/************************************************ START: IMPORT ************************************************/
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Keyboard,
} from "react-native";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Block from "../../../../../components/Block";
import Text from "../../../../../components/Text";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import moment from "moment";
import TVSList from "../../../../../components/Tvs/TVSList";
import TextInput from "../../../../../components/TextInput";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import sysFetch from "../../../../../services/fetch_v1";
/************************************************ END: IMPORT ************************************************/

const ModalChiTiet = ({
  isShow,
  handleShow,
  phongBan_code,
  warning,
  dataEmployeeIns,
  setDataEmployeeIns,
  limitDate,
  about_days_register,
  // to_code,
  // phanXuong_code,
  fDate,
  tDate,
}) => {
  //************************************************ START: VARIABLE ************************************************
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let full_name = useSelector(
    (state) => state.loginReducers.data.data.full_name
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  //******************************************************************** END: VARIABLE ********************************************************************

  //************************************************ START: STATE ************************************************
  const [fromDate, setFromDate] = useState(
    moment(limitDate).format("DD/MM/YYYY")
  );
  const [toDate, setToDate] = useState(
    moment(about_days_register).format("DD/MM/YYYY")
  );
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [timKiem, setTimKiem] = useState("");
  const [checkedAll, setCheckedAll] = useState("N");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [dataEmployee, setDataEmployee] = useState([]);
  const [lengthDataEmployee, setLengthDataEmployee] = useState(0);
  //************************************************ END: STATE ************************************************

  const styles = StyleSheet.create({
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
      marginBottom: 5,
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
    if (isShow) {
      OnCheckedAll(true);
      OnCheckedAll(false);
      getDataEmployee(
        phongBan_code,
        timKiem,
        fDate,
        tDate
        // phanXuong_code,
        // to_code
      );
    }
  }, [isShow, fDate, tDate]);

  useEffect(() => {
    setFromDate(moment(limitDate).format("DD/MM/YYYY"));
    setToDate(moment(about_days_register).format("DD/MM/YYYY"));
  }, [limitDate, about_days_register]);

  const searchEmployee = (text) => {
    setTimKiem(text);

    const searchTextWithoutDiacritics = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const updatedDataEmployee = dataEmployee.map((employee) => {
      const fullNameWithoutDiacritics = employee.full_nm
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const empIdWithoutDiacritics = employee.emp_id
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (
        fullNameWithoutDiacritics
          .toLowerCase()
          .includes(searchTextWithoutDiacritics.toLowerCase()) ||
        empIdWithoutDiacritics
          .toLowerCase()
          .includes(searchTextWithoutDiacritics.toLowerCase())
      ) {
        return {
          ...employee,
          found: "true",
        };
      } else {
        return {
          ...employee,
          found: "false",
        };
      }
    });

    setDataEmployee(updatedDataEmployee);
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
    if (moment(val).format("YYYYMMDD") < limitDate) {
      dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày quy định");
      return;
    }

    if (moment(val).format("YYYYMMDD") > about_days_register) {
      dialogError("Vui lòng chọn từ ngày nhỏ hơn hoặc bằng ngày quy định");
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
    if (moment(val).format("YYYYMMDD") > about_days_register) {
      dialogError("Vui lòng chọn đến ngày nhỏ hơn hoặc bằng ngày quy định");
      return;
    }

    if (moment(val).format("YYYYMMDD") < limitDate) {
      dialogError("Vui lòng chọn đến ngày lớn hơn hoặc bằng ngày quy định");
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

  const onReset = () => {
    setFromDate(moment(limitDate).format("DD/MM/YYYY"));
    setToDate(moment(about_days_register).format("DD/MM/YYYY"));
    setReason("");
    setDescription("");
    setTimKiem("");
    OnCheckedAll(true);
    OnCheckedAll(false);
    // setLengthDataEmployee(0);
  };

  const OnChecked = (itemPk, status) => {
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      if (obj.pk === itemPk) {
        {
          return { ...obj, checked: status };
        }
      } else {
        return obj;
      }
    });
    setDataEmployee(newLst);
  };

  const OnCheckedAll = (status) => {
    setCheckedAll(status);
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      return { ...obj, checked: status };
    });
    setDataEmployee(newLst);
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

  const OnUpdateLstEmployee = () => {
    let newLst = [...dataEmployee.filter((x) => x.checked == "Y")];
    if (newLst.length == 0) {
      dialogNoti("Vui lòng chọn nhân viên");
      return;
    }

    for (let obj of newLst) {
      if (
        moment(fromDate, "DD/MM/YYYY").isBefore(
          moment(obj.from_dt, "DD/MM/YYYY")
        )
      ) {
        dialogNoti("Từ ngày của nhân viên " + obj.full_nm + " không hợp lệ");
        return;
      }
      if (
        moment(toDate, "DD/MM/YYYY").isAfter(moment(obj.to_dt, "DD/MM/YYYY"))
      ) {
        dialogNoti("Đến ngày của nhân viên " + obj.full_nm + " không hợp lệ");
        return;
      }
    }

    newLst = newLst.map((obj) => {
      return {
        ...obj,
        from_dt: fromDate,
        to_dt: toDate,
        reason: reason,
        description: description,
      };
    });
    let oldLst = [...dataEmployeeIns];
    newLst.forEach(function (itemIns) {
      oldLst = oldLst.filter((item) => item.pk != itemIns.pk);
      setDataEmployeeIns(oldLst);
      oldLst.push({
        ...itemIns,
      });
    });
    setDataEmployeeIns(oldLst);
    handleShow(false);
    onReset();
  };

  const getDataEmployee = (
    org_pk,
    keySearch,
    fDate,
    tDate
    // phanXuong_code,
    // to_code
  ) => {
    setWaiting(true);
    const pro = "SELHRRI008001";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: org_pk,
      p3_varchar2: keySearch,
      p4_varchar2: moment(fDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p5_varchar2: moment(tDate, "DD/MM/YYYY").format("YYYYMMDD"),
      // p6_varchar2: to_code,
      // p7_varchar2: phanXuong_code,
      p7_varchar2: crt_by,
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
        console.log("RS", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataEmployee(rs.data.data);
            setLengthDataEmployee(rs.data.data.length);
          }
        }
        setWaiting(false);
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <TVSControlPopup
      title={"Chọn nhân viên"}
      isShow={isShow}
      minHeight={600}
      onHide={() => {
        handleShow(false), onReset();
      }}
      bottom={
        <View style={{ flexDirection: "row" }}>
          <TVSButton
            type={"danger"}
            buttonStyle={"3"}
            icon={"close"}
            onPress={() => {
              handleShow(false), onReset();
            }}
          >
            Đóng lại
          </TVSButton>
          <TVSButton
            // type={'danger'}
            buttonStyle={"3"}
            icon={"check"}
            onPress={() => {
              OnUpdateLstEmployee();
            }}
          >
            Xác nhận
          </TVSButton>
        </View>
      }
    >
      {/* START: CONTROL FROM DATE - TO DATE */}
      <Block
        style={{
          flexDirection: "row",
          marginBottom: 5,
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

      {/* START: NOTE */}
      {warning.length > 0 ? (
        <Block style={styles.titleContainer}>
          <Block style={styles.titleText}>
            <Text color={Color.red}>{warning}</Text>
          </Block>
        </Block>
      ) : null}

      {/* END: NOTE */}

      <View style={{ flex: 1, flexDirection: "column" }}>
        {/* START: CONTROL TEXT INPUT LÝ DO */}
        <Block style={{ marginBottom: 10 }}>
          <Block style={styles.titleText}>
            <Text color={Color.mainColor}>Lý do</Text>
          </Block>
          <Block
            style={{
              backgroundColor: Color.gray,
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 6,
            }}
          >
            <TextInput
              placeholder={"Nhập lý do"}
              value={reason}
              onChangeText={setReason}
              returnKeyType={"done"}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </Block>
        </Block>
        {/* END: CONTROL TEXT INPUT LÝ DO*/}

        {/* START: CONTROL TEXT INPUT GHI CHÚ */}
        <Block style={{ marginBottom: 10 }}>
          <Block style={styles.titleText}>
            <Text color={Color.mainColor}>Ghi chú</Text>
          </Block>
          <Block
            style={{
              backgroundColor: Color.gray,
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 6,
              height: Platform.OS == "ios" ? 60 : null,
              justifyContent: "center",
              maxHeight: 60,
            }}
          >
            <TextInput
              // multiline={true}
              placeholder={"Nhập ghi chú"}
              value={description}
              onChangeText={setDescription}
              returnKeyType={"done"}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </Block>
        </Block>
        {/* END: CONTROL TEXT INPUT GHI CHÚ */}
        <Block flexDirection={"row"}>
          {/* START: CONTROL TEXT INPUT TÌM NHÂN VIÊN */}
          <Block style={{ flex: 1 }}>
            <Block style={styles.titleText}>
              <Text color={Color.mainColor}>Tìm nhân viên </Text>
              <Text
                style={{
                  backgroundColor: "white",
                  color: "red",
                }}
              >
                {lengthDataEmployee}
              </Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 6,
                paddingVertical: Platform.OS === "ios" ? 10 : 0,
                borderRadius: 6,
              }}
            >
              <TextInput
                placeholder={"Nhập họ tên hoặc mã nhân viên để tìm kiếm"}
                value={timKiem}
                onChangeText={(e) => {
                  setTimKiem(e), searchEmployee(e);
                }}
              />
            </Block>
          </Block>
          {/* END: CONTROL TEXT INPUT TÌM NHÂN VIÊN */}

          <View
            style={{
              flex: 0.2,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity onPress={() => searchEmployee(timKiem)}>
              <LinearGradient
                colors={["#01acec", "#2E86C1"]}
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "red",
                }}
              >
                <Icon name={"account-search"} size={20} color={"white"} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Block>

        {/* START: CONTROL TABLE NHÂN VIÊN */}
        <View style={{ flex: 1, marginTop: 10 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                        <Icon name={"check"} color={Color.mainColor} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 200,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
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
                  <Text>Từ ngày</Text>
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
                  <Text>Đến ngày</Text>
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
                  <Text>Ghi chú</Text>
                </View>
              </View>
              <ScrollView>
                {waiting ? (
                  <ActivityIndicator color="gray" />
                ) : (
                  dataEmployee.map((item) => {
                    if (item.found == "true") {
                      return (
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
                                OnChecked(
                                  item.pk,
                                  item.checked == "Y" ? "N" : "Y"
                                );
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
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: 80,
                                borderBottomColor: "#BDBDBD",
                                borderBottomWidth: 0.2,
                              }}
                            >
                              <Text>{item.emp_id}</Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: 200,
                                borderBottomColor: "#BDBDBD",
                                borderBottomWidth: 0.2,
                                paddingLeft: 10,
                              }}
                            >
                              <Text>{item.full_nm}</Text>
                            </View>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: 100,
                                borderBottomColor: "#BDBDBD",
                                borderBottomWidth: 0.2,
                                paddingLeft: 10,
                              }}
                            >
                              <Text>{item.from_dt}</Text>
                            </View>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: 100,
                                borderBottomColor: "#BDBDBD",
                                borderBottomWidth: 0.2,
                                paddingLeft: 10,
                              }}
                            >
                              <Text>{item.to_dt}</Text>
                            </View>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: 100,
                                borderBottomColor: "#BDBDBD",
                                borderBottomWidth: 0.2,
                                paddingLeft: 10,
                              }}
                            >
                              <Text>{item.description}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  })
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {/* END: CONTROL TABLE NHÂN VIÊN */}
      </View>
    </TVSControlPopup>
  );
};
export default ModalChiTiet;
