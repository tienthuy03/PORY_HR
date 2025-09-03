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
import { KeyboardAvoidingView } from "react-native";
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

  //DIEM TRA
  const [modalVisibleProcess, setModalVisibleProcess] = useState(false);
  const [dataProcess, setDataProcess] = useState([]);
  const [process_code, setProcess_code] = useState("");
  const [process_code_nm, setProcess_code_nm] = useState("Chọn cụm công đoạn");

  const [ghiChu, setGhiChu] = useState("");
  const [quantity, setQuantity] = useState("");

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
      setOrg_code(dataOrg.filter((x) => x.code == data.org_pk)[0].code);
      setOrg_code_nm(dataOrg.filter((x) => x.code == data.org_pk)[0].code_nm);
      getDataItem(
        type,
        data,
        dataOrg.filter((x) => x.code == data.org_pk)[0].code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
      );
    } else {
      console.log("result org ", result);
      setOrg_code(result.code);
      setOrg_code_nm(result.code_nm);
      setItem_code("");
      setItem_code_nm("Chọn mã hàng");
      setProcess_code("");
      setProcess_code_nm("Chọn cụm công đoạn");
      setModalVisibleOrg(false);
      getDataItem(
        "manual",
        [],
        result.code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
      );
      // setQuantity("");

      setQuantity1(0);
      setQuantity2(0);
      setQuantity3(0);
      setQuantity4(0);
      setQuantity5(0);
      setQuantity6(0);
      setQuantity7(0);
      setQuantity8(0);
      setQuantity9(0);
      setQuantity10(0);
    }
  };

  const getStateItem = (type, data, result) => {
    if (type == "auto") {
      setItem_code(result.filter((x) => x.code == data.item_code)[0].code);
      setItem_code_nm(
        result.filter((x) => x.code == data.item_code)[0].code_nm
      );
      setProcess_code("");
      setProcess_code_nm("Chọn cụm công đoạn");
      setModalVisibleItem(false);
      getDataProcess(
        type,
        data,
        data.org_pk,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
        result.filter((x) => x.code == data.item_code)[0].code
      );
    } else {
      setItem_code(result.code);
      setItem_code_nm(result.code_nm);
      setProcess_code("");
      setProcess_code_nm("Chọn cụm công đoạn");
      setModalVisibleItem(false);
      getDataProcess(
        "manual",
        [],
        org_code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
        result.code
      );
    }
    // setQuantity("");

    setQuantity1(0);
    setQuantity2(0);
    setQuantity3(0);
    setQuantity4(0);
    setQuantity5(0);
    setQuantity6(0);
    setQuantity7(0);
    setQuantity8(0);
    setQuantity9(0);
    setQuantity10(0);
  };

  const getStateProcess = (type, data, result) => {
    if (type == "auto") {
      setProcess_code(
        result.filter((x) => x.code == data.process_code)[0].code
      );
      setProcess_code_nm(
        result.filter((x) => x.code == data.process_code)[0].code_nm
      );
    } else {
      setProcess_code(result.code);
      setProcess_code_nm(result.code_nm);
      setModalVisibleProcess(false);
    }
    // setQuantity("");

    setQuantity1(0);
    setQuantity2(0);
    setQuantity3(0);
    setQuantity4(0);
    setQuantity5(0);
    setQuantity6(0);
    setQuantity7(0);
    setQuantity8(0);
    setQuantity9(0);
    setQuantity10(0);
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
    console.log("getDataOrg");
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR002001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_org",
          p2_sys: "lst_frame",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          // refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataOrg(rs.data.lst_org);
            console.log(rs.data.lst_org.filter((x) => x.default_yn == "Y"));
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
            handleFrame(rs.data.lst_frame);
            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log("error getData");
        console.log(error);
      });
  };

  const getDataItem = (type, data, org, date) => {
    console.log("getDataItem ", {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: org,
      p3_varchar2: date,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    });
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR002002",
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
            console.log(rs.data.lst_item);
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
        console.log("error getData");
        console.log(error);
      });
  };

  const getDataProcess = (type, data, org, date, item) => {
    console.log("getDataProcess ", {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: org,
      p3_varchar2: date,
      p4_varchar2: item,
      p5_varchar2: APP_VERSION,
      p6_varchar2: crt_by,
    });

    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR002003",
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
        console.log("error getDataProcess");
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
    setProcess_code_nm("Chọn cụm công đoạn");
    // setFromDate("dd/mm/yyyy");
    setGhiChu("");
    setQuantity1(0);
    setQuantity2(0);
    setQuantity3(0);
    setQuantity4(0);
    setQuantity5(0);
    setQuantity6(0);
    setQuantity7(0);
    setQuantity8(0);
    setQuantity9(0);
    setQuantity10(0);
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
    const pro = "UPDHRPR002000";
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: thr_emp_pk,
      p3_varchar2: org_code.toString(),
      p4_varchar2: item_code.toString(),
      p5_varchar2: process_code.toString(),
      p6_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p7_varchar2: quantity,
      p8_varchar2: ghiChu,
      p9_varchar2: APP_VERSION,
      p10_varchar2: crt_by,
      p11_varchar2: quantity1 == 0 ? "" : quantity1,
      p12_varchar2: quantity2 == 0 ? "" : quantity2,
      p13_varchar2: quantity3 == 0 ? "" : quantity3,
      p14_varchar2: quantity4 == 0 ? "" : quantity4,
      p15_varchar2: quantity5 == 0 ? "" : quantity5,
      p16_varchar2: quantity6 == 0 ? "" : quantity6,
      p17_varchar2: quantity7 == 0 ? "" : quantity7,
      p18_varchar2: quantity8 == 0 ? "" : quantity8,
      p19_varchar2: quantity9 == 0 ? "" : quantity9,
      p20_varchar2: quantity10 == 0 ? "" : quantity10,
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
        console.log("rs UPDHRBS002000 ", rs);
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
      // bottom={
      //   <TVSButton
      //     type={"danger"}
      //     icon={"close"}
      //     buttonStyle={"3"}
      //     onPress={() => setModalVisibleOrg(false)}
      //   >
      //     Đóng lại
      //   </TVSButton>
      // }
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
      // bottom={
      //   <TVSButton
      //     type={"danger"}
      //     icon={"close"}
      //     buttonStyle={"3"}
      //     onPress={() => setModalVisibleItem(false)}
      //   >
      //     Đóng lại
      //   </TVSButton>
      // }
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
      title={"Chọn cụm công đoạn"}
      isShow={modalVisibleProcess}
      onHide={() => setModalVisibleProcess(false)}
    >
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
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopupBottom>
  );

  const [modalVisibleSuggest, setModalVisibleSuggest] = useState(false);
  const [dataSuggest, setDataSuggest] = useState([]);
  const [dataSuggestTitle, setDataSuggestTitle] = useState([]);

  const showSuggest = () => {
    //getdata
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRPR002004",
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
            console.log(rs.data.lst_text);
            console.log(rs.data.lst_data);
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
        console.log("error getData");
        console.log(error);
      });
  };
  const onCallBack = (data) => {
    if (data != null) {
      console.log("call back ", data);
      console.log(
        "dataOrg ",
        dataOrg.filter((x) => x.code == data.org_pk)
      );
      getStateOrg("auto", data, {});
      // getStateItem(dataItem.filter((x) => x.code == data.item_code)[0]);
      // getStateProcess(dataProcess.filter((x) => x.code == data.process_code)[0]);
    }
    setModalVisibleSuggest(!modalVisibleSuggest);
  };
  const [isShow1, setIsShow1] = useState("N");
  const [isShow2, setIsShow2] = useState("N");
  const [isShow3, setIsShow3] = useState("N");
  const [isShow4, setIsShow4] = useState("N");
  const [isShow5, setIsShow5] = useState("N");
  const [isShow6, setIsShow6] = useState("N");
  const [isShow7, setIsShow7] = useState("N");
  const [isShow8, setIsShow8] = useState("N");
  const [isShow9, setIsShow9] = useState("N");
  const [isShow10, setIsShow10] = useState("N");

  const [isShowName1, setIsShowName1] = useState("LẦN 01");
  const [isShowName2, setIsShowName2] = useState("LẦN 02");
  const [isShowName3, setIsShowName3] = useState("LẦN 03");
  const [isShowName4, setIsShowName4] = useState("LẦN 04");
  const [isShowName5, setIsShowName5] = useState("LẦN 05");
  const [isShowName6, setIsShowName6] = useState("LẦN 06");
  const [isShowName7, setIsShowName7] = useState("LẦN 07");
  const [isShowName8, setIsShowName8] = useState("LẦN 08");
  const [isShowName9, setIsShowName9] = useState("LẦN 09");
  const [isShowName10, setIsShowName10] = useState("LẦN 10");

  const [quantity1, setQuantity1] = useState(0);
  const [quantity2, setQuantity2] = useState(0);
  const [quantity3, setQuantity3] = useState(0);
  const [quantity4, setQuantity4] = useState(0);
  const [quantity5, setQuantity5] = useState(0);
  const [quantity6, setQuantity6] = useState(0);
  const [quantity7, setQuantity7] = useState(0);
  const [quantity8, setQuantity8] = useState(0);
  const [quantity9, setQuantity9] = useState(0);
  const [quantity10, setQuantity10] = useState(0);

  const handleFrame = (data) => {
    console.log("frame ", data);
    let arrProcess = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let arrShow = [];
    let arrHide = [];
    if (data.length > 0) {
      data.forEach(function (item) {
        if (item.code == 1) {
          setIsShowName1(item.code_nm);
        }
        if (item.code == 2) {
          setIsShowName2(item.code_nm);
        }
        if (item.code == 3) {
          setIsShowName3(item.code_nm);
        }
        if (item.code == 4) {
          setIsShowName4(item.code_nm);
        }
        if (item.code == 5) {
          setIsShowName5(item.code_nm);
        }
        if (item.code == 6) {
          setIsShowName6(item.code_nm);
        }
        if (item.code == 7) {
          setIsShowName7(item.code_nm);
        }
        if (item.code == 8) {
          setIsShowName8(item.code_nm);
        }
        if (item.code == 9) {
          setIsShowName9(item.code_nm);
        }
        if (item.code == 10) {
          setIsShowName10(item.code_nm);
        }
        arrShow.push(item.code);
      });
      arrHide = arrProcess.filter((x) => !arrShow.includes(x));
      console.log("arrShow ", arrShow);
      console.log("arrHide ", arrHide);
    } else {
      arrHide = arrProcess;
    }
    arrShow.forEach(function (item) {
      if (item == 1) {
        setIsShow1("Y");
      }
      if (item == 2) {
        setIsShow2("Y");
      }
      if (item == 3) {
        setIsShow3("Y");
      }
      if (item == 4) {
        setIsShow4("Y");
      }
      if (item == 5) {
        setIsShow5("Y");
      }
      if (item == 6) {
        setIsShow6("Y");
      }
      if (item == 7) {
        setIsShow7("Y");
      }
      if (item == 8) {
        setIsShow8("Y");
      }
      if (item == 9) {
        setIsShow9("Y");
      }
      if (item == 10) {
        setIsShow10("Y");
      }
    });
    arrHide.forEach(function (item) {
      if (item == 1) {
        setIsShow1("N");
      }
      if (item == 2) {
        setIsShow2("N");
      }
      if (item == 3) {
        setIsShow3("N");
      }
      if (item == 4) {
        setIsShow4("N");
      }
      if (item == 5) {
        setIsShow5("N");
      }
      if (item == 6) {
        setIsShow6("N");
      }
      if (item == 7) {
        setIsShow7("N");
      }
      if (item == 8) {
        setIsShow8("N");
      }
      if (item == 9) {
        setIsShow9("N");
      }
      if (item == 10) {
        setIsShow10("N");
      }
    });
  };
  return (
    <Block flex>
      <TVSHeader goBack={goBack}>Nhập sản lượng theo cụm</TVSHeader>
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
                  // nextScreen={() => {
                  //   setFromDatePickerVisible(true);
                  // }}
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
                <Text color={Color.mainColor}>Cụm công đoạn</Text>
                <Text color={Color.red}> *</Text>
              </Block>
              <TVSList
                onPress={() => setModalVisibleProcess(true)}
                colorText={
                  process_code_nm == "Chọn cụm công đoạn" ? "#B2B2B2" : null
                }
                code_nm={process_code_nm}
              />
            </Block>
            <Block style={styles.titleContainer}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Số lượng</Text>
                <Text color={Color.red}> *</Text>
              </Block>
              <View style={{ marginHorizontal: 10 }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{ borderRadius: 2 }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        height: 30,
                      }}
                    >
                      {isShow1 == "Y" && (
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
                          <Text>{isShowName1}</Text>
                        </View>
                      )}
                      {isShow2 == "Y" && (
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
                          <Text>{isShowName2}</Text>
                        </View>
                      )}
                      {isShow3 == "Y" && (
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
                          <Text>{isShowName3}</Text>
                        </View>
                      )}
                      {isShow4 == "Y" && (
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
                          <Text>{isShowName4}</Text>
                        </View>
                      )}
                      {isShow5 == "Y" && (
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
                          <Text>{isShowName5}</Text>
                        </View>
                      )}
                      {isShow6 == "Y" && (
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
                          <Text>{isShowName6}</Text>
                        </View>
                      )}
                      {isShow7 == "Y" && (
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
                          <Text>{isShowName7}</Text>
                        </View>
                      )}
                      {isShow8 == "Y" && (
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
                          <Text>{isShowName8}</Text>
                        </View>
                      )}
                      {isShow9 == "Y" && (
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
                          <Text>{isShowName9}</Text>
                        </View>
                      )}
                      {isShow10 == "Y" && (
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
                          <Text>{isShowName10}</Text>
                        </View>
                      )}
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          height: Platform.OS == "ios" ? 30 : 40,
                        }}
                      >
                        {isShow1 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity1}
                              placeholder="0"
                              onChangeText={(text) => setQuantity1(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow2 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity2}
                              placeholder="0"
                              onChangeText={(text) => setQuantity2(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow3 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity3}
                              placeholder="0"
                              onChangeText={(text) => setQuantity3(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow4 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity4}
                              placeholder="0"
                              onChangeText={(text) => setQuantity4(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow5 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity5}
                              placeholder="0"
                              onChangeText={(text) => setQuantity5(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow6 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity6}
                              placeholder="0"
                              onChangeText={(text) => setQuantity6(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow7 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity7}
                              placeholder="0"
                              onChangeText={(text) => setQuantity7(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow8 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity8}
                              placeholder="0"
                              onChangeText={(text) => setQuantity8(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow9 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity9}
                              placeholder="0"
                              onChangeText={(text) => setQuantity9(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                        {isShow10 == "Y" && (
                          <View
                            style={{
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
                            <TextInput
                              style={{
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={quantity10}
                              placeholder="0"
                              onChangeText={(text) => setQuantity10(text)}
                              keyboardType={"numeric"}
                              returnKeyType="done"
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
              {/* <TextInput
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
              ></TextInput> */}
            </Block>
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
                  multiline={true}
                  placeholder={"Nhập ghi chú"}
                  value={ghiChu}
                  onChangeText={setGhiChu}
                />
              </Block>
            </Block>
            <Block style={{ marginBottom: 350 }}></Block>
          </Block>

          {/*  */}

          {/* {modalTuyenDuong} */}
          {modalOrg}
          {modalItem}
          {modalProcess}
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
  );
}
