import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  View,
  Keyboard,
  FlatList,
  Image,
  Platform,
  PermissionsAndroid,
  LayoutAnimation,
} from "react-native";
import axios from "axios";
import Block from "../../../../../../components/Block";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import sysFetch2 from "../../../../../../services/fetch_v1/fetch2";
import { APP_VERSION } from "../../../../../../config/Pro";
import Button from "../../../../../../components/Button";
import TVSButton from "../../../../../../components/Tvs/Button";
import Load from "../../../../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSHeader from "../../../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../../../Language";
import TVSList from "../../../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import OneField from "../../../../../../components/OneFieldKeyValue";
import TVSSignature from "../../../../../../components/Tvs/TVSSignature";
import IconDate from "../../../../../../icons/Datev";
import IconTime from "../../../../../../icons/Time";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SignatureScreen from "react-native-signature-canvas";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import LinearGradient from "react-native-linear-gradient";
// import { request, PERMISSIONS } from "react-native-permissions";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../../services/redux/GlobalLoading/action";
import { showAlert } from "../../../../../../components/Tvs/TVSAlertORA";
import ShowError from "../../../../../../services/errors";

const ChiTietChuyenDi = ({ route_pk, car_reg_pk }) => {
  //   const { item, onRefresh } = route.params;
  //get status isLoading
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  const menuReducer = useSelector((state) => state.menuReducer);

  const Color = useSelector((s) => s.SystemReducer.theme);

  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let thr_emp_pk = "";
  let tokenLogin = "";
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
  const [dataMain, setDataMain] = useState([]);
  const [dataCost, setDataCost] = useState([]);
  const [ghiChu, setGhiChu] = useState([]);
  useEffect(() => {
    getDataMain(route_pk);
  }, []);
  const getDataMain = (route_pk) => {
    console.log("getDataMain: ", route_pk);
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRBS001002",
        in_par: {
          p1_varchar2: route_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data_main",
          p2_sys: "lst_data_emp",
          p3_sys: "lst_data_cost",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        // console.log("grbs001002", rs.data.lst_data_cost);
        if (rs == "Token Expired") {
          refreshNewToken("getDataMain");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log("rs.data:", rs.data);
            setDataMain(rs.data.lst_data_main);
            setDataCost(rs.data.lst_data_cost);
            if (rs.data.lst_data_main.length > 0) {
              if (rs.data.lst_data_main[0].checkindt != "") {
                setColorCheckinDate(null);
                setCheckinDate(rs.data.lst_data_main[0].checkindt);
              }
              if (rs.data.lst_data_main[0].checkintime != "") {
                setColorCheckinTime(null);
                setCheckinTime(rs.data.lst_data_main[0].checkintime);
              }
              if (rs.data.lst_data_main[0].checkoutdt != "") {
                setColorCheckoutDate(null);
                setCheckoutDate(rs.data.lst_data_main[0].checkoutdt);
              }
              if (rs.data.lst_data_main[0].checkouttime != "") {
                setColorCheckoutTime(null);
                setCheckoutTime(rs.data.lst_data_main[0].checkouttime);
              }
              if (rs.data.lst_data_main[0].startkm != "") {
                setNumKMStart(rs.data.lst_data_main[0].startkm.toString());
              }
              if (rs.data.lst_data_main[0].endkm != "") {
                setNumKMEnd(rs.data.lst_data_main[0].endkm.toString());
              }
              if (rs.data.lst_data_main[0].imgstartkm != "") {
                setStartKMImage(
                  "data:image/png;base64," + rs.data.lst_data_main[0].imgstartkm
                );
              }
              if (rs.data.lst_data_main[0].imgendkm != "") {
                setEndKMImage(
                  "data:image/png;base64," + rs.data.lst_data_main[0].imgendkm
                );
              }
              if (rs.data.lst_data_main[0].imgsign != "") {
                setSignature(
                  "data:image/png;base64," + rs.data.lst_data_main[0].imgsign
                );
              }

              if (rs.data.lst_data_main[0].personapp != "") {
                setSelectCodeNameEmp(rs.data.lst_data_main[0].personapp);
                setSelectCodeEmp(rs.data.lst_data_main[0].personapp);
                setColorEmp(null);
              }
              setGhiChu(rs.data.lst_data_main[0].ghichu);
            }
            setDataEmp(rs.data.lst_data_emp);
            dispatch(HideGlobalLoading);
          }
          dispatch(HideGlobalLoading);
        }
        dispatch(HideGlobalLoading);
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };
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
        if (obj == "getDataMain") {
          getDataMain(route_pk);
        }
        if (obj == "GetDataBinding") {
          GetDataBinding();
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
  const ItemMain = ({ item }) => {
    return (
      <View style={{ marginBottom: 5 }}>
        <Block
          backgroundColor={Color.white}
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}
        >
          {item.lblsubmit.length > 0 ? (
            <OneField value={" "} keyName={item.lblsubmit} />
          ) : null}
          {Object.entries(item).map((oneField, index) => {
            return (
              oneField[0].substr(0, 1) === "_" && (
                <OneField
                  value={oneField[1]}
                  keyName={
                    oneField[0].replace("_", "").substr(0, 1).toUpperCase() +
                    oneField[0]
                      .replace("_", "")
                      .substr(1, oneField[0].replace("_", "").length)
                  }
                />
              )
            );
          })}
        </Block>
      </View>
    );
  };

  //Ngay check in
  const [colorCheckinDate, setColorCheckinDate] = useState("#B2B2B2");
  const [checkinDate, setCheckinDate] = useState("dd/mm/yyyy");
  const [checkinDatePickerVisible, setCheckinDatePickerVisible] =
    useState(false);
  const showDatePickerCheckin = () => {
    setCheckinDatePickerVisible(true);
  };

  const hideDatePickerCheckin = () => {
    setCheckinDatePickerVisible(false);
  };

  const handleConfirmCheckinDate = (val) => {
    hideDatePickerCheckin();
    setCheckinDate(moment(val).format("DD/MM/YYYY"));
    setColorCheckinDate(null);
  };
  //Gio check in
  const [colorCheckinTime, setColorCheckinTime] = useState("#B2B2B2");
  const [checkinTime, setCheckinTime] = useState("hh:mm");
  const [checkinTimePickerVisible, setCheckinTimePickerVisible] =
    useState(false);
  const showTimePickerCheckin = () => {
    setCheckinTimePickerVisible(true);
  };

  const hideTimePickerCheckin = () => {
    setCheckinTimePickerVisible(false);
  };

  const handleConfirmCheckinTime = (val) => {
    hideTimePickerCheckin();
    setCheckinTime(moment(val).format("HH:mm"));
    setColorCheckinTime(null);
  };
  //Ngay check out
  const [colorCheckoutDate, setColorCheckoutDate] = useState("#B2B2B2");
  const [checkoutDate, setCheckoutDate] = useState("dd/mm/yyyy");
  const [checkoutDatePickerVisible, setCheckoutDatePickerVisible] =
    useState(false);
  const showDatePickerCheckout = () => {
    setCheckoutDatePickerVisible(true);
  };

  const hideDatePickerCheckout = () => {
    setCheckoutDatePickerVisible(false);
  };

  const handleConfirmCheckoutDate = (val) => {
    hideDatePickerCheckout();
    setCheckoutDate(moment(val).format("DD/MM/YYYY"));
    setColorCheckoutDate(null);
  };
  //Gio check out
  const [colorCheckoutTime, setColorCheckoutTime] = useState("#B2B2B2");
  const [checkoutTime, setCheckoutTime] = useState("hh:mm");
  const [checkoutTimePickerVisible, setCheckoutTimePickerVisible] =
    useState(false);
  const showTimePickerCheckout = () => {
    setCheckoutTimePickerVisible(true);
  };

  const hideTimePickerCheckout = () => {
    setCheckoutTimePickerVisible(false);
  };

  const handleConfirmCheckoutTime = (val) => {
    hideTimePickerCheckout();
    setCheckoutTime(moment(val).format("HH:mm"));
    setColorCheckoutTime(null);
  };
  //
  const defaultAvatar =
    "data:image/png;base64,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";

  const [startKMImage, setStartKMImage] = useState(defaultAvatar);
  const [endKMImage, setEndKMImage] = useState(defaultAvatar);

  //
  const [numKMStart, setNumKMStart] = useState("");
  const [numKMEnd, setNumKMEnd] = useState("");

  //
  const [signature, setSignature] = useState("");

  const handleOK = (signature) => {
    // console.log(signature);
    // onCallBack(signature.replace("data:image/png;base64,", ""));
    setSignature(signature);
    setModalSignatureVisible(false);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };
  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();
  };
  const ref = useRef();
  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const [modalSignatureVisible, setModalSignatureVisible] = useState(false);
  const modalSignature = (
    <TVSControlPopup
      title={"Chữ ký tay"}
      isShow={modalSignatureVisible}
      onHide={() => setModalSignatureVisible(false)}
      minHeight={400}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "red",
        }}
      >
        <SignatureScreen
          onOK={handleOK}
          onEmpty={handleEmpty}
          descriptionText="signature"
          webStyle={style}
          dotSize={3}
          ref={ref}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          // backgroundColor: 'red',
        }}
      >
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={handleClear}
        >
          Clear
        </TVSButton>
        <TVSButton
          type={"primary"}
          icon={"check"}
          buttonStyle={"3"}
          onPress={handleConfirm}
        >
          Confirm
        </TVSButton>
      </View>
    </TVSControlPopup>
  );
  //
  const [dataEmp, setDataEmp] = useState([]);
  const [selectCodeNameEmp, setSelectCodeNameEmp] = useState(
    "Chọn người xác nhận"
  );
  const [selectCodeEmp, setSelectCodeEmp] = useState("");
  const onChangeEmp = (result) => {
    setSelectCodeNameEmp(result.code_nm);
    setSelectCodeEmp(result.code);

    setModalVisibleEmp(false);
    setColorEmp(null);
  };
  const [colorEmp, setColorEmp] = useState("#B2B2B2");
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);

  const modalEmp = (
    <TVSControlPopup
      title={"Chọn người xác nhận"}
      isShow={modalVisibleEmp}
      onHide={() => setModalVisibleEmp(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleEmp(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataEmp}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeEmp(item);
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
  const OnConfirmSubmit = () => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn trình ký?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => OnSubmit(),
        },
      ],
      { cancelable: false }
    );
  };
  const OnSubmit = () => {
    const pro = "UPDHRBS001001";
    const in_par = {
      p1_varchar2: route_pk,
      p2_varchar2: car_reg_pk,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    };

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
        if (rs.results == "S") {
          getDataMain(route_pk);
          showAlert(rs.data.status);
        } else {
          showAlert(rs.errorData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const OnValidate = () => {
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
          onPress: () => OnSave(),
        },
      ],
      { cancelable: false }
    );
  };
  const OnSave = () => {
    const pro = "UPDHRBS001000";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: route_pk,
      p3_varchar2: car_reg_pk,
      p4_varchar2:
        checkinDate == "dd/mm/yyyy"
          ? ""
          : moment(checkinDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p5_varchar2: checkinTime == "hh:mm" ? "" : checkinTime,
      p6_varchar2:
        checkoutDate == "dd/mm/yyyy"
          ? ""
          : moment(checkoutDate, "DD/MM/YYYY").format("YYYYMMDD"),
      p7_varchar2: checkoutTime == "hh:mm" ? "" : checkoutTime,
      p8_varchar2: numKMStart,
      p9_varchar2: numKMEnd,
      p10_varchar2:
        startKMImage == defaultAvatar
          ? ""
          : startKMImage.replace("data:image/png;base64,", ""),
      p11_varchar2:
        endKMImage == defaultAvatar
          ? ""
          : endKMImage.replace("data:image/png;base64,", ""),
      p12_varchar2: selectCodeEmp,
      p13_varchar2: signature.replace("data:image/png;base64,", ""),
      p14_varchar2: APP_VERSION,
      p15_varchar2: crt_by,
    };
    const out_par = {
      // p1_varchar2: "rtn_value",
    };
    sysFetch2(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        // if (rs == "Token Expired") {
        //   refreshNewToken("OnGetGridData");
        // }
        // if (rs != "Token Expired") {
        //   if (rs.results == "S") {
        //     showAlert(rs.data.rtn_value);
        //   } else {
        //     showAlert(rs.errorData);
        //   }
        // }
        if (rs.result == "F") {
          showAlert(rs.content);
        } else {
          getDataMain(route_pk);
          showAlert("Thành công");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //
  const OnChangeImage = async (type) => {
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
        console.log("granted ", granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Thông báo",
            "Hình ảnh được dùng để lưu vào hệ thống",
            [
              {
                text: "Hủy bỏ",
              },
              {
                text: "Chọn ảnh từ thư viện",
                onPress: () => {
                  OnTakeImage(type, "library");
                },
              },
              {
                text: "Chụp ảnh",
                onPress: () => {
                  OnTakeImage(type, "camera");
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
          "Hình ảnh được dùng để lưu vào hệ thống",
          [
            {
              text: "Chụp ảnh",
              onPress: () => {
                OnTakeImage(type, "camera");
              },
            },
            {
              text: "Chọn ảnh từ thư viện",
              onPress: () => {
                OnTakeImage(type, "library");
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

    // try {
    //   if (Platform.OS === "android") {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.CAMERA,
    //       {
    //         title: "Thông báo",
    //         message: "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
    //         buttonNegative: "Hủy bỏ",
    //         buttonPositive: "Xác nhận",
    //       }
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       OnTakeImage(type);
    //     } else {
    //       Alert.alert(
    //         "Thông báo",
    //         "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
    //         [{ text: "Đóng" }]
    //       );
    //     }
    //   } else {
    //     request(PERMISSIONS.IOS.CAMERA).then((result) => {
    //       if (result === "granted") {
    //         OnTakeImage(type);
    //       } else if (result === "blocked") {
    //         Alert.alert(
    //           "Thông báo",
    //           "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
    //           [{ text: "Đóng" }]
    //         );
    //       }
    //     });
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  const OptionsImage = {
    maxWidth: 450,
    maxHeight: 600,
    quality: 1,
    cameraType: "back",
    // cameraType: "front",
    includeBase64: true,
    mediaType: "photo",
    presentationStyle: "fullScreen",
  };
  const OnTakeImage = (type, typeImage) => {
    console.log(type, "-", typeImage);

    // dispatch(ShowGlobalLoading);
    if (type == "start") {
      console.log("case start");
      if (typeImage == "camera") {
        console.log("case camera");
        launchCamera(OptionsImage, (res) => {
          if (res.errorCode == "camera_unavailable") {
            ShowError("camera_unavailable");
          } else if (!res.didCancel) {
            dispatch(ShowGlobalLoading);
            setStartKMImage("data:image/png;base64," + res.assets[0].base64);
            dispatch(HideGlobalLoading);
          }
        });
      } else if (typeImage == "library") {
        console.log("case launchImageLibrary");
        launchImageLibrary(OptionsImage, (res) => {
          if (res.errorCode == "camera_unavailable") {
            ShowError("camera_unavailable");
          } else if (!res.didCancel) {
            dispatch(ShowGlobalLoading);
            setStartKMImage("data:image/png;base64," + res.assets[0].base64);
            dispatch(HideGlobalLoading);
          }
        });
      }
      // await setStartKMImage("data:image/png;base64," + res.assets[0].base64);
    } else {
      if (typeImage == "camera") {
        launchCamera(OptionsImage, (res) => {
          if (res.errorCode == "camera_unavailable") {
            ShowError("camera_unavailable");
          } else if (!res.didCancel) {
            dispatch(ShowGlobalLoading);
            setEndKMImage("data:image/png;base64," + res.assets[0].base64);
            dispatch(HideGlobalLoading);
          }
        });
      } else if (typeImage == "library") {
        launchImageLibrary(OptionsImage, (res) => {
          if (res.errorCode == "camera_unavailable") {
            ShowError("camera_unavailable");
          } else if (!res.didCancel) {
            dispatch(ShowGlobalLoading);
            setEndKMImage("data:image/png;base64," + res.assets[0].base64);
            dispatch(HideGlobalLoading);
          }
        });
      }
      // await setEndKMImage("data:image/png;base64," + res.assets[0].base64);
    }
  };
  //

  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);

  return (
    <Block flex>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
          marginBottom: 20,
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpanded(!expanded);
          }}
        >
          <View
            style={{
              // height: 60,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              // marginBottom: expanded ? 0 : 10,
              borderRadius: 8,
              flexDirection: "row",
              backgroundColor: Color.tabColor,
              paddingVertical: 5,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View>
                <Text
                  numberOfLines={1}
                  paddingLeft={10}
                  height={60}
                  fontFamily={"Roboto-Medium"}
                  style={{
                    // fontWeight: 'bold',
                    // fontSize: 17,
                    color: Color.mainColor,
                  }}
                >
                  Thông tin chi tiết
                </Text>
              </View>
            </View>
            <View
              style={{
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={25}
                color={Color.mainColor}
                name={expanded ? "chevron-up" : "chevron-down"}
              />
            </View>
          </View>
        </TouchableOpacity>
        {expanded && dataMain.length > 0 && (
          <View
            style={{
              paddingTop: 5,
              marginHorizontal: 5,
              // paddingBottom: 10,
              // flex: 1,
            }}
          >
            {dataMain.map((x) => (
              <ItemMain item={x} />
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpanded2(!expanded2);
          }}
        >
          <View
            style={{
              // height: 60,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              // marginBottom: expanded2 ? 0 : 10,
              borderRadius: 8,
              flexDirection: "row",
              backgroundColor: Color.tabColor,
              paddingVertical: 5,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View>
                <Text
                  numberOfLines={1}
                  paddingLeft={10}
                  height={60}
                  fontFamily={"Roboto-Medium"}
                  style={{
                    // fontWeight: 'bold',
                    // fontSize: 17,
                    color: Color.mainColor,
                  }}
                >
                  Chi phí
                </Text>
              </View>
            </View>
            <View
              style={{
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={25}
                color={Color.mainColor}
                name={expanded2 ? "chevron-up" : "chevron-down"}
              />
            </View>
          </View>
        </TouchableOpacity>
        {expanded2 && dataCost.length > 0 && (
          <View
            style={{
              paddingTop: 5,
              marginHorizontal: 10,
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ borderRadius: 2 }}
            >
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    flex: 1,
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
                      width: 150,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Chức năng</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: 150,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Loại chi phí</Text>
                  </View>
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
                    <Text>Số tiền</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: 200,
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
                      flex: 1,
                      width: 100,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Xem ảnh</Text>
                  </View>
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
                    <Text>Duyệt</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: 200,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Ghi chú duyệt</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: 130,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Ngày duyệt</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: 200,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Người duyệt</Text>
                  </View>
                </View>
                {/*  */}
                {dataCost.map((x) => (
                  <View
                    style={{
                      flex: 1,
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
                        width: 150,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>{x.cost_code_nm}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        width: 150,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>{x.cost_code_nm}</Text>
                    </View>
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
                      <Text>{x.amount_cv}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        width: 200,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>{x.description}</Text>
                    </View>
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
                      <Text>Xem ảnh</Text>
                    </View>
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
                      <Text>{x.approved_yn}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        width: 200,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>{x.approve_note}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        width: 130,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>{x.approved_dt}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        width: 200,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>{x.approved_by}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpanded3(!expanded3);
          }}
        >
          <View
            style={{
              // height: 60,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              marginBottom: expanded3 ? 0 : 10,
              borderRadius: 8,
              flexDirection: "row",
              backgroundColor: Color.tabColor,
              paddingVertical: 5,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View>
                <Text
                  numberOfLines={1}
                  paddingLeft={10}
                  height={60}
                  fontFamily={"Roboto-Medium"}
                  style={{
                    // fontWeight: 'bold',
                    // fontSize: 17,
                    color: Color.mainColor,
                  }}
                >
                  Danh sách người đi xe
                </Text>
              </View>
            </View>
            <View
              style={{
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={25}
                color={Color.mainColor}
                name={expanded3 ? "chevron-up" : "chevron-down"}
              />
            </View>
          </View>
        </TouchableOpacity>
        {expanded3 && dataMain.length > 0 && (
          <View
            style={{
              paddingTop: 5,
              paddingBottom: 10,
              // flex: 1,
            }}
          >
            {dataMain.map((x) => (
              <ItemMain item={x} />
            ))}
          </View>
        )}
        <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
          <Block
            style={{ flex: 1, marginRight: 5 }}
            height={70}
            row
            justifyContent={"space-between"}
          >
            <Button nextScreen={showTimePickerCheckin} column flex>
              <Block row marginBottom={4}>
                <Text style={{ color: Color.mainColor }}>Giờ check in</Text>
              </Block>
              <Block
                row
                justifyContent={"space-between"}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.white,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colorCheckinTime }}>{checkinTime}</Text>
                <IconTime />
              </Block>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={checkinTimePickerVisible}
              mode="time"
              hideTitleContainerIOS={false}
              date={new Date()}
              locale="vi_VN"
              onConfirm={handleConfirmCheckinTime}
              onCancel={hideTimePickerCheckin}
            />
          </Block>
          <Block
            style={{ flex: 1, marginLeft: 5 }}
            height={70}
            row
            justifyContent={"space-between"}
          >
            <Button nextScreen={showDatePickerCheckin} column flex>
              <Block row marginBottom={4}>
                <Text style={{ color: Color.mainColor }}>Ngày check in</Text>
              </Block>
              <Block
                row
                justifyContent={"space-between"}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.white,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colorCheckinDate }}>{checkinDate}</Text>
                <IconDate />
              </Block>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={checkinDatePickerVisible}
              mode="date"
              hideTitleContainerIOS={false}
              date={
                checkinDate !== "dd/mm/yyyy"
                  ? new Date(moment(checkinDate, "DD/MM/YYYY"))
                  : new Date()
              }
              locale="vi_VN"
              onConfirm={handleConfirmCheckinDate}
              onCancel={hideDatePickerCheckin}
            />
          </Block>
        </View>
        {/* Check out */}
        <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
          <Block
            style={{ flex: 1, marginRight: 5 }}
            height={70}
            row
            justifyContent={"space-between"}
          >
            <Button nextScreen={showTimePickerCheckout} column flex>
              <Block row marginBottom={4}>
                <Text style={{ color: Color.mainColor }}>Giờ check out</Text>
              </Block>
              <Block
                row
                justifyContent={"space-between"}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.white,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colorCheckoutTime }}>{checkoutTime}</Text>
                <IconTime />
              </Block>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={checkoutTimePickerVisible}
              mode="time"
              hideTitleContainerIOS={false}
              date={new Date()}
              locale="vi_VN"
              onConfirm={handleConfirmCheckoutTime}
              onCancel={hideTimePickerCheckout}
            />
          </Block>
          <Block
            style={{ flex: 1, marginLeft: 5 }}
            height={70}
            row
            justifyContent={"space-between"}
          >
            <Button nextScreen={showDatePickerCheckout} column flex>
              <Block row marginBottom={4}>
                <Text style={{ color: Color.mainColor }}>Ngày check out</Text>
              </Block>
              <Block
                row
                justifyContent={"space-between"}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.white,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colorCheckoutDate }}>{checkoutDate}</Text>
                <IconDate />
              </Block>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={checkoutDatePickerVisible}
              mode="date"
              hideTitleContainerIOS={false}
              date={
                checkoutDate !== "dd/mm/yyyy"
                  ? new Date(moment(checkoutDate, "DD/MM/YYYY"))
                  : new Date()
              }
              locale="vi_VN"
              onConfirm={handleConfirmCheckoutDate}
              onCancel={hideDatePickerCheckout}
            />
          </Block>
        </View>
        {/* KM BD */}
        <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={{ color: Color.mainColor }}>Số km bắt đầu</Text>
            <View style={{ marginTop: 5 }}>
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: Color.white,
                  padding: Platform.OS == "android" ? 5 : 10,
                  borderRadius: 8,
                }}
                value={numKMStart}
                placeholder="0"
                onChangeText={(num) => setNumKMStart(num)}
                keyboardType={"numeric"}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              onPress={() => OnChangeImage("start")}
              style={{ alignItems: "center" }}
            >
              <Image
                style={{
                  width: "60%",
                  borderRadius: 10,
                  resizeMode: "contain",
                  height: 120,
                }}
                source={{ uri: startKMImage }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={{ color: Color.mainColor }}>Số km kết thúc</Text>
            <View style={{ marginTop: 5 }}>
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: Color.white,
                  padding: Platform.OS == "android" ? 5 : 10,
                  borderRadius: 8,
                }}
                value={numKMEnd}
                placeholder="0"
                onChangeText={(num) => setNumKMEnd(num)}
                keyboardType={"numeric"}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              onPress={() => OnChangeImage("end")}
              style={{ alignItems: "center" }}
            >
              <Image
                style={{
                  width: "60%",
                  borderRadius: 10,
                  resizeMode: "contain",
                  height: 120,
                }}
                source={{ uri: endKMImage }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Block style={{ margin: 5 }}>
          <Block
            style={{
              flexDirection: "row",
              paddingBottom: 5,
              paddingLeft: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ color: Color.mainColor }}>Người xác nhận</Text>
          </Block>
          <Button
            nextScreen={() => setModalVisibleEmp(true)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: Color.white,
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
              <Text style={{ color: colorEmp }}>{selectCodeNameEmp}</Text>
            </Block>
            <Block style={{ justifyContent: "center", paddingRight: 10 }}>
              <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
            </Block>
          </Button>
          {modalEmp}
        </Block>
        <View style={{ margin: 5 }}>
          <View style={{ marginLeft: 5, paddingBottom: 5 }}>
            <Text style={{ color: Color.mainColor }}>Chữ ký</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                // width: 335,
                height: 114,
                backgroundColor: Color.white,
                justifyContent: "center",
                alignItems: "center",
                // margin: 10,
                borderRadius: 8,
              }}
              onPress={() => setModalSignatureVisible(true)}
            >
              {signature ? (
                <Image
                  resizeMode={"contain"}
                  style={{ width: 335, height: 114 }}
                  source={{ uri: signature }}
                />
              ) : null}
            </TouchableOpacity>
            {modalSignature}
          </View>
        </View>
                
        {/* KM BD */}
        <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={{ color: Color.mainColor }}>Ghi chú</Text>
            <View style={{ marginTop: 5 }}>
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: Color.white,
                  padding: Platform.OS == "android" ? 5 : 10,
                  borderRadius: 8,
                }}
                multiline={true}
                value={ghiChu}
                placeholder={"Nhập ghi chú"}
                onChangeText={setGhiChu}
              />
            </View>
            <TouchableOpacity
              // onPress={() => OnChangeImage("start")}
              style={{ alignItems: "center" }}
            >
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          marginHorizontal: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          paddingBottom: 10,
        }}
      >
        <View>
          <TVSButton
            onPress={() => {
              OnValidate();
            }}
            icon={"content-save"}
            buttonStyle={"3"}
            minWidth={150}
          >
            Sao lưu
          </TVSButton>
        </View>
        <View>
          <TVSButton
            onPress={() => {
              OnConfirmSubmit();
            }}
            buttonStyle={"3"}
            type={"success"}
            icon={"check"}
            minWidth={150}
          >
            Trình ký
          </TVSButton>
        </View>
      </View>
    </Block>
  );
};

export default ChiTietChuyenDi;
