/**************** START: IMPORT ****************/
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Text from "../../../../../components/Text";
import { updateUserAction } from "../../../../../actions";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";

import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSList2 from "../../../../../components/Tvs/TVSList2";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVS2Date from "../../../../../components/Tvs/TVS2Date";
import TVSTextInput from "../../../../../components/Tvs/TVSTextInput";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";
import { useNavigation } from "@react-navigation/native";

/**************** END: IMPORT ****************/

export default function DK() {
  const navigation = useNavigation();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  let thr_emp_pk = "";
  let tokenLogin = "";
  let tes_user_pk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    tes_user_pk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}

  useEffect(() => {
    dispatch(ShowGlobalLoading);
    OnLoadingData();
  }, []);
  //************ START: STATE ************
  const [textWarning, setTextWarning] = useState("");
  const [limitDate, setLimitDate] = useState("");
  const [inputEmpID, setInputEmpID] = useState("");
  const [inputFullNm, setInputFullNm] = useState("");
  //
  const [disableOrg, setDisableOrg] = useState(true);
  const [dataOrg, setDataOrg] = useState([]);
  const [selectNameOrg, setSelectNameOrg] = useState("Chọn phòng ban");
  const [selectCodeOrg, setSelectCodeOrg] = useState("");
  const onChangeOrg = (result) => {
    setSelectNameOrg(result.code_nm);
    setSelectCodeOrg(result.code);

    setModalVisibleOrg(false);
    setColorOrg(null);
  };
  const [colorOrg, setColorOrg] = useState("#B2B2B2");
  const [modalVisibleOrg, setModalVisibleOrg] = useState(false);

  const modalOrg = (
    <TVSControlPopup
      title={"Chọn phòng ban"}
      isShow={modalVisibleOrg}
      onHide={() => setModalVisibleOrg(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleOrg(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataOrg}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeOrg(item);
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
  //
  const [dataObject, setDataObject] = useState([]);
  const [selectNameObject, setSelectNameObject] = useState("Chọn đối tượng");
  const [selectCodeObject, setSelectCodeObject] = useState("");
  const [isShowCustomer, setIsShowCustomer] = useState(false);
  const [isShowType2, setIsShowType2] = useState(false);
  const [textCustomer, setTextCustomer] = useState("");
  const onChangeObject = (result) => {
    setSelectNameObject(result.code_nm);
    setSelectCodeObject(result.code);
    if (result.extend == "1") {
      setIsShowCustomer(true);
      setIsShowType2(false);
      setDisablePaidCost(false);
      if (dataPaidCost.length > 0) {
        onChangePaidCost(dataPaidCost[0]);
      }
    } else if (result.extend == "2") {
      setIsShowCustomer(false);
      setIsShowType2(true);
      setDisablePaidCost(true);
      // if (dataPaidCost.length > 0) {
      onChangePaidCost({ code: "", code_nm: "" });
      // }
    } else {
      setIsShowCustomer(false);
      setIsShowType2(false);
      setDisablePaidCost(true);
      // if (dataPaidCost.length > 0) {
      onChangePaidCost({ code: "", code_nm: "" });
      // }
    }
    OnGetGridData(
      result.code,
      moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD")
    );
  };
  //
  const [disablePaidCost, setDisablePaidCost] = useState(true);
  const [dataPaidCost, setDataPaidCost] = useState([]);
  const [selectNamePaidCost, setSelectNamePaidCost] = useState("Chọn");
  const [selectCodePaidCost, setSelectCodePaidCost] = useState("");
  const onChangePaidCost = (result) => {
    setSelectNamePaidCost(result.code_nm);
    setSelectCodePaidCost(result.code);

    setModalVisiblePaidCost(false);
    setColorPaidCost(null);
  };
  const [colorPaidCost, setColorPaidCost] = useState("#B2B2B2");
  const [modalVisiblePaidCost, setModalVisiblePaidCost] = useState(false);

  const modalPaidCost = (
    <TVSControlPopup
      title={"Chọn đối tượng trả phí"}
      isShow={modalVisiblePaidCost}
      onHide={() => setModalVisiblePaidCost(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePaidCost(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPaidCost}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangePaidCost(item);
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
  //
  const [dataMealMethod, setDataMealMethod] = useState([]);
  const [selectNameMealMethod, setSelectNameMealMethod] =
    useState("Chọn phương thức");
  const [selectCodeMealMethod, setSelectCodeMealMethod] = useState("");
  const onChangeMealMethod = (result) => {
    setSelectNameMealMethod(result.code_nm);
    setSelectCodeMealMethod(result.code);
    console.log(result.code);
    getDataCanteen(result.code);
    setModalVisibleMealMethod(false);
    setColorMealMethod(null);
  };
  const [colorMealMethod, setColorMealMethod] = useState("#B2B2B2");
  const [modalVisibleMealMethod, setModalVisibleMealMethod] = useState(false);

  const modalMealMethod = (
    <TVSControlPopup
      title={"Chọn phương thức"}
      isShow={modalVisibleMealMethod}
      onHide={() => setModalVisibleMealMethod(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleMealMethod(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataMealMethod}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeMealMethod(item);
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
  //
  const [dataCanteen, setDataCanteen] = useState([]);
  const [selectNameCanteen, setSelectNameCanteen] = useState("Chọn vị trí ăn");
  const [selectCodeCanteen, setSelectCodeCanteen] = useState("");
  const onChangeCanteen = (result) => {
    setSelectNameCanteen(result.code_nm);
    setSelectCodeCanteen(result.code);
  };
  //
  let flagDate = "";
  const [fromDate, setFromDate] = useState(moment().format("DD/MM/YYYY"));
  const onChangeFromDate = (val) => {
    setFromDate(moment(val).format("DD/MM/YYYY"));
    console.log("onChangeFromDate");
    if (flagDate == "") {
      flagDate = "onChangeFromDate";
      OnGetGridData(
        selectCodeObject,
        moment(val).format("YYYYMMDD"),
        moment(val).format("YYYYMMDD")
      );
    }
    if (flagDate == "onChangeToDate") {
      flagDate = "";
    }
  };
  // * To date
  const [toDate, setToDate] = useState(moment().format("DD/MM/YYYY"));
  const onChangeToDate = (val) => {
    setToDate(moment(val).format("DD/MM/YYYY"));
    console.log("onChangeToDate");
    if (flagDate == "") {
      flagDate = "onChangeToDate";
      OnGetGridData(
        selectCodeObject,
        moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
        moment(val).format("YYYYMMDD")
      );
    }
    if (flagDate == "onChangeFromDate") {
      flagDate = "";
    }
  };
  //
  const [textDescription, setTextDescription] = useState("");
  //
  const [dataGrid, setDataGrid] = useState([]);
  const [isShow1, setIsShow1] = useState("Y");
  const [isShow2, setIsShow2] = useState("Y");
  const [isShow3, setIsShow3] = useState("Y");
  const [isShow4, setIsShow4] = useState("Y");

  const OnEditRow = (name, type, val) => {
    let arr = [...dataGrid];

    arr.forEach(function (item) {
      if (item.name == name) {
        switch (type) {
          case 1:
            item.sang = val;
            break;
          case 2:
            item.trua = val;
            break;
          case 3:
            item.chieu = val;
            break;
          case 4:
            item.dem = val;
            break;
          default:
            console.log("out case");
        }
      }
    });

    setDataGrid(arr);
  };
  //************ END: STATE ************

  //RefreshToken
  const refreshNewToken = (obj) => {
    axios
      .post(API + "User/RefreshToken/", {
        token: tokenLogin,
        userPk: tes_user_pk,
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
  //
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
  //****************************************** START: HANDLE FUNCTIONS ******************************************
  const OnLoadingData = () => {
    const pro = "SELHRRI009000";
    const in_par = {
      p1_varchar2: tes_user_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "lst_note",
      p2_sys: "lst_obj",
      p3_sys: "lst_type",
      p4_sys: "lst_canteen",
      p5_sys: "lst_org",
      p6_sys: "lst_paid_cost",
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnLoadingData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataObject(rs.data.lst_obj);
            setDataMealMethod(rs.data.lst_type);
            if (rs.data.lst_type.length > 0) {
              onChangeMealMethod(rs.data.lst_type[0]);
              // getDataCanteen(rs.data.lst_type[0].code);
            }
            // setDataCanteen(rs.data.lst_canteen);
            setTextWarning(rs.data.lst_note[0].note);
            setLimitDate(rs.data.lst_note[0].limit_dt);
            setDataOrg(rs.data.lst_org);
            if (rs.data.lst_org.length > 0) {
              onChangeOrg(
                rs.data.lst_org.filter((x) => x.default_yn == "Y")[0]
              );
              console.log(
                "filter ",
                rs.data.lst_org.filter((x) => x.default_yn == "Y")[0]
              );
            }
            setDataPaidCost(rs.data.lst_paid_cost);
            // if (rs.data.lst_paid_cost.length > 0) {
            //   onChangePaidCost(rs.data.lst_paid_cost[0]);
            // }

            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
        dispatch(HideGlobalLoading);
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  const getDataCanteen = (code) => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRRI009006";
    const in_par = {
      p1_varchar2: code,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "lst_canteen",
    };
    console.log(pro, in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnLoadingData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log("rs.data.lst_canteen ", rs.data.lst_canteen);
            setDataCanteen(rs.data.lst_canteen);
          }
        }
        dispatch(HideGlobalLoading);
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  useEffect(() => {
    console.log("isShow1 ", isShow1);
  }, [dataGrid]);

  const OnGetGridData = (code, date) => {
    const pro = "SELHRRI009001";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: date,
      p3_varchar2: code,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "lst_data",
    };
    console.log(pro, in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnGetGridData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.lst_data.length > 0) {
              rs.data.lst_data[0].sang == "0"
                ? setIsShow1("Y")
                : setIsShow1("N");
              rs.data.lst_data[0].trua == "0"
                ? setIsShow2("Y")
                : setIsShow2("N");
              rs.data.lst_data[0].chieu == "0"
                ? setIsShow3("Y")
                : setIsShow3("N");
              rs.data.lst_data[0].dem == "0"
                ? setIsShow4("Y")
                : setIsShow4("N");
              setDataGrid(rs.data.lst_data);
            } else {
              setIsShow1("Y");
              setIsShow2("Y");
              setIsShow3("Y");
              setIsShow4("Y");
              setDataGrid([]);
            }
          } else {
            showAlert(rs.errorData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const OnReset = () => {
    navigation.goBack();
    navigation.navigate("MBHRRI009");
  };

  const OnValidate = () => {
    console.log("data grid ", dataGrid);
    Alert.alert(
      "Thông báo",
      "Bạn có muốn đăng ký?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => OnSave(),
        },
      ],
      { cancelable: false }
    );
  };

  const OnSave = () => {
    let name = "";
    let num1 = "";
    let num2 = "";
    let num3 = "";
    let num4 = "";
    let count = 0;
    if (dataGrid.length > 0) {
      dataGrid.forEach(function (item) {
        console.log("item ", item);
        if (item.sang == "") {
          num1 += "0" + "|";
        } else {
          num1 += item.sang + "|";
        }
        if (item.trua == "") {
          num2 += "0" + "|";
        } else {
          num2 += item.trua + "|";
        }
        if (item.chieu == "") {
          num3 += "0" + "|";
        } else {
          num3 += item.chieu + "|";
        }
        if (item.dem == "") {
          num4 += "0" + "|";
        } else {
          num4 += item.dem + "|";
        }
        name += item.name + "|";
        count++;
      });
    }
    const pro = "UPDHRRI009000";
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: name,
      p4_varchar2: num1,
      p5_varchar2: num2,
      p6_varchar2: num3,
      p7_varchar2: num4,
      p8_varchar2: selectCodeObject,
      p9_varchar2: selectCodeMealMethod,
      p10_varchar2: selectCodeCanteen,
      p11_varchar2: moment(fromDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p12_varchar2: moment(toDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p13_varchar2: textCustomer,
      p14_varchar2: textDescription,
      p15_varchar2: thr_emp_pk,
      p16_varchar2: selectCodePaidCost,
      p17_varchar2: selectCodeOrg,
      p18_varchar2: count,
      p19_varchar2: "",
      p20_varchar2: "",
      p21_varchar2: "",
      p22_varchar2: "",
      p23_varchar2: inputEmpID,
      p24_varchar2: inputFullNm,
      p25_varchar2: APP_VERSION,
      p26_varchar2: crt_by,
    };

    const out_par = {
      p1_varchar2: "rtn_value",
    };
    console.log(selectCodePaidCost);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnGetGridData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            showAlert(rs.data.rtn_value);
          } else {
            showAlert(rs.errorData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //****************************************** START: HANDLE FUNCTIONS ******************************************

  return (
    <View
      style={{
        paddingTop: 5,
        paddingBottom: 10,
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          marginHorizontal: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: "white",
        }}
      >
        {textWarning != "" && (
          <View style={{ marginHorizontal: 10, marginTop: 5 }}>
            <Text style={{ color: "red" }}>{textWarning}</Text>
          </View>
        )}
        <View>
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Phòng ban</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisibleOrg(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorOrg }}>{selectNameOrg}</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalOrg}
          </Block>
          {/* <TVSList2
            required={true}
            label={"Phòng ban"}
            dataItem={dataOrg}
            titleModal={"Chọn phòng ban"}
            code={selectCodeOrg}
            code_nm={selectNameOrg}
            onChangeSelect={(val) => onChangeOrg(val)}
          /> */}
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <TVSList2
              required={true}
              label={"Đối tượng"}
              dataItem={dataObject}
              titleModal={"Chọn đối tượng"}
              code={selectCodeObject}
              code_nm={selectNameObject}
              onChangeSelect={(val) => onChangeObject(val)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Block style={{ margin: 10 }}>
              <Block
                style={{
                  flexDirection: "row",
                  paddingBottom: 5,
                  paddingLeft: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Color.mainColor }}>Trả phí</Text>
                {/* <Text style={{ color: Color.red }}> *</Text> */}
              </Block>
              <Button
                nextScreen={() =>
                  disablePaidCost ? null : setModalVisiblePaidCost(true)
                }
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: Color.gray,
                  borderRadius: 6,
                }}
              >
                <Block
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingLeft: 10,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: colorPaidCost }}>
                    {selectNamePaidCost}
                  </Text>
                </Block>
                <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                  <Icon
                    name={"chevron-down"}
                    color={
                      disablePaidCost ? Color.disableButton2 : Color.mainColor
                    }
                    size={30}
                  />
                </Block>
              </Button>
              {modalPaidCost}
            </Block>
          </View>
        </View>
        {isShowCustomer && (
          <View>
            <TVSTextInput
              required={true}
              label={"Tên đoàn khách"}
              placeholder={"Tên đoàn khách theo ĐNTK, nhập không dấu, ghi liền"}
              value={textCustomer}
              changeValue={setTextCustomer}
              // multiLine={true}
            />
          </View>
        )}
        {isShowType2 ? (
          <View>
            <TVSTextInput
              required={true}
              label={"Mã NV mới"}
              placeholder={"Nhập ID của NV mới"}
              value={inputEmpID}
              changeValue={setInputEmpID}
              // multiLine={true}
            />
            <TVSTextInput
              required={true}
              label={"Tên NV mới"}
              placeholder={"Nhập tên của NV mới"}
              value={inputFullNm}
              changeValue={setInputFullNm}
              // multiLine={true}
            />
          </View>
        ) : null}
        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
          <TVS2Date
            multiDateTime={true}
            required={true}
            label={"Từ ngày"}
            value={fromDate}
            onChangeDate={(val) => onChangeFromDate(val)}
            validateFromDate={true}
            fromDateCompare={limitDate}
            alertTextFrom={"Từ ngày không được nhỏ hơn ngày giới hạn!"}
            label2={"Đến ngày"}
            value2={toDate}
            onChangeDate2={(val) => onChangeToDate(val)}
            validateToDate={true}
            toDateCompare={fromDate}
            alertTextTo={"Từ ngày không được lớn hơn đến ngày!"}
          />
        </View>
        {/*  */}
        <View style={{ marginHorizontal: 10, marginTop: 20 }}>
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    width: 100,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Lựa chọn</Text>
                </View>
                {isShow1 == "Y" && (
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
                    <Text>Sáng</Text>
                  </View>
                )}
                {isShow2 == "Y" && (
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
                    <Text>Trưa</Text>
                  </View>
                )}
                {isShow3 == "Y" && (
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
                    <Text>Chiều</Text>
                  </View>
                )}
                {isShow4 == "Y" && (
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
                    <Text>Đêm</Text>
                  </View>
                )}
              </View>
              <View>
                {dataGrid.map((item) => (
                  <View
                    style={{
                      flexDirection: "row",
                      height: Platform.OS == "ios" ? 30 : 40,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
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
                      <Text>{item.name}</Text>
                    </View>
                    {isShow1 == "Y" && (
                      <View
                        style={{
                          alignItems: "center",
                          paddingHorizontal: 10,
                          width: 50,
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
                          value={0}
                          placeholder="0"
                          onChangeText={(text) => OnEditRow(item.name, 1, text)}
                          keyboardType={"numeric"}
                          returnKeyType="done"
                        />
                      </View>
                    )}
                    {isShow2 == "Y" && (
                      <View
                        style={{
                          alignItems: "center",
                          paddingHorizontal: 10,
                          width: 50,
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
                          value={0}
                          placeholder="0"
                          onChangeText={(text) => OnEditRow(item.name, 2, text)}
                          keyboardType={"numeric"}
                          returnKeyType="done"
                        />
                      </View>
                    )}
                    {isShow3 == "Y" && (
                      <View
                        style={{
                          alignItems: "center",
                          paddingHorizontal: 10,
                          width: 50,
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
                          value={0}
                          placeholder="0"
                          onChangeText={(text) => OnEditRow(item.name, 3, text)}
                          keyboardType={"numeric"}
                          returnKeyType="done"
                        />
                      </View>
                    )}
                    {isShow4 == "Y" && (
                      <View
                        style={{
                          alignItems: "center",
                          paddingHorizontal: 10,
                          width: 50,
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
                          value={0}
                          placeholder="0"
                          onChangeText={(text) => OnEditRow(item.name, 4, text)}
                          keyboardType={"numeric"}
                          returnKeyType="done"
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        {/*  */}
        <View>
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Phương thức</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisibleMealMethod(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorMealMethod }}>
                  {selectNameMealMethod}
                </Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalMealMethod}
          </Block>
          {/* <TVSList2
            required={true}
            label={"Loại"}
            dataItem={dataMealMethod}
            titleModal={"Chọn loại"}
            code={selectCodeMealMethod}
            code_nm={selectNameMealMethod}
            onChangeSelect={(val) => onChangeMealMethod(val)}
          /> */}
        </View>
        <View>
          <TVSList2
            required={true}
            label={"Vị trí ăn"}
            dataItem={dataCanteen}
            titleModal={"Chọn vị trí ăn"}
            code={selectCodeCanteen}
            code_nm={selectNameCanteen}
            onChangeSelect={(val) => onChangeCanteen(val)}
          />
        </View>
        <View>
          <TVSTextInput
            label={"Ghi chú"}
            placeholder={"Nhập ghi chú"}
            value={textDescription}
            changeValue={setTextDescription}
            multiLine={true}
          />
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          marginHorizontal: 10,
          backgroundColor: "white",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          paddingBottom: 10,
        }}
      >
        <View>
          <TVSButton
            onPress={() => {
              OnReset();
            }}
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
            onPress={() => {
              OnValidate();
            }}
            icon={"content-save"}
            buttonStyle={"3"}
            minWidth={150}
          >
            Đăng ký
          </TVSButton>
        </View>
      </View>
    </View>
  );
}
