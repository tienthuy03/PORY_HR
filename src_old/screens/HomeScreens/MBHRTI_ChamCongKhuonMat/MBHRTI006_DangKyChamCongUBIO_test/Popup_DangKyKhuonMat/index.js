import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid,
  Dimensions,
  FlatList,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Color } from "../../../../../colors/colortv";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";
import TVSButton from "../../../../../components/Tvs/Button";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";
import NetInfo from "@react-native-community/netinfo";
import sysFetch from "../../../../../services/fetch_v1";
import sysFetch2 from "../../../../../services/fetch_v1/fetch2";
import ShowError from "../../../../../services/errors";
import { updateUserAction } from "../../../../../actions";
import Button from "../../../../../components/Button";
import RNRestart from "react-native-restart";
import TVSSelect from "../../../../../components/Tvs/Select";
import { APP_VERSION } from "../../../../../config/Pro";
import Person from "../../../../../icons/Person";

import TVSControlPopupMachine from "../Popup_ChonMayChamCong";

const styles = StyleSheet.create({
  btnChupAnhTouch: {
    padding: 10,
    borderColor: Color.btnMain,
    borderWidth: 1,
    backgroundColor: Color.inputBackgroundColor,
    borderRadius: 5,
    marginTop: 10,
  },
  btnChupAnhText: {
    color: Color.mainColor,
  },
  viewInfo: {
    paddingVertical: 5,
    flexDirection: "row",
  },
  viewPicture: {
    justifyContent: "center",
    alignItems: "center",
  },
  picture: {
    height: 110,
    width: 110,
    borderRadius: 10,
    resizeMode: "stretch",
  },
  label: {
    fontSize: 15,
  },
  field: {
    fontSize: 15,
    paddingLeft: 10,
  },
  CheckBoxE: {
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
  CheckBoxD: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Color.mainColor,
    marginRight: 5,
  },
  fieldsetTitle: {
    position: "absolute",
    top: -12,
    backgroundColor: "white",
    left: 10,
  },
  footerLoading: {
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: 'row',
    flex: 1,
  },
});

