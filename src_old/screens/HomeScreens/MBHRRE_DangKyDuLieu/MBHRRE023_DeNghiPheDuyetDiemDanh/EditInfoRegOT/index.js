import moment from "moment";
import {
  Alert,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Keyboard,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
import RequestSendNotification from "../../../../../services/notification/send";
import TVSHeader from "../../../../../components/Tvs/Header";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import Text from "../../../../../components/Text";

const EditRegOT = ({ navigation: { goBack }, route }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let height = Dimensions.get("window").height;

  const { getDataList } = route.params;
  let useRef_TimeIn = useRef(null);
  let useRef_TimeOut = useRef(null);
  // const tokenLogin = useSelector(
  //   state => state.loginReducers.data.data.tokenLogin,
  // );
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
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
  const [decisContent, setDecisContent] = useState("");

  const [currentPhongBan, setCurrentPhongBan] = useState({});

  const [description, setDescription] = useState("");

  const [masterPK, setMasterPK] = useState("");

  const [dataEmployeeIns, setDataEmployeeIns] = useState([]);

  const [dataInsertApprove, setDataInsertApprove] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("DD/MM/YYYY")
  );
  const [toDate, setToDate] = useState(
    moment().endOf("month").format("DD/MM/YYYY")
  );
  const [modalVisiblePhongBan, setModalVisiblePhongBan] = useState(false);
  const [modalVisibleloaiDiemDanh, setModalVisibleloaiDiemDanh] =
    useState(false);
  const [modalVisibleTTXacNhan, setModalVisibleTTXacNhan] = useState(false);
  const [modalVisibleLoaiPhieu, setModalVisibleLoaiPhieu] = useState(false);
  const [modalVisibleLyDo, setModalVisibleLyDo] = useState(false);

  const [loaiDiemDanh, setLoaiDiemDanh] = useState({});
  const [dataLoaiDiemDanh, setDataLoaiDiemDanh] = useState([]);
  const [loaiPhieu, setLoaiPhieu] = useState({});
  const [dataLoaiPhieu, setDataLoaiPhieu] = useState([]);
  const [ttXacNhan, setTTXacNhan] = useState({});
  const [dataTTXacNhan, setDataTTXacNhan] = useState([]);
  const [dataLyDo, setDataLyDo] = useState([]);
  const [numberEmp, setNumberEmp] = useState(0);
  const [reasonTT, setReasonTT] = useState({});
  const [numberEmpIns, setNumberEmpIns] = useState(0);
  const [isShowTimeOut, setIsShowTimeOut] = useState(false);
  const [isShowTimeIn, setIsShowTimeIn] = useState(false);

  const [currentSelectedTimeIn, setCurrentSelectedTimeIn] = useState({});
  const [currentSelectedTimeOut, setCurrentSelectedTimeOut] = useState({});

  const [modalVisibleEditEmp, setModalVisibleEditEmp] = useState(false);
  const [dataEditeEmp, setDataEditEmp] = useState([]);
  const [disableTimeIn, setDisableTimeIn] = useState(false);
  const [disableTimeOut, setDisableTimeOut] = useState(false);
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);

  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");

  const [date, setDate] = useState(moment().format("DD/MM/YYYY"));
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [decisNo, setDecisNo] = useState("");

  useEffect(() => {
    setMasterPK(route.params.masterPK);
    setCurrentPhongBan({ code: 0, code_nm: "Chọn phòng ban" });
    setLoaiDiemDanh({ code: 0, code_nm: "Chọn lỗi điểm danh" });
    setLoaiPhieu({ code: 0, code_nm: "Chọn loại phiếu" });
    setFromDate(moment().startOf("month").format("DD/MM/YYYY"));
    setToDate(moment().endOf("month").format("DD/MM/YYYY"));
  }, []);

  useEffect(() => {
    getData();
  }, [masterPK]);

  useEffect(() => {
    if (modalVisibleEmp) {
      getDataEmployee(
        currentPhongBan.code,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
        moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
        loaiDiemDanh.code.toString(),
        loaiPhieu.code.toString()
      );
    }
  }, [modalVisibleEmp]);

  const getStateTTXacNhan = (result) => {
    setTTXacNhan(result);
    setModalVisibleTTXacNhan(false);
  };

  const getStateLyDo = (result) => {
    setReasonTT(result);
    setModalVisibleLyDo(false);
  };

  const modalTTXacNhan = (
    <TVSControlPopup
      title={"Chọn tình trạng xác nhận"}
      isShow={modalVisibleTTXacNhan}
      onHide={() => setModalVisibleTTXacNhan(false)}
    >
      <FlatList
        data={dataTTXacNhan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateTTXacNhan(item);
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
  );

  const modalLyDo = (
    <TVSControlPopup
      title={"Chọn lý do"}
      isShow={modalVisibleLyDo}
      onHide={() => setModalVisibleLyDo(false)}
    >
      <FlatList
        data={dataLyDo}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateLyDo(item);
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
  );

  const OnDelete = (pk) => {
    let newLst = [...dataEmployeeIns];
    newLst = newLst.map((obj) => {
      if (obj.pk == pk) {
        obj.checked = "N";
      }
      return obj;
    });
    setDataEmployeeIns(newLst);
    setNumberEmpIns(numberEmpIns - 1);
  };

  const getData = () => {
    const pro = "SELHRRE023004";
    const in_par = {
      p1_varchar2: masterPK,
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
          p1_sys: "lst_org",
          p2_sys: "data_approve",
          p3_sys: "dataEmp",
          p4_sys: "dataAttendance",
          p5_sys: "time",
          p6_sys: "dataLoaiDiemDanh",
          p7_sys: "dataLoaiPhieu",
          p8_sys: "lstReason",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRRE023004", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.lst_org && rs.data.lst_org.length > 0) {
              setCurrentPhongBan({
                code: rs.data.lst_org[0].code,
                code_nm: rs.data.lst_org[0].code_nm,
              });

              setDecisContent(rs.data.lst_org[0].decis_content);
              setDecisNo(rs.data.lst_org[0].decis_no);
            }

            if (rs.data.data_approve && rs.data.data_approve.length > 0) {
              setDataInsertApprove(rs.data.data_approve);
            }

            if (rs.data.dataEmp && rs.data.dataEmp.length > 0) {
              setDataEmployeeIns(rs.data.dataEmp);
              setNumberEmpIns(rs.data.dataEmp.length);
            }

            if (rs.data.dataAttendance && rs.data.dataAttendance.length > 0) {
              setDataTTXacNhan(rs.data.dataAttendance);
            }

            if (
              rs.data.dataLoaiDiemDanh &&
              rs.data.dataLoaiDiemDanh.length > 0
            ) {
              setDataLoaiDiemDanh(rs.data.dataLoaiDiemDanh);
              setLoaiDiemDanh({
                code: rs.data.dataLoaiDiemDanh[0].code,
                code_nm: rs.data.dataLoaiDiemDanh[0].code_nm,
              });
            }

            if (rs.data.dataLoaiPhieu && rs.data.dataLoaiPhieu.length > 0) {
              setDataLoaiPhieu(rs.data.dataLoaiPhieu);
              setLoaiPhieu({
                code: rs.data.dataLoaiPhieu[0].code,
                code_nm: rs.data.dataLoaiPhieu[0].code_nm,
              });
            }
            setDataLyDo(rs.data.lstReason);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
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

  const OnSubmit = () => {
    if (masterPK == "") {
      dialogNoti("Vui lòng sao lưu phiếu đăng ký");
    } else {
      Alert.alert(
        "Thông báo",
        "Bạn có muốn trình ký?",
        [
          {
            text: "Hủy bỏ",
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              const pro = "UPDHRRE023001";
              const in_par = {
                p1_varchar2: "UPDATE",
                p2_varchar2: thr_emp_pk,
                p3_varchar2: masterPK + "|",
                p4_varchar2: "2" + "|", //trình ký
                p5_varchar2: 1,
                p6_varchar2: APP_VERSION,
                p7_varchar2: crt_by,
              };

              console.log(pro, in_par);

              sysFetch(
                API,
                {
                  pro,
                  in_par,
                  out_par: {
                    p1_varchar2: "result",
                    p2_sys: "noti",
                  },
                },
                tokenLogin
              )
                .then((rs) => {
                  console.log("rs UPDHRRE023001", rs);
                  if (rs == "Token Expired") {
                    refreshNewToken("OnSave", "", "");
                  }
                  if (rs != "Token Expired") {
                    if (rs.results == "F") {
                      var newText = rs.errorData.split(":");
                      let errors = newText[1].trim().split("\n")[0];
                      dialogNoti(errors);
                    } else {
                      if (rs.data.result == "1") {
                        dialogNoti("Trình ký thành công");
                        RequestSendNotification(rs.data.noti, API, tokenLogin);
                        getDataList();
                      } else {
                        dialogNoti("Sao lưu thất bại");
                      }
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

    if (dataInsertApprove.length == 0) {
      dialogNoti("Vui lòng chọn người phê duyệt");
    } else if (decisContent.length == 0) {
      dialogNoti("Vui lòng nhập lý do phiếu đăng ký");
      return;
    } else {
      if (dataIns.length > 0) {
        let lst_emp_pk = "";
        let lst_full_nm = "";
        let lst_status = "";
        let lst_time_in = "";
        let lst_time_out = "";
        let lst_reason = "";
        let lst_description = "";
        let lst_attendance_status = "";

        dataIns.forEach(function (item) {
          lst_emp_pk += item.pk + "|";
          if (item.checked == "N") {
            lst_status += "3" + "|";
          } else {
            lst_status += "2" + "|";
          }
          lst_reason += item.reason_code + "|";
          lst_full_nm += item.full_nm + "|";
          lst_time_in += item.time_in_tt + "|";
          lst_time_out += item.time_out_tt + "|";
          lst_description +=
            item.description == undefined ? "|" : item.description + "|";
          lst_attendance_status += item.tt_attendance_status + "|";
        });

        let lst_approve_pk = "";
        let lst_approve_id = "";
        let lst_approve_name = "";
        let lst_approve_level = "";
        let lst_approve_role_type = "";
        let lst_approve_role_name = "";
        let lst_tco_org_pk = "";

        dataInsertApprove.forEach(function (item) {
          lst_approve_pk += item.thr_emp_pk + "|";
          lst_approve_id += item.emp_id + "|";
          lst_approve_name += item.full_nm + "|";
          lst_approve_level += item.approve_level + "|";
          lst_approve_role_type += item.approve_role_type + "|";
          lst_approve_role_name += item.level_name + "|";
          lst_tco_org_pk += item.tco_org_pk + "|";
        });

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
                const pro = "UPDHRRE023000";
                const in_par = {
                  p1_varchar2: masterPK == "" ? "INSERT" : "UPDATE",
                  p2_varchar2: thr_emp_pk,
                  p3_varchar2: full_name,
                  p4_varchar2: masterPK,
                  p5_varchar2: decisContent,

                  p6_varchar2: lst_emp_pk,
                  p7_varchar2: lst_full_nm,
                  p8_varchar2: currentPhongBan.code,
                  p9_varchar2: lst_time_in,
                  p10_varchar2: lst_time_out,
                  p11_varchar2: lst_attendance_status,
                  p12_varchar2: lst_reason,
                  p13_varchar2: lst_description,
                  p14_varchar2: lst_status,
                  p15_varchar2: dataIns.length,

                  p16_varchar2: lst_approve_pk,
                  p17_varchar2: lst_approve_id,
                  p18_varchar2: lst_approve_name,
                  p19_varchar2: lst_approve_level,
                  p20_varchar2: lst_approve_role_type,
                  p21_varchar2: lst_approve_role_name,
                  p22_varchar2: lst_tco_org_pk,
                  p23_varchar2: dataInsertApprove.length,

                  p24_varchar2: APP_VERSION,
                  p25_varchar2: crt_by,
                };

                console.log(pro, in_par);

                sysFetch(
                  API,
                  {
                    pro,
                    in_par,
                    out_par: {
                      p1_varchar2: "result",
                      p2_varchar2: "value_pk",
                      p3_varchar2: "decisNo",
                    },
                  },
                  tokenLogin
                )
                  .then((rs) => {
                    console.log("rs UPDHRRE023000 ", rs);
                    if (rs == "Token Expired") {
                      refreshNewToken("OnSave", "", "");
                    }
                    if (rs != "Token Expired") {
                      if (rs.results == "F") {
                        var newText = rs.errorData.split(":");
                        let errors = newText[1].trim().split("\n")[0];
                        dialogNoti(errors);
                      } else {
                        if (rs.data.result == "1") {
                          setMasterPK(rs.data.value_pk);
                          dialogNoti("Sao lưu thành công");

                          getDataList();
                        } else {
                          dialogNoti("Sao lưu thất bại");
                        }
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
      } else {
        dialogNoti("Vui lòng chọn nhân viên");
      }
    }
  };

  const OnEditEmp = () => {
    setIsShowTimeOut(false);
    setIsShowTimeIn(false);

    setModalVisibleEditEmp(true);
  };

  useEffect(() => {
    if (modalVisibleEditEmp) {
      setReasonTT({
        code: dataEditeEmp.reason_code,
        code_nm: dataEditeEmp.reason_code_nm,
      });
      setDescription(dataEditeEmp.description);
      setTTXacNhan({
        code: dataEditeEmp.tt_attendance_status,
        code_nm: dataEditeEmp.tt_attendance_status_nm,
      });
      if (dataEditeEmp.flag_edt_time_in == "Y") {
        setDisableTimeIn(true);
      }
      if (dataEditeEmp.time_in_tt) {
        setTimeIn(dataEditeEmp.time_in_tt);
      }

      if (dataEditeEmp.flag_edt_time_out == "Y") {
        setDisableTimeOut(true);
      }
      if (dataEditeEmp.time_out_tt) {
        setTimeOut(dataEditeEmp.time_out_tt);
      }
    } else {
      setTimeIn("");
      setTimeOut("");
      setTTXacNhan({});
      setDisableTimeIn(false);
      setDisableTimeOut(false);
      setReasonTT("");
      setDescription("");
    }
  }, [modalVisibleEditEmp]);

  const OnUpdateLstEmployeeEdit = () => {
    let check_timeIn = timeIn.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
    let check_timeOut = timeOut.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
    if (timeIn && !check_timeIn) {
      dialogNoti("Giờ vào không đúng định dạng (vd: 16:30)");
      useRef_TimeIn.current.focus();
      return;
    }

    if (timeOut && !check_timeOut) {
      dialogNoti("Giờ ra không đúng định dạng (vd: 16:30)");
      useRef_TimeOut.current.focus();
      return;
    }

    if (
      (ttXacNhan.code == "1P" || ttXacNhan.code == "K") &&
      timeIn != "" &&
      disableTimeIn
    ) {
      dialogNoti(
        "Không thể thay đổi giờ vào khi chọn tình trạng xác nhận " +
          ttXacNhan.code_nm
      );
      return;
    }

    if (
      (ttXacNhan.code == "1P" || ttXacNhan.code == "K") &&
      timeOut != "" &&
      disableTimeOut
    ) {
      dialogNoti(
        "Không thể thay đổi giờ ra khi chọn tình trạng xác nhận " +
          ttXacNhan.code_nm
      );
      return;
    }

    if (
      (ttXacNhan.code == "1" || ttXacNhan.code == "1/2P") &&
      (timeIn.trim() == "" || timeOut.trim() == "")
    ) {
      dialogNoti(
        "Tình trạng xác nhận " +
          ttXacNhan.code_nm.toString().toLowerCase() +
          " phải nhập giờ vào hoặc giờ ra"
      );
      return;
    }

    if (!reasonTT.code) {
      dialogNoti("Vui lòng nhập lý do");
      return;
    } else {
      let dataEmployeeTemp = [...dataEmployeeIns];
      let index = dataEmployeeTemp.findIndex(
        (item) => item.pk == dataEditeEmp.pk
      );
      if (index != -1) {
        dataEmployeeTemp[index].reason_code = reasonTT.code;
        dataEmployeeTemp[index].reason_code_nm = reasonTT.code_nm;
        dataEmployeeTemp[index].time_in_tt = timeIn;
        dataEmployeeTemp[index].time_out_tt = timeOut;
        dataEmployeeTemp[index].tt_attendance_status = ttXacNhan.code;
        dataEmployeeTemp[index].tt_attendance_status_nm = ttXacNhan.code_nm;
        dataEmployeeTemp[index].description = description;
        dataEmployeeTemp[index].status = 1;
        setDataEmployeeIns(dataEmployeeTemp);
      }
      setModalVisibleEditEmp(false);
    }
  };

  const modalEditEmp = (
    <TVSControlPopup
      title={"CHỈNH SỬA"}
      minHeight={height * 0.7}
      isShow={modalVisibleEditEmp}
      onHide={() => setModalVisibleEditEmp(false)}
      onAccept={() => OnUpdateLstEmployeeEdit()}
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
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          {/* START: CONTROL TEXT INPUT TIME IN */}
          <Block style={{ flex: 1, marginRight: 5 }}>
            <Block style={styles.titleText}>
              <Text color={Color.mainColor}>Giờ vào TT</Text>
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
                editable={disableTimeIn}
                ref={useRef_TimeIn}
                color={!disableTimeIn ? Color.red : Color.black}
                placeholder={"hh:mm"}
                value={timeIn}
                onChangeText={setTimeIn}
                returnKeyType={"done"}
                onSubmitEditing={(value) => {
                  Keyboard.dismiss();
                }}
                maxHeight={40}
              />
            </Block>
          </Block>
          {/* END: CONTROL TEXT INPUT TIME IN*/}

          {/* START: CONTROL TEXT INPUT TIME OUT */}
          <Block style={{ flex: 1, marginRight: 5 }}>
            <Block style={styles.titleText}>
              <Text color={Color.mainColor}>Giờ ra TT</Text>
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
                editable={disableTimeOut}
                ref={useRef_TimeOut}
                color={!disableTimeOut ? Color.red : Color.black}
                placeholder={"hh:mm"}
                value={timeOut}
                onChangeText={setTimeOut}
                returnKeyType={"done"}
                onSubmitEditing={() => Keyboard.dismiss()}
                maxHeight={40}
              />
            </Block>
          </Block>
          {/* END: CONTROL TEXT INPUT TIME OUT*/}
        </View>

        <Block style={{ flexDirection: "row", marginBottom: 5 }}>
          {/* START: CONTROL SELECT */}
          <Block style={{ flex: 1, marginRight: 5 }}>
            <Block style={styles.titleText}>
              <Text color={Color.mainColor}>Tình trạng xác nhận</Text>
            </Block>
            <TVSList
              onPress={() => {
                setModalVisibleTTXacNhan(true);
              }}
              colorText={
                ttXacNhan.code_nm == "Tình trạng xác nhận" ? "#B2B2B2" : null
              }
              code_nm={ttXacNhan.code_nm}
              maxHeight={40}
            />
          </Block>
          {/* END: CONTROL SELECT */}

          {/* START: CONTROL TEXT INPUT LÝ DO */}
          <Block style={{ flex: 1 }}>
            <Block style={{ flex: 1, marginRight: 5 }}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Lý do</Text>
              </Block>
              <TVSList
                onPress={() => {
                  setModalVisibleLyDo(true);
                }}
                colorText={reasonTT.code_nm == "" ? "#B2B2B2" : null}
                code_nm={reasonTT.code_nm}
                maxHeight={40}
              />
            </Block>
          </Block>
          {/* END: CONTROL TEXT INPUT LÝ DO*/}
        </Block>

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
              value={description}
              onChangeText={setDescription}
              returnKeyType={"done"}
              onSubmitEditing={() => Keyboard.dismiss()}
              maxHeight={40}
            />
          </Block>
        </Block>
        {/* END: CONTROL TEXT INPUT GHI CHÚ*/}

        <View style={{ flex: 1 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View>
              <View style={{ flexDirection: "row" }}>
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
                    width: 200,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Lỗi điểm danh</Text>
                </View>
              </View>
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    // marginTop: 5,
                    paddingVertical: 2,
                    borderBottomColor: "#BDBDBD",
                    borderBottomWidth: 0.2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 80,
                      paddingLeft: 5,
                    }}
                  >
                    <Text>{dataEditeEmp.emp_id}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 150,
                      paddingLeft: 5,
                    }}
                  >
                    <Text>{dataEditeEmp.full_nm}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 120,
                    }}
                  >
                    <Text>{dataEditeEmp.org_nm}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 120,
                    }}
                  >
                    <Text>{dataEditeEmp.work_dt}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 200,
                    }}
                  >
                    <Text>{dataEditeEmp.att_kind_nm}</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {modalTTXacNhan}
        {modalLyDo}
      </View>
    </TVSControlPopup>
  );

  //DATE
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hidePickerDate = () => {
    setDatePickerVisible(false);
  };
  const handleConfirmDate = (val) => {
    hidePickerDate();

    setDate(moment(val).format("DD/MM/YYYY"));
  };

  return (
    <Block style={{ flex: 1 }} backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Chỉnh sửa thông tin đăng ký</TVSHeader>
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
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            {/* START: CONTROL DATE */}
            <Block style={{ flex: 0.65 }}>
              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Ngày</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSDate
                  disabled={true}
                  // onPress={() => showDatePicker()}
                  colorText={"#B2B2B2"}
                  date={date}
                  modalVisible={datePickerVisible}
                  onConfirm={handleConfirmDate}
                  onCancel={hidePickerDate}
                />
              </Block>
            </Block>
            {/* END: CONTROL DATE*/}

            {/* START: CONTROL SELECT */}
            <Block style={{ flex: 1, marginRight: 5 }}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Chọn phòng ban</Text>
                <Text color={Color.red}> *</Text>
              </Block>
              <TVSList
                disabled={true}
                color={"#B2B2B2"}
                colorText={
                  currentPhongBan.code == "Chọn phòng ban" ? "#B2B2B2" : null
                }
                code_nm={currentPhongBan.code_nm}
                maxHeight={40}
              />
            </Block>
            {/* END: CONTROL SELECT */}
          </View>

          <View
            style={{
              paddingHorizontal: 5,
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Block style={{ flex: 0.6, marginRight: 5 }}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Số phiếu</Text>
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
                  editable={false}
                  color={"#B2B2B2"}
                  value={decisNo}
                  onChangeText={setDecisNo}
                  returnKeyType={"done"}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  maxHeight={40}
                />
              </Block>
            </Block>

            {/* START: CONTROL TEXT INPUT LÝ DO */}
            <Block style={{ flex: 1 }}>
              <Block style={styles.titleText}>
                <Text color={Color.mainColor}>Lý do</Text>
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
                  editable={false}
                  color={"#B2B2B2"}
                  placeholder={"Nhập lý do"}
                  value={decisContent}
                  onChangeText={setDecisContent}
                  returnKeyType={"done"}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  maxHeight={40}
                />
              </Block>
            </Block>
            {/* END: CONTROL TEXT INPUT LÝ DO*/}
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
                style={{ marginHorizontal: 5, marginTop: 10 }}
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
                        Danh sách người phê duyệt{"  "}
                        <Icon
                          name={"pencil-outline"}
                          color={Color.mainColor}
                          size={15}
                        />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginTop: 5 }}>
                  <ScrollView style={{ maxHeight: 60 }}>
                    {dataInsertApprove.map((item) => (
                      <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
                        <Text>{item.level_name + " - " + item.full_nm}</Text>
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
                <TouchableOpacity
                  onPress={() => {
                    if (
                      currentPhongBan.code == 0 &&
                      currentPhongBan.code_nm == "Chọn phòng ban"
                    ) {
                      dialogNoti("Vui lòng chọn phòng ban");
                    } else if (
                      fromDate == "dd/mm/yyyy" &&
                      toDate == "dd/mm/yyyy"
                    ) {
                      dialogNoti("Vui lòng chọn ngày");
                    } else if (
                      loaiDiemDanh.code == 0 &&
                      loaiDiemDanh.code_nm == "Chọn lỗi điểm danh"
                    ) {
                    }
                  }}
                >
                  <Text style={{ color: Color.mainColor }}>
                    Danh sách nhân viên{"  "}
                    <Text style={{ color: Color.red }}>{numberEmpIns}</Text>
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
                        borderTopLeftRadius: 8,
                      }}
                    >
                      <Text>Xoá</Text>
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
                        width: 200,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Lỗi điểm danh</Text>
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
                        width: 100,
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
                        width: 100,
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
                        width: 200,
                        justifyContent: "center",
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
                        width: 120,
                        justifyContent: "center",
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
                        width: 170,
                        justifyContent: "center",
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Text>Đơn vị xác nhận tình trạng</Text>
                    </View>
                  </View>
                  <ScrollView>
                    {dataEmployeeIns.map((item) => {
                      if (item.checked == "Y") {
                        return (
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
                            <TouchableOpacity
                              style={{ flex: 1, flexDirection: "row" }}
                              onPress={() => {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 80,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.emp_id}</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 150,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.full_nm}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 120,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.org_nm}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 200,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.att_kind_nm}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 120,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.work_dt}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 100,
                                  paddingLeft: 5,
                                  backgroundColor:
                                    item.flag_edt_time_in == "Y"
                                      ? item.bg_color
                                      : "",
                                }}
                              >
                                <Text>{item.time_in_tt}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 100,
                                  paddingLeft: 5,
                                  backgroundColor:
                                    item.flag_edt_time_out == "Y"
                                      ? item.bg_color
                                      : "",
                                }}
                              >
                                <Text>{item.time_out_tt}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 200,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.reason_code_nm}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 120,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.description}</Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: 150,
                                  paddingLeft: 5,
                                }}
                              >
                                <Text>{item.tt_attendance_status_nm}</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      }
                    })}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
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
          <View style={{ flex: 1 }}>
            <TVSButton
              onPress={() => OnSave()}
              icon={"content-save"}
              buttonStyle={"3"}
            >
              Sao lưu
            </TVSButton>
          </View>
          <View style={{ flex: 1 }}>
            <TVSButton
              onPress={() => OnSubmit()}
              icon={"check"}
              buttonStyle={"3"}
              type={"success"}
            >
              Trình ký
            </TVSButton>
          </View>
        </View>
      </View>
      {modalEditEmp}
    </Block>
  );
};

export default EditRegOT;
