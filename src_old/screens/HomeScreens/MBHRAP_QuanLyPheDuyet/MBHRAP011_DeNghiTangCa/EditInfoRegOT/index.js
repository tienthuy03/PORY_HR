import moment from "moment";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import axios from "axios";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "../../../../../components/Button";
import IconDate from "../../../../../icons/Datev";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../../config/Pro";
import RequestSendNotificationV1 from "../../../../../services/notification/send_v1";
import TVSHeader from "../../../../../components/Tvs/Header";
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";

const EditRegOT = ({ navigation: { goBack }, route }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  // const tokenLogin = useSelector(
  //   state => state.loginReducers.data.data.tokenLogin,
  // );
  const crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
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
  });
  const [decisNo, setDecisNo] = useState("");
  const [decisContent, setDecisContent] = useState("");
  const [registerDate, setRegisterDate] = useState("dd/mm/yyyy");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [currentPhongBan, setCurrentPhongBan] = useState([]);
  const [masterPK, setMasterPK] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [dataEmployeeIns, setDataEmployeeIns] = useState([]);
  const [dataInsertApprove, setDataInsertApprove] = useState([]);
  const hanleApproveInfo = (dataApprover) => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    dataApprover.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = dataApprover.filter((y) => {
        return y.level_name === x;
      });
      let default_yn = null;
      let required_yn = false;
      tempArr.map((z) => {
        if (z.required_yn === "Y") {
          required_yn = true;
        }
        if (default_yn === null && z.default_yn === "Y") {
          default_yn = z;
        }
      });
      if (!required_yn && default_yn !== null) {
        arrApproveDefault = arrApproveDefault.filter(
          (item) => item.approve_role_type !== default_yn.approve_role_type
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === "Y") {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    // setApproveInfo(arrApproveInfo);
  };

  const OnDelete = (pk) => {
    let newLst = [...dataEmployeeIns];
    newLst = newLst.map((obj) => {
      if (obj.pk === pk) {
        if (obj.d_pk != null) {
          return { ...obj, status: 3 };
        } else {
          return { ...obj, status: 4 };
        }
      } else {
        return obj;
      }
    });
    setDataEmployeeIns(newLst);
  };
  //1:ok
  //2:warning
  //3:delete
  useEffect(() => {
    setMasterPK(route.params.masterPK);
    setIsEdit(route.params.isEdit);
    setRegisterDate("dd/mm/yyyy");
    setCurrentPhongBan({ code: 0, code_nm: "Chọn phòng ban" });
    //getData();
    getDataRegInfo();
  }, []);
  const getDataRegInfo = () => {
    sysFetch(
      API,
      {
        pro: "SELHRAP011002",
        in_par: {
          p1_varchar2: route.params.masterPK,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "master_info",
          p2_sys: "approve_info",
          p3_sys: "detail_info",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.master_info.length > 0) {
              setRegisterDate(rs.data.master_info[0].decis_dt);
              setCurrentPhongBan({
                code: rs.data.master_info[0].code_pb,
                code_nm: rs.data.master_info[0].nm_pb,
              });
              setDecisNo(rs.data.master_info[0].decis_no);
              setDecisContent(rs.data.master_info[0].decis_content);

              getDataApprove(rs.data.master_info[0].code_pb);
            }
            if (rs.data.approve_info.length > 0) {
              let dataSelectApprove = [];
              rs.data.approve_info.forEach(function (item) {
                dataSelectApprove.push({
                  role_type: item.approve_role_type,
                  approve_pk: item.thr_emp_pk,
                  role_nm: item.level_name,
                  approve_nm: item.approve_name,
                  level: item.approve_level,
                  code: item.thr_emp_pk,
                  code_nm: item.level_name + " - " + item.full_nm,
                });
              });
              // setDataSelectedApprove(dataSelectApprove);
              setDataInsertApprove(dataSelectApprove);
            }
            if (rs.data.detail_info.length > 0) {
              setDataEmployeeIns(rs.data.detail_info);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getDataApprove = (tco_org_pk) => {
    sysFetch(
      API,
      {
        pro: "SELHRRE011001",
        in_par: {
          p1_varchar2: tco_org_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_approve",
          p2_sys: "approve_default",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            hanleApproveInfo(rs.data.lst_approve);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const refreshNewToken = (obj, p1, p2) => {
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

        if (obj == "getData") {
          getData();
        }
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
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePickerDate = () => {
    setDatePickerVisible(false);
  };
  const handleConfirmDate = (val) => {
    hideDatePickerDate();
    setRegisterDate(moment(val).format("DD/MM/YYYY"));
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
  const OnSave = () => {
    let dataIns = [...dataEmployeeIns];

    let lst_pk = "";
    let lst_status = "";
    let lst_approve_note = "";
    if (dataInsertApprove.length == 0) {
      dialogNoti("Vui lòng chọn người phê duyệt");
    } else {
      if (dataIns.length > 0 || masterPK != "") {
        let flag = "N";
        dataIns.forEach(function (item) {
          if (item.flag_upd == "Y") {
            flag = "Y";
          }
        });
        if (flag == "N") {
          // dialogNoti("Vui lòng chọn nhân viên");
          return;
        } else {
          let cnt = 0;
          dataIns.forEach(function (item) {
            if (item.flag_upd == "Y") {
              cnt++;
              lst_status += item.checked + "|";
              lst_approve_note +=
                item.approve_note == undefined
                  ? " |"
                  : item.approve_note == ""
                  ? " |"
                  : item.approve_note + "|";
              lst_pk += item.pk + "|";
            }
          });
          let in_par = {
            p1_varchar2: masterPK,
            p2_varchar2: lst_pk,
            p3_varchar2: lst_status,
            p4_varchar2: lst_approve_note,
            p5_varchar2: cnt,
            p6_varchar2: APP_VERSION,
            p7_varchar2: crt_by,
          };
          Alert.alert(
            "Thông báo",
            "Bạn có muốn sao lưu?",
            [
              {
                text: "Hủy bỏ",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Xác nhận",
                onPress: () => {
                  sysFetch(
                    API,
                    {
                      pro: "UPDHRAP011001",
                      in_par,
                      out_par: {
                        p1_varchar2: "result",
                      },
                    },
                    tokenLogin
                  )
                    .then((rs) => {
                      if (rs == "Token Expired") {
                        refreshNewToken("OnSave", "", "");
                      }
                      if (rs != "Token Expired") {
                        if (rs.results == "F") {
                          showAlert(rs.errorData);
                        } else {
                          showAlert(rs.data.result);
                        }
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                },
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        dialogNoti("Vui lòng chọn nhân viên");
      }
    }
  };
  const OnCheck = (pk, status) => {
    let obj = [...dataEmployeeIns];
    obj.forEach(function (item) {
      if (item.pk == pk) {
        item.checked = status == "Y" ? "N" : "Y";
        item.flag_upd = "Y";
      }
    });
    setDataEmployeeIns(obj);
  };

  const [modalVisibleEditEmp, setModalVisibleEditEmp] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [detailPk, setDetailPk] = useState("");
  const OnUpdateLstEmployeeEdit = () => {
    let dataEmployeeTemp = [...dataEmployeeIns];
    dataEmployeeTemp = dataEmployeeTemp.map((obj) => {
      if (obj.pk == detailPk) {
        return { ...obj, approve_note: approveNote, flag_upd: "Y" };
      } else {
        return obj;
      }
    });

    setDataEmployeeIns(dataEmployeeTemp);
    setModalVisibleEditEmp(false);
  };
  const modalEditApproveNote = (
    <View style={{ zIndex: 9999 }}>
      <TVSControlPopup
        title={"CHỈNH SỬA"}
        minHeight={100}
        isShow={modalVisibleEditEmp}
        onHide={() => setModalVisibleEditEmp(false)}
        bottom={
          <View style={{ flexDirection: "row" }}>
            <TVSButton
              type={"danger"}
              buttonStyle={"3"}
              icon={"close"}
              onPress={() => setModalVisibleEditEmp(false)}
            >
              Đóng lại
            </TVSButton>
            <TVSButton
              buttonStyle={"3"}
              icon={"check"}
              onPress={() => OnUpdateLstEmployeeEdit()}
            >
              Xác nhận
            </TVSButton>
          </View>
        }
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
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
              }}
            >
              <TextInput
                placeholder={"Nhập ghi chú"}
                value={approveNote}
                onChangeText={setApproveNote}
                returnKeyType={"done"}
                onSubmitEditing={() => Keyboard.dismiss()}
                maxHeight={40}
              />
            </Block>
          </Block>
          {/* END: CONTROL TEXT INPUT GHI CHÚ*/}
        </View>
      </TVSControlPopup>
    </View>
  );
  return (
    <Block style={{ flex: 1 }} backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        <Text>
          {isEdit ? "Chỉnh sửa thông tin đăng ký" : "Thông tin chi tiết"}
        </Text>
      </TVSHeader>
      {modalEditApproveNote}
      <View style={{ flex: 1 }} backgroundColor={Color.gray}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 5,
              marginTop: 10,
              flexDirection: "row",
              zIndex: 11,
            }}
          >
            <View style={{ flex: 2 }}>
              <View
                style={{
                  justifyContent: "flex-end",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Ngày</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => (isEdit ? showDatePicker() : null)}
                    style={{ flex: 1 }}
                  >
                    <View
                      radius={6}
                      backgroundColor={Color.gray}
                      justifyContent={"space-between"}
                      alignCenter
                      style={{
                        flexDirection: "row",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            registerDate == "dd/mm/yyyy"
                              ? "#B2B2B2"
                              : Color.mainColor,
                        }}
                      >
                        {registerDate}
                      </Text>
                      <IconDate />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={datePickerVisible}
                    mode="date"
                    hideTitleContainerIOS={false}
                    date={
                      registerDate !== "dd/mm/yyyy"
                        ? new Date(moment(registerDate, "DD/MM/YYYY"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePickerDate}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Phòng ban</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      // if (isEdit) {
                      //   masterPK == ""
                      //     ? setModalVisiblePb(!modalVisiblePb)
                      //     : null;
                      // }
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      radius={6}
                      backgroundColor={Color.gray}
                      justifyContent={"space-between"}
                      alignCenter
                      style={{
                        flexDirection: "row",
                        borderRadius: 8,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text
                          style={{
                            color:
                              currentPhongBan.code == 0
                                ? "#B2B2B2"
                                : Color.mainColor,
                          }}
                        >
                          {currentPhongBan.code_nm}
                        </Text>
                      </View>
                      <View>
                        <Icon
                          name={"chevron-down"}
                          color={Color.mainColor}
                          size={22}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 5,
              marginTop: 10,
              flexDirection: "row",
              zIndex: 9,
            }}
          >
            <View style={{ flex: 2 }}>
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Số phiếu</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TextInput
                    value={decisNo}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder={""}
                    style={{
                      borderRadius: 5,
                      paddingBottom: 10,
                      paddingTop: 10,
                      paddingHorizontal: 5,
                      backgroundColor: Color.gray,
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Lý do tăng ca chính</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TextInput
                    editable={isEdit}
                    value={decisContent}
                    onChangeText={(value) => setDecisContent(value)}
                    placeholder={""}
                    style={{
                      borderRadius: 5,
                      paddingBottom: 10,
                      paddingTop: 10,
                      paddingHorizontal: 5,
                      backgroundColor: Color.gray,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              zIndex: 8,
            }}
          >
            <View>
              <View
                border={1}
                paddingVertical={10}
                borderColor={Color.gray}
                radius={6}
                borderWidth={2}
                borderRadius={8}
                style={{ marginHorizontal: 5, marginTop: 20 }}
              >
                <View row style={styles.fieldsetTitle}>
                  <View>
                    <View>
                      <Text style={{}}>Danh sách người phê duyệt</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 5 }}>
                  <ScrollView style={{ maxHeight: 60 }}>
                    {dataInsertApprove.map((item) => (
                      <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
                        <Text>{item.code_nm}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
          <View
            border={1}
            paddingVertical={10}
            borderColor={Color.gray}
            radius={6}
            borderWidth={2}
            borderRadius={8}
            style={{
              marginHorizontal: 5,
              marginTop: 15,
              flex: 1,
              marginBottom: 5,
            }}
          >
            <View row style={styles.fieldsetTitle}>
              <View
                style={{
                  borderBottomColor: Color.mainColor,
                  borderBottomWidth: 0.2,
                }}
              >
                <View>
                  <Text style={{ color: Color.mainColor }}>
                    Danh sách nhân viên {"("}
                    {dataEmployeeIns.length}
                    {")"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View>
                  <View style={{ flexDirection: "row" }}>
                    {isEdit ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 50,
                          borderWidth: 0.2,
                          borderColor: "#BDBDBD",
                          paddingVertical: 5,
                          borderTopLeftRadius: 8,
                        }}
                      >
                        <Text>Xoá</Text>
                      </View>
                    ) : null}
                    {isEdit ? null : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 50,
                          borderWidth: 0.2,
                          borderColor: "#BDBDBD",
                          paddingVertical: 5,
                          borderTopLeftRadius: 8,
                        }}
                      >
                        <Text>Chọn</Text>
                      </View>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 150,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        paddingVertical: 5,
                      }}
                    >
                      <Text>Ghi chú</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 100,
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
                        width: 240,
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
                        width: 80,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Giờ BĐ OT</Text>
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
                      <Text>Giờ KT OT</Text>
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
                      <Text>Kiểu ngày</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 50,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>OT</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: 70,
                        justifyContent: "center",
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        // borderTopRightRadius: 8,
                      }}
                    >
                      <Text>Cơm TC</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: 200,
                        justifyContent: "center",
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Text>Lý do</Text>
                    </View>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {dataEmployeeIns.map((item) =>
                      item.status != "3" && item.status != "4" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            // marginTop: 5,
                            paddingVertical: 2,
                            borderBottomColor: "#BDBDBD",
                            borderBottomWidth: 0.2,
                          }}
                        >
                          {isEdit ? (
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
                                  OnDelete(item.pk);
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
                          ) : null}
                          {isEdit ? null : (
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
                                  OnCheck(item.pk, item.checked);
                                }}
                              >
                                <View>
                                  <Icon
                                    name={
                                      item.checked == "Y"
                                        ? "checkbox-marked-outline"
                                        : "checkbox-blank-outline"
                                    }
                                    color={Color.mainColor}
                                    size={25}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              setModalVisibleEditEmp(true);
                              setDetailPk(item.pk);
                              setApproveNote(item.approve_note);
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              width: 150,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.approve_note}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 100,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.emp_id}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              width: 240,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.full_nm}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 80,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.time}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 80,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.end_time}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 100,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.hol_type}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 50,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.ot}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 70,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.meal_yn}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              width: 200,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.reason}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : null
                    )}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        {/* {isEdit ? ( */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 5,
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <View style={{}}>
            <TVSButton
              onPress={() => OnSave()}
              icon={"content-save"}
              buttonStyle={"3"}
              // disabled={flagEnabled == "Y" ? false : true}
            >
              Sao lưu
            </TVSButton>
          </View>
          {/* <View style={{ flex: 1 }}>
              <TVSButton
                onPress={() => OnSubmit()}
                icon={"check"}
                buttonStyle={"3"}
                type={"success"}
              >
                Trình ký
              </TVSButton>
            </View> */}
        </View>
        {/* ) : null} */}

        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 20,
            flexDirection: 'row',
            backgroundColor: 'white',
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              OnSave();
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: flagEnabled == 'Y' ? '#E7F2FE' : '#E5E7ED',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              flexDirection: 'row',
              flex: 1,
              marginRight: 2,
            }}>
            <View style={{paddingHorizontal: 5}}>
              <Icon
                name={'content-save'}
                color={flagEnabled == 'Y' ? '#5A94E7' : '#677583'}
                size={20}
              />
            </View>
            <View style={{paddingHorizontal: 5}}>
              <Text style={{color: flagEnabled == 'Y' ? '#5A94E7' : '#677583'}}>
                Sao lưu
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              OnSubmit();
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#E7F2FE',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={{paddingHorizontal: 5}}>
              <Icon name={'content-save'} color={'#5A94E7'} size={20} />
            </View>
            <View style={{paddingHorizontal: 5}}>
              <Text style={{color: '#5A94E7'}}>Trình ký</Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
    </Block>
  );
};

export default EditRegOT;