const TVSControlPopupRegisterFace = ({
  isShow,
  onHide,
  children,
  title,
  maxHeight = Dimensions.get("screen").height,
  minHeight,
  backgroundColor = "white",
  empInfo,
  setDataOneItem,
  setModalOneItemVisible,
  onRequestToServer,
  dsNhanVien,
  setDsNhanVien = () => {},
}) => {
  const { width, height } = Dimensions.get("screen");
  const [flagInputCard, setFlagInputCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState("face");
  const [currentCardNo, setCurrentCardNo] = useState("");
  const [modalMachineVisible, setModalMachineVisible] = useState(false);
  const [flagMachine, setFlagMachine] = useState("N");

  const [isShowMachineFace, setIsShowMachineFace] = useState(false);
  const [currentMachineFace, setCurrentMachineFace] = useState({});
  const [flagShowSelectCtrFace, setFlagShowSelectCtrFace] = useState(false);

  const [isShowMachineFP, setIsShowMachineFP] = useState(false);
  const [currentMachineFP, setCurrentMachineFP] = useState([]);
  const [flagShowSelectCtrFP, setFlagShowSelectCtrFP] = useState(false);
  const [currentFP, setCurrentFP] = useState(0);
  const [type, setType] = useState("");

  const [FPImg1, setFPImg1] = useState("N");
  const [FPImg2, setFPImg2] = useState("N");
  const [FPImg3, setFPImg3] = useState("N");
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );

  let [dataMachine, setDataMachine] = useState([]);
  let arrStatusMachine = [];
  const [image, setImage] = useState(empInfo.image);
  const [oldImage, setOldImage] = useState("");
  const [changeImage, setChangeImage] = useState("N");
  const OptionsImage = {
    maxWidth: 450,
    maxHeight: 600,
    quality: 1,
    cameraType: "back",
    includeBase64: true,
    mediaType: "photo",
    presentationStyle: "fullScreen",
  };

  useEffect(() => {
    setImage(empInfo.image);
    setCurrentCardNo(empInfo.card_num);
    if (empInfo.fp_ubio_1_1 != "" && empInfo.fp_ubio_1_2 != "") {
      setFPImg1("Y");
    }

    if (empInfo.fp_ubio_2_1 != "" && empInfo.fp_ubio_2_2 != "") {
      setFPImg2("Y");
    }

    if (empInfo.fp_ubio_3_1 != "" && empInfo.fp_ubio_3_2 != "") {
      setFPImg3("Y");
    }
  }, [empInfo]);

  useEffect(() => {
    if (isShow) {
      setImage(empInfo.image);
      onLoadData(empInfo.pk);
      setOldImage(empInfo.image);
      setCurrentCardNo(empInfo.card_num);
      setFPImg1("N");
      setFPImg2("N");
      setFPImg3("N");
      if (empInfo.fp_ubio_1_1 != "" && empInfo.fp_ubio_1_2 != "") {
        setFPImg1("Y");
      }

      if (empInfo.fp_ubio_2_1 != "" && empInfo.fp_ubio_2_2 != "") {
        setFPImg2("Y");
      }

      if (empInfo.fp_ubio_3_1 != "" && empInfo.fp_ubio_3_2 != "") {
        setFPImg3("Y");
      }
      setIsShowMachineFP(false);
      setIsShowMachineFace(false);

      setFlagShowSelectCtrFP(false);
      setFlagShowSelectCtrFace(false);

      setCurrentMachineFP([]);
      setCurrentMachineFace({});
      setCurrentFP("0");
      setChangeImage("N");
      arrStatusMachine = [];
    }
    setLoading(false);
    setChecked("face");
    setFlagInputCard(false);
  }, [isShow]);

  const onLoadData = (empPk) => {
    const pro = "SELHRTI006002";
    const in_par = {
      p1_varchar2: empPk,
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
          p1_sys: "data",
        },
      },
      tokenLogin
    ).then((rs) => {
      console.log("rs SELHRTI006002", rs);
      if (rs == "Token Expired") {
        refreshNewToken("onLoadData", empPk);
      }
      if (rs != "Token Expired") {
        setDataMachine(rs.data.data);
      }
    });
  };

  const refreshNewToken = (obj, p1) => {
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
        if (obj == "onLoadData") {
          onLoadData(p1);
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

  const onChangeImage = async () => {
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
            "Hình ảnh được dùng để đăng ký xuống máy chấm công và lưu vào hệ thống",
            [
              {
                text: "Chụp ảnh",
                onPress: () => {
                  onTakePhoto("camera");
                },
              },
              {
                text: "Chọn ảnh từ thư viện",
                onPress: () => {
                  onTakePhoto("library");
                },
              },
              {
                text: "Hủy bỏ",
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
          "Hình ảnh được dùng để đăng ký xuống máy chấm công và lưu vào hệ thống",
          [
            {
              text: "Chụp ảnh",
              onPress: () => {
                onTakePhoto("camera");
              },
            },
            {
              text: "Chọn ảnh từ thư viện",
              onPress: () => {
                onTakePhoto("library");
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
  const onTakePhoto = (type) => {
    if (type == "camera") {
      launchCamera(OptionsImage, (res) => {
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          setImage(res.assets[0].base64);
          onSave(res.assets[0].base64);
        }
      });
    } else if (type == "library") {
      launchImageLibrary(OptionsImage, (res) => {
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          setImage(res.assets[0].base64);
          onSave(res.assets[0].base64);
        }
      });
    }
  };
  const onSave = (imageBase64) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn sao lưu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => {
            console.log("Cancel Pressed");
            setImage(oldImage);
          },
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                sysFetch2(
                  API,
                  {
                    pro: "UPDHRTI006000",
                    in_par: {
                      p1_varchar2: "UPDATE",
                      p2_varchar2: empInfo.id_num,
                      p3_varchar2: "",
                      p4_varchar2: imageBase64,
                      p5_varchar2: APP_VERSION,
                      p6_varchar2: crt_by,
                    },
                    out_par: {
                      p1_varchar2: "message",
                    },
                  },
                  tokenLogin
                )
                  .then((rs) => {
                    if (rs.result === "S") {
                      setChangeImage("Y");
                      Alert.alert("Thông báo", "Cập nhật hình ảnh thành công");
                    } else {
                      Alert.alert(
                        "Thông báo",
                        "Cập nhật hình ảnh thất bại. " + rs.errorData
                      );
                    }
                  })
                  .catch((error) => {
                    Alert.alert(
                      "Thông báo",
                      "Cập nhật hình ảnh thất bại. " + error
                    );
                  });
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
  const onSaveCard = () => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn sao lưu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => {
            setImage(oldImage);
          },
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                const pro = "UPDHRTI006000";
                const in_par = {
                  p1_varchar2: "UPDATE",
                  p2_varchar2: empInfo.id_num,
                  p3_varchar2: "",
                  p4_varchar2: currentCardNo,
                  p5_varchar2: APP_VERSION,
                  p6_varchar2: crt_by,
                };

                sysFetch(
                  API,
                  {
                    pro,
                    in_par,
                    out_par: {
                      p1_varchar2: "message",
                    },
                  },
                  tokenLogin
                )
                  .then((rs) => {
                    if (rs.results === "S") {
                      Alert.alert("Thông báo", "Cập nhật số thẻ thành công");
                      empInfo.card_num = currentCardNo;
                    } else {
                      Alert.alert(
                        "Thông báo",
                        "Cập nhật số thẻ thất bại. " + rs.errorData
                      );
                    }
                  })
                  .catch((error) => {
                    Alert.alert(
                      "Thông báo",
                      "Cập nhật số thẻ thất bại. " + error
                    );
                  });
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

  const OnScanFace = () => {
    if (Object.keys(currentMachineFace).length === 0) {
      dialogNoti("Chưa chọn máy chấm công");
      return;
    }
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
        "content-type": "application/json",
      },
    };

    let urlPost =
      currentMachineFace.ubio_url_service +
      "/RegistWalkThroughFaceFromTerminal" +
      "?ClientPK=" +
      currentMachineFace.client_pk;

    var obj_data = {
      terminalId: parseInt(currentMachineFace.ubio_terminal_id),
      basicInfo: {
        userID: parseInt(empInfo.id_num),
      },
    };

    console.log(urlPost, obj_data);
    setLoading(true);
    axios
      .post(
        urlPost,
        obj_data,
        {
          headers: {
            "content-type": "application/json",
          },
        },
        axiosConfig
      )
      .then((res) => {
        console.log("RES", res.data);
        flagFace = true;
        TrackingFace();
        setFlagShowSelectCtrFace(false);
        setTimeout(() => {
          flagFace = false;
          setLoading(false);
        }, 20000);
        setIsShowMachineFace(false);
      })
      .catch((err) => {
        console.log("err2UBio ", err);
        dialogNoti("Quét khuôn mặt thất bại");
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

  const OnSelectMachineScanFP = (obj) => {
    setCurrentFP(obj);
    setFlagShowSelectCtrFP(true);
  };

  let flagFace = false;
  const TrackingFace = () => {
    if (flagFace) {
      console.log("empInfo ", empInfo);
      const pro = "SELHRTI006007";
      const in_par = {
        p1_varchar2: empInfo.pk,
        p2_varchar2: APP_VERSION,
        p3_varchar2: crt_by,
      };
      sysFetch(
        API,
        {
          pro,
          in_par,
          out_par: {
            p1_sys: "data",
          },
        },
        tokenLogin
      ).then((rs) => {
        if (rs.data.data.length > 0) {
          if (rs.data.data[0].image != image) {
            setImage(rs.data.data[0].image);
            flagFace = false;
            setDataOneItem(rs.data.data[0]);
            let data = [...dsNhanVien];

            data.map(function (itemData) {
              if (itemData.pk == empInfo.pk) {
                itemData.image = rs.data.data[0].image;
              }
            });
            setDsNhanVien(data);
            setLoading(false);
            dialogNoti("Cập nhật khuôn mặt thành công");
          }
        }
      });
      setTimeout(() => {
        TrackingFace();
      }, 2000);
    }
  };

  let flagFP = false;
  const TrackingFP = () => {
    console.log("empInfo ", empInfo);
    if (flagFP) {
      const pro = "SELHRTI006007";
      const in_par = {
        p1_varchar2: empInfo.pk,
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
            p1_sys: "data",
          },
        },
        tokenLogin
      ).then((rs) => {
        console.log("RS SELHRTI006007", rs);
        if (rs.data.data.length > 0) {
          if (currentFP == 1) {
            console.log("===> 1 ");
            if (
              rs.data.data[0].fp_ubio_1_1 != empInfo.fp_ubio_1_1 &&
              rs.data.data[0].fp_ubio_1_2 != empInfo.fp_ubio_1_2
            ) {
              if (
                rs.data.data[0].fp_ubio_1_1 != "" &&
                rs.data.data[0].fp_ubio_1_2 != ""
              ) {
                setFPImg1("Y");
              }
              flagFP = false;
              setDataOneItem(rs.data.data[0]);
              let data = [...dsNhanVien];

              data.map(function (itemData) {
                if (itemData.pk == empInfo.pk) {
                  itemData.fp_ubio_1_1 = rs.data.data[0].fp_ubio_1_1;
                  itemData.fp_ubio_1_2 = rs.data.data[0].fp_ubio_1_2;
                  itemData.fp_ubio_2_1 = rs.data.data[0].fp_ubio_2_1;
                  itemData.fp_ubio_2_2 = rs.data.data[0].fp_ubio_2_2;
                  itemData.fp_ubio_3_1 = rs.data.data[0].fp_ubio_3_1;
                  itemData.fp_ubio_3_2 = rs.data.data[0].fp_ubio_3_2;
                }
              });
              setDsNhanVien(data);
              setLoading(false);
              dialogNoti("Cập nhật vân tay thành công");
            }
          }
          if (currentFP == 2) {
            console.log("===> 2 ");
            if (
              rs.data.data[0].fp_ubio_2_1 != empInfo.fp_ubio_2_1 &&
              rs.data.data[0].fp_ubio_2_2 != empInfo.fp_ubio_2_2
            ) {
              if (
                rs.data.data[0].fp_ubio_2_1 != "" &&
                rs.data.data[0].fp_ubio_2_2 != ""
              ) {
                setFPImg2("Y");
              }
              flagFP = false;
              setDataOneItem(rs.data.data[0]);
              let data = [...dsNhanVien];

              data.map(function (itemData) {
                if (itemData.pk == empInfo.pk) {
                  itemData.fp_ubio_1_1 = rs.data.data[0].fp_ubio_1_1;
                  itemData.fp_ubio_1_2 = rs.data.data[0].fp_ubio_1_2;
                  itemData.fp_ubio_2_1 = rs.data.data[0].fp_ubio_2_1;
                  itemData.fp_ubio_2_2 = rs.data.data[0].fp_ubio_2_2;
                  itemData.fp_ubio_3_1 = rs.data.data[0].fp_ubio_3_1;
                  itemData.fp_ubio_3_2 = rs.data.data[0].fp_ubio_3_2;
                }
              });
              setDsNhanVien(data);
              setLoading(false);
              dialogNoti("Cập nhật vân tay thành công");
            }
          }
          if (currentFP == 3) {
            console.log("===> 3 ");
            console.log(rs.data.data);
            if (
              rs.data.data[0].fp_ubio_3_1 != empInfo.fp_ubio_3_1 &&
              rs.data.data[0].fp_ubio_3_2 != empInfo.fp_ubio_3_2
            ) {
              if (
                rs.data.data[0].fp_ubio_3_1 != "" &&
                rs.data.data[0].fp_ubio_3_2 != ""
              ) {
                setFPImg3("Y");
              }
              flagFP = false;
              setDataOneItem(rs.data.data[0]);
              let data = [...dsNhanVien];

              data.map(function (itemData) {
                if (itemData.pk == empInfo.pk) {
                  itemData.fp_ubio_1_1 = rs.data.data[0].fp_ubio_1_1;
                  itemData.fp_ubio_1_2 = rs.data.data[0].fp_ubio_1_2;
                  itemData.fp_ubio_2_1 = rs.data.data[0].fp_ubio_2_1;
                  itemData.fp_ubio_2_2 = rs.data.data[0].fp_ubio_2_2;
                  itemData.fp_ubio_3_1 = rs.data.data[0].fp_ubio_3_1;
                  itemData.fp_ubio_3_2 = rs.data.data[0].fp_ubio_3_2;
                }
              });
              setDsNhanVien(data);
              setLoading(false);
              dialogNoti("Cập nhật vân tay thành công");
            }
          }
        }
      });
      setTimeout(() => {
        TrackingFP();
      }, 2000);
    }
  };

  const OnScanFP = (obj) => {
    if (Object.keys(currentMachineFP).length === 0) {
      dialogNoti("Chưa chọn máy chấm công");
      return;
    }
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
        "content-type": "application/json",
      },
    };

    let urlPost =
      currentMachineFP.ubio_url_service +
      "/EnrollFromTerminal" +
      "?ClientPK=" +
      currentMachineFP.client_pk;

    var obj_data = {
      terminalId: parseInt(currentMachineFP.ubio_terminal_id),
      basicInfo: {
        userID: parseInt(empInfo.id_num),
      },
      indexFinger: parseInt(currentFP),
    };

    console.log(urlPost, obj_data);
    setLoading(true);
    axios
      .post(
        urlPost,
        obj_data,
        {
          headers: {
            "content-type": "application/json",
          },
        },
        axiosConfig
      )
      .then((res) => {
        console.log("RES FP", res.data);
        flagFP = true;
        TrackingFP();
        setFlagShowSelectCtrFP(false);
        setTimeout(() => {
          flagFP = false;
          setLoading(false);
        }, 20000);
        setIsShowMachineFP(false);
      })
      .catch((err) => {
        console.log("err2UBio ", err);
        setFlagShowSelectCtrFP(false);

        dialogNoti("Quét vân tay thất bại");
        setLoading(false);
      });
  };

  const popupMachine = (
    <TVSControlPopupMachine
      title={"CHỌN MÁY CHẤM CÔNG"}
      isShow={modalMachineVisible}
      minHeight={height * 0.7}
      flag={flagMachine}
      onSelect={(item) => onSelectMachine(item)}
      onHide={() => {
        setFlagMachine("N");
        setModalMachineVisible(false);
      }}
      type={type}
      empInfo={empInfo}
      setDataOneItem={(data) => setDataOneItem(data)}
    ></TVSControlPopupMachine>
  );
  const onOpenPopupMachine = (type) => {
    setType(type);
    setModalMachineVisible(true);
    setFlagMachine("Y");
  };

  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(00,00,00,.1)",
        }}
      >
        <HideArea />
        <AMT.View
          duration={300}
          animation={"fadeInUp"}
          style={{
            backgroundColor: backgroundColor,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
          }}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              backgroundColor: "rgba(00,00,00,.03)",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              alignItems: "flex-end",
              height:
                Platform.OS == "ios"
                  ? (Dimensions.get("screen").height / 20) * 2
                  : Dimensions.get("screen").height / 20,
            }}
          >
            <PopupTitle>{title}</PopupTitle>
            <TouchableOpacity onPress={() => setModalOneItemVisible(false)}>
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: 10,
              paddingLeft: 20,
              paddingRight: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              minHeight:
                Platform.OS == "ios"
                  ? (Dimensions.get("screen").height / 20) * 16
                  : (Dimensions.get("screen").height / 20) * 16,
            }}
          >
            <View>
              <View style={styles.viewInfo}>
                <View flex={1}>
                  <View>
                    <View
                      flexDirection={"row"}
                      style={{ marginBottom: 5, marginLeft: 5 }}
                    >
                      <View flex={2}>
                        <Text>Họ tên: </Text>
                      </View>
                      <View flex={3}>
                        <Text>{empInfo.full_name}</Text>
                      </View>
                    </View>
                    <View
                      flexDirection={"row"}
                      style={{ marginBottom: 5, marginLeft: 5 }}
                    >
                      <View flex={2}>
                        <Text>Mã nhân viên: </Text>
                      </View>
                      <View flex={3}>
                        <Text>{empInfo.emp_id}</Text>
                      </View>
                    </View>
                    <View
                      flexDirection={"row"}
                      style={{ marginBottom: 5, marginLeft: 5 }}
                    >
                      <View flex={2}>
                        <Text>Mã chấm công: </Text>
                      </View>
                      <View flex={3}>
                        <Text>{empInfo.id_num}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginVertical: 15, marginLeft: 5 }}>
              <Text>Dữ liệu đăng ký</Text>
            </View>
            <View
              style={{ flexDirection: "row", marginBottom: 5, marginLeft: 5 }}
            >
              <View style={{ flex: 1 }}>
                <Button
                  nextScreen={() => {
                    setChecked("face");
                  }}
                  row
                  paddingLeft={5}
                  alignCenter
                >
                  <View
                    style={
                      checked == "face" ? styles.CheckBoxE : styles.CheckBoxD
                    }
                  >
                    {checked == "face" ? (
                      <Icon
                        name={"checkbox-blank-circle"}
                        color={"#5A94E7"}
                        size={13}
                      />
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setChecked("face");
                    }}
                  >
                    <Text>Khuôn mặt</Text>
                  </TouchableOpacity>
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  nextScreen={() => {
                    setChecked("finger");
                  }}
                  row
                  paddingLeft={5}
                  alignCenter
                >
                  <View
                    style={
                      checked == "finger" ? styles.CheckBoxE : styles.CheckBoxD
                    }
                  >
                    {checked == "finger" ? (
                      <Icon
                        name={"checkbox-blank-circle"}
                        color={"#5A94E7"}
                        size={13}
                      />
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setChecked("finger");
                    }}
                  >
                    <Text>Vân tay</Text>
                  </TouchableOpacity>
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  nextScreen={() => {
                    setChecked("card");
                  }}
                  row
                  paddingLeft={5}
                  alignCenter
                >
                  <View
                    style={
                      checked == "card" ? styles.CheckBoxE : styles.CheckBoxD
                    }
                  >
                    {checked == "card" ? (
                      <Icon
                        name={"checkbox-blank-circle"}
                        color={"#5A94E7"}
                        size={13}
                      />
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setChecked("card");
                    }}
                  >
                    <Text>Thẻ từ</Text>
                  </TouchableOpacity>
                </Button>
              </View>
            </View>
            {checked == "face" ? (
              <View
                style={{
                  marginTop: 30,
                  zIndex: 10,
                }}
              >
                <View
                  border={1}
                  paddingVertical={10}
                  borderColor={Color.gray}
                  radius={6}
                  borderWidth={2}
                  borderRadius={10}
                  marginBottom={5}
                >
                  <View row style={styles.fieldsetTitle}>
                    <Text color={Color.mainColor} fontWeight={"bold"}>
                      Khuôn mặt
                    </Text>
                  </View>
                  <View>
                    <View>
                      <View>
                        <View style={styles.viewPicture}>
                          {image != "" ? (
                            <Image
                              style={styles.picture}
                              source={{
                                uri:
                                  // image != ""?
                                  "data:image/png;base64," + image,
                                // : defaultAvatar,
                              }}
                            />
                          ) : (
                            <View style={styles.picture}>
                              <Person />
                            </View>
                          )}
                        </View>
                      </View>
                      <View paddingVertical={10} flexDirection={"row"}>
                        <View
                          flex={1}
                          paddingHorizontal={15}
                          style={{ alignItems: "center" }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setFlagShowSelectCtrFace(!flagShowSelectCtrFace);
                            }}
                            style={{
                              padding: 10,
                              marginTop: 5,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>
                              <Icon
                                name={"camera-rear-variant"}
                                size={16}
                                color={"#5A94E7"}
                              />{" "}
                              Máy chấm công
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          flex={1}
                          paddingHorizontal={15}
                          style={{ alignItems: "center" }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              onChangeImage();
                            }}
                            style={{
                              padding: 10,
                              marginTop: 5,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>
                              <Icon
                                name={"camera-plus"}
                                size={16}
                                color={"#5A94E7"}
                              />{" "}
                              Chụp ảnh
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {flagShowSelectCtrFace ? (
                  <View zIndex={10} marginTop={5}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        marginTop: 20,
                      }}
                    >
                      <Text>Chọn máy chấm công</Text>
                      <View flexDirection={"row"}>
                        <View flex={8}>
                          <TouchableOpacity
                            onPress={() => {
                              setIsShowMachineFace(!isShowMachineFace);
                            }}
                            style={{
                              padding: 10,
                              backgroundColor: "rgba(00,00,00,.03)",
                              justifyContent: "center",
                              borderRadius: 8,
                            }}
                          >
                            <Text>{currentMachineFace.code_nm}</Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              OnScanFace();
                            }}
                            style={{
                              padding: 10,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>Xác nhận</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <TVSSelect
                      isShow={isShowMachineFace}
                      data={dataMachine.filter(
                        (x) => x.auth_face_yn == "Y" && x.machine_kind == "UBIO"
                      )}
                      onSelected={(item) => {
                        setIsShowMachineFace(false);
                        setCurrentMachineFace(item);
                      }}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Finger */}

            {checked == "finger" ? (
              <View style={{ marginTop: 30, zIndex: 9 }}>
                <View
                  border={1}
                  paddingVertical={10}
                  borderColor={Color.gray}
                  radius={6}
                  borderWidth={2}
                  borderRadius={10}
                  marginBottom={5}
                >
                  <View row style={styles.fieldsetTitle}>
                    <Text color={Color.mainColor} fontWeight={"bold"}>
                      Vân tay
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ marginVertical: 5 }}>
                      <View flexDirection={"row"}>
                        <View flex={1} style={{ alignItems: "center" }}>
                          {/* <Image
                            style={{
                              width: 60,
                              height: 60,
                              resizeMode: "contain",
                            }}
                            source={{
                              uri:
                                FPImg1 == "Y"
                                  ? "data:image/png;base64," + hasFP
                                  : "data:image/png;base64," + noFP,
                            }}
                          /> */}

                          {FPImg1 == "Y" ? (
                            <Icon
                              name={"fingerprint"}
                              size={60}
                              color={"green"}
                            />
                          ) : (
                            <Icon
                              name={"fingerprint-off"}
                              size={60}
                              color={"red"}
                            />
                          )}

                          {FPImg1 == "Y" ? (
                            <Text
                              style={{
                                color: "green",
                                paddingTop: 10,
                                paddingBottom: 5,
                              }}
                            >
                              Đã đăng ký
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: "red",
                                paddingTop: 10,
                                paddingBottom: 5,
                              }}
                            >
                              Chưa đăng ký
                            </Text>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              OnSelectMachineScanFP("1");
                            }}
                            style={{
                              padding: 10,
                              marginTop: 5,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                              borderColor:
                                currentFP == "1" ? "#5A94E7" : "#E7F2FE",
                              borderWidth: 1,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>Vân tay 1</Text>
                          </TouchableOpacity>
                        </View>
                        <View flex={1} style={{ alignItems: "center" }}>
                          {/* <Image
                            style={{
                              width: 60,
                              height: 60,
                              resizeMode: "contain",
                            }}
                            source={{
                              uri:
                                FPImg2 == "Y"
                                  ? "data:image/png;base64," + hasFP
                                  : "data:image/png;base64," + noFP,
                            }}
                          /> */}
                          {FPImg2 == "Y" ? (
                            <Icon
                              name={"fingerprint"}
                              size={60}
                              color={"green"}
                            />
                          ) : (
                            <Icon
                              name={"fingerprint-off"}
                              size={60}
                              color={"red"}
                            />
                          )}

                          {FPImg2 == "Y" ? (
                            <Text
                              style={{
                                color: "green",
                                paddingTop: 10,
                                paddingBottom: 5,
                              }}
                            >
                              Đã đăng ký
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: "red",
                                paddingTop: 10,
                                paddingBottom: 5,
                              }}
                            >
                              Chưa đăng ký
                            </Text>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              OnSelectMachineScanFP("2");
                            }}
                            style={{
                              padding: 10,
                              marginTop: 5,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                              borderColor:
                                currentFP == "2" ? "#5A94E7" : "#E7F2FE",
                              borderWidth: 1,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>Vân tay 2</Text>
                          </TouchableOpacity>
                        </View>
                        <View flex={1} style={{ alignItems: "center" }}>
                          {/* <Image
                            style={{
                              width: 60,
                              height: 60,
                              resizeMode: "contain",
                            }}
                            source={{
                              uri:
                                FPImg3 == "Y"
                                  ? "data:image/png;base64," + hasFP
                                  : "data:image/png;base64," + noFP,
                            }}
                          /> */}

                          {FPImg3 == "Y" ? (
                            <Icon
                              name={"fingerprint"}
                              size={60}
                              color={"green"}
                            />
                          ) : (
                            <Icon
                              name={"fingerprint-off"}
                              size={60}
                              color={"red"}
                            />
                          )}
                          {FPImg3 == "Y" ? (
                            <Text
                              style={{
                                color: "green",
                                paddingTop: 10,
                                paddingBottom: 5,
                              }}
                            >
                              Đã đăng ký
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: "red",
                                paddingTop: 10,
                                paddingBottom: 5,
                              }}
                            >
                              Chưa đăng ký
                            </Text>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              OnSelectMachineScanFP("3");
                            }}
                            style={{
                              padding: 10,
                              marginTop: 5,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                              borderColor:
                                currentFP == "3" ? "#5A94E7" : "#E7F2FE",
                              borderWidth: 1,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>Vân tay 3</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {flagShowSelectCtrFP ? (
                  <View zIndex={3}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        marginTop: 20,
                      }}
                    >
                      <Text>Chọn máy chấm công</Text>
                      <View flexDirection={"row"}>
                        <View flex={8}>
                          <TouchableOpacity
                            onPress={() => {
                              setIsShowMachineFP(!isShowMachineFP);
                            }}
                            style={{
                              padding: 10,
                              backgroundColor: "rgba(00,00,00,.03)",
                              justifyContent: "center",
                              borderRadius: 8,
                            }}
                          >
                            <Text>{currentMachineFP.code_nm}</Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              OnScanFP(currentFP);
                            }}
                            style={{
                              padding: 10,
                              backgroundColor: "#E7F2FE",
                              justifyContent: "center",
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: "#5A94E7" }}>Xác nhận</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <TVSSelect
                      isShow={isShowMachineFP}
                      data={dataMachine.filter(
                        (x) =>
                          x.auth_finger_yn == "Y" && x.machine_kind == "UBIO"
                      )}
                      onSelected={(item) => {
                        setIsShowMachineFP(false);
                        setCurrentMachineFP(item);
                      }}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
            {/* Card */}

            {checked == "card" ? (
              <View style={{ marginTop: 30, zIndex: 2 }}>
                <View
                  border={1}
                  paddingVertical={10}
                  borderColor={Color.gray}
                  radius={6}
                  borderWidth={2}
                  borderRadius={10}
                  marginBottom={5}
                  zIndex={2}
                >
                  <View row zIndex={2} style={styles.fieldsetTitle}>
                    <Text color={Color.mainColor} fontWeight={"bold"}>
                      Thẻ từ
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <View>
                      <View>
                        <View>
                          <View paddingHorizontal={10}>
                            <Text>Số thẻ</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                paddingBottom: 10,
                              }}
                            >
                              <TextInput
                                editable={flagInputCard}
                                onChangeText={(newText) =>
                                  setCurrentCardNo(newText)
                                }
                                defaultValue={currentCardNo}
                                onSubmitEditing={() => onSaveCard()}
                                style={{
                                  padding: Platform.OS == "ios" ? 10 : 5,
                                  backgroundColor: "rgba(00,00,00,.03)",
                                  justifyContent: "center",
                                  borderRadius: 8,
                                  flex: 1,
                                }}
                              />
                              <View
                                style={{
                                  position: "absolute",
                                  right: 10,
                                  padding: 10,
                                }}
                              >
                                {flagInputCard ? (
                                  <Icon name="check" color="green" size={15} />
                                ) : (
                                  <Icon name="close" color="red" size={15} />
                                )}
                                {/* close */}
                              </View>
                            </View>
                          </View>
                        </View>
                        <View paddingVertical={10} flexDirection={"row"}>
                          <View flex={1} style={{ alignItems: "center" }}>
                            <TouchableOpacity
                              onPress={() => {
                                setFlagInputCard(true);
                              }}
                              style={{
                                padding: 10,
                                marginTop: 5,
                                backgroundColor: "#E7F2FE",
                                justifyContent: "center",
                                borderRadius: 8,
                              }}
                            >
                              <Text style={{ color: "#5A94E7" }}>
                                <Icon
                                  name={"keyboard-outline"}
                                  size={16}
                                  color={"#5A94E7"}
                                />{" "}
                                Nhập tay
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
            <View style={styles.footerLoading}>
              {loading ? (
                <View>
                  <ActivityIndicator color="black" style={{ margin: 15 }} />
                  <Text>Đang xử lý...</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              paddingTop: 10,
              flexDirection: "row",
              flexwrap: "wrap",
              backgroundColor: "rgba(00,00,00,.03)",
              justifyContent: "center",
              alignItems: "flex-start",
              height: (Dimensions.get("screen").height / 20) * 2,
            }}
          >
            <TVSButton
              icon={"download"}
              type={"primary"}
              buttonStyle={"3"}
              onPress={() => {
                onOpenPopupMachine("Register");
              }}
            >
              Đăng ký xuống MCC
            </TVSButton>

            <TVSButton
              icon={"upload"}
              type={"success"}
              buttonStyle={"3"}
              onPress={() => {
                onOpenPopupMachine("Update");
              }}
            >
              Cập nhật dữ liệu
            </TVSButton>

            {/* <TVSButton
              onPress={() => setModalOneItemVisible(false)}
              type={"danger"}
              buttonStyle={"2"}
              icon={"close"}
            >
              Đóng lại
            </TVSButton> */}
          </View>
          {popupMachine}
        </AMT.View>
        <HideArea />
      </View>
    </Modal>
  );
};
const PopupTitle = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          textTransform: "uppercase",
          color: Color.mainColor,
        }}
      >
        {children}
      </Text>
    </View>
  );
};
const HideArea = ({ onHide }) => {
  return <TouchableOpacity style={{ flex: 1 }} onPress={onHide} />;
};

export default TVSControlPopupRegisterFace;
