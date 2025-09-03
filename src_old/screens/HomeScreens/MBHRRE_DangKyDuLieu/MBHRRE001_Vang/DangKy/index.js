/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-new-object */

import axios from "axios";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
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
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import DropdownPk from "../../../../../components/DropdowPk";
import ListContent from "../../../../../components/ListContent";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup";
import IconDate from "../../../../../icons/Datev";
import IconTime from "../../../../../icons/Time";
import ShowError from "../../../../../services/errors";
import RequestSendNotification from "../../../../../services/notification/send";
import sysFetch from "../../../../../services/fetch";
const { width, height } = Dimensions.get("screen");
export default function DKV({ onCallbackReload }) {
  //get status isLoading
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);

  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    blockApproveInfo: {
      marginTop: 20,
    },
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: "white",
    },
  });

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLV, setModalVisibleLV] = useState(false);
  const [modalVisiblePK1, setModalVisiblePK1] = useState(false);
  const [modalVisiblePK2, setModalVisiblePK2] = useState(false);
  const [dataLDV, setDataLDV] = useState([]);
  const [dataLV, setDataLV] = useState([]);
  const loginReducers = useSelector((state) => state.loginReducers);

  //current approve info then process
  const [approveInfo, setApproveInfo] = useState([]);
  const [approveDefault, setApproveDefault] = useState([]);
  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: "Chọn vai trò phê duyệt",
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: "Chọn người phê duyệt",
  });

  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  const [data, setData] = useState([]);
  const onChangeSelectedLevel = (value) => {
    setCurrentSelectedLevel(value);
  };
  //handle when approve person change
  const onChangeSelectedPerson = (value) => {
    setCurrentSelectedPerson(value);
  };

  let thr_emp_pk;
  let company_pk;
  let tokenLogin;
  let fullnames;
  let org_pk;
  const [limit_reg_dt, setLimit_reg_dt] = useState([]);
  const [note, setNote] = useState([]);
  const [hide_time, setHide_time] = useState("N");
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    // limit_reg_dt = data.data.limit_reg_dt;
    // hide_time = data.data.hide_time;
    // note = data.data.note;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) { }
  const [load, setLoad] = useState(false);

  const [cbPersonApproved, setCbPersonApproved] = useState([]);
  const [empApproved_pk1, setEmpApproved_pk1] = useState("");
  const [empApproved_pk2, setEmpApproved_pk2] = useState("");
  // const [value_pk1, setValuePk1] = useState('');
  // const [value_pk2, setValuePk2] = useState('');

  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const [toDate, setToDate] = useState("dd/mm/yyyy");
  const [startTime, setStartTime] = useState("hh:mm");
  const [endTime, setEndTime] = useState("hh:mm");
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [startTimetDatePickerVisible, setStartTimeDatePicker] = useState(false);
  const [endTimetDatePickerVisible, setEndTimetDatePickerVisible] =
    useState(false);
  // const [lydovang_val, setLydvang_val] = useState('Chọn lý do vắng');
  const [lydovang_pk, setLydovang_pk] = useState("");
  const [loaivang_val, setLoaivang_val] = useState("Chọn loại vắng");
  const [loaivang_pk, setLoaivang_pk] = useState("");
  const [description, setDescription] = useState("");

  const [colorFrom, setColorFrom] = useState("#B2B2B2");
  const [colorTo, setColorTo] = useState("#B2B2B2");
  const [colorTimefrom, setColorTimeFrom] = useState("#B2B2B2");
  const [colorTimeto, setColorTimeTo] = useState("#B2B2B2");
  const [colorLoai, setColorLoai] = useState("#B2B2B2");
  // const [colorLydo, setColorLydo] = useState('#B2B2B2');

  const [switchValue, setSwitchValue] = useState(false);
  const [switchValueTime, setSwitchValueTime] = useState(false);

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
  const getData = async () => {
    console.log("thr_emp_pk ", thr_emp_pk);
    await sysFetch(
      API,
      {
        pro: "SELHRRE0010101",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: "",
          p3_varchar2: "",
        },
        out_par: {
          p1_sys: "ls_dkv",
          p2_sys: "approve_status",
          p3_sys: "ds_lydo",
          p4_sys: "ds_nguoipheduyet",
          p5_varchar2: "limit_reg_dt",
          p6_varchar2: "note",
          p7_varchar2: "hide_time",
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
            setLimit_reg_dt(rs.data.limit_reg_dt);
            setHide_time(rs.data.hide_time);
            setNote(rs.data.note);
            setDataLV(rs.data.ds_lydo);
            setCbPersonApproved(rs.data.ds_nguoipheduyet);
            setData(rs.data);
            hanleApproveInfo(rs.data.ds_nguoipheduyet);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    //console.warn('A date has been picked Start Date: ', date);
  };

  useEffect(() => {
    getData();
  }, []);
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
    if (
      loaivang_val === ""
      // && lydovang_val === ''
    ) {
      dialogError("Vui lòng chọn loại vắng");
      return;
    }

    if (
      loaivang_val === "Chọn loại vắng"
      // && lydovang_val === 'Chọn lý do vắng'
    ) {
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
    console.log(approveInfo);
    console.log(approveInfo.length);

    if (approveInfo.length > 0) {
      if (currentSelectedLevel.arr.length === 0) {
        Alert.alert("Thông báo", "Bạn chưa chọn vai trò phê duyệt.", [
          { text: "Đóng" },
        ]);
        return;
      }

      if (!currentSelectedPerson.thr_emp_pk) {
        Alert.alert("Thông báo", "Bạn chưa chọn người phê duyệt.", [
          { text: "Đóng" },
        ]);
        return;
      }
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
              console.log("state ", state);
              if (state.isConnected) {
                updateExperience();
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
  const getState = async (result) => {
    setTimeout(() => {
      // setLydvang_val(result.value);
      setLydovang_pk(result.pk);
      setModalVisible(false);
      // setColorLydo(Color.mainColor);
    }, 100);
  };

  const getStateLV = (result) => {
    setLoaivang_val(result.absence_nm);
    setLoaivang_pk(result.absence_code);
    setModalVisibleLV(false);
    setColorLoai(null);
  };

  const getStatePk1 = async (result) => {
    setTimeout(() => {
      // setValuePk1(result.value);
      setEmpApproved_pk1(result.pk);
      console.log("result: ====== ", result.pk);

      setModalVisiblePK1(false);
      // setColorLoai(Color.mainColor);
    }, 100);
  };
  const getStatePk2 = async (result) => {
    setTimeout(() => {
      // setValuePk2(result.value);
      setEmpApproved_pk2(result.pk);
      setModalVisiblePK2(false);
      // setColorLydo(Color.mainColor);
    }, 100);
  };
  const onResetForm = () => {
    setStartTime("HH:MM");
    setEndTime("HH:MM");
    setFromDate("dd/mm/yyyy");
    setToDate("dd/mm/yyyy");
    setLoaivang_val("Chọn loại vắng");
    // setLydvang_val('Chọn lý do vắng');
    setLoaivang_pk("");
    setLydovang_pk("");
    setDescription("");
    setCurrentSelectedLevel({ arr: [], name: "Chọn vai trò phê duyệt" });
    setCurrentSelectedPerson({ approve_name: "Chọn người phê duyệt" });
    setColorFrom("#B2B2B2");
    setColorTo("#B2B2B2");
    setColorTimeFrom("#B2B2B2");
    setColorTimeTo("#B2B2B2");
    setColorLoai("#B2B2B2");
    // setColorLydo('#B2B2B2');
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
        if (obj == "updateExperience") {
          updateExperience();
        }
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
  const updateExperience = () => {
    let p_action = "INSERT";
    let fromTimes = "";
    let endTimes = "";
    let p_from_date = moment(moment(fromDate, "DD/MM/YYYY")).format("YYYYMMDD");
    let p_to_date = "";
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
    sysFetch(
      API,
      {
        pro: "UPDHRRE0010101",
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
          p10_varchar2: fullnames,
          p11_varchar2:
            approveInfo.length > 0
              ? currentSelectedPerson.approve_role_type
              : "",
          p12_varchar2:
            approveInfo.length > 0 ? currentSelectedPerson.thr_emp_pk : "",
        },
        out_par: {
          p1_varchar2: "status",
          p2_sys: "id_noti",
          p3_sys: "new_approve_list",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("updateExperience");
        }
        if (rs != "Token Expired") {
          let er = rs.errorData;
          if (rs.results === "S") {
            if (rs.data.status.toString() === "2") {
              //handle changed new info
              hanleNewApproveInfo(rs.data.new_approve_list);
              setCurrentSelectedLevel({
                arr: [],
                name: "Chọn vai trò phê duyệt",
              });
              setCurrentSelectedPerson({
                approve_name: "Chọn người phê duyệt",
              });
              Alert.alert(
                "Thông báo",
                `Vui lòng chọn lại thông tin người phê duyệt mới. Ngày đăng ký dữ liệu thuộc bộ phận khác`,
                [
                  {
                    text: "Đóng",
                  },
                ],
                { cancelable: false }
              );
              return;
            } else if (rs.data.status.toString() === "0") {
              Alert.alert(
                "Thông báo",
                "Đăng ký vắng thất bại!",
                [
                  {
                    text: "Đóng",
                  },
                ],
                { cancelable: false }
              );
              return;
            }
            Alert.alert(
              "Thông báo",
              "Đăng ký vắng thành công!",
              [
                {
                  text: "Đóng",
                  onPress: () => {
                    onCallbackReload();
                  },
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
            //send notification
            RequestSendNotification(rs.data.id_noti, API, tokenLogin);
          } else if (rs.results === "F") {
            let newText = er.split("ORA");
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
                  onPress: () => { },
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          } else {
            Alert.alert(
              "Thông báo",
              "Đăng ký thất bại!",
              [
                {
                  text: "Thoát",
                  onPress: () => { },
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modal = (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <Button
        nextScreen={() => setModalVisible(false)}
        flex
        backgroundColor={"rgba(0,0,0,0.3)"}
        justifyCenter
        alignCenter
      >
        <Block
          backgroundColor={Color.white}
          width={300}
          justifyCenter
          radius={5}
          padding={10}
        >
          <Block
            marginBottom={10}
            paddingBottom={10}
            borderBottomColor={Color.mainColor}
            borderBottomWidth={1}
          >
            <Text paddingLeft={10} size={18} fontFamily={"Roboto-Bold"}>
              CHỌN LÝ DO VẮNG
            </Text>
          </Block>
          <Block paddingLeft={10} paddingRight={10} height={300}>
            <ScrollView>
              <ListContent
                PROP={dataLDV}
                getState={getState}
                pk={lydovang_pk}
              />
            </ScrollView>
          </Block>
          <Block
            marginTop={10}
            paddingTop={10}
            borderTopColor={Color.mainColor}
            alignCenter
            borderTopWidth={1}
          >
            <TouchableOpacity
              style={styles.btnOk}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnCloseText}>Đóng</Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Button>
    </Modal>
  );

  const modalLV = (
    <TVSControlPopup
      title={"Chọn loại vắng"}
      isShow={modalVisibleLV}
      onHide={() => setModalVisibleLV(false)}
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
              <Text>{item.absence_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const modalPK1 = (
    <Modal animationType="fade" transparent={true} visible={modalVisiblePK1}>
      <Button
        nextScreen={() => setModalVisiblePK1(false)}
        flex
        backgroundColor={"rgba(0,0,0,0.3)"}
        justifyCenter
        alignCenter
      >
        <Block
          backgroundColor={Color.white}
          width={width * 0.9}
          justifyCenter
          radius={10}
          paddingTop={15}
        >
          <Block paddingLeft={10} paddingRight={10}>
            <ScrollView>
              <DropdownPk
                PROP={Object(
                  cbPersonApproved.filter((i) => i.approve_role_type == 1)
                )}
                getState={getStatePk1}
                pk={empApproved_pk1}
              />
            </ScrollView>
          </Block>
        </Block>
      </Button>
    </Modal>
  );

  const modalPK2 = (
    <Modal animationType="fade" transparent={true} visible={modalVisiblePK2}>
      <Button
        nextScreen={() => setModalVisiblePK2(false)}
        flex
        backgroundColor={"rgba(0,0,0,0.3)"}
        justifyCenter
        alignCenter
      >
        <Block
          backgroundColor={Color.white}
          width={width * 0.9}
          justifyCenter
          radius={10}
          paddingTop={15}
        >
          <Block paddingLeft={10} paddingRight={10}>
            <ScrollView>
              <DropdownPk
                PROP={Object(
                  cbPersonApproved.filter((i) => i.approve_role_type == 2)
                )}
                getState={getStatePk2}
                pk={empApproved_pk2}
              />
            </ScrollView>
          </Block>
        </Block>
      </Button>
    </Modal>
  );

  const hanleApproveInfo = (arrayData) => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    arrayData.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = arrayData.filter((y) => {
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
    setApproveDefault(arrApproveDefault);
  };

  const hanleNewApproveInfo = (arr) => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    arr.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = arr.filter((y) => {
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

  return (
    <Block
      paddingTop={10}
      marginHorizontal={10}
      backgroundColor={Color.gray}
      flex
    >
      <Block flex marginBottom={0}>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block
                paddingTop={10}
                radius={6}
                backgroundColor={Color.white}
                marginLeft={10}
                marginRight={10}
                flex
              >
                <Block flex paddingLeft={5} paddingRight={5} marginBottom={4}>
                  <Block row paddingBottom={3}>
                    <Text paddingLeft={5}>Loại vắng</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <Button
                    nextScreen={() => setModalVisibleLV(true)}
                    row
                    flex
                    justifyContent={"space-between"}
                    backgroundColor={Color.gray}
                    radius={6}
                  >
                    <Block
                      flex
                      justifyCenter
                      paddingLeft={10}
                      paddingVertical={12}
                    >
                      <Text color={colorLoai}>{loaivang_val}</Text>
                    </Block>
                    <Block justifyCenter paddingRight={10}>
                      <Icon
                        color={Color.mainColor}
                        name={"arrow-down-drop-circle-outline"}
                        size={24}
                      />
                    </Block>
                  </Button>
                </Block>
                <Block row justifyCenter alignCenter paddingTop={10}>
                  <Text
                    flex
                    paddingLeft={10}
                    height={60}
                    fontFamily={"Roboto-Medium"}
                  >
                    Đăng ký nhiều ngày
                  </Text>
                  <Switch
                    style={{ marginRight: 10 }}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                  />
                </Block>
                <Block
                  padding={5}
                  height={70}
                  row
                  justifyContent={"space-between"}
                >
                  <Button nextScreen={showDatePickerStart} column flex>
                    <Block row marginBottom={4}>
                      <Text paddingLeft={10} paddingTop={2}>
                        {switchValue ? "Từ ngày" : "Ngày vắng"}
                      </Text>
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
                      <Text color={colorFrom}>{fromDate}</Text>
                      <IconDate />
                    </Block>
                  </Button>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={startDatePickerVisible}
                    mode="date"
                    hideTitleContainerIOS={false}
                    date={
                      fromDate !== "dd/mm/yyyy"
                        ? new Date(moment(fromDate, "DD/MM/YYYY"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmStart}
                    onCancel={hideDatePickerStart}
                  />
                  {switchValue ? (
                    <Block
                      alignCenter
                      justifyCenter
                      paddingTop={20}
                      width={20}
                      marginLeft={5}
                      marginRight={5}
                    >
                      <Text>...</Text>
                    </Block>
                  ) : null}
                  {switchValue ? (
                    <Button
                      nextScreen={() => showDatePickerEnd()}
                      column
                      // paddingTop={4}
                      flex
                    // backgroundColor={Color.gray}
                    // radius={6}
                    >
                      <Block row marginBottom={4}>
                        <Text paddingLeft={10} paddingTop={2}>
                          Đến ngày
                        </Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <Block
                        backgroundColor={Color.gray}
                        radius={6}
                        row
                        justifyContent={"space-between"}
                        alignCenter
                        padding={8}
                      >
                        <Text color={colorTo}>{toDate}</Text>
                        <IconDate />
                      </Block>
                    </Button>
                  ) : null}
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={endDatePickerVisible}
                    hideTitleContainerIOS={false}
                    mode="date"
                    date={
                      toDate !== "dd/mm/yyyy"
                        ? new Date(moment(toDate, "DD/MM/YYYY"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmEnd}
                    onCancel={hideDatePickerEnd}
                  />
                </Block>
                {/* Time */}
                {hide_time !== "Y" && (
                  <Block row justifyCenter alignCenter paddingTop={10}>
                    <Text
                      flex
                      paddingLeft={10}
                      height={60}
                      fontFamily={"Roboto-Medium"}
                    >
                      Đăng ký khung giờ
                    </Text>
                    <Switch
                      style={{ marginRight: 10 }}
                      onValueChange={toggleSwitchTime}
                      value={switchValueTime}
                    />
                  </Block>
                )}
                {switchValueTime ? (
                  <Block
                    marginTop={5}
                    marginBottom={5}
                    padding={5}
                    alignCenter
                    height={70}
                    row
                    justifyContent={"space-between"}
                  >
                    <Block flex>
                      <Text paddingLeft={10} paddingTop={2} marginBottom={4}>
                        Từ giờ
                      </Text>
                      <Button
                        nextScreen={showDatePickerStartTime}
                        column
                        flex
                        backgroundColor={Color.gray}
                        radius={6}
                      >
                        <Block
                          row
                          justifyContent={"space-between"}
                          padding={10}
                        >
                          <Text color={colorTimefrom}>{startTime}</Text>
                          <IconTime />
                        </Block>
                      </Button>
                    </Block>
                    <DateTimePickerModal
                      cancelTextIOS="Hủy bỏ"
                      confirmTextIOS="Xác nhận"
                      isVisible={startTimetDatePickerVisible}
                      mode="time"
                      hideTitleContainerIOS={false}
                      date={new Date()}
                      locale="vi_VN"
                      onConfirm={handleConfirmStartTime}
                      onCancel={hideDatePickerStartTime}
                    />
                    <Block
                      alignCenter
                      justifyContent={"flex-end"}
                      height={30}
                      width={20}
                      marginLeft={5}
                      marginRight={5}
                    >
                      <Text>...</Text>
                    </Block>
                    <Block flex>
                      <Text paddingLeft={10} paddingTop={2} marginBottom={4}>
                        Đến giờ
                      </Text>
                      <Button
                        nextScreen={showDatePickerEndTime}
                        column
                        flex
                        backgroundColor={Color.gray}
                        radius={6}
                      >
                        <Block
                          row
                          justifyContent={"space-between"}
                          padding={10}
                        >
                          <Text color={colorTimeto}>{endTime}</Text>
                          <IconTime />
                        </Block>
                      </Button>
                    </Block>
                    <DateTimePickerModal
                      cancelTextIOS="Hủy bỏ"
                      confirmTextIOS="Xác nhận"
                      isVisible={endTimetDatePickerVisible}
                      mode="time"
                      hideTitleContainerIOS={false}
                      date={new Date()}
                      locale="vi_VN"
                      onConfirm={handleConfirmEndTime}
                      onCancel={hideDatePickerEndtTime}
                    />
                  </Block>
                ) : null}
                <Block row justifyCenter alignCenter paddingTop={10}>
                  <Text flex paddingLeft={10}>
                    Ghi chú
                  </Text>
                </Block>
                <Block
                  flex
                  backgroundColor={Color.gray}
                  borderWidth={1}
                  borderColor={Color.white}
                  padding={5}
                  margin={5}
                  radius={7}
                >
                  <TextInput
                    style={{
                      padding: 10,
                    }}
                    multiline={true}
                    placeholder={"Nhập ghi chú"}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                  />
                </Block>
                {approveInfo.length > 0 ? (
                  <Block>
                    <Block style={styles.blockApproveInfo}>
                      {/* approve info start */}
                      <Block
                        border={1}
                        padding={10}
                        borderColor={Color.gray}
                        radius={6}
                        marginBottom={20}
                        marginLeft={5}
                        marginRight={5}
                      >
                        <Block
                          padding={3}
                          radius={4}
                          height={40}
                          alignCenter
                          row
                          style={styles.approveIntoTitle}
                        >
                          <Text fontWeight={"bold"}>
                            Thông tin người phê duyệt
                          </Text>
                        </Block>
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
                      </Block>
                      {/* approve info end */}
                    </Block>
                  </Block>
                ) : null}

                {note ? (
                  <Block
                    style={{
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        fontSize: 12,
                      }}
                      fontStyle={"italic"}
                    >
                      {note}
                    </Text>
                  </Block>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <TVSButton
                      onPress={onResetForm}
                      type={"secondary"}
                      icon={"sync"}
                    >
                      Đăng ký mới
                    </TVSButton>
                  </View>
                  <View>
                    <TVSButton onPress={validate} icon={"content-save"}>
                      Sao lưu
                    </TVSButton>
                  </View>
                </View>
              </Block>
              <View></View>
              {modal}
              {modalLV}
              {modalPK1}
              {modalPK2}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
}

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
        marginTop: 10,
      }}
    >
      <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
        Vai trò phê duyệt <Text style={{ color: "red" }}>*</Text>
      </Text>
      <View
        style={{
          backgroundColor: Color.gray,
          padding: 10,
          marginTop: 5,
          borderBottomColor: Color.inputBackgroundColor,
          borderBottomWidth: 1,
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
                  currentSelectedLevel.name === "Chọn vai trò phê duyệt"
                    ? "#B2B2B2"
                    : null,
              }}
            >
              {currentSelectedLevel.name}
            </Text>
          </View>
          <Icon
            name={"arrow-down-drop-circle-outline"}
            size={24}
            color={Color.mainColor}
          />
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
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "white",
                    marginBottom: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    flex={1}
                    flexWrap={"wrap"}
                    paddingLeft={5}
                    paddingRight={5}
                  >
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
        marginTop: 10,
      }}
    >
      <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
        Người phê duyệt <Text style={{ color: "red" }}>*</Text>
      </Text>
      <View
        style={{
          backgroundColor: Color.gray,
          padding: 10,
          marginTop: 5,
          borderBottomColor: Color.inputBackgroundColor,
          borderBottomWidth: 1,
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
                  currentSelectedPerson.approve_name === "Chọn người phê duyệt"
                    ? "#B2B2B2"
                    : null,
              }}
            >
              {currentSelectedPerson.approve_name}
            </Text>
          </View>
          <Icon
            name={"arrow-down-drop-circle-outline"}
            color={Color.mainColor}
            size={24}
          />
        </Button>
        {isShow && (
          <View
            style={{
              marginTop: 10,
            }}
          >
            {currentSelectedLevel.arr.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsShow(false);
                    onChangeSelectedPerson(item);
                  }}
                  key={index.toString()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "white",
                    marginBottom: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    flex={1}
                    flexWrap={"wrap"}
                    paddingLeft={5}
                    paddingRight={5}
                  >
                    {item.approve_name}
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
