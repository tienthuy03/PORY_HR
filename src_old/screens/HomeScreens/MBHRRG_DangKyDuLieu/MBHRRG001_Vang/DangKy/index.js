import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput,
  View,
  LayoutAnimation,
  Image,
  PermissionsAndroid,
} from "react-native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import TVSTime from "../../../../../components/Tvs/TVSTime";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import ShowError from "../../../../../services/errors";
import RequestSendNotificationV1 from "../../../../../services/notification/send_v1";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import sysFetch2 from "../../../../../services/fetch_v1/fetch2";
import { APP_VERSION } from "../../../../../config/Pro";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const { width, height } = Dimensions.get("screen");
export default function DKV({ onCallbackReload }) {
  //get status isLoading
  const [expanded, setExpanded] = useState(false);
  const [expandedImg, setExpandedImg] = useState(false);
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);

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
  });

  const dispatch = useDispatch();
  const [modalVisibleLV, setModalVisibleLV] = useState(false);
  const [dataLV, setDataLV] = useState([]);
  const loginReducers = useSelector((state) => state.loginReducers);

  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  const [note, setNote] = useState([]);
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
    // limit_reg_dt = data.data.limit_reg_dt;
    // hide_time = data.data.hide_time;
    // note = data.data.note;
    // send_mail = data.data.send_mail;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  const [load, setLoad] = useState(false);

  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const [toDate, setToDate] = useState("dd/mm/yyyy");
  const [startTime, setStartTime] = useState("hh:mm");
  const [endTime, setEndTime] = useState("hh:mm");
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [startTimetDatePickerVisible, setStartTimeDatePicker] = useState(false);
  const [endTimetDatePickerVisible, setEndTimetDatePickerVisible] =
    useState(false);
  const [loaivang_val, setLoaivang_val] = useState("Chọn loại vắng");
  const [loaivang_pk, setLoaivang_pk] = useState("");
  const [description, setDescription] = useState("");

  const [colorFrom, setColorFrom] = useState("#B2B2B2");
  const [colorTo, setColorTo] = useState("#B2B2B2");
  const [colorTimefrom, setColorTimeFrom] = useState("#B2B2B2");
  const [colorTimeto, setColorTimeTo] = useState("#B2B2B2");
  const [colorLoai, setColorLoai] = useState("#B2B2B2");

  const [switchValue, setSwitchValue] = useState(false);
  const [switchValueTime, setSwitchValueTime] = useState(false);

  useEffect(() => {
    console.log("effet");
    getData("", "");
    // try {
    //   setDataLV(data.data.ds_lydo);
    //   setCbPersonApproved(data.data.ds_nguoipheduyet);
    //   hanleApproveInfo();
    // } catch (error) {}
  }, []);
  const toggleSwitch = (value) => {
    setSwitchValue(value);
  };

  const toggleSwitchTime = (value) => {
    setSwitchValueTime(value);
    setStartTime("hh:mm");
    setEndTime("hh:mm");
    setColorTimeFrom("#B2B2B2");
    setColorTimeTo("#B2B2B2");
  };

  //Ngay lam viec
  const showDatePickerStart = () => {
    setStartDatePickerVisible(true);
  };

  const hideDatePickerStart = () => {
    setStartDatePickerVisible(false);
  };

  const handleConfirmStart = (val) => {
    hideDatePickerStart();
    if (parseInt(limit_reg_dt) > parseInt(moment(val).format("YYYYMMDD"))) {
      Alert.alert(
        "Thông báo",
        `Dữ liệu đăng ký vắng không được trước ngày ${moment(
          moment(limit_reg_dt, "YYYYMMDD")
        ).format("DD/MM/YYYY")}`,
        [{ text: "Đóng" }]
      );
      return;
    }
    if (toDate !== "dd/mm/yyyy") {
      if (
        moment(val).format("YYYYMMDD") >
        moment(moment(toDate, "DD/MM/YYYY")).format("YYYYMMDD")
      ) {
        setToDate(moment(val).format("DD/MM/YYYY"));
        setColorTo(null);
      }
    } else {
      setToDate(moment(val).format("DD/MM/YYYY"));
      setColorTo(null);
    }
    setFromDate(moment(val).format("DD/MM/YYYY"));
    setColorFrom(null);
    getData(moment(val).format("YYYYMMDD"), "");
  };
  //Tu gio
  const showDatePickerStartTime = () => {
    setStartTimeDatePicker(true);
  };

  const hideDatePickerStartTime = () => {
    setStartTimeDatePicker(false);
  };

  const handleConfirmStartTime = (time) => {
    hideDatePickerStartTime();
    setStartTime(moment(time).format("HH:mm"));
    setColorTimeFrom(null);
  };

  //Den ngay
  const showDatePickerEnd = () => {
    setEndDatePickerVisible(true);
  };

  const hideDatePickerEnd = () => {
    setEndDatePickerVisible(false);
  };

  const handleConfirmEnd = (val) => {
    hideDatePickerEnd();
    if (
      moment(val).format("YYYYMMDD") <
      moment(moment(fromDate, "DD/MM/YYYY")).format("YYYYMMDD")
    ) {
      Alert.alert(
        "Thông báo",
        "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
        [
          {
            text: "Đóng",
          },
        ]
      );
      return;
    }
    setToDate(moment(val).format("DD/MM/YYYY"));
    setColorTo(null);
  };
  //Den gio
  const showDatePickerEndTime = () => {
    setEndTimetDatePickerVisible(true);
  };

  const hideDatePickerEndtTime = () => {
    setEndTimetDatePickerVisible(false);
  };

  const handleConfirmEndTime = (time) => {
    hideDatePickerEndtTime();
    setEndTime(moment(time).format("HH:mm"));
    setColorTimeTo(null);
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

  const validate = () => {
    if (loaivang_val === "") {
      dialogError("Vui lòng chọn loại vắng");
      return;
    }

    if (loaivang_val === "Chọn loại vắng") {
      dialogError("Vui lòng chọn loại vắng");
      return;
    }

    if (switchValue === false && fromDate === "dd/mm/yyyy") {
      dialogError("Vui lòng chọn ngày vắng!");
      return false;
    }
    if (switchValue === true) {
      if (fromDate === "dd/mm/yyyy") {
        dialogError("Vui lòng chọn ngày vắng!");
        return;
      }
      if (toDate === "dd/mm/yyyy") {
        dialogError("Vui lòng chọn ngày đến!");
        return;
      }

      if (moment(toDate, "DD/MM/YYYY") < moment(fromDate, "DD/MM/YYYY")) {
        dialogError("Từ ngày vắng phải nhỏ hơn đến ngày!");
        return;
      }
    }
    if (dataInsertApprove.length == 0) {
      Alert.alert("Thông báo", "Bạn chưa chọn người phê duyệt.", [
        { text: "Đóng" },
      ]);
      return;
    }
    Alert.alert(
      "Đăng kí vắng",
      "Bạn có muốn đăng ký không?",
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

  const getStateLV = (result) => {
    setLoaivang_val(result.code_nm);
    setLoaivang_pk(result.code);
    setModalVisibleLV(false);
    setColorLoai(null);
  };

  const getData = (fromDT, toDT) => {
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: fromDT,
      p3_varchar2: toDT,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRRG001000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: fromDT,
          p3_varchar2: toDT,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_loaivang",
          p2_sys: "lst_approve",
          p3_sys: "lst_approve_default",
          p4_varchar2: "limit_reg_dt",
          p5_sys: "lst_note",
          p6_varchar2: "hide_time",
          p7_varchar2: "send_mail",
          p8_varchar2: "expanded_yn",
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
            console.log(rs.data);
            setDataLV(rs.data.lst_loaivang);
            limit_reg_dt = rs.data.limit_reg_dt;
            hide_time = rs.data.hide_time;
            send_mail = rs.data.send_mail;

            hanleApproveInfo(rs.data.lst_approve);
            let dataSelectApprove = [];
            rs.data.lst_approve_default.forEach(function (item) {
              dataSelectApprove.push({
                approve_role_type: item.approve_role_type,
                thr_emp_pk: item.thr_emp_pk,
                level_name: item.level_name,
                approve_name: item.approve_name,
                approve_level: item.approve_level,
                full_nm: item.full_nm,
              });
            });
            console.log("dataSelectApprove ", dataSelectApprove);
            console.log(rs.data.lst_approve_default);
            setDataInsertApprove(rs.data.lst_approve_default);
            setDataSelectedApprove(dataSelectApprove);
            setExpanded(rs.data.expanded_yn == "Y" ? true : false);
            setNote(rs.data.lst_note);
            console.log("note ", rs.data.lst_note);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const onResetForm = () => {
    setStartTime("HH:MM");
    setEndTime("HH:MM");
    setFromDate("dd/mm/yyyy");
    setToDate("dd/mm/yyyy");
    setLoaivang_val("Chọn loại vắng");
    setLoaivang_pk("");
    setDescription("");
    setCurrentSelectedLevel({ arr: [], name: "Chọn vai trò phê duyệt" });
    setCurrentSelectedPerson({ approve_name: "Chọn người phê duyệt" });
    setColorFrom("#B2B2B2");
    setColorTo("#B2B2B2");
    setColorTimeFrom("#B2B2B2");
    setColorTimeTo("#B2B2B2");
    setColorLoai("#B2B2B2");
    setDataInsertApprove([]);
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
    let lst_approve_pk = "";
    let lst_role_type = "";
    if (dataInsertApprove.length == 0) {
      dialogNoti("Vui lòng chọn người phê duyệt");
    } else {
      let p_action = "INSERT";
      let fromTimes = "";
      let endTimes = "";
      let p_from_date = moment(moment(fromDate, "DD/MM/YYYY")).format(
        "YYYYMMDD"
      );
      let p_to_date = "";
      let str_approve = "";
      if (switchValue === false) {
        p_to_date = moment(moment(fromDate, "DD/MM/YYYY")).format("YYYYMMDD");
      } else if (switchValue === true) {
        p_to_date = moment(moment(toDate, "DD/MM/YYYY")).format("YYYYMMDD");
      }

      if (hide_time !== "Y") {
        if (switchValueTime === false) {
          fromTimes = "";
          endTimes = "";
        } else if (switchValueTime === true) {
          if (startTime === "hh:mm") {
            fromTimes = "";
          } else {
            fromTimes = startTime;
          }
          if (endTime === "hh:mm") {
            endTimes = "";
          } else {
            endTimes = endTime;
          }
        }
      }
      console.log("dataInsertApprove ", dataInsertApprove);
      dataInsertApprove.forEach(function (item) {
        lst_approve_pk += item.thr_emp_pk + "|";
        lst_role_type += item.approve_role_type + "|";
      });
      console.log({
        p1_varchar2: p_action,
        p2_varchar2: "",
        p3_varchar2: thr_emp_pk,
        p4_varchar2: loaivang_pk,
        p5_varchar2: p_from_date,
        p6_varchar2: p_to_date,
        p7_varchar2: fromTimes,
        p8_varchar2: endTimes,
        p9_varchar2: description,
        p10_varchar2: lst_approve_pk,
        p11_varchar2: lst_role_type,
        p12_varchar2: dataInsertApprove.length,
        p13_varchar2: image1,
        p14_varchar2: image2,
        p15_varchar2: image3,
        p16_varchar2: APP_VERSION,
        p17_varchar2: crt_by,
      });
      sysFetch2(
        API,
        {
          pro: "UPDHRRG001000",
          in_par: {
            p1_varchar2: p_action,
            p2_varchar2: "",
            p3_varchar2: thr_emp_pk,
            p4_varchar2: loaivang_pk,
            p5_varchar2: p_from_date,
            p6_varchar2: p_to_date,
            p7_varchar2: fromTimes,
            p8_varchar2: endTimes,
            p9_varchar2: description,
            p10_varchar2: lst_approve_pk,
            p11_varchar2: lst_role_type,
            p12_varchar2: dataInsertApprove.length,
            p13_varchar2: image1,
            p14_varchar2: image2,
            p15_varchar2: image3,
            p16_varchar2: APP_VERSION,
            p17_varchar2: crt_by,
          },
          out_par: {
            p1_varchar2: "status",
            p2_sys: "id_noti",
            // p3_sys: 'lst_send_mail',
          },
        },
        tokenLogin
      )
        .then((rs) => {
          // if (rs == 'Token Expired') {
          //   refreshNewToken('onSave');
          // }
          // if (rs != 'Token Expired') {
          console.log("rs save ", rs);
          if (rs.result === "S") {
            Alert.alert(
              "Thông báo",
              "Đăng ký vắng thành công",
              [
                {
                  text: "Đóng",
                },
              ],
              { cancelable: false }
            );

            //send notification
            RequestSendNotificationV1(rs.data, API, tokenLogin);
            // if (send_mail === 'Y') {
            //   let arrSendMail = rs.data.lst_send_mail;
            //   if (arrSendMail.length > 0) {
            //     arrSendMail.forEach(function (item) {
            //       let mParam = {
            //         FromP: item.fromp,
            //         FromM: item.fromm,
            //         FromPass: item.frompass,
            //         ToM: item.email,
            //         ToP: item.full_name,
            //         Subject: item.subject,
            //         BodyContent: item.slip,
            //         SmtpServer: item.smtpserver,
            //         SmtpPort: item.smtpport,
            //       };
            //       return axios
            //         .post(API + 'SendMail/Basic/', mParam)
            //         .then(response => {
            //           return response.data;
            //         })
            //         .catch(error => {
            //           console.log(error);
            //           ShowError(error.toString());
            //         });
            //     });
            //   }
            // }
          } else if (rs.result === "F") {
            let newText = rs.content.split("ORA");
            let errors = "";
            try {
              errors = newText[1].trim().split(":")[1];
            } catch (error) {
              errors = "Lỗi: đăng ký không thành công.";
            }

            Alert.alert(
              "Thông báo",
              errors,
              [
                {
                  text: "Thoát",
                  onPress: () => {},
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
            // } else {
            //   Alert.alert(
            //     'Thông báo',
            //     'Đăng ký thất bại!',
            //     [
            //       {
            //         text: 'Thoát',
            //         onPress: () => {},
            //         style: 'cancel',
            //       },
            //     ],
            //     {cancelable: false},
            //   );
            // }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const modalLV = (
    <TVSControlPopup
      title={"Chọn loại vắng"}
      isShow={modalVisibleLV}
      onHide={() => setModalVisibleLV(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleLV(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataLV}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateLV(item);
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

  const [approveInfo, setApproveInfo] = useState([]);
  const [modalVisibleNPD, setModalVisibleNPD] = useState(false);
  const [dataSelectedApprove, setDataSelectedApprove] = useState([]);
  const [dataInsertApprove, setDataInsertApprove] = useState([]);
  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: "Chọn vai trò phê duyệt",
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: "Chọn người phê duyệt",
  });
  //handle when approve level changed
  const onChangeSelectedLevel = (value) => {
    setCurrentSelectedLevel(value);
  };
  //handle when approve person change
  const onChangeSelectedPerson = (value) => {
    setCurrentSelectedPerson(value);
  };
  const hanleApproveInfo = (dataApprover) => {
    console.log(dataApprover);
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
    setApproveInfo(arrApproveInfo);
  };

  const onSelectApprover = () => {
    let dataSelectApprove;
    const approve_role_type = currentSelectedPerson.approve_role_type;
    const approve_role_nm = currentSelectedLevel.name;
    const approve_by_pk = currentSelectedPerson.thr_emp_pk;
    const approve_by_name = currentSelectedPerson.approve_name;
    const full_nm = currentSelectedPerson.full_nm;
    const approve_level = currentSelectedPerson.approve_level;
    dataSelectApprove = dataSelectedApprove;
    console.log("approve_role_type ", approve_role_type);
    console.log("approve_role_nm ", approve_role_nm);
    console.log("approve_by_pk ", approve_by_pk);
    console.log("approve_by_name ", approve_by_name);
    console.log("full_nm ", full_nm);
    console.log("approve_level ", approve_level);
    console.log("dataSelectApprove ", dataSelectApprove);
    if (approve_role_type == undefined || approve_by_pk == undefined) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn vai trò và người phê duyệt!",
        [
          {
            text: "Thoát",
            onPress: () => {},
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      console.log(approve_level);
      console.log(dataSelectApprove);
      dataSelectApprove = dataSelectApprove.filter(
        (item) => item.approve_level != approve_level
      );
      setDataSelectedApprove(dataSelectApprove);
      dataSelectApprove.push({
        approve_role_type: approve_role_type,
        thr_emp_pk: approve_by_pk,
        level_name: approve_role_nm,
        approve_name: approve_by_name,
        full_nm: full_nm,
        approve_level: approve_level,
      });

      setDataSelectedApprove(dataSelectApprove);
      setDataInsertApprove(dataSelectApprove);
      setModalVisibleNPD(false);
    }
  };

  const showPopupSelectApprove = (level, emp_pk) => {
    console.log(level, "|", emp_pk);
    // setCurrentSelectedLevel({arr: [], name: 'Chọn vai trò phê duyệt'});
    console.log("level ", level);
    console.log("approveInfo ", approveInfo);
    console.log(
      "filter ",
      approveInfo.filter((x) => x.name == level)
    );
    setCurrentSelectedLevel(approveInfo.filter((x) => x.name == level)[0]);
    setCurrentSelectedPerson(
      approveInfo
        .filter((x) => x.name == level)[0]
        .arr.filter((y) => y.thr_emp_pk == emp_pk)[0]
    );
    // setCurrentSelectedPerson({approve_name: 'Chọn người phê duyệt'});
    console.log("show");
    setModalVisibleNPD(true);
  };
  const SelectLevelApprove = ({
    onChangeSelectedPerson,
    currentSelectedLevel,
    onChangeSelectedLevel,
    approveInfo,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 10,
        }}
      >
        <Block
          style={{
            flexDirection: "row",
            paddingBottom: 5,
            paddingLeft: 5,
            alignItems: "center",
          }}
        >
          <Text color={Color.mainColor}>Vai trò phê duyệt</Text>
          <Text color={Color.red}> *</Text>
        </Block>

        <View
          style={{
            backgroundColor: Color.gray,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            // nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedLevel.name === "Chọn vai trò phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedLevel.name}
              </Text>
            </View>
            {/* <Icon name={'chevron-down'} color={Color.mainColor} size={24} /> */}
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              {approveInfo.map((item, index) => {
                if (item.name === currentSelectedLevel.name) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedLevel(item);
                      onChangeSelectedPerson({
                        approve_name: "Chọn người phê duyệt",
                      });
                    }}
                    key={index.toString()}
                    style={{
                      padding: 10,
                      backgroundColor: "white",
                      marginBottom: 1,
                      borderRadius: 6,
                      alignItems: "flex-start",
                    }}
                  >
                    <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };
  const SelectApprovePerson = ({
    currentSelectedPerson,
    onChangeSelectedPerson,
    currentSelectedLevel,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 10,
        }}
      >
        <Block
          style={{
            flexDirection: "row",
            paddingBottom: 5,
            paddingLeft: 5,
            alignItems: "center",
          }}
        >
          <Text color={Color.mainColor}>Người phê duyệt</Text>
          <Text color={Color.red}> *</Text>
        </Block>

        <View
          style={{
            backgroundColor: Color.gray,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedPerson.approve_name ===
                    "Chọn người phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedPerson.approve_name}
              </Text>
            </View>
            <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              <ScrollView style={{ maxHeight: 150 }}>
                {currentSelectedLevel.arr.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedPerson(item);
                      }}
                      key={index.toString()}
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 1,
                        borderRadius: 6,
                      }}
                    >
                      <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
                        {item.approve_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };
  const modalNPD = (
    <TVSControlPopup
      title={"Chọn người phê duyệt"}
      isShow={modalVisibleNPD}
      minHeight={500}
      onHide={() => setModalVisibleNPD(false)}
      onAccept={() => onUpdateApprove()}
      bottom={
        <TVSButton
          onPress={() => setModalVisibleNPD(false)}
          buttonStyle={"3"}
          type={"danger"}
          icon={"close"}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Block>
        <SelectLevelApprove
          onChangeSelectedPerson={onChangeSelectedPerson}
          currentSelectedLevel={currentSelectedLevel}
          approveInfo={approveInfo}
          onChangeSelectedLevel={onChangeSelectedLevel}
        />
        <SelectApprovePerson
          currentSelectedLevel={currentSelectedLevel}
          currentSelectedPerson={currentSelectedPerson}
          onChangeSelectedPerson={onChangeSelectedPerson}
        />
      </Block>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <TVSButton
            onPress={onSelectApprover}
            type={"primary"}
            icon={"account-edit"}
            buttonStyle={"3"}
          >
            Chọn
          </TVSButton>
        </View>
      </View>
    </TVSControlPopup>
  );

  const onChangeImage = async (obj) => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Thông báo",
            message: "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            buttonNegative: "Hủy bỏ",
            buttonPositive: "Xác nhận",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Thông báo",
            "Hình ảnh được dùng lưu vào hệ thống",
            [
              {
                text: "Hủy bỏ",
              },
              {
                text: "Chọn ảnh từ thư viện",
                onPress: () => {
                  onTakePhoto("library", obj);
                },
              },
              {
                text: "Chụp ảnh",
                onPress: () => {
                  onTakePhoto("camera", obj);
                },
              },
            ],
            { cancelable: true }
          );
        } else {
          Alert.alert(
            "Thông báo",
            "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            [{ text: "Đóng" }]
          );
        }
      } else {
        Alert.alert(
          "Thông báo",
          "Hình ảnh được dùng lưu vào hệ thống",
          [
            {
              text: "Chụp ảnh",
              onPress: () => {
                onTakePhoto("camera", obj);
              },
            },
            {
              text: "Chọn ảnh từ thư viện",
              onPress: () => {
                onTakePhoto("library", obj);
              },
            },
            {
              text: "Hủy bỏ",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const OptionsImage = {
    maxWidth: 450,
    maxHeight: 600,
    quality: 1,
    cameraType: "back",
    includeBase64: true,
    mediaType: "photo",
    presentationStyle: "fullScreen",
  };
  const onTakePhoto = (type, obj) => {
    if (type == "camera") {
      launchCamera(OptionsImage, (res) => {
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          if (obj == 1) {
            setImage1(res.assets[0].base64);
          } else if (obj == 2) {
            setImage2(res.assets[0].base64);
          } else {
            setImage3(res.assets[0].base64);
          }
        }
      });
    } else if (type == "library") {
      launchImageLibrary(OptionsImage, (res) => {
        console.log(res);
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          if (obj == 1) {
            setImage1(res.assets[0].base64);
          } else if (obj == 2) {
            setImage2(res.assets[0].base64);
          } else {
            setImage3(res.assets[0].base64);
          }
        }
      });
    }
  };

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Loại vắng</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisibleLV(true)}
                    colorText={colorLoai}
                    code_nm={loaivang_val}
                  />
                </Block>
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text style={{ flex: 1 }} color={Color.mainColor}>
                      Đăng ký nhiều ngày
                    </Text>
                    <Switch
                      style={{ marginRight: 10 }}
                      onValueChange={toggleSwitch}
                      value={switchValue}
                    />
                  </Block>
                </Block>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>
                        {switchValue ? "Từ ngày" : "Ngày vắng"}
                      </Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSDate
                      onPress={() => showDatePickerStart()}
                      colorText={colorFrom}
                      date={fromDate}
                      modalVisible={startDatePickerVisible}
                      onConfirm={handleConfirmStart}
                      onCancel={hideDatePickerStart}
                    />
                  </Block>
                  {switchValue ? (
                    <Block
                      style={{
                        flexDirection: "column",
                        marginBottom: 10,
                      }}
                    >
                      <Block
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            paddingLeft: 10,
                            color: Color.mainColor,
                          }}
                        ></Text>
                      </Block>
                      <Block
                        style={{
                          alignItems: "center",
                          marginLeft: 10,
                          marginRight: 10,
                          justifyContent: "center",
                          flex: 1,
                        }}
                      >
                        <Text>...</Text>
                      </Block>
                    </Block>
                  ) : null}
                  {switchValue ? (
                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Đến ngày</Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <TVSDate
                        onPress={() => showDatePickerEnd()}
                        colorText={colorTo}
                        date={toDate}
                        modalVisible={endDatePickerVisible}
                        onConfirm={handleConfirmEnd}
                        onCancel={hideDatePickerEnd}
                      />
                    </Block>
                  ) : null}
                </Block>
                {/* Control switch */}
                {hide_time !== "Y" && (
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text style={{ flex: 1 }} color={Color.mainColor}>
                        Đăng ký theo khung giờ
                      </Text>
                      <Switch
                        style={{ marginRight: 10 }}
                        onValueChange={toggleSwitchTime}
                        value={switchValueTime}
                      />
                    </Block>
                  </Block>
                )}
                {/* Control time */}
                {switchValueTime ? (
                  <Block
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Từ giờ</Text>
                      </Block>
                      <TVSTime
                        onPress={() => showDatePickerStartTime()}
                        colorText={colorTimefrom}
                        time={startTime}
                        modalVisible={startTimetDatePickerVisible}
                        onConfirm={handleConfirmStartTime}
                        onCancel={hideDatePickerStartTime}
                      />
                    </Block>

                    <Block
                      style={{
                        flexDirection: "column",
                        marginBottom: 10,
                      }}
                    >
                      <Block
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            paddingLeft: 10,
                            color: Color.mainColor,
                          }}
                        ></Text>
                      </Block>
                      <Block
                        style={{
                          alignItems: "center",
                          marginLeft: 10,
                          marginRight: 10,
                          justifyContent: "center",
                          flex: 1,
                        }}
                      >
                        <Text>...</Text>
                      </Block>
                    </Block>

                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Đến giờ</Text>
                      </Block>
                      <TVSTime
                        onPress={() => showDatePickerEndTime()}
                        colorText={colorTimeto}
                        time={endTime}
                        modalVisible={endTimetDatePickerVisible}
                        onConfirm={handleConfirmEndTime}
                        onCancel={hideDatePickerEndtTime}
                      />
                    </Block>
                  </Block>
                ) : null}
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
                      value={description}
                      onChangeText={(text) => setDescription(text)}
                    />
                  </Block>
                </Block>
                {/* Control chon nguoi phe duyet */}
                <TouchableOpacity
                  style={styles.titleContainer}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    setExpanded(!expanded);
                  }}
                >
                  <View style={styles.dropdownlistContainer}>
                    <View
                      style={{
                        marginLeft: 5,
                      }}
                    >
                      <Icon
                        name={"account-check-outline"}
                        size={30}
                        color={"#5A94E7"}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 5,
                        justifyContent: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: Color.mainColor,
                            paddingLeft: 5,
                          }}
                        >
                          Danh sách phê duyệt
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        minWidth: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 5,
                        marginRight: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontWeight: "bold",
                        }}
                      >
                        {dataInsertApprove.length}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginRight: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        size={30}
                        color={Color.mainColor}
                        name={expanded ? "chevron-up" : "chevron-down"}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                {expanded && (
                  <ScrollView maxHeight={100} style={{ marginBottom: 10 }}>
                    {dataInsertApprove.length > 0
                      ? dataInsertApprove.map((item) => (
                          <TouchableOpacity
                            onPress={() =>
                              showPopupSelectApprove(
                                item.level_name,
                                item.thr_emp_pk
                              )
                            }
                          >
                            <View style={styles.dropdownlistChild}>
                              <View
                                style={{
                                  flex: 1,
                                  marginLeft: 5,
                                  justifyContent: "center",
                                }}
                              >
                                <View>
                                  <Text style={{ color: Color.mainColor }}>
                                    {item.approve_name}
                                  </Text>
                                </View>
                              </View>

                              <View style={{ marginRight: 5 }}>
                                <Icon
                                  size={20}
                                  color={Color.mainColor}
                                  name={"pencil-outline"}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      : null}
                  </ScrollView>
                )}

                <TouchableOpacity
                  style={styles.titleContainer}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    setExpandedImg(!expandedImg);
                  }}
                >
                  <View style={styles.dropdownlistContainer}>
                    <View
                      style={{
                        marginLeft: 5,
                      }}
                    >
                      <Icon name={"paperclip"} size={30} color={"#5A94E7"} />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 5,
                        justifyContent: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: Color.mainColor,
                            paddingLeft: 5,
                          }}
                        >
                          Chứng từ đính kèm
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        minWidth: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 5,
                        marginRight: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontWeight: "bold",
                        }}
                      >
                        {/* {dataInsertApprove.length} */}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginRight: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        size={30}
                        color={Color.mainColor}
                        name={expandedImg ? "chevron-up" : "chevron-down"}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                {expandedImg && (
                  <ScrollView maxHeight={200} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => onChangeImage(1)}
                      >
                        <>
                          {image1 != "" ? (
                            <View style={styles.dropdownlistChildHasAttach}>
                              <TouchableOpacity
                                onPress={() => {
                                  setImage1("");
                                }}
                                style={{
                                  alignItems: "flex-end",
                                  marginVertical: 5,
                                  marginRight: 5,
                                }}
                              >
                                <Icon size={15} color={"gray"} name={"close"} />
                              </TouchableOpacity>
                              <View
                                style={{
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  style={{
                                    width: 80,
                                    height: 90,
                                    resizeMode: "stretch",
                                  }}
                                  source={{
                                    uri: "data:image/png;base64," + image1,
                                  }}
                                />
                              </View>
                            </View>
                          ) : (
                            <View style={styles.dropdownlistChildNoAttach}>
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 6,
                                  flexDirection: "row",
                                  backgroundColor: Color.tabColor,
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon
                                    size={15}
                                    color={"lightgray"}
                                    name={"plus"}
                                  />
                                  <View>
                                    <Text style={{ color: "lightgray" }}>
                                      Thêm mới
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          )}
                        </>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => onChangeImage(2)}
                      >
                        <>
                          {image2 != "" ? (
                            <View
                              style={{
                                marginHorizontal: 5,
                                marginBottom: 5,
                                borderRadius: 6,
                                borderColor: "lightgray",
                                borderWidth: 2,
                                height: 120,
                                justifyContent: "center",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  setImage2("");
                                }}
                                style={{
                                  alignItems: "flex-end",
                                  marginVertical: 5,
                                  marginRight: 5,
                                }}
                              >
                                <Icon size={15} color={"gray"} name={"close"} />
                              </TouchableOpacity>
                              <View>
                                <View
                                  style={{
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    style={{
                                      width: 80,
                                      height: 90,
                                      resizeMode: "stretch",
                                    }}
                                    source={{
                                      uri: "data:image/png;base64," + image2,
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View
                              style={{
                                marginHorizontal: 5,
                                marginBottom: 5,
                                borderRadius: 6,
                                borderColor: "lightgray",
                                borderWidth: 2,
                                borderStyle: "dashed",
                                height: 120,
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 6,
                                  flexDirection: "row",
                                  backgroundColor: Color.tabColor,
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon
                                    size={15}
                                    color={"lightgray"}
                                    name={"plus"}
                                  />
                                  <View>
                                    <Text style={{ color: "lightgray" }}>
                                      Thêm mới
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          )}
                        </>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => onChangeImage(3)}
                      >
                        <>
                          {image3 != "" ? (
                            <View
                              style={{
                                marginHorizontal: 5,
                                marginBottom: 5,
                                borderRadius: 6,
                                borderColor: "lightgray",
                                borderWidth: 2,
                                height: 120,
                                justifyContent: "center",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  setImage3("");
                                }}
                                style={{
                                  alignItems: "flex-end",
                                  marginVertical: 5,
                                  marginRight: 5,
                                }}
                              >
                                <Icon size={15} color={"gray"} name={"close"} />
                              </TouchableOpacity>
                              <View>
                                <View
                                  style={{
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    style={{
                                      width: 80,
                                      height: 90,
                                      resizeMode: "stretch",
                                    }}
                                    source={{
                                      uri: "data:image/png;base64," + image3,
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View
                              style={{
                                marginHorizontal: 5,
                                marginBottom: 5,
                                borderRadius: 6,
                                borderColor: "lightgray",
                                borderWidth: 2,
                                borderStyle: "dashed",
                                height: 120,
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 6,
                                  flexDirection: "row",
                                  backgroundColor: Color.tabColor,
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon
                                    size={15}
                                    color={"lightgray"}
                                    name={"plus"}
                                  />
                                  <View>
                                    <Text style={{ color: "lightgray" }}>
                                      Thêm mới
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          )}
                        </>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}

                {note.length > 0 ? (
                  <Block
                    style={{
                      flex: 1,
                      marginHorizontal: 10,
                      // marginBottom: 10,
                    }}
                  >
                    {note.map((item) => (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                        }}
                        fontStyle={"italic"}
                      >
                        {item.note}
                      </Text>
                    ))}
                  </Block>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <TVSButton
                      onPress={onResetForm}
                      buttonStyle={"3"}
                      type={"secondary"}
                      icon={"sync"}
                      minWidth={150}
                    >
                      Đăng ký mới
                    </TVSButton>
                  </View>
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
              {modalLV}
              {modalNPD}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
}
