import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import TVSHeader from "../../../../components/Tvs/Header";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../config/Pro";
import sysFetch from "../../../../services/fetch_v1";
import sysFetch2 from "../../../../services/fetch_v1/fetch2";
import Block from "../../../../components/Block";
import { RNCamera } from "react-native-camera";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
import moment from "moment/moment";

const widthScreen = Dimensions.get("window").width;

const OptionsImage = {
  // maxWidth: 450,
  // maxHeight: 600,
  quality: 2,
  cameraType: "back",
  includeBase64: true,
  mediaType: "photo",
};

const QRDetail = ({ navigation: { goBack }, route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { pk_detail } = route.params;
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  let urlImageLogin;
  let fullnameLogin;
  let empIdLogin;
  let thr_emp_pk = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    urlImageLogin = loginReducers.data.data.avatar;
    fullnameLogin = loginReducers.data.data.full_name;
    empIdLogin = loginReducers.data.data.emp_id;
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}

  const [itemChiTiet, setItemChiTiet] = useState(undefined);
  const [dataResult, setDataResult] = useState(null);
  const [valueQR, setValueQR] = useState("");

  useEffect(() => {
    fetchData(false);
  }, []);

  const fetchData = (isUpdate) => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRQR001000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "data",
    };
    console.log("in_par", in_par);
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
        console.log("pk_detail ", rs);
        dispatch(HideGlobalLoading);
        setIsSaveButton(false);
        if (isUpdate && itemChiTiet.type == "CCCD") {
          Alert.alert("Thông báo", "Cập nhật thông tin CCCD thành công.");
        } else if (isUpdate && itemChiTiet.type == "TNV") {
          Alert.alert("Thông báo", "Cập nhật thông tin nhân viên thành công.");
        }
        setVisibleCamera(false);
        if (rs == "Token Expired") {
          // refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (pk_detail == 2) {
              const qr_cccd = rs.data.data[0].qr_cccd
                ? rs.data.data[0].qr_cccd
                : "";
              //"095094006758|385661012|Nguyễn Trọng Hiếu|15101994|Nam|Ấp Cầu Đỏ, Vĩnh Lộc, Hồng Dân, Bạc Liêu|09082021"
              setValueQR(qr_cccd);
              if (qr_cccd != "") {
                const itemTemp = {
                  soCCCD: qr_cccd.split("|")[0],
                  soCMND: qr_cccd.split("|")[1],
                  hoTen: qr_cccd.split("|")[2],
                  ngaySinh: moment(qr_cccd.split("|")[3], "DDMMYYYY").format(
                    "DD/MM/YYYY"
                  ),
                  gioiTinh: qr_cccd.split("|")[4],
                  diaChi: qr_cccd.split("|")[5],
                  ngayCap: moment(qr_cccd.split("|")[6], "DDMMYYYY").format(
                    "DD/MM/YYYY"
                  ),
                  type: "CCCD",
                  avatar: urlImageLogin,
                  img1: rs.data.data[0].cccd_mattruoc,
                  img2: rs.data.data[0].cccd_matsau,
                };
                setItemChiTiet(itemTemp);
              } else {
                setItemChiTiet(null);
              }
            }
            if (pk_detail == 1) {
              const itemTemp = {
                pk: rs.data.data[0].pk,
                avatar: rs.data.data[0].tco_company_logo
                  ? rs.data.data[0].tco_company_logo
                  : urlImageLogin,
                name: rs.data.data[0].full_name
                  ? rs.data.data[0].full_name
                  : fullnameLogin,
                code: rs.data.data[0].emp_id,
                type: "TNV",
                chucDanh: rs.data.data[0].chuc_danh
                  ? rs.data.data[0].chuc_danh
                  : "",
                phongBan: rs.data.data[0].phong_ban
                  ? rs.data.data[0].phong_ban
                  : "",
                ngayVaoLam: rs.data.data[0].begin_contract
                  ? moment(rs.data.data[0].begin_contract, "YYYYMMDD").format(
                      "DD/MM/YYYY"
                    )
                  : "",
                img1: rs.data.data[0].thenhanvien_mattruoc,
                img2: rs.data.data[0].thenhanvien_matsau,
              };
              const pk = rs.data.data[0].pk ? rs.data.data[0].pk : "";
              const code = rs.data.data[0].emp_id ? rs.data.data[0].emp_id : "";
              const type = "TNV";
              const name = rs.data.data[0].full_name
                ? rs.data.data[0].full_name
                : fullnameLogin;
              const chucDanh = rs.data.data[0].chuc_danh
                ? rs.data.data[0].chuc_danh
                : "";
              const phongBan = rs.data.data[0].phong_ban
                ? rs.data.data[0].phong_ban
                : "";
              const ngayVaoLam = rs.data.data[0].begin_contract
                ? moment(rs.data.data[0].begin_contract, "YYYYMMDD").format(
                    "DD/MM/YYYY"
                  )
                : "";
              const valueQRTemp =
                type +
                "*|*" +
                pk +
                "*|*" +
                code +
                "*|*" +
                name +
                "*|*" +
                chucDanh +
                "*|*" +
                phongBan +
                "*|*" +
                ngayVaoLam;
              setValueQR(valueQRTemp);
              setItemChiTiet(itemTemp);

              const dataTemp = {
                name: fullnameLogin,
                empId: empIdLogin,
                chucDanh,
                phongBan,
                ngayVaoLam,
                tco_company_name: rs.data.data[0].tco_company_name,
                logo: rs.data.data[0].tco_company_logo,
              };
              setDataResult(dataTemp);
            }
          } else {
            setItemChiTiet(null);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setItemChiTiet(null);
        dispatch(HideGlobalLoading);
      });
  };

  const ItemThongTin = (label, value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "black",
            opacity: 0.8,
            flex: 1,
          }}
        >
          {label}:&nbsp;
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "black",
            opacity: 0.8,
            flex: 1,
          }}
        >
          {value}
        </Text>
      </View>
    );
  };

  const ItemImage = (url, face) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectImageOption(url, face);
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 6,
            width: widthScreen - 24,
            height: 250,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: "data:image/png;base64," + url }}
            style={{
              width: widthScreen - 24,
              height: 250,
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const ItemCCCDView = (lable, content) => {
    return (
      <View style={{ marginBottom: 5 }}>
        <Text
          style={{
            fontSize: 16,
            color: "black",
            opacity: 0.6,
          }}
        >
          {lable}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "black",
            opacity: 0.6,
            fontWeight: "bold",
          }}
        >
          {content}
        </Text>
      </View>
    );
  };

  //Quet ma QR de them CCCD/CMND dien tu
  //QR Scan
  const [visibleCamera, setVisibleCamera] = useState(false);
  const cameraRef = useRef(null);
  const [isSaveButton, setIsSaveButton] = useState(false);

  const handlePermissionCamera = async () => {
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
          setVisibleCamera(true);
        } else {
          Alert.alert(
            "Thông báo",
            "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            [{ text: "Đóng" }]
          );
        }
      } else if (Platform.OS === "ios") {
        setVisibleCamera(true);
      } else {
        Alert.alert("Thông báo", "Thiết bị không hỗ trợ chức năng này.", [
          { text: "Đóng" },
        ]);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const onSuccess = async (e) => {
    console.log("log e: ", e.data);
    //095094006758|385661012|Nguyễn Trọng Hiếu|15101994|Nam|Ấp Cầu Đỏ, Vĩnh Lộc, Hồng Dân, Bạc Liêu|09082021
    //075079007004|026044997|Nguyễn Vũ Phong|11041979|Nam|320/22/15, Đường Tth15, Tổ 24, Khu Phố 3A, P.Tân Thới Hiệp, Quận 12, TP.Hồ Chí Minh|05082022
    //046096000141|191891155|Trần Quang Tiến|30051996|Nam|137/19 Trường Chinh, An Đông,Thành phố Huế,Thừa Thiên Huế|09022021
    try {
      setValueQR(e.data);
      const itemTemp = {
        soCCCD: e.data.split("|")[0],
        soCMND: e.data.split("|")[1],
        hoTen: e.data.split("|")[2],
        ngaySinh: moment(e.data.split("|")[3], "DDMMYYYY").format("DD/MM/YYYY"),
        gioiTinh: e.data.split("|")[4],
        diaChi: e.data.split("|")[5],
        ngayCap: moment(e.data.split("|")[6], "DDMMYYYY").format("DD/MM/YYYY"),
        type: "CCCD",
        avatar: urlImageLogin,
      };
      setItemChiTiet(itemTemp);
      setVisibleCamera(false);
      setIsSaveButton(true);
    } catch (error) {
      setVisibleCamera(false);
      setItemChiTiet(null);
      Alert.alert("Thông báo", "Quét mã thất bại. Xin thử lại.");
    }
  };

  const saveData = (qr_cccd) => {
    const pro = "UPDHRQR001000";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: thr_emp_pk,
      p3_varchar2: qr_cccd,
      p4_varchar2: itemChiTiet.img1
        .toString()
        .replace("data:image/png;base64,", ""),
      p5_varchar2: itemChiTiet.img2
        .toString()
        .replace("data:image/png;base64,", ""),
      p6_varchar2: itemChiTiet.type,
    };
    const out_par = {
      p1_varchar2: "status",
    };
    console.log("in_par", {
      p1_varchar2: "UPDATE",
      p2_varchar2: thr_emp_pk,
      p3_varchar2: qr_cccd,
      p6_varchar2: itemChiTiet.type,
    });

    sysFetch2(API, { pro, in_par, out_par }, tokenLogin)
      .then((rs) => {
        console.log("rs------------>", rs);
        dispatch(HideGlobalLoading);
        setVisibleCamera(false);
        if (rs == "Token Expired") {
          // refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.result == "S") {
            fetchData(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  //----------------------CAMERA----------------------
  const cartFace = useRef(null);
  const [isShowDialogChooseImage, setIsShowDialogChooseImage] = useState(false);

  const showDialogChooseImage = (face) => {
    if (face == "front") {
      cartFace.current = "front";
    } else {
      cartFace.current = "back";
    }
    setIsShowDialogChooseImage(true);
  };

  const PopupChooseAvatar = () => {
    return (
      <TVSControlPopup
        title={"Chọn ảnh đại diện"}
        isShow={isShowDialogChooseImage}
        onHide={() => setIsShowDialogChooseImage(false)}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            flexDirection: "column",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onChangeCamera();
            }}
          >
            <Text
              style={{
                fontSize: 16,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              Chụp ảnh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onChangeLibrary();
            }}
          >
            <Text
              style={{
                fontSize: 16,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              Chọn ảnh từ thư viện
            </Text>
          </TouchableOpacity>
        </View>
      </TVSControlPopup>
    );
  };

  const onChangeCamera = async () => {
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
          takePhoto();
        } else {
          Alert.alert(
            "Thông báo",
            "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            [{ text: "Đóng" }]
          );
        }
      } else if (Platform.OS === "ios") {
        takePhoto();
      } else {
        Alert.alert("Thông báo", "Thiết bị không hỗ trợ chức năng này.", [
          { text: "Đóng" },
        ]);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const takePhoto = () => {
    setIsShowDialogChooseImage(false);
    setTimeout(
      () =>
        launchCamera(OptionsImage, (res) => {
          if (res.errorCode == "camera_unavailable") {
            //   ShowError('camera_unavailable');
            Alert.alert("Thông báo", "camera_unavailable");
            return;
          } else if (!res.didCancel) {
            console.log("cartFace.current", cartFace.current);
            if (cartFace.current == "front") {
              const base64String = res.assets[0].base64;
              setItemChiTiet({
                ...itemChiTiet,
                img1: base64String,
              });
            }
            if (cartFace.current == "back") {
              const base64String = res.assets[0].base64;
              setItemChiTiet({
                ...itemChiTiet,
                img2: base64String,
              });
            }

            setIsSaveButton(true);
          }
        }),
      500
    );
  };

  const onChangeLibrary = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Thông báo",
            message: "Xin hãy cấp quyền truy cập thư viện ảnh cho ứng dụng.",
            buttonNegative: "Hủy bỏ",
            buttonPositive: "Xác nhận",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          selectImage();
        } else {
          Alert.alert(
            "Thông báo",
            "Xin hãy cấp quyền truy cập thư viện ảnh cho ứng dụng.",
            [{ text: "Đóng" }]
          );
        }
      } else if (Platform.OS === "ios") {
        selectImage();
      } else {
        Alert.alert("Thông báo", "Thiết bị không hỗ trợ chức năng này.", [
          { text: "Đóng" },
        ]);
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const selectImage = () => {
    setIsShowDialogChooseImage(false);
    setTimeout(() => {
      launchImageLibrary(OptionsImage, (res) => {
        if (res.errorCode == "camera_unavailable") {
          Alert.alert("Thông báo", "camera_unavailable");
        } else if (!res.didCancel) {
          console.log("cartFace.current", cartFace.current);
          if (cartFace.current == "front") {
            const base64String = res.assets[0].base64;
            setItemChiTiet({
              ...itemChiTiet,
              img1: base64String,
            });
          }
          if (cartFace.current == "back") {
            const base64String = res.assets[0].base64;
            setItemChiTiet({
              ...itemChiTiet,
              img2: base64String,
            });
          }

          setIsSaveButton(true);
        }
      });
    }, 500);
  };

  //---------------------XEM HINH ANH---------------------
  const [visibleImage, setVisibleImage] = useState(false);
  const [imageShow, setImageShow] = useState("");
  const [face, setFace] = useState("");

  const selectImageOption = (url, face) => {
    setFace(face);
    setImageShow(url);
    setVisibleImage(true);
  };

  const modalImage = () => {
    return (
      <Modal visible={visibleImage} transparent={true}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: "data:image/png;base64," + imageShow }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 20,
              right: 10,
              left: 10,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisibleImage(false);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 30,
                borderColor: "white",
                borderWidth: 1,
                width: 100,
                alignSelf: "center",
                marginRight: 10,
              }}
            >
              <Text style={{ color: "white" }}>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setVisibleImage(false);
                showDialogChooseImage(face);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 30,
                backgroundColor: Color.mainColor,
                width: 100,
                alignSelf: "center",
              }}
            >
              <Text style={{ color: "white" }}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <TVSHeader goBack={goBack}>
        {pk_detail == 2 ? "CCCD/CMND" : "QR Nhân viên"}
      </TVSHeader>

      {/* Form chinh */}
      {!visibleCamera && !isShowDialogChooseImage && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginBottom:
              (pk_detail == 2 && itemChiTiet) || isSaveButton ? 60 : 0,
            paddingHorizontal: 12,
          }}
        >
          {itemChiTiet && (
            <View
              style={{
                flex: 1,
                paddingVertical: 12,
              }}
            >
              {/* QR code */}
              <View style={{ marginBottom: 20 }}>
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      opacity: 0.8,
                      marginBottom: 10,
                    }}
                  >
                    Mã QR
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <QRCode
                    value={
                      pk_detail == 2
                        ? valueQR
                          ? valueQR
                          : "null value"
                        : JSON.stringify(valueQR ? valueQR : "null value")
                    }
                    // logo={{ uri: 'data:image/png;base64,' + itemChiTiet.avatar }}
                    // logoSize={36}
                    // logoBorderRadius={36}
                    // logoBackgroundColor={Color.mainColor}
                    size={220}
                    ecl="L"
                  />
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      opacity: 0.6,
                    }}
                  >
                    {itemChiTiet.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      opacity: 0.6,
                    }}
                  >
                    Quét mã QR để xem thông tin
                  </Text>
                </View>
              </View>

              {/* Thông tin chi tiết */}
              <View style={{ marginBottom: 20 }}>
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      opacity: 0.8,
                      marginBottom: 10,
                    }}
                  >
                    {pk_detail == 2
                      ? "Thẻ CCCD/CMND điện tử"
                      : "Thẻ nhân viên điện tử"}
                  </Text>
                </View>

                {itemChiTiet.type == "CCCD" && (
                  <View>
                    <View
                      style={{
                        width: "100%",
                        overflow: "hidden",
                        borderRadius: 8,
                        borderColor: "#ddd",
                        borderWidth: 2,
                      }}
                    >
                      <View
                        style={{
                          top: -80,
                          left: -120,
                          right: 0,
                          bottom: 0,
                          position: "absolute",
                        }}
                      >
                        <Image
                          source={require("../../../../assets/images/bg_cccd.jpg")}
                          style={{
                            resizeMode: "contain",
                            width: "150%",
                            height: 500,
                            opacity: 0.1,
                          }}
                        />
                      </View>
                      <View style={{ padding: 15 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {ItemCCCDView("Số CCCD", itemChiTiet.soCCCD)}
                          <View>
                            <Image
                              source={require("../../../../assets/images/logo_dang.jpg")}
                              style={{
                                width: 50,
                                height: 50,
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        </View>
                        {ItemCCCDView("Số CMND", itemChiTiet.soCMND)}
                        {ItemCCCDView("Họ và tên", itemChiTiet.hoTen)}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {ItemCCCDView("Giới tính", itemChiTiet.gioiTinh)}
                          {ItemCCCDView("Ngày sinh", itemChiTiet.ngaySinh)}
                        </View>

                        {ItemCCCDView("Nơi thường trú", itemChiTiet.diaChi)}
                        {ItemCCCDView("Ngày cấp CCCD", itemChiTiet.ngayCap)}
                      </View>
                    </View>
                    <View style={{}}>
                      <Text
                        style={{
                          opacity: 0.6,
                          marginTop: 10,
                        }}
                      >
                        * Lưu ý: Thẻ CCCD điện tử chỉ có giá trị tham khảo,
                        không có giá trị thay thế thẻ CCCD
                      </Text>
                    </View>
                  </View>
                )}
                {itemChiTiet.type == "TNV" && (
                  <View>
                    {dataResult ? (
                      <View style={{}}>
                        <View
                          style={{
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: "#ddd",
                            overflow: "hidden",
                          }}
                        >
                          {/* Header */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                borderRightColor: "#ddd",
                                borderRightWidth: 2,
                                paddingHorizontal: 10,
                              }}
                            >
                              <Image
                                source={{
                                  uri:
                                    "data:image/png;base64," + dataResult.logo,
                                }}
                                style={{
                                  width: "100%",
                                  height: 50,
                                  resizeMode: "contain",
                                }}
                              />
                            </View>
                            <View
                              style={{
                                flex: 3,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 10,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  color: "black",
                                  opacity: 0.6,
                                  textAlign: "center",
                                }}
                              >
                                {dataResult.tco_company_name
                                  ? dataResult.tco_company_name
                                  : ""}
                              </Text>
                            </View>
                          </View>

                          {/* Body */}
                          <View
                            style={{
                              borderTopColor: "#ddd",
                              borderTopWidth: 2,
                            }}
                          >
                            <View style={{}}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: "bold",
                                  color: "black",
                                  opacity: 0.6,
                                  textAlign: "center",
                                  marginTop: 10,
                                }}
                              >
                                THẺ NHÂN VIÊN ĐIỆN TỬ
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  padding: 10,
                                }}
                              >
                                <Image
                                  source={{ uri: urlImageLogin }}
                                  style={{
                                    width: "100%",
                                    height: 90,
                                    resizeMode: "contain",
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  flex: 3,
                                  padding: 10,
                                }}
                              >
                                {ItemThongTin("Họ và tên", fullnameLogin)}
                                {ItemThongTin("Mã nhân viên", empIdLogin)}
                                {ItemThongTin("Chức danh", dataResult.chucDanh)}
                                {ItemThongTin("Phòng ban", dataResult.phongBan)}
                                {ItemThongTin(
                                  "Ngày vào",
                                  dataResult.ngayVaoLam
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>

              {/* Hinh anh */}
              <View
                style={{
                  // flexDirection: 'row',
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    opacity: 0.8,
                    marginBottom: 10,
                  }}
                >
                  Ảnh mặt trước
                </Text>
                {itemChiTiet.img1 ? (
                  ItemImage(itemChiTiet.img1, "front")
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      showDialogChooseImage("front");
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 6,
                        height: 250,
                        borderRadius: 8,
                        overflow: "hidden",
                        borderWidth: 2,
                        borderColor: "#ddd",
                      }}
                    >
                      <Icon
                        name="camera-plus-outline"
                        size={50}
                        style={{
                          opacity: 0.6,
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    opacity: 0.8,
                    marginBottom: 10,
                  }}
                >
                  Ảnh mặt sau
                </Text>
                {itemChiTiet.img2 ? (
                  ItemImage(itemChiTiet.img2, "back")
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      showDialogChooseImage("back");
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 6,
                        height: 250,
                        borderRadius: 8,
                        overflow: "hidden",
                        borderWidth: 2,
                        borderColor: "#ddd",
                      }}
                    >
                      <Icon
                        name="camera-plus-outline"
                        size={50}
                        style={{
                          opacity: 0.6,
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          {pk_detail == 2 && itemChiTiet == null ? (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  opacity: 0.8,
                  textAlign: "center",
                  marginRight: 2,
                }}
              >
                Bạn chưa có thẻ CCCD/CMND điện tử ?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="qrcode-scan"
                  size={16}
                  style={{
                    marginRight: 2,
                    color: Color.mainColor,
                  }}
                  onPress={() => {
                    handlePermissionCamera();
                  }}
                />

                <Text
                  onPress={() => {
                    handlePermissionCamera();
                  }}
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Color.mainColor,
                    textAlign: "center",
                    textDecorationLine: "underline",
                  }}
                >
                  Quét QR CCCD ngay.
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}

      {/* Quet QR */}
      {visibleCamera && (
        <Block style={{ flex: 1 }}>
          <RNCamera
            ref={cameraRef}
            style={{ flex: 1 }}
            maxZoom={0.5}
            // zoom={Platform.OS === "ios" ? 0 : 0.5}
            zoom={0}
            onBarCodeRead={onSuccess}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  width: "100%",
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: "20%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                />
                <View
                  style={{
                    borderWidth: 2,
                    flex: 1,
                    borderColor: Color.mainColor,
                  }}
                />
                <View
                  style={{
                    width: "20%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  width: "100%",
                }}
              />
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                Di chuyển camera gần mã QR để quét
              </Text>
              <TouchableOpacity
                style={{
                  marginBottom: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: Color.mainColor,
                }}
                onPress={() => setVisibleCamera(false)}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          </RNCamera>
        </Block>
      )}

      {/* Lay hinh anh */}
      {isShowDialogChooseImage && <PopupChooseAvatar />}

      {/* Button */}
      {pk_detail == 2 && itemChiTiet != null && !visibleCamera && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTopColor: "#ddd",
            borderTopWidth: 0.5,
            height: 60,
          }}
        >
          <TVSButton
            type="secondary"
            onPress={() => {
              handlePermissionCamera();
            }}
            icon={"qrcode-scan"}
            buttonStyle="3"
          >
            Quét QR CCCD của bạn
          </TVSButton>

          {isSaveButton && (
            <TVSButton
              type="primary"
              onPress={() => {
                saveData(valueQR);
              }}
              icon={"cloud-download-outline"}
              buttonStyle="3"
            >
              Sao lưu
            </TVSButton>
          )}
        </View>
      )}

      {pk_detail == 1 &&
        itemChiTiet != null &&
        !visibleCamera &&
        isSaveButton && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              width: "100%",
              borderTopColor: "#ddd",
              borderTopWidth: 0.5,
              height: 60,
            }}
          >
            <TVSButton
              type="primary"
              onPress={() => {
                saveData("");
              }}
              icon={"cloud-download-outline"}
              buttonStyle="3"
            >
              Sao lưu
            </TVSButton>
          </View>
        )}

      {/* Xem hinh anh */}
      {modalImage()}
    </View>
  );
};

export default QRDetail;
