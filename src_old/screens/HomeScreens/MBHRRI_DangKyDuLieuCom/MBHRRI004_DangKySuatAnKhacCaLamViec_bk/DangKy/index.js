import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSCheckBox from "../../../../../components/Tvs/TVSCheckBox";
import ShowError from "../../../../../services/errors";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";

export default function DK({ onCallbackReload }) {
  //get status isLoading
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
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );
  const [dateCaAn2, setDateCaAn2] = useState(
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );
  const [dateCaAn3, setDateCaAn3] = useState(
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );

  const [fromDateCaAn1, setFromDateCaAn1] = useState(fromDate);
  const [toDate, setToDate] = useState(fromDate);
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [switchValue2, setSwitchValue2] = useState(true);
  const [modalVisibleLyDo, setModalVisibleLyDo] = useState(false);
  const [dataLyDo, setDataLyDo] = useState([]);
  const [lyDo_code, setLyDo_code] = useState("");
  const [lyDo_code_nm, setLyDo_code_nm] = useState("Chọn lý do");

  const [modalVisibleCaAn, setModalVisibleCaAn] = useState(false);
  const [dataEatingShift, setDataEatingShift] = useState([]);
  const [dataEatingShift2, setDataEatingShift2] = useState([]);
  const [fromCaAn1_code, setFromCaAn1_code] = useState("");
  const [fromCaAn1_code_nm, setFromCaAn1_code_nm] = useState("Chọn ca");
  const [caAn1_code, setCaAn1_code] = useState("");
  const [caAn1_code_nm, setCaAn1_code_nm] = useState("Chọn ca");
  const [nextCode, setNextCode] = useState("");
  const [nextMealDate, setNextMealDate] = useState("");
  const [caAn2_code, setCaAn2_code] = useState("");
  const [caAn2_code_nm, setCaAn2_code_nm] = useState("Chọn ca");
  const [caAn3_code, setCaAn3_code] = useState("");
  const [caAn3_code_nm, setCaAn3_code_nm] = useState("Chọn ca");
  const [tuCaLamViec, setTuCaLamViec] = useState("");

  const [modalVisiblePart, setModalVisiblePart] = useState(false);
  const [dataPart, setDataPart] = useState([]);
  const [part_code, setPart_code] = useState("");
  const [part_code_nm, setPart_code_nm] = useState("Chọn loại");

  const [modalVisiblePositionCanteen, setModalVisiblePositionCanteen] =
    useState(false);
  const [dataPositionCanteen, setDataPositionCanteen] = useState([]);
  const [positionCanteen_code, setPositionCanteen_code] = useState("");
  const [positionCanteen_code_nm, setPositionCanteen_code_nm] =
    useState("Chọn vị trí");
  const [ghiChu, setGhiChu] = useState("");
  const [visibleFromCaAn1, setVisibleFromCaAn1] = useState(false);

  const [anChayYN1, setAnChayYN1] = useState("N");
  const [anChayYN2, setAnChayYN2] = useState("N");
  const [anChayYN3, setAnChayYN3] = useState("N");
  const [vegetarianDt, setVegetarianDt] = useState("");
  const [vegetarianDt2, setVegetarianDt2] = useState("");

  useEffect(() => {
    getData();
    OnCheckVegetarian(moment(new Date().getTime()).format("YYYYMMDD"));
  }, []);

  useEffect(() => {
    getData2();
  }, [dataPositionCanteen, fromDate]);

  useEffect(() => {
    if (caAn2_code == "01") {
      setSwitchValue2(false);
      return;
    }
  }, [caAn2_code]);
  useEffect(() => {
    if (tuCaLamViec == "null") {
      setFromCaAn1_code("");
      setFromCaAn1_code_nm("");
      setFromDateCaAn1("");
    } else {
      setFromDateCaAn1(fromDate);
    }
  }, [tuCaLamViec]);

  useEffect(() => {
    if (lyDo_code && lyDo_code == "2") {
      setVisibleFromCaAn1(true);
      if (dataEatingShift.length > 0) {
        setCaAn1_code(dataEatingShift[0].code);
        setCaAn1_code_nm(dataEatingShift[0].code_nm);

        dataEatingShift.map((item, index) => {
          if (item.code == dataEatingShift[0].code) {
            if (index == dataEatingShift.length - 1) {
              setCaAn2_code(dataEatingShift[0].code);
              setCaAn2_code_nm(dataEatingShift[0].code_nm);
              setDateCaAn2(
                moment(toDate, "DD/MM/YYYY").add(1, "days").format("DD/MM/YYYY")
              );
              setCaAn3_code(dataEatingShift[1].code);
              setCaAn3_code_nm(dataEatingShift[1].code_nm);
              setDateCaAn3(
                moment(toDate, "DD/MM/YYYY").add(1, "days").format("DD/MM/YYYY")
              );
            } else {
              setCaAn2_code(dataEatingShift[index + 1].code);
              setCaAn2_code_nm(dataEatingShift[index + 1].code_nm);
              setDateCaAn2(moment(toDate, "DD/MM/YYYY").format("DD/MM/YYYY"));
              setCaAn3_code(dataEatingShift[index + 2].code);
              setCaAn3_code_nm(dataEatingShift[index + 2].code_nm);
              setDateCaAn3(moment(toDate, "DD/MM/YYYY").format("DD/MM/YYYY"));
            }
          }
        });
      }
    } else {
      if (dataEatingShift2.length > 0 && dataEatingShift.length > 0) {
        setCaAn1_code(dataEatingShift2[0].code);
        setCaAn1_code_nm(dataEatingShift2[0].code_nm);
        setNextMealDate(dataEatingShift2[0].next_meal_dt);
        setNextCode(dataEatingShift2[0].next_code);

        const currentIndex = dataEatingShift.findIndex(
          (item) => item.code === dataEatingShift2[0].code
        );
        const nextIndex = (currentIndex + 1) % dataEatingShift.length;
        const secondNextIndex = (currentIndex + 2) % dataEatingShift.length;

        setCaAn2_code(dataEatingShift[nextIndex].code);
        setCaAn2_code_nm(dataEatingShift[nextIndex].code_nm);
        setDateCaAn2(
          moment(toDate, "DD/MM/YYYY")
            .add(nextIndex < currentIndex ? 1 : 0, "days")
            .format("DD/MM/YYYY")
        );

        setCaAn3_code(dataEatingShift[secondNextIndex].code);
        setCaAn3_code_nm(dataEatingShift[secondNextIndex].code_nm);
        setDateCaAn3(
          moment(toDate, "DD/MM/YYYY")
            .add(secondNextIndex < currentIndex ? 1 : 0, "days")
            .format("DD/MM/YYYY")
        );
      }
      setVisibleFromCaAn1(false);
    }
    setSwitchValue(false);
    setSwitchValue2(false);
  }, [lyDo_code, dataEatingShift, dataEatingShift2, toDate]);

  //Từ ngày
  const showDatePickerFrom = () => {
    setFromDatePickerVisible(true);
  };
  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };
  const handleConfirmFromDate = (val) => {
    hidePickerFromDate();
    // if (
    //   moment(val).format("YYYYMMDD") <
    //   moment(new Date().getTime()).format("YYYYMMDD")
    // ) {
    //   dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày hiện tại");
    //   return;
    // }

    setFromDate(moment(val).format("DD/MM/YYYY"));
    setToDate(moment(val).format("DD/MM/YYYY"));
    setDateCaAn2(moment(val).format("DD/MM/YYYY"));
    OnCheckVegetarian(moment(val).format("YYYYMMDD"));
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

    //if val today > fromDate 2 day hoặc val today < fromDate 2 day error
    if (
      moment(val).format("YYYYMMDD") <
        moment(fromDate, "DD/MM/YYYY").subtract(1, "days").format("YYYYMMDD") ||
      moment(val).format("YYYYMMDD") >
        moment(fromDate, "DD/MM/YYYY").add(1, "days").format("YYYYMMDD")
    ) {
      dialogError("Đến ngày chỉ được lớn hoặc nhỏ hơn 1 ngày");
      return;
    }

    setToDate(moment(val).format("DD/MM/YYYY"));
    setDateCaAn2(moment(val).format("DD/MM/YYYY"));
  };

  const toggleSwitch = () => {
    let oldSwitch = switchValue;
    setSwitchValue((previousState) => !previousState);
    setSwitchValue2((previousState) => (oldSwitch ? false : previousState));
    setAnChayYN2("N");
    setAnChayYN3("N");
  };

  const toggleSwitch2 = () => {
    if (caAn2_code == "01") {
      dialogNoti("Chỉ giới hạn đến ca sáng");
      return;
    }
    setSwitchValue2((previousState) => !previousState);
    setAnChayYN3("N");
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

  const getStateLyDo = (result) => {
    setLyDo_code(result.code);
    setLyDo_code_nm(result.code_nm);
    setModalVisibleLyDo(false);
  };

  const getStateCaAn = (result) => {
    setCaAn1_code(result.code);
    setCaAn1_code_nm(result.code_nm);
    setModalVisibleCaAn(false);

    const currentIndex = dataEatingShift.findIndex(
      (item) => item.code === result.code
    );

    const nextIndex = (currentIndex + 1) % dataEatingShift.length;
    setCaAn2_code(dataEatingShift[nextIndex].code);
    setCaAn2_code_nm(dataEatingShift[nextIndex].code_nm);
    setDateCaAn2(
      moment(toDate, "DD/MM/YYYY")
        .add(nextIndex < currentIndex ? 1 : 0, "days")
        .format("DD/MM/YYYY")
    );

    const secondNextIndex = (currentIndex + 2) % dataEatingShift.length;
    setCaAn3_code(dataEatingShift[secondNextIndex].code);
    setCaAn3_code_nm(dataEatingShift[secondNextIndex].code_nm);
    setDateCaAn3(
      moment(toDate, "DD/MM/YYYY")
        .add(secondNextIndex < currentIndex ? 1 : 0, "days")
        .format("DD/MM/YYYY")
    );
  };

  const getStatePart = (result) => {
    setPart_code(result.code);
    setPart_code_nm(result.code_nm);
    setModalVisiblePart(false);
  };

  const getStatePositionCanteen = (result) => {
    setPositionCanteen_code(result.code);
    setPositionCanteen_code_nm(result.code_nm);
    setModalVisiblePositionCanteen(false);
  };

  const validate = () => {
    if (lyDo_code == "") {
      dialogError("Vui lòng chọn lý do");
      return;
    }

    if (part_code == "") {
      dialogError("Vui lòng chọn loại");
      return;
    }

    if (positionCanteen_code == "") {
      dialogError("Vui lòng chọn vị trí");
      return;
    }

    if (caAn1_code == "") {
      dialogError("Vui lòng chọn ca ăn 1");
      return;
    }

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

  const getData = () => {
    const pro = "SELHRRI004000";
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
          p1_sys: "lst_limit_date",
          p2_sys: "lst_reason",
          p3_sys: "lst_eating_shift",
          p4_sys: "lst_part",
          p5_sys: "lst_position_canteen",
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
            setDataLyDo(rs.data.lst_reason);
            setDataEatingShift(rs.data.lst_eating_shift);
            setDataPart(rs.data.lst_part);
            setDataPositionCanteen(rs.data.lst_position_canteen);

            if (rs.data.lst_reason.length > 0) {
              setLyDo_code(rs.data.lst_reason[0].code);
              setLyDo_code_nm(rs.data.lst_reason[0].code_nm);
            }

            if (rs.data.lst_part.length > 0) {
              setPart_code(rs.data.lst_part[0].code);
              setPart_code_nm(rs.data.lst_part[0].code_nm);
            }

            if (rs.data.lst_position_canteen.length > 0) {
              setPositionCanteen_code(rs.data.lst_position_canteen[0].code);
              setPositionCanteen_code_nm(
                rs.data.lst_position_canteen[0].code_nm
              );
            }
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const getData2 = () => {
    const pro = "SELHRRI004001";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
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
          p1_varchar2: "canteen_code",
          p2_sys: "lst_meal_shift",
          p3_sys: "lst_meal_shift_default",
          p4_varchar2: "meal_shift_char",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRRI004001", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            dataPositionCanteen.map((item) => {
              if (item.code == rs.data.canteen_code) {
                setPositionCanteen_code(item.code);
                setPositionCanteen_code_nm(item.code_nm);

                dataPart.map((itemPart) => {
                  if (item.check_yn == "Y") {
                    if (itemPart.code == "1") {
                      setPart_code(itemPart.code);
                      setPart_code_nm(itemPart.code_nm);
                    }
                  } else {
                    if (itemPart.code == "2") {
                      setPart_code(itemPart.code);
                      setPart_code_nm(itemPart.code_nm);
                    }
                  }
                });
              }
            });

            if (rs.data.lst_meal_shift.length > 0) {
              setDataEatingShift2(rs.data.lst_meal_shift);
              setCaAn1_code(rs.data.lst_meal_shift[0].code);
              setCaAn1_code_nm(rs.data.lst_meal_shift[0].code_nm);
              setNextMealDate(rs.data.lst_meal_shift[0].next_meal_dt);
              setNextCode(rs.data.lst_meal_shift[0].next_code);
            }

            if (rs.data.lst_meal_shift_default.length > 0) {
              setFromCaAn1_code(rs.data.lst_meal_shift_default[0].code);
              setFromCaAn1_code_nm(rs.data.lst_meal_shift_default[0].code_nm);
            }

            setTuCaLamViec(rs.data.meal_shift_char);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const onResetForm = () => {
    setSwitchValue(false);
    setSwitchValue2(false);
    setFromDate(moment(new Date().getTime()).format("DD/MM/YYYY"));
    setLyDo_code("");
    setLyDo_code_nm("Chọn lý do");
    setPart_code("");
    setPart_code_nm("Chọn loại");
    setPositionCanteen_code("");
    setPositionCanteen_code_nm("Chọn vị trí");
    setCaAn1_code("");
    setCaAn1_code_nm("Chọn ca");
    setGhiChu("");
    setAnChayYN1("N");
    setAnChayYN2("N");
    setAnChayYN3("N");
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    const pro = "UPDHRRI004000";
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: lyDo_code,
      p4_varchar2: part_code,
      p5_varchar2: positionCanteen_code,
      p6_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p7_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p8_varchar2: caAn1_code,
      p9_varchar2: switchValue ? caAn2_code : "",
      p10_varchar2: switchValue2 ? caAn3_code : "",
      p11_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p12_varchar2: switchValue
        ? moment(dateCaAn2, "DD/MM/YYYY").format("YYYYMMDD")
        : "",
      p13_varchar2: switchValue2
        ? moment(dateCaAn3, "DD/MM/YYYY").format("YYYYMMDD")
        : "",
      p14_varchar2: ghiChu.toString().trim(),
      p15_varchar2: thr_emp_pk,
      p16_varchar2: moment(new Date().getTime()).format("YYYYMMDDHHmmss"),
      p17_varchar2: lyDo_code == "2" ? fromCaAn1_code : "",
      p18_varchar2: "",
      p19_varchar2:
        lyDo_code == "2"
          ? moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
          : "",
      p20_varchar2: "",
      p21_varchar2: anChayYN1,
      p22_varchar2: anChayYN2,
      p23_varchar2: anChayYN3,
      p24_varchar2: crt_by,
      p25_varchar2: APP_VERSION,
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
        console.log("rs UPDHRRI004000", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: đăng ký không thành công.";
          }
          dialogNoti(errors);
        } else {
          dialogNoti("Đăng ký thành công");
          onResetForm();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalLyDo = (
    <TVSControlPopup
      title={"Chọn lý do"}
      isShow={modalVisibleLyDo}
      onHide={() => setModalVisibleLyDo(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleLyDo(false)}
        >
          Đóng lại
        </TVSButton>
      }
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

  const modalCaAn = (
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
        data={lyDo_code == "1" ? dataEatingShift2 : dataEatingShift}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateCaAn(item, index);
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

  const modalPart = (
    <TVSControlPopup
      title={"Chọn phần"}
      isShow={modalVisiblePart}
      onHide={() => setModalVisiblePart(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePart(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePart(item);
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

  const modalPositionCanteen = (
    <TVSControlPopup
      title={"Chọn vị trí"}
      isShow={modalVisiblePositionCanteen}
      onHide={() => setModalVisiblePositionCanteen(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePositionCanteen(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPositionCanteen}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (part_code == "1") {
            if (item.check_yn == "Y") {
              return (
                <TouchableOpacity
                  onPress={() => {
                    getStatePositionCanteen(item);
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
            }
          } else {
            return (
              <TouchableOpacity
                onPress={() => {
                  getStatePositionCanteen(item);
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
          }
        }}
      />
    </TVSControlPopup>
  );
  const onCheck = (type) => {
    switch (type) {
      case 1:
        if (anChayYN1 == "Y") {
          setAnChayYN1("N");
        } else {
          setAnChayYN1("Y");
        }
        break;
      case 2:
        if (anChayYN2 == "Y") {
          setAnChayYN2("N");
        } else {
          setAnChayYN2("Y");
        }
        break;
      case 3:
        if (anChayYN3 == "Y") {
          setAnChayYN3("N");
        } else {
          setAnChayYN3("Y");
        }
        break;
      default:
        console.log("out case");
    }
  };
  const OnCheckVegetarian = (date) => {
    console.log(date);
    const pro = "SELHRRI004003";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: date,
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
          p1_sys: "vegetarian",
          p2_sys: "vegetarian2",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs SELHRRI004003", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log(rs.data.vegetarian);
            if (rs.data.vegetarian.length > 0) {
              console.log("is vegetarian");
              setVegetarianDt(rs.data.vegetarian[0].vegetarian_dt);
            }
            if (rs.data.vegetarian.length == 0) {
              setVegetarianDt("");
            }
            if (rs.data.vegetarian2.length > 0) {
              console.log("is vegetarian");
              setVegetarianDt2(rs.data.vegetarian2[0].vegetarian_dt);
            }
            if (rs.data.vegetarian2.length == 0) {
              setVegetarianDt2("");
            }
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Block style={styles.titleContainer}>
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

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Lý do</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisibleLyDo(true)}
                    colorText={lyDo_code_nm == "Chọn lý do" ? "#B2B2B2" : null}
                    code_nm={lyDo_code_nm}
                  />
                </Block>

                <View
                  style={{
                    display: "flex",
                    paddingHorizontal: 5,
                    marginBottom: 10,
                    flexDirection: "row",
                  }}
                >
                  <Block style={{ flex: 0.6, marginHorizontal: 2 }}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Loại</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSList
                      onPress={() => setModalVisiblePart(true)}
                      colorText={part_code_nm == "Chọn loại" ? "#B2B2B2" : null}
                      code_nm={part_code_nm}
                    />
                  </Block>
                  <Block style={{ flex: 1, marginHorizontal: 2 }}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Vị trí</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSList
                      maxHeight={40}
                      onPress={() => setModalVisiblePositionCanteen(true)}
                      colorText={
                        positionCanteen_code_nm == "Chọn vị trí"
                          ? "#B2B2B2"
                          : null
                      }
                      code_nm={positionCanteen_code_nm}
                    />
                  </Block>
                </View>

                {visibleFromCaAn1 ? (
                  <>
                    <Block
                      style={{
                        flex: 0.6,
                        marginHorizontal: 2,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>
                          Ca làm việc: {tuCaLamViec}
                        </Text>
                      </Block>
                    </Block>

                    <View
                      style={{
                        display: "flex",
                        paddingHorizontal: 5,
                        marginBottom: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Block style={{ flex: 0.6, marginHorizontal: 2 }}>
                        <Block style={styles.titleText}>
                          <Text color={Color.mainColor}>Ca ăn 1</Text>
                          <Text color={Color.red}> *</Text>
                        </Block>
                        <TVSList
                          disabled={true}
                          onPress={() => setModalVisibleCaAn(true)}
                          colorText={
                            fromCaAn1_code_nm == "Chọn ca" ? "#B2B2B2" : null
                          }
                          code_nm={fromCaAn1_code_nm}
                        />
                      </Block>
                      <Block style={{ flex: 1, marginHorizontal: 2 }}>
                        <Block style={styles.titleText}>
                          <Text color={Color.mainColor}></Text>
                          <Text color={Color.red}> </Text>
                        </Block>
                        <TVSDate colorText={"#B2B2B2"} date={fromDateCaAn1} />
                      </Block>
                    </View>

                    <Block
                      style={{
                        flex: 1,
                        flexDirection: "row",
                      }}
                    >
                      <Block style={styles.titleContainer}>
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
                  </>
                ) : null}

                <View
                  style={{
                    display: "flex",
                    paddingHorizontal: 5,
                    marginBottom: 10,
                    flexDirection: "row",
                  }}
                >
                  <Block
                    style={{
                      flex: 0.85,
                      marginHorizontal: 2,
                      marginTop:
                        toDate == vegetarianDt || toDate == vegetarianDt2
                          ? 3
                          : 0,
                    }}
                  >
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>Ca ăn 1</Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSList
                      onPress={() => setModalVisibleCaAn(true)}
                      colorText={caAn1_code_nm == "Chọn ca" ? "#B2B2B2" : null}
                      code_nm={caAn1_code_nm}
                    />
                  </Block>
                  <Block style={{ flex: 1, marginHorizontal: 2 }}>
                    <Block style={styles.titleText}>
                      {toDate == vegetarianDt || toDate == vegetarianDt2 ? (
                        <View style={{ flexDirection: "row" }}>
                          <View>
                            <TVSCheckBox
                              size={"S"}
                              value={anChayYN1}
                              onPress={() => onCheck(1)}
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() => onCheck(1)}
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              paddingLeft: 5,
                            }}
                          >
                            <Text>Ăn chay</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <>
                          <Text color={Color.mainColor}></Text>
                          <Text color={Color.red}> </Text>
                        </>
                      )}
                    </Block>
                    <TVSDate colorText={"#B2B2B2"} date={toDate} />
                  </Block>

                  <Block style={{ flex: 0.4, marginHorizontal: 2 }}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}></Text>
                      <Text color={Color.red}> </Text>
                    </Block>
                    <Switch value={switchValue} onValueChange={toggleSwitch} />
                  </Block>
                </View>

                {switchValue ? (
                  <View
                    style={{
                      display: "flex",
                      paddingHorizontal: 5,
                      marginBottom: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Block
                      style={{
                        flex: 0.85,
                        marginHorizontal: 2,
                        marginTop:
                          dateCaAn2 == vegetarianDt ||
                          dateCaAn2 == vegetarianDt2
                            ? 3
                            : 0,
                      }}
                    >
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Ca ăn 2</Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <TVSList
                        disabled={true}
                        colorText={
                          caAn2_code_nm == "Chọn ca" ? "#B2B2B2" : null
                        }
                        code_nm={caAn2_code_nm}
                      />
                    </Block>

                    <Block style={{ flex: 1, marginHorizontal: 2 }}>
                      <Block style={styles.titleText}>
                        {dateCaAn2 == vegetarianDt ||
                        dateCaAn2 == vegetarianDt2 ? (
                          <View style={{ flexDirection: "row" }}>
                            <View>
                              <TVSCheckBox
                                size={"S"}
                                value={anChayYN2}
                                onPress={() => onCheck(2)}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => onCheck(2)}
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                paddingLeft: 5,
                              }}
                            >
                              <Text>Ăn chay</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <>
                            <Text color={Color.mainColor}></Text>
                            <Text color={Color.red}> </Text>
                          </>
                        )}
                      </Block>
                      <TVSDate colorText={"#B2B2B2"} date={dateCaAn2} />
                    </Block>

                    <Block style={{ flex: 0.4, marginHorizontal: 2 }}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}></Text>
                        <Text color={Color.red}> </Text>
                      </Block>
                      <Switch
                        value={switchValue2}
                        onValueChange={toggleSwitch2}
                      />
                    </Block>
                  </View>
                ) : null}

                {switchValue2 ? (
                  <View
                    style={{
                      display: "flex",
                      paddingHorizontal: 5,
                      marginBottom: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Block
                      style={{
                        flex: 0.6,
                        marginHorizontal: 2,
                        marginTop:
                          dateCaAn3 == vegetarianDt ||
                          dateCaAn3 == vegetarianDt2
                            ? 3
                            : 0,
                      }}
                    >
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Ca ăn 3</Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <TVSList
                        disabled={true}
                        colorText={
                          caAn3_code_nm == "Chọn ca" ? "#B2B2B2" : null
                        }
                        code_nm={caAn3_code_nm}
                      />
                    </Block>

                    <Block style={{ flex: 1, marginHorizontal: 2 }}>
                      <Block style={styles.titleText}>
                        {dateCaAn3 == vegetarianDt ||
                        dateCaAn3 == vegetarianDt2 ? (
                          <View style={{ flexDirection: "row" }}>
                            <View>
                              <TVSCheckBox
                                size={"S"}
                                value={anChayYN3}
                                onPress={() => onCheck(3)}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => onCheck(3)}
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                paddingLeft: 5,
                              }}
                            >
                              <Text>Ăn chay</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <>
                            <Text color={Color.mainColor}></Text>
                            <Text color={Color.red}> </Text>
                          </>
                        )}
                      </Block>
                      <TVSDate colorText={"#B2B2B2"} date={dateCaAn3} />
                    </Block>
                  </View>
                ) : null}

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
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </Block>
                </Block>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
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
              {modalLyDo}
              {modalCaAn}
              {modalPart}
              {modalPositionCanteen}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
}
