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
  Platform,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
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
import IconDate from "../../../../../icons/Datev";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";
import ModalSuggest from "../Modal";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import TVSControlPopupBottom from "../../../../../components/Tvs/ControlPopupBottom";

import TVSHeader from "../../../../../components/Tvs/Header";
export default function DK({ navigation: { goBack }, route }) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    // style form
    container: {
      paddingTop: 10,
      flex: 1,
    },
    titleContainerTime: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
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
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
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
  const [load, setLoad] = useState(false);

  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [tablePK, setTablePK] = useState("");
  //NOTE
  const [dataNote, setDataNote] = useState([]);
  const [dataDefault, setDataDefault] = useState([]);
  //To chuyen
  const [modalVisibleOrg, setModalVisibleOrg] = useState(false);
  const [dataOrg, setDataOrg] = useState([]);
  const [org_code, setOrg_code] = useState("");
  const [org_code_nm, setOrg_code_nm] = useState("Chọn tổ chuyền");

  //Ma hang
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const [item_code, setItem_code] = useState("");
  const [item_code_nm, setItem_code_nm] = useState("Chọn mã hàng");

  //Cong doan
  const [modalVisibleProcess, setModalVisibleProcess] = useState(false);
  const [dataProcess, setDataProcess] = useState([]);
  const [process_code, setProcess_code] = useState("");
  const [process_code_nm, setProcess_code_nm] = useState("Chọn công đoạn");

  const [ghiChu, setGhiChu] = useState("");
  const [quantity, setQuantity] = useState("");

  const [modalVisibleInputQuantity, setModalVisibleInputQuantity] =
    useState(false);
  useEffect(() => {
    getDataOrg();
  }, []);

  //Từ ngày
  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };
  const handleConfirmFromDate = (val) => {
    hidePickerFromDate();
    setFromDate(moment(val).format("DD/MM/YYYY"));
    setItem_code("");
    setItem_code_nm("Chọn mã hàng");
    setDataSelectedProcess([]);
    setModalVisibleOrg(false);
    if (org_code != "") {
      getDataItem("manual", [], org_code, moment(val).format("YYYYMMDD"));
    }
  };

  const dialogError = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Thoát",
          onPress: () => {
            setLoad(false);
          },
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const getStateOrg = (type, data, result) => {
    if (type == "auto") {
      setOrg_code(dataOrg.filter((x) => x.code == data[0].org_pk)[0].code);
      setOrg_code_nm(
        dataOrg.filter((x) => x.code == data[0].org_pk)[0].code_nm
      );
      getDataItem(
        type,
        data,
        dataOrg.filter((x) => x.code == data[0].org_pk)[0].code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
      );
    } else {
      setOrg_code(result.code);
      setOrg_code_nm(result.code_nm);
      setItem_code("");
      setItem_code_nm("Chọn mã hàng");
      setProcess_code("");
      setProcess_code_nm("Chọn công đoạn");
      setDataSelectedProcess([]);
      setModalVisibleOrg(false);
      getDataItem(
        "manual",
        [],
        result.code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
      );
    }
  };

  const getStateItem = (type, data, result) => {
    if (type == "auto") {
      setItem_code(result.filter((x) => x.code == data[0].item_code)[0].code);
      setItem_code_nm(
        result.filter((x) => x.code == data[0].item_code)[0].code_nm
      );
      setProcess_code("");
      setProcess_code_nm("Chọn công đoạn");
      setModalVisibleItem(false);
      getDataProcess(
        type,
        data,
        data[0].org_pk,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
        result.filter((x) => x.code == data[0].item_code)[0].code
      );
    } else {
      setItem_code(result.code);
      setItem_code_nm(result.code_nm);
      setProcess_code("");
      setProcess_code_nm("Chọn công đoạn");
      setDataSelectedProcess([]);
      setModalVisibleItem(false);
      getDataProcess(
        "manual",
        [],
        org_code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
        result.code
      );
    }
  };
  const [flagEditProcess, setFlagEditProcess] = useState("");
  const [flagEditProcessCodeName, setFlagEditProcessCodeName] = useState("");

  const getStateProcess = (type, data, result) => {
    if (type == "auto") {
      // setProcess_code(
      //   result.filter((x) => x.code == data.process_code)[0].code
      // );
      // setProcess_code_nm(
      //   result.filter((x) => x.code == data.process_code)[0].code_nm
      // );
      let processTmp = [];
      result.forEach(function (item) {
        data.forEach(function (item2) {
          if (item.code == item2.process_code) {
            processTmp.push({
              code: item.code,
              code_nm: item.code_nm,
              quantity: "",
              selected: true,
            });
          }
        });
      });
      setDataSelectedProcess(processTmp);
    } else {
      let dataProcessTemp = [...dataProcess];
      dataProcessTemp = dataProcessTemp.map((obj) => {
        if (obj.code == result.code) {
          if (obj.selected) {
            return { ...obj, selected: false };
          } else {
            return { ...obj, selected: true };
          }
        } else {
          return obj;
        }
      });
      setDataProcess(dataProcessTemp);
      // setFlagEditProcess(result.code);
      // setModalVisibleProcess(false);
      // setModalVisibleInputQuantity(true);
    }
    setQuantity("");
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
        // if (obj == 'updateExperience') {
        //   updateExperience();
        // }
        // if (obj == 'getData') {
        //   getData();
        // }
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

  const getDataOrg = () => {
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR001001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_org",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          // refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataOrg(rs.data.lst_org);
            if (rs.data.lst_org.filter((x) => x.default_yn == "Y").length > 0) {
              getStateOrg(
                "manual",
                [],
                rs.data.lst_org.filter((x) => x.default_yn == "Y")[0]
              );
            } else {
              setOrg_code("");
              setOrg_code_nm("Chọn tổ chuyền");
            }
            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  const getDataItem = (type, data, org, date) => {
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR001002",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: org,
          p3_varchar2: date,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_item",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          // refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataItem(rs.data.lst_item);
            if (type == "auto") {
              getStateItem(type, data, rs.data.lst_item);
            }
            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  const getDataProcess = (type, data, org, date, item) => {
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR001003",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: org,
          p3_varchar2: date,
          p4_varchar2: item,
          p5_varchar2: APP_VERSION,
          p6_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_process",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          // refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataProcess(rs.data.lst_process);
            if (type == "auto") {
              getStateProcess(type, data, rs.data.lst_process);
            }
            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };
  const onResetForm = () => {
    setTablePK("");

    setOrg_code("");
    setOrg_code_nm("Chọn tổ chuyền");
    setItem_code("");
    setItem_code_nm("Chọn mã hàng");
    setProcess_code("");
    setProcess_code_nm("Chọn công đoạn");
    // setFromDate("dd/mm/yyyy");
    setGhiChu("");
    setDataSelectedProcess([]);
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

  const onSave = () => {
    const pro = "UPDHRPR001002";
    let valQuan = "";
    let lstCodeProcess = ""; //code
    if (dataSelectedProcess.length > 0) {
      dataSelectedProcess.forEach(function (item) {
        if (item.quantity > 0) {
          valQuan += item.quantity + "|";
        } else {
          valQuan += "0|";
        }
        lstCodeProcess += item.code + "|";
      });
    }
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: thr_emp_pk,
      p3_varchar2: org_code.toString(),
      p4_varchar2: item_code.toString(),
      p5_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p6_varchar2: lstCodeProcess,
      p7_varchar2: valQuan,
      p8_varchar2: dataSelectedProcess.length,
      p9_varchar2: ghiChu,
      p10_varchar2: APP_VERSION,
      p11_varchar2: crt_by,
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
        if (rs.results == "F") {
          showAlert(rs.errorData);
        } else {
          showAlert(rs.data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalOrg = (
    <TVSControlPopupBottom
      title={"Chọn tổ chuyền"}
      isShow={modalVisibleOrg}
      onHide={() => setModalVisibleOrg(false)}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataOrg}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateOrg("manual", [], item);
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
    </TVSControlPopupBottom>
  );

  const modalItem = (
    <TVSControlPopupBottom
      title={"Chọn mã hàng"}
      isShow={modalVisibleItem}
      onHide={() => setModalVisibleItem(false)}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataItem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateItem("manual", [], item);
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
    </TVSControlPopupBottom>
  );

  const modalProcess = (
    <TVSControlPopupBottom
      title={"Chọn công đoạn"}
      isShow={modalVisibleProcess}
      onHide={() => setModalVisibleProcess(false)}
      // bottom={
      //   <TVSButton
      //     type={"danger"}
      //     icon={"close"}
      //     buttonStyle={"3"}
      //     onPress={() => setModalVisibleProcess(false)}
      //   >
      //     Đóng lại
      //   </TVSButton>
      // }
    >
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dataProcess}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  getStateProcess("manual", [], item);
                }}
                style={{
                  backgroundColor: "#F3F6F9",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 3,
                  flexDirection: "row",
                }}
              >
                <Text style={{ flex: 1 }}>{item.code_nm}</Text>
                {item.selected ? (
                  <Icon name={"check"} size={16} color={"green"} />
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TVSButton
            // type={"danger"}
            icon={"check"}
            buttonStyle={"3"}
            onPress={() => handleSelectProcess()}
          >
            Xác nhận
          </TVSButton>
        </View>
      </>
    </TVSControlPopupBottom>
  );

  const modalInputQuantity = (
    <TVSControlPopup
      title={"CÔNG ĐOẠN"}
      isShow={modalVisibleInputQuantity}
      minHeight={60}
      maxHeight={500}
      onHide={() => setModalVisibleInputQuantity(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"trash-can-outline"}
          buttonStyle={"3"}
          onPress={() => handleDeleteQuantity()}
        >
          Xóa bỏ
        </TVSButton>
      }
    >
      <Block style={styles.titleContainer}>
        <View style={{}}>
          <Text>{flagEditProcessCodeName}</Text>
        </View>
      </Block>
    </TVSControlPopup>
  );
  const onEditQuantity = (code, code_nm) => {
    setFlagEditProcess(code);
    setFlagEditProcessCodeName(code_nm);
    setModalVisibleInputQuantity(true);
  };
  const handleDeleteQuantity = () => {
    let dataSelectedProcessTemp = [...dataSelectedProcess];
    setDataSelectedProcess(
      dataSelectedProcessTemp.filter((x) => x.code != flagEditProcess)
    );
    let dataProcessTemp = [...dataProcess];
    dataProcessTemp = dataProcessTemp.map((obj) => {
      if (obj.code === flagEditProcess) {
        return { ...obj, selected: false };
      } else {
        return obj;
      }
    });
    setDataProcess(dataProcessTemp);
    setModalVisibleInputQuantity(false);
  };
  const [dataSelectedProcess, setDataSelectedProcess] = useState([]);
  const handleSelectProcess = () => {
    let dataProcessTemp = [...dataProcess];
    let dataSelectedProcessTemp = [...dataSelectedProcess];
    let tmp = [];
    if (dataSelectedProcessTemp.length > 0) {
      dataProcessTemp
        .filter((x) => x.selected == true)
        .map((x) => {
          let flag = true;
          dataSelectedProcessTemp.map((y) => {
            if (y.code == x.code) {
              flag = false;
            }
          });
          if (flag) {
            tmp.push(x);
          }
        });
      setDataSelectedProcess([...dataSelectedProcess, ...tmp]);
    } else {
      setDataSelectedProcess(dataProcessTemp.filter((x) => x.selected == true));
    }
    dataProcessTemp = dataProcessTemp.map((obj) => {
      return { ...obj, selected: false };
    });
    setDataProcess(dataProcessTemp);

    setModalVisibleProcess(false);
  };
  const [modalVisibleSuggest, setModalVisibleSuggest] = useState(false);
  const [dataSuggest, setDataSuggest] = useState([]);
  const [dataSuggestTitle, setDataSuggestTitle] = useState([]);

  const showSuggest = () => {
    //getdata
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR001004",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_text",
          p2_sys: "lst_data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          // refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataSuggest(rs.data.lst_data);
            setDataSuggestTitle(rs.data.lst_text);
            setModalVisibleSuggest(!modalVisibleSuggest);
            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  const onCallBack = (data) => {
    if (data != null) {
      //data.length > 0) {
      let flagCheckOrg = true;
      let flagCheckItem = true;

      let tmpOrg = data[0].org_pk;
      let tmpItem = data[0].item_code;

      data.forEach(function (item) {
        if (item.org_pk != tmpOrg) {
          flagCheckOrg = false;
        }
        if (item.item_code != tmpItem) {
          flagCheckItem = false;
        }
      });
      if (!flagCheckOrg) {
        dialogNoti("Vui lòng chọn gợi ý có cùng tổ chuyền");
        return;
      }
      if (!flagCheckOrg) {
        dialogNoti("Vui lòng chọn gợi ý có cùng mã hàng");
        return;
      }
      getStateOrg("auto", data, {});
    }
    setModalVisibleSuggest(!modalVisibleSuggest);
  };
  const handleInputQuantity = (text, code) => {
    let dataProcessTemp = [...dataSelectedProcess];

    dataProcessTemp = dataProcessTemp.map((obj) => {
      if (obj.code === code) {
        return { ...obj, quantity: text };
      } else {
        return obj;
      }
    });
    setDataSelectedProcess(dataProcessTemp);
    // You can perform any actions here when the user finishes typing
  };
  const handleEndEditing = (text, code) => {
    let dataProcessTemp = [...dataSelectedProcess];

    dataProcessTemp = dataProcessTemp.map((obj) => {
      if (obj.code === code) {
        return { ...obj, quantity: text };
      } else {
        return obj;
      }
    });
    setDataSelectedProcess(dataProcessTemp);
    // You can perform any actions here when the user finishes typing
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Block flex>
        <TVSHeader goBack={goBack}>Nhập sản lượng</TVSHeader>
        <Block borderTopLeftRadius={6} borderTopRightRadius={6} flex={1}>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: Color.white,
              marginHorizontal: 10,
              marginTop: 10,
              borderRadius: 8,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Block style={[styles.container]}>
              {dataNote.length > 0 ? (
                <Block
                  style={{
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      // fontSize: 12,
                    }}
                    fontStyle={"italic"}
                  >
                    {dataNote[0].note}
                  </Text>
                </Block>
              ) : null}

              <Block
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Block style={styles.titleContainer}>
                  <Button
                    nextScreen={() => {
                      setFromDatePickerVisible(true);
                    }}
                    column
                    flex
                  >
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Ngày</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <Block
                      radius={6}
                      backgroundColor={Color.gray}
                      row
                      justifyContent={"space-between"}
                      alignCenter
                      padding={8}
                    >
                      <Text>{fromDate}</Text>
                      <IconDate />
                    </Block>
                  </Button>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={fromDatePickerVisible}
                    mode="date"
                    hideTitleContainerIOS={false}
                    date={
                      fromDate !== "dd/mm/yyyy"
                        ? new Date(moment(fromDate, "DD/MM/YYYY"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmFromDate}
                    onCancel={hidePickerFromDate}
                  />
                </Block>
                <Block
                  style={{
                    // flex: 1,
                    paddingHorizontal: 5,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}></Text>
                    </Block>
                    <TouchableOpacity
                      onPress={() => {
                        showSuggest();
                      }}
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        // marginHorizontal: 5,
                        borderWidth: 0.5,
                        borderRadius: 20,
                        borderColor: "#FFA800",
                        backgroundColor: "white",
                      }}
                    >
                      <Icon
                        name={"lightbulb-on-outline"}
                        color={"#FFA800"}
                        size={20}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          paddingVertical: 10,
                          fontWeight: "bold",
                          color: "#FFA800",
                        }}
                      >
                        Gợi ý
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Block>
              </Block>
              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Tổ chuyền</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSList
                  onPress={() => setModalVisibleOrg(true)}
                  colorText={org_code_nm == "Chọn tổ chuyền" ? "#B2B2B2" : null}
                  code_nm={org_code_nm}
                />
              </Block>
              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Mã hàng</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSList
                  onPress={() => setModalVisibleItem(true)}
                  colorText={item_code_nm == "Chọn mã hàng" ? "#B2B2B2" : null}
                  code_nm={item_code_nm}
                />
              </Block>

              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Công đoạn</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSList
                  onPress={() => setModalVisibleProcess(true)}
                  colorText={
                    process_code_nm == "Chọn công đoạn" ? "#B2B2B2" : null
                  }
                  code_nm={process_code_nm}
                />
              </Block>
              {/* <Block style={styles.titleContainer}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Số lượng</Text>
                <Text color={Color.red}> *</Text>
              </Block>
              <TextInput
                style={{
                  backgroundColor: Color.gray,
                  paddingHorizontal: 5,
                  paddingVertical: Platform.OS == "ios" ? 10 : 0,
                  borderRadius: 6,
                }}
                value={quantity}
                placeholder="0"
                onChangeText={setQuantity}
                keyboardType={"number-pad"}
              ></TextInput>
            </Block> */}
              <View
                style={{
                  borderWidth: 1,
                  paddingVertical: 10,
                  borderColor: Color.gray,
                  // borderRadius:6,
                  borderWidth: 2,
                  borderRadius: 8,
                  marginHorizontal: 5,
                  marginTop: 15,
                  marginBottom: 5,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -12,
                    backgroundColor: "white",
                    left: 10,
                  }}
                >
                  <View style={{}}>
                    <Text style={{ color: Color.mainColor }}>
                      Danh sách công đoạn {"("}
                      {dataSelectedProcess.length}
                      {")"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: "lightgray",
                    marginBottom: 3,
                    flexDirection: "row",
                    marginHorizontal: 10,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Text style={{}}>Công đoạn</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 60,
                      }}
                    >
                      <Text style={{}}>Số lượng</Text>
                    </View>
                  </View>
                </View>
                {dataSelectedProcess.length > 0
                  ? dataSelectedProcess.map((x) => (
                      <View
                        style={{
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgray",
                          marginBottom: 3,
                          flexDirection: "row",
                          marginHorizontal: 10,
                          marginBottom: 10,
                        }}
                      >
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => {
                              onEditQuantity(x.code, x.code_nm);
                            }}
                            style={{ flex: 1, justifyContent: "center" }}
                          >
                            <Text style={{}}>{x.code_nm}</Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              justifyContent: "center",
                              // alignItems: "center",
                              width: 60,
                            }}
                          >
                            <TextInput
                              style={{
                                flex: 1,
                                padding: 5,
                                backgroundColor: Color.gray,
                                marginBottom: 5,
                                borderRadius: 8,
                                // alignItems: "center",
                                // justifyContent: "center",
                              }}
                              value={x.quantity}
                              placeholder="0"
                              keyboardType={"number-pad"}
                              onChangeText={(text) =>
                                handleInputQuantity(text, x.code)
                              }
                              // onEndEditing={(event) =>
                              //   handleEndEditing(event.nativeEvent.text, x.code)
                              // }
                            />
                            {/* <Text style={{ color: "green" }}>{x.quantity}</Text> */}
                          </View>
                        </View>
                      </View>
                    ))
                  : null}
              </View>
              {/* Control Text Area */}
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
                    // multiline={true}
                    placeholder={"Nhập ghi chú"}
                    value={ghiChu}
                    onChangeText={setGhiChu}
                  />
                </Block>
              </Block>
              {/* <Block style={{ marginBottom: 350 }}></Block> */}
              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Color.white,
                  marginHorizontal: 10,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  maginTop: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <TVSButton
                    onPress={onResetForm}
                    buttonStyle={"3"}
                    type={"secondary"}
                    icon={"sync"}
                    minWidth={150}
                  >
                    Làm mới
                  </TVSButton>
                </View>
                <View style={{ flex: 1 }}>
                  <TVSButton
                    onPress={validate}
                    icon={"content-save"}
                    buttonStyle={"3"}
                    minWidth={150}
                  >
                    Sao lưu
                  </TVSButton>
                </View>
              </View> */}
            </Block>

            {/*  */}

            {/* {modalTuyenDuong} */}
            {modalOrg}
            {modalItem}
            {modalProcess}
            {modalInputQuantity}
            {/* {modalSuggest} */}

            <ModalSuggest
              isShow={modalVisibleSuggest}
              callBack={(data) => onCallBack(data)}
              data={dataSuggest}
              title={dataSuggestTitle}
            />
            <Load visible={load} />
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Color.white,
              marginHorizontal: 10,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <TVSButton
                onPress={onResetForm}
                buttonStyle={"3"}
                type={"secondary"}
                icon={"sync"}
                minWidth={150}
              >
                Làm mới
              </TVSButton>
            </View>
            <View style={{ flex: 1 }}>
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

        <SafeAreaView />
      </Block>
    </KeyboardAvoidingView>
  );
}
