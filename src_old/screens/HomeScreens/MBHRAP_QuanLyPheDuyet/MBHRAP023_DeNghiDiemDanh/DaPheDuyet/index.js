import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../../config/Pro";
import sysFetch from "../../../../../services/fetch_v1";
import TVSButton from "../../../../../components/Tvs/Button";
import axios from "axios";
import RequestSendNotificationV1 from "../../../../../services/notification/send_v1";
import RNRestart from "react-native-restart";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";

const DaPheDuyet = ({ onReload, data, dataOT, dataInfo, flagReload }) => {
  const [dataSlip, setDataSlip] = useState([]);
  const { width, height } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
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
  const [countStatus3, setCountStatus3] = useState(0);
  const [countStatus4, setCountStatus4] = useState(0);
  const [countStatus5, setCountStatus5] = useState(0);

  const [dataEmployee, setDataEmployee] = useState([]);
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);
  const [checkedAll, setCheckedAll] = useState("N");
  const [masterPK, setMasterPK] = useState("");
  const [modalVisibleEditEmp, setModalVisibleEditEmp] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [detailPk, setDetailPk] = useState("");

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

  useEffect(() => {
    setDataSlip(data);
    setCountStatus3(0);
    setCountStatus4(0);
    setCountStatus5(0);
  }, [flagReload]);

  useEffect(() => {
    if (modalVisibleEmp) {
      setCheckedAll("N");
      getDataEmployee();
    }
  }, [modalVisibleEmp]);

  const OnChecked = (itemPk, status, oldStatus) => {
    let cnt3 = countStatus3;
    let cnt4 = countStatus4;
    let cnt5 = countStatus5;
    let newLst = [...dataSlip];
    newLst = newLst.map((obj) => {
      if (obj.pk === itemPk) {
        if (status == "0") {
          return { ...obj, checked: "N", status: status };
        } else {
          return { ...obj, checked: "Y", status: status };
        }
      } else {
        return obj;
      }
    });

    setDataSlip(newLst);
    switch (oldStatus) {
      case "3":
        console.log("old 3");
        cnt3 -= 1;
        switch (status) {
          case "3":
            console.log("new 3");
            cnt3 += 1;
            break;
          case "4":
            console.log("new 4");
            cnt4 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "4":
        console.log("old 4");
        cnt4 -= 1;
        switch (status) {
          case "3":
            console.log("new 3");
            cnt3 += 1;
            break;
          case "4":
            console.log("new 4");
            cnt4 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "5":
        console.log("old 5");
        cnt5 -= 1;
        switch (status) {
          case "3":
            console.log("new 3");
            cnt3 += 1;
            break;
          case "4":
            console.log("new 4");
            cnt4 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "0":
        console.log("old 0");
        switch (status) {
          case "3":
            console.log("new 3");
            cnt3 += 1;
            break;
          case "4":
            console.log("new 4");
            cnt4 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      default:
        console.log("out case");
    }
    setCountStatus3(cnt3);
    setCountStatus4(cnt4);
    setCountStatus5(cnt5);
  };
  const UpdateApproveNote = (pk, value) => {
    let newLst = [...dataSlip];
    newLst = newLst.map((obj) => {
      if (obj.pk === pk) {
        return { ...obj, checked: "Y", approve_description: value };
      } else {
        return obj;
      }
    });

    setDataSlip(newLst);
  };
  const renderItem = ({ item }) => {
    return (
      <Block flex marginLeft={10} marginRight={10} marginBottom={5}>
        <Block row justifyContent={"space-between"} alignCenter>
          <Block
            borderTopRightRadius={6}
            borderTopLeftRadius={6}
            height={35}
            alignCenter
            justifyCenter
            paddingLeft={10}
            paddingRight={10}
            style={{
              backgroundColor: item.bg_color,
            }}
          >
            <Text style={{ color: Color.mainColor }}>{item.decis_no}</Text>
          </Block>
          {item.status == "3" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={"#E7F2FE"}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: "#3FCB89" }}>Chọn phê duyệt</Text>
            </Block>
          ) : item.status == "4" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={"#E7F2FE"}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: "#F64E60" }}>Chọn không duyệt</Text>
            </Block>
          ) : item.status == "5" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={"#E7F2FE"}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: "#5A94E7" }}>Chọn huỷ phiếu</Text>
            </Block>
          ) : null}
        </Block>
        <View
          style={{
            backgroundColor: Color.white,
            borderColor: Color.oneContentBorder,
            borderWidth: 1,
            borderBottomRightRadius: 6,
            borderBottomLeftRadius: 6,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              borderRadius: 50,
              padding: 10,
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setModalVisibleEmp(true);
                setMasterPK(item.pk);
                console.log("setMasterPK ", item.pk);
              }}
            >
              <Icon name={"pencil-outline"} size={20} color={"#5A94E7"} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingTop: 5 }}>
            <Text style={{ color: "gray" }}>{item.decis_dt}</Text>
          </View>
          <View style={{ paddingTop: 5 }}>
            <Text style={{ color: "gray" }}>{item.approve_status}</Text>
          </View>
          <View style={{ paddingTop: 5 }}>
            <Text style={{ color: "gray" }}>{item.org_nm}</Text>
          </View>
          <View style={{ paddingTop: 5 }}>
            <Text style={{ color: "gray" }}>{item.description}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: "#F4F4F4",
                paddingVertical: 5,
                paddingLeft: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text style={{ color: "gray" }}>Lỗi điểm danh</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshing={false}
              data={dataOT.filter((x) => x.pk == item.pk)}
              renderItem={renderItemOT}
              scrollEnabled={false}
              listKey={(item, index) => index.toString()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                backgroundColor: "#F4F4F4",
                paddingVertical: 5,
                paddingLeft: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text style={{ color: "gray" }}>Chức vụ</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshing={false}
              data={dataInfo.filter((x) => x.pk == item.pk)}
              renderItem={renderItemInfo}
              //   horizontal={true}
              scrollEnabled={false}
              listKey={(item, index) => index.toString()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                color: "gray",
              }}
            >
              Phản hồi phê duyệt
            </Text>
            <TextInput
              value={item.approve_description}
              onChangeText={(e) => {
                UpdateApproveNote(item.pk, e.toString());
              }}
              style={{
                backgroundColor: Color.inputBackgroundColor,
                paddingBottom: 10,
                paddingHorizontal: 10,
                paddingTop: 12,
                borderRadius: 5,
                marginTop: 10,
              }}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1 }}></View>
              {item.status != "4" ? (
                <TVSButton
                  buttonStyle="3"
                  icon={"close-circle-outline"}
                  onPress={() => {
                    OnChecked(item.pk, "4", item.status);
                  }}
                  paddingHorizontal={30}
                  type={"danger"}
                >
                  Không duyệt
                </TVSButton>
              ) : (
                <TVSButton
                  buttonStyle="3"
                  icon={"sync"}
                  onPress={() => {
                    OnChecked(item.pk, "0", item.status);
                  }}
                  paddingHorizontal={30}
                  type={"secondary"}
                >
                  Huỷ bỏ
                </TVSButton>
              )}
              <View style={{ flex: 1 }}></View>
            </View>
          </View>
        </View>
      </Block>
    );
  };
  const renderItemOT = ({ item }) => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "gray",
            borderBottomWidth: 0.2,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "gray" }}>{item.time_ot}</Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={{ color: "gray" }}>{item.count_ot}</Text>
          </View>
        </View>
      </>
    );
  };
  const renderItemInfo = ({ item }) => {
    return (
      <>
        {item.count_info != "" ? (
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "gray",
              borderBottomWidth: 0.2,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "gray" }}>{item.info_nm}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: "gray" }}>{item.count_info}</Text>
            </View>
          </View>
        ) : null}
      </>
    );
  };
  const OnSave = () => {
    console.log("save ");
    let arrData = [...dataSlip].filter((x) => x.checked == "Y");
    let lstPK = "";
    let lstDt = "";
    let lstStatus = "";
    let lstDescription = "";
    let l_action = "UPDATE";
    if (arrData.length > 0) {
      arrData.forEach(function (item) {
        lstPK += item.pk + "|";
        lstDt += item.detail_dt + "|";
        lstStatus += item.status + "|";
        lstDescription += item.approve_description + "|";
      });
      Alert.alert(
        "Thông báo",
        "Bạn có muốn xác nhận?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              console.log({
                p1_varchar2: l_action,
                p2_varchar2: lstStatus,
                p3_varchar2: lstPK,
                p4_varchar2: lstDt,
                p5_varchar2: lstDescription,
                p6_varchar2: thr_emp_pk,
                p7_varchar2: arrData[0].approve_role_type,
                p8_varchar2: arrData[0].approve_name,
                p9_varchar2: arrData.length,
                p10_varchar2: APP_VERSION,
                p11_varchar2: crt_by,
              });
              sysFetch(
                API,
                {
                  pro: "UPDHRAP023000",
                  in_par: {
                    p1_varchar2: l_action,
                    p2_varchar2: lstStatus,
                    p3_varchar2: lstPK,
                    p4_varchar2: lstDt,
                    p5_varchar2: lstDescription,
                    p6_varchar2: thr_emp_pk,
                    p7_varchar2: arrData[0].approve_role_type,
                    p8_varchar2: arrData[0].approve_name,
                    p9_varchar2: arrData.length,
                    p10_varchar2: APP_VERSION,
                    p11_varchar2: crt_by,
                  },
                  out_par: {
                    p1_varchar2: "result",
                    p2_sys: "noti",
                  },
                },
                tokenLogin
              )
                .then((rs) => {
                  console.log("rs ", rs);
                  if (rs == "Token Expired") {
                    refreshNewToken("OnSave");
                  }
                  if (rs != "Token Expired") {
                    if (rs.results == "F") {
                      var newText = rs.errorData.split(":");
                      let errors = newText[1].trim().split("\n")[0];
                      dialogNoti(errors);
                    } else if (rs.data.result == "1") {
                      console.log(rs.data.noti);
                      Alert.alert(
                        "Thông báo",
                        "Xác nhận thành công",
                        [
                          {
                            text: "Thoát",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                      onReload();
                      RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
                    } else {
                      Alert.alert(
                        "Thông báo",
                        "Xác nhận không thành công",
                        [
                          {
                            text: "Thoát",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                      onReload();
                    }
                  }
                })
                .catch((error) => {
                  console.log("error save");
                  console.log(error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  const refreshNewToken = (obj) => {
    axios
      .post(API + "User/RefreshToken/", {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then((response) => {
        console.log("response ", response);
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
        if (obj == "OnSave") {
          let arrData = [...dataSlip].filter((x) => x.checked == "Y");
          let lstPK = "";
          let lstDt = "";
          let lstStatus = "";
          let lstDescription = "";
          let l_action = "UPDATE";
          if (arrData.length > 0) {
            arrData.forEach(function (item) {
              lstPK += item.pk + "|";
              lstDt += item.detail_dt + "|";
              lstStatus += item.status + "|";
              lstDescription += item.approve_description + "|";
            });
            sysFetch(
              API,
              {
                pro: "UPDHRAP023000",
                in_par: {
                  p1_varchar2: l_action,
                  p2_varchar2: lstStatus,
                  p3_varchar2: lstPK,
                  p4_varchar2: lstDt,
                  p5_varchar2: lstDescription,
                  p6_varchar2: thr_emp_pk,
                  p7_varchar2: arrData[0].approve_role_type,
                  p8_varchar2: arrData[0].approve_name,
                  p9_varchar2: arrData.length,
                  p10_varchar2: APP_VERSION,
                  p11_varchar2: crt_by,
                },
                out_par: {
                  p1_varchar2: "result",
                  p2_sys: "noti",
                },
              },
              tokenLogin
            )
              .then((rs) => {
                console.log("rs ", rs);
                if (rs == "Token Expired") {
                  refreshNewToken("OnSave");
                }
                if (rs != "Token Expired") {
                  if (rs.results == "F") {
                    var newText = rs.errorData.split(":");
                    let errors = newText[1].trim().split("\n")[0];
                    dialogNoti(errors);
                  } else if (rs.data.result == "S") {
                    console.log(rs.data.noti);
                    Alert.alert(
                      "Thông báo",
                      "Xác nhận thành công",
                      [
                        {
                          text: "Thoát",
                          style: "cancel",
                        },
                      ],
                      { cancelable: false }
                    );
                    onReload();
                    RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
                  } else {
                    Alert.alert(
                      "Thông báo",
                      "Xác nhận không thành công",
                      [
                        {
                          text: "Thoát",
                          style: "cancel",
                        },
                      ],
                      { cancelable: false }
                    );
                    onReload();
                  }
                }
              })
              .catch((error) => {
                console.log("error save");
                console.log(error);
              });
          }
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
          console.log("error ", error);
        }
        console.log(error);
      });
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

  const getDataEmployee = () => {
    const pro = "SELHRAP023001";
    const in_par = {
      p1_varchar2: masterPK,
      p2_varchar2: thr_emp_pk,
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
          p1_sys: "dataEmp",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRAP023001", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataEmployee(rs.data.dataEmp);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const modalEmployee = (
    <TVSControlPopup
      title={"Chọn nhân viên" + " (" + dataEmployee.length + ")"}
      isShow={modalVisibleEmp}
      minHeight={500}
      onHide={() => setModalVisibleEmp(false)}
      bottom={
        <View style={{ flexDirection: "row" }}>
          <TVSButton
            type={"danger"}
            buttonStyle={"3"}
            icon={"close"}
            onPress={() => setModalVisibleEmp(false)}
          >
            Đóng lại
          </TVSButton>
          <TVSButton
            buttonStyle={"3"}
            icon={"check"}
            onPress={() => OnUpdateLstEmployee()}
          >
            Xác nhận
          </TVSButton>
        </View>
      }
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View>
              <View style={{ flexDirection: "row" }}>
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
                      OnCheckedEmpAll(checkedAll == "Y" ? "N" : "Y");
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
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Ghi chú</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Tình trạng</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
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
                    width: 150,
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
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Phòng ban</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Ngày làm việc</Text>
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
                  <Text>Lỗi điểm danh</Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Đơn vị xác nhận tình trạng
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
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
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Giờ vào TT</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Giờ ra TT</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Ngày yêu cầu (HR)</Text>
                </View>
              </View>

              <ScrollView>
                <View
                  style={{
                    flexDirection: "column",
                  }}
                >
                  {dataEmployee &&
                    dataEmployee.map((item) => (
                      <View
                        style={{
                          flexDirection: "row",
                          height: 40,
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 40,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              OnCheckedEmp(
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
                                <Icon name={"check"} color={Color.mainColor} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottomColor: "#BDBDBD",
                            borderBottomWidth: 0.2,
                          }}
                        >
                          <TouchableOpacity
                            style={{ flexDirection: "row", height: "100%" }}
                            onPress={() => {
                              setModalVisibleEditEmp(true);
                              setDetailPk(item.pk);
                              setApproveNote(item.approve_note);
                            }}
                          >
                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.approve_note}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: item.approve_status_bgcolor,
                                height: "100%",
                              }}
                            >
                              <Text>{item.approve_status_nm}</Text>
                            </View>

                            <View
                              style={{
                                width: 80,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  item.flag_check == "Y" ? "red" : null,
                              }}
                            >
                              <Text
                                style={{
                                  color: item.flag_check == "Y" ? "#FFF" : null,
                                }}
                              >
                                {item.emp_id}
                              </Text>
                            </View>

                            <View
                              style={{
                                width: 150,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.full_nm}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.org_nm}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.work_dt}</Text>
                            </View>

                            <View
                              style={{
                                width: 250,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.att_kind_nm}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.tt_attendance_status_nm}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.reason}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  item.att_kind == "2" && item.time_out == ""
                                    ? item.bg_color
                                    : "",
                              }}
                            >
                              <Text>{item.time_in_tt}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  item.att_kind == "2" && item.time_out == ""
                                    ? item.bg_color
                                    : "",
                              }}
                            >
                              <Text>{item.time_out_tt}</Text>
                            </View>

                            <View
                              style={{
                                width: 120,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{item.request_dt}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

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
      </View>
    </TVSControlPopup>
  );

  const OnUpdateLstEmployeeEdit = () => {
    dataEmployeeTemp = [...dataEmployee];
    dataEmployeeTemp = dataEmployeeTemp.map((obj) => {
      if (obj.pk == detailPk) {
        return { ...obj, approve_note: approveNote };
      } else {
        return obj;
      }
    });

    setDataEmployee(dataEmployeeTemp);
    setModalVisibleEditEmp(false);
  };

  const OnUpdateLstEmployee = () => {
    let arrData = [...dataEmployee];

    let lstAttConfirmPk = "";
    let lstEmpPk = "";
    let lstSel = "";
    let lstapproveNote = "";
    let lstApproveStatus = "";
    let lstApprovePk = "";
    let lstApproveRoleType = "";
    let lstApproveByName = "";

    if (arrData.length > 0) {
      arrData.forEach(function (item) {
        lstAttConfirmPk += item.pk + "|";
        lstEmpPk += item.emp_pk + "|";
        lstSel += item.checked + "|";
        lstapproveNote += item.approve_note + "|";
        lstApproveStatus += item.approve_status + "|";
        lstApprovePk += item.approve_pk + "|";
        lstApproveRoleType += item.approve_role_type + "|";
        lstApproveByName += item.approve_by_name + "|";
      });
      Alert.alert(
        "Thông báo",
        "Bạn có muốn xác nhận?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              const pro = "UPDHRAP023001";
              const in_par = {
                p1_varchar2: "UPDATE",
                p2_varchar2: lstAttConfirmPk,
                p3_varchar2: lstEmpPk,
                p4_varchar2: masterPK,
                p5_varchar2: lstSel,
                p6_varchar2: lstapproveNote,
                p7_varchar2: lstApproveStatus,
                p8_varchar2: lstApprovePk,
                p9_varchar2: lstApproveRoleType,
                p10_varchar2: lstApproveByName,
                p11_varchar2: arrData.length,
                p12_varchar2: APP_VERSION,
                p13_varchar2: crt_by,
              };

              console.log(pro, in_par);

              sysFetch(
                API,
                {
                  pro,
                  in_par,
                  out_par: {
                    p1_varchar2: "result",
                  },
                },
                tokenLogin
              )
                .then((rs) => {
                  console.log("rs ", rs);
                  if (rs == "Token Expired") {
                    refreshNewToken("OnSave");
                  }
                  if (rs != "Token Expired") {
                    if (rs.results == "F") {
                      var newText = rs.errorData.split(":");
                      let errors = newText[1].trim().split("\n")[0];
                      dialogNoti(errors);
                    } else if (rs.data.result == "1") {
                      console.log(rs.data.noti);
                      dialogNoti("Xác nhận thành công");
                      setModalVisibleEmp(false);
                    } else {
                      dialogNoti("Xác nhận không thành công");
                    }
                  }
                })
                .catch((error) => {
                  console.log("error save");
                  console.log(error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const OnCheckedEmp = (itemPk, status) => {
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      if (obj.pk == itemPk) {
        return { ...obj, checked: status };
      } else {
        return obj;
      }
    });
    setDataEmployee(newLst);
  };
  const OnCheckedEmpAll = (status) => {
    setCheckedAll(status);
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      return { ...obj, checked: status };
    });
    setDataEmployee(newLst);
  };

  return (
    <Block paddingTop={5} backgroundColor={Color.gray} flex>
      <View style={{ flex: 1, marginTop: 5 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => onReload()}
          refreshing={false}
          data={dataSlip}
          renderItem={renderItem}
          listKey="slip"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          height: height / 12,
        }}
      >
        <View style={{ flex: 4, marginLeft: 20, justifyContent: "center" }}>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#F64E60" }}>Chọn không duyệt: </Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#F64E60" }}>{countStatus4}</Text>
          </View>
        </View>
        <View style={{ flex: 6, justifyContent: "center" }}>
          <View paddingRight={10}>
            <TVSButton
              buttonStyle="3"
              icon={"content-save"}
              onPress={OnSave}
              paddingHorizontal={30}
            >
              Xác nhận
            </TVSButton>
          </View>
        </View>
      </View>
      {modalEmployee}
    </Block>
  );
};

export default DaPheDuyet;
