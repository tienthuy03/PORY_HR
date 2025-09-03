/************************************************ START: IMPORT ************************************************/
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import TVSButton from "../../../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../../../components/Tvs/ControlPopup2";
import Block from "../../../../../../../components/Block";
import Text from "../../../../../../../components/Text";
import TVSDate from "../../../../../../../components/Tvs/TVSDate";
import moment from "moment";
import TVSList from "../../../../../../../components/Tvs/TVSList";
import TextInput from "../../../../../../../components/TextInput";
import { useDispatch, useSelector } from "react-redux";
import sysFetch from "../../../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../../../config/Pro";
/************************************************ END: IMPORT ************************************************/

const ChinhSuaChiTiet = ({
  isShow,
  handleShow,
  dataEmployeeIns,
  setDataEmployeeIns,
  item,
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
  const [fromDate, setFromDate] = useState(item.from_dt);
  const [toDate, setToDate] = useState(item.to_dt);
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [warning, setWarning] = useState();
  const [limitDate, setLimitDate] = useState(moment().format("YYYYMMDD"));
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
  }, []);

  useEffect(() => {
    setFromDate(moment(limitDate).format("DD/MM/YYYY"));
    setToDate(moment(limitDate).format("DD/MM/YYYY"));
    console.log("limitDate", limitDate);
  }, [limitDate]);

  useEffect(() => {
    console.log(item);
    setFromDate(item.from_dt);
    setToDate(item.to_dt);
    setReason(item.reason);
    setDescription(item.description);
  }, [isShow, item]);

  //Từ ngày
  const showDatePickerFrom = () => {
    setFromDatePickerVisible(true);
  };
  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };
  const handleConfirmFromDate = (val) => {
    hidePickerFromDate();
    // if (moment(val).format("YYYYMMDD") < limitDate) {
    //   dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày quy định");
    //   return;
    // }

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
    // if (moment(val).format("YYYYMMDD") < limitDate) {
    //   dialogError("Vui lòng chọn đến ngày lớn hơn hoặc bằng ngày quy định");
    //   return;
    // }

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
    setFromDate(
      moment(new Date().getTime()).add(2, "days").format("DD/MM/YYYY")
    );
    setToDate(moment(new Date().getTime()).add(2, "days").format("DD/MM/YYYY"));
    setReason("");
    setDescription("");
  };

  const OnUpdateLstEmployee = () => {
    const oldLst = dataEmployeeIns;
    const newLst = oldLst.map((employee) => {
      if (employee.emp_id == item.emp_id) {
        return {
          ...employee,
          from_dt: fromDate,
          to_dt: toDate,
          reason: reason,
          description: description,
        };
      } else {
        return {
          ...employee,
        };
      }
    });

    setDataEmployeeIns(newLst);
    handleShow(false);
    onReset();
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

  const getData = () => {
    const pro = "SELHRRE021004";
    const in_par = {
      p1_varchar2: thr_emp_pk,
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
          p2_sys: "warning",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("RS", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setWarning(rs.data.warning[0].note);
            setLimitDate(rs.data.warning[0].limit_dt);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <TVSControlPopup
      title={"Chỉnh sửa chi tiết"}
      isShow={isShow}
      minHeight={500}
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

      {/* START: NOTE */}
      <Block style={styles.titleContainer}>
        <Block style={styles.titleText}>
          <Text color={Color.red}>{warning}</Text>
        </Block>
      </Block>
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
              paddingVertical: Platform.OS === "ios" ? 10 : 0,
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
        {/* END: CONTROL TEXT INPUT GHI CHÚ */}

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
              minHeight: 50,
              maxHeight: 100,
              paddingVertical: Platform.OS === "ios" ? 10 : 0,
            }}
          >
            <TextInput
              multiline={true}
              placeholder={"Nhập ghi chú"}
              value={description}
              onChangeText={setDescription}
              returnKeyType={"done"}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </Block>
        </Block>
        {/* END: CONTROL TEXT INPUT GHI CHÚ */}

        {/* START: CONTROL TABLE NHÂN VIÊN */}
        <View style={{ flex: 1, marginTop: 10 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    height: 30,
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
                    width: 250,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Họ tên</Text>
                </View>
              </View>
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
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
                        justifyContent: "center",
                        width: 100,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                      }}
                    >
                      <Text>{item.emp_id}</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 250,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                      }}
                    >
                      <Text>{item.full_nm}</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {/* END: CONTROL TABLE NHÂN VIÊN */}
      </View>
    </TVSControlPopup>
  );
};
export default ChinhSuaChiTiet;
