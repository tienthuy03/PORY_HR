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
  Dimensions,
} from "react-native";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Block from "../../../../../components/Block";
import Text from "../../../../../components/Text";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import moment from "moment";
import TVSList from "../../../../../components/Tvs/TVSList";
import TextInput from "../../../../../components/TextInput";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
/************************************************ END: IMPORT ************************************************/

const ModalEdit = ({
  isShow,
  handleShow,
  dataCaAn,
  dataLoai,
  dataViTriAnTaiCho,
  dataViTriAnDongHop,
  warning,
  dataEmployeeIns,
  setDataEmployeeIns,
  dataHint,
  item = {},
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
  let height = Dimensions.get("window").height;
  //******************************************************************** END: VARIABLE ********************************************************************

  //************************************************ START: STATE ************************************************
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
  const [dataEmployee, setDataEmployee] = useState([]);
  const [dataViTriAnDieuChinh, setDataViTriAnDieuChinh] = useState([]);

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
      setFromDate(item.from_dt);
      setLoai_code(item.method_code);
      setLoai_code_nm(item.method_code_nm);
      setViTriAnDieuChinh_code(item.position_canteen_edit_code);
      setViTriAnDieuChinh_code_nm(item.position_canteen_edit_code_nm);
      setGhiChu(item.note);
      setLyDo(item.reason);
      setCaAn_code(item.meal_shift_code);
      setCaAn_code_nm(item.meal_shift_code_nm);
    }
  }, [item, isShow]);

  useEffect(() => {
    if (loai_code === "1") {
      setDataViTriAnDieuChinh(dataViTriAnTaiCho);
    } else {
      setDataViTriAnDieuChinh(dataViTriAnDongHop);
    }
  }, [loai_code]);

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
    console.log(
      "FROM DATE",
      moment(val).format("YYYYMMDD"),
      moment().format("YYYYMMDD")
    );
    if (moment(val).format("YYYYMMDD") < moment().format("YYYYMMDD")) {
      dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày quy định");
      return;
    }

    setFromDate(moment(val).format("DD/MM/YYYY"));
  };

  const onReset = () => {
    setFromDate(moment().format("DD/MM/YYYY"));
    setViTriAnDieuChinh_code("");
    setViTriAnDieuChinh_code_nm("Chọn vị trí ăn điều chỉnh");
    setGhiChu("");
    OnCheckedAll(true);
    OnCheckedAll(false);
    setLyDo("");
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
    //update item in employeeeINS
    let newLst = [...dataEmployeeIns];
    newLst = newLst.map((obj) => {
      if (obj.pk === item.pk) {
        {
          return {
            ...obj,
            from_dt: fromDate,
            method_code: loai_code,
            method_code_nm: loai_code_nm,
            position_canteen_edit_code: viTriAnDieuChinh_code,
            position_canteen_edit_code_nm: viTriAnDieuChinh_code_nm,
            meal_shift_code: caAn_code,
            meal_shift_code_nm: caAn_code_nm,
            note: ghiChu,
            reason: lyDo,
          };
        }
      } else {
        return obj;
      }
    });
    setDataEmployeeIns(newLst);
    handleShow(false);
  };

  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <TVSControlPopup
      title={"Chọn nhân viên"}
      isShow={isShow}
      minHeight={height * 0.8}
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
                top: -40,
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

        <View style={{ flex: 1, flexDirection: "column", marginBottom: 10 }}>
          {/* START: CONTROL SELECT */}
          <Block style={{ marginBottom: 5 }}>
            <Block style={styles.titleText}>
              <Text color={Color.mainColor}>Ca ăn</Text>
            </Block>
            <TVSList
              onPress={() => setModalVisibleCaAn(true)}
              colorText={caAn_code_nm == "Chọn ca ăn" ? "#B2B2B2" : null}
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
                onPress={() => setModalVisibleLoai(true)}
                colorText={loai_code_nm == "Chọn loại" ? "#B2B2B2" : null}
                code_nm={loai_code_nm}
              />
            </Block>

            <Block style={{ flex: 0.6 }}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Vị trí ăn điều chỉnh</Text>
              </Block>
              <TVSList
                maxHeight={Platform.OS == "ios" ? null : 40}
                onPress={() => setModalVisibleViTriAnDieuChinh(true)}
                colorText={
                  viTriAnDieuChinh_code_nm == "Chọn vị trí ăn điều chỉnh"
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

                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 240,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Vị trí ăn tại chỗ</Text>
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
                    <Text>Vị trí ăn đóng hộp</Text>
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
                              <Icon name={"check"} color={Color.mainColor} />
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

                        <View
                          style={{
                            alignItems: "center",
                            width: 240,
                            borderBottomColor: "#BDBDBD",
                            borderBottomWidth: 0.2,
                            paddingLeft: 10,
                          }}
                        >
                          <Text>{item.cantin_code_nm}</Text>
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
                          <Text>{item.box_cantin_code_nm}</Text>
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
    </TVSControlPopup>
  );
};
export default ModalEdit;
