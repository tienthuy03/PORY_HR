import axios from "axios";
import base64ToArrayBuffer from "base64-arraybuffer";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Button,
} from "react-native";
import Device from "react-native-device-info";
import { ScrollView } from "react-native-gesture-handler";
import GetLocation from "react-native-get-location";
import { launchCamera } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Text from "../../../../components/Text";
import TVSButton from "../../../../components/Tvs/Button";
import TVSHeader from "../../../../components/Tvs/Header";
import ShowError from "../../../../services/errors";
import LocateService from "../../../../services/locate";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import * as permissions from "react-native-permissions";
// import { request, PERMISSIONS } from "react-native-permissions";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
import OneRecordRecognize from "./OneRecordRecognize";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch_v1";
import sysFetch2 from "../../../../services/fetch_v1/fetch2";
import { APP_VERSION } from "../../../../config/Pro";
const OptionsImage = {
  maxWidth: 450,
  maxHeight: 600,
  quality: 1,
  // cameraType: 'back',
  cameraType: "front",
  includeBase64: true,
  mediaType: "photo",
  presentationStyle: "fullScreen",
};
const defaultAvatar =
  "data:image/png;base64,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";
const ChamCongKhuonMat = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    avatarView: {
      width: 60,
      height: 80,
    },
    avatar: {
      borderRadius: 10,
      width: "100%",
      height: "100%",
    },
    informationContainer: {
      flexDirection: "row",
      backgroundColor: Color.white,
      borderRadius: 10,
    },
    informationContainerRight: {
      padding: 10,
      flex: 1,
    },
    oneField: {
      marginTop: 5,
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
      width: "100%",
      backgroundColor: Color.inputBackgroundColor,
    },
    registerFaceContainer: {
      borderRadius: 5,
      padding: 10,
      backgroundColor: Color.white,
      justifyContent: "center",
      alignItems: "center",
      flex: 0,
    },
    avatarViewRF: {},
    avatarRF: {
      width: 210,
      height: 280,
      resizeMode: "contain",
      borderWidth: 1,
      borderColor: Color.grayPlahoder,
    },
    footer: {
      marginTop: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    btnSave: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 20,
      paddingLeft: 20,
      color: Color.white,
    },
    btnSaveView: {
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Color.btnMain,
    },
    btnChangeImage: {
      color: Color.mainColor,
      paddingTop: 20,
      paddingBottom: 10,
    },
    textTitle: {
      color: Color.mainColor,
      size: 16,
      flex: 1,
      padding: 5,
    },
    textDetail: {
      color: Color.mainColor,
      flex: 1,
    },
    textDetail: {
      color: Color.mainColor,
      flex: 1,
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
    mapView: {
      borderRadius: 5,
      height: 300,
      // flex: 1,
      // justifyContent: 'flex-end',
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
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
  const [NewImage, setNewImage] = useState(defaultAvatar);
  const [IsDurty, setIsDurty] = useState(false);
  const [PersonId, setPersonId] = useState("");
  const [checkType, setCheckType] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [tempLocation, setTempLocation] = useState([]);
  const [ipList, setIpList] = useState([]);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const currentLangue = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let imageIns = "";
  let locationIns = "";
  let longitudeIns = "";
  let latitudeIns = "";
  const menu = useSelector((state) => state.menuReducer.data.data.menu);
  try {
    menu.filter((x) => x.menu_cd === "MBHRTI001")[0][
      currentLangue.toLowerCase()
    ];
  } catch (error) {
    Alert.alert("Thông báo", "Menu MBHRTI001 không tồn tại.", [
      { text: "Xác nhận", onPress: () => goBack() },
    ]);
  }

  useEffect(() => {
    dispatch(ShowGlobalLoading);
    loadData();

    //loadHistory();
  }, []);

  //load dữ liệu khuôn mặt
  const loadData = async () => {
    sysFetch(
      API,
      {
        pro: "SELHRTI001000",
        in_par: {
          p1_varchar2: employee_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "check_type",
          p2_sys: "face",
          p3_sys: "location",
          p4_sys: "ip",
          p5_sys: "history",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("loadData");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            if (rs.data.face.length === 0) {
              Alert.alert(
                "Thông báo",
                "Bạn chưa đăng ký khuôn mặt! Hãy đăng ký khuôn mặt rồi thử lại sau",
                [{ text: "Đóng", onPress: () => goBack() }]
              );
            } else {
              setPersonId(rs.data.face[0].azure_person_id);
            }
            dispatch(HideGlobalLoading);
            setCheckType(rs.data.check_type[0]);
            setHistory(rs.data.history);
            setLocationList(rs.data.location);
            setIpList(rs.data.ip);
          }
          if (rs.results === "F") {
            ShowError("fail");
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        if (obj == "loadData") {
          loadData();
        }
        if (obj == "insertData") {
          insertData(imageIns, longitudeIns, latitudeIns);
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

  const checkLocation = () => {
    if (checkType.location_yn == "Y") {
      console.log("check location");
      if (tempLocation.length == 0) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        })
          .then(async (location) => {
            console.log("location ", location);
            setTempLocation(location);
            // if (checkType.location_yn === 'Y') {
            let temp = false;
            if (locationList.length === 0) {
              throw { code: "NO-POSITION" };
            }
            await locationList.map((loc) => {
              const ls = new LocateService(
                loc.location.split("|")[1],
                loc.location.split("|")[0]
              );
              if (ls.Check(location.longitude, location.latitude, loc.radius)) {
                temp = true;
                return;
              }
            });
            // console.log('temp ', temp);
            if (!temp) {
              throw { code: "POSITION-FAIL" };
            } else {
              takePhoto(location.longitude, location.latitude);
            }
            // } else {
            //   takePhoto(location);
            // }
          })
          .catch((error) => {
            console.log("error location ", error);
            dispatch(HideGlobalLoading);
            const { code, message } = error;
            if (code === "UNAVAILABLE") {
              Alert.alert(
                "Thông báo",
                "Bạn chưa bật định vị trên thiết bị. Hãy bật định vị rồi thử lại."
              );
            }
            if (code === "TIMEOUT") {
              Alert.alert(
                "Thông báo",
                "Yêu cầu lấy định vị trên thiết bị của bạn đang hết hạn. Xin thử lại"
              );
            }
            if (code === "POSITION-FAIL") {
              Alert.alert(
                "Thông báo",
                "Vị trí chấm công của bạn chưa đúng. Xin tới vị trí chấm công được đăng ký rồi thử lại."
              );
            }
            if (code === "NO-POSITION") {
              Alert.alert(
                "Thông báo",
                "Không có vị trí chấm công. Xin liên hệ với quản trị để cài đặt vị trí chấm công."
              );
            }
          });
      } else {
        console.log("has location");
        if (checkType.location_yn === "Y") {
          let temp = false;
          if (locationList.length === 0) {
            Alert.alert(
              "Thông báo",
              "Không có vị trí chấm công. Xin liên hệ với quản trị để cài đặt vị trí chấm công."
            );
          }
          locationList.map((loc) => {
            const ls = new LocateService(
              loc.location.split("|")[1],
              loc.location.split("|")[0]
            );
            if (
              ls.Check(
                tempLocation.longitude,
                tempLocation.latitude,
                loc.radius
              )
            ) {
              temp = true;
              return;
            }
          });
          // console.log('temp ', temp);
          if (!temp) {
            Alert.alert(
              "Thông báo",
              "Vị trí chấm công của bạn chưa đúng. Xin tới vị trí chấm công được đăng ký rồi thử lại."
            );
          } else {
            // takePhoto(tempLocation);
            takePhoto(tempLocation.longitude, tempLocation.latitude);
          }
        } else {
          takePhoto(tempLocation.longitude, tempLocation.latitude);
        }
      }
      console.log("done check location");
    } else {
      takePhoto("0", "0");
    }
  };

  //insert data
  const insertData = async (imgbase64, longitude, latitude) => {
    try {
      dispatch(ShowGlobalLoading);
      sysFetch2(
        API,
        {
          pro: "UPDHRTI001000",
          in_par: {
            p1_varchar2: employee_pk,
            p2_varchar2: latitude + "|" + longitude,
            p3_varchar2: imgbase64.replace("data:image/png;base64,", ""),
            p4_varchar2: APP_VERSION,
            p5_varchar2: crt_by,
          },
          out_par: {},
        },
        tokenLogin
      )
        .then((rs) => {
          console.log(rs);
          if (rs.result === "S") {
            Alert.alert("Thông báo", "Chấm công thành công!", [
              { text: "Xác nhận" },
            ]);
            dispatch(HideGlobalLoading);
            setHistory([
              {
                time: moment(new Date()).format("HH:mm:ss"),
                work_dt: moment(new Date()).format("YYYYMMDD"),
                image: imgbase64.replace("data:image/png;base64,", ""),
                location: latitude + "|" + longitude,
              },
              ...history,
            ]);
          } else {
            ShowError("fail");
            dispatch(HideGlobalLoading);
          }
        })
        .catch((error) => {
          if (error == "AxiosError: Request failed with status code 401") {
            refreshNewToken("insertData");
          }
        });
      //insert du lieu start
      // const param = {
      //   pro: 'UPDHRTI001000',
      //   in_par: {
      //     p1_varchar2: employee_pk,
      //     p2_varchar2: location.latitude + '|' + location.longitude,
      //     p3_varchar2: imgbase64.replace('data:image/png;base64,', ''),
      //     p4_varchar2: APP_VERSION,
      //     p5_varchar2: crt_by,
      //   },
      //   out_par: {},
      //   token: 'tvs',
      //   machine_id: Device.getUniqueId(),
      // };
      // let axiosConfig = {
      //   headers: {
      //     Authorization: `Bearer ${tokenLogin}`,
      //   },
      // };
      // await axios
      //   .post(API + 'ExecV2/MOBILE', param, axiosConfig)
      //   .then(rs => {
      //     if (rs.data.result === 'S') {
      //       Alert.alert('Thông báo', 'Chấm công thành công!', [
      //         {text: 'Xác nhận'},
      //       ]);
      //       dispatch(HideGlobalLoading);
      //       setHistory([
      //         {
      //           time: moment(new Date()).format('HH:mm:ss'),
      //           work_dt: moment(new Date()).format('YYYYMMDD'),
      //           image: imgbase64.replace('data:image/png;base64,', ''),
      //           location: location.latitude + '|' + location.longitude,
      //         },
      //         ...history,
      //       ]);
      //     } else {
      //       ShowError('fail');
      //       dispatch(HideGlobalLoading);
      //     }
      //   })
      //   .catch(err => {
      //     if (err == 'AxiosError: Request failed with status code 401') {
      //       refreshNewToken('insertData');
      //     }
      //   });
    } catch (error) {
      dispatch(HideGlobalLoading);
    }
  };

  const onChangeImage = async () => {
    console.log("checkType ", checkType);
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
        // console.log('granted ', granted);
        // console.log(
        //   'PermissionsAndroid.RESULTS.GRANTED ',
        //   PermissionsAndroid.RESULTS.GRANTED,
        // );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (checkType.wifi_yn === "Y") {
            console.log("check wifi");
            axios({
              method: "GET",
              url: "https://api.ipify.org",
            })
              .then(async (ip) => {
                let tempFlag = false;
                await ipList.map((item) => {
                  if (item.wifi_ip === ip.data) {
                    tempFlag = true;
                  }
                  return;
                });
                // console.log('tempFlag ', tempFlag);
                if (tempFlag) {
                  checkLocation();
                } else {
                  Alert.alert(
                    "Thông báo",
                    "Hãy kết nối vào mạng đã đăng ký rồi thử lại."
                  );
                }
              })
              .catch((error) => {
                Alert.alert(
                  "Thông báo",
                  "Chấm công thất bại. Không lấy được địa chỉ IP. Xin liên hệ với quản trị."
                );
              });
          } else {
            checkLocation();
          }
        } else {
          Alert.alert(
            "Thông báo",
            "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            [{ text: "Đóng" }]
          );
        }
      } else {
        // request(PERMISSIONS.IOS.CAMERA).then((result) => {
        //   console.log(result);
        //   if (result === "granted") {
        if (checkType.wifi_yn === "Y") {
          axios({
            method: "GET",
            url: "https://api.ipify.org",
          })
            .then(async (ip) => {
              // console.log(ip.data);
              let tempFlag = false;
              await ipList.map((item) => {
                // console.log(item.wifi_ip);
                if (item.wifi_ip == ip.data) {
                  tempFlag = true;
                }
                return;
              });
              if (tempFlag) {
                checkLocation();
              } else {
                Alert.alert(
                  "Thông báo",
                  "Hãy kết nối vào mạng đã đăng ký rồi thử lại."
                );
              }
            })
            .catch((error) => {
              console.log(error);
              Alert.alert(
                "Thông báo",
                "Chấm công thất bại. Không lấy được địa chỉ IP. Xin liên hệ với quản trị."
              );
            });
        } else {
          checkLocation();
        }
        //   } else if (result === "blocked") {
        //     Alert.alert(
        //       "Thông báo",
        //       "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
        //       [{ text: "Đóng" }]
        //     );
        //   }
        // });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onShowLocation = (location) => {
    let dataLatitude = "";
    let dataLongitude = "";

    dataLatitude = location.split("|")[0];
    dataLongitude = location.split("|")[1];
    setLatitude(parseFloat(dataLatitude));
    setLongitude(parseFloat(dataLongitude));
    // LOG  10.8496476
    // LOG  106.6245025

    setModalVisible(true);
  };

  const modal = (
    <TVSControlPopup
      title={"Vị trí chấm công"}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}
    >
      <View style={styles.mapView}>
        <MapView
          scrollEnabled={false}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      </View>
    </TVSControlPopup>
  );

  const takePhoto = async (longitude, latitude) => {
    console.log("takePhoto");
    const url = "https://tvs-devoff.cognitiveservices.azure.com/face/v1.0/";
    launchCamera(OptionsImage, async (res) => {
      console.log("res takePhoto ", res);
      if (res.didCancel) {
        return;
      }
      if (res.errorCode == "camera_unavailable") {
        Alert.alert("Thông báo", "Thiết bị không hỗ trợ camera", [
          { text: "Xác nhận" },
        ]);
        return;
      }
      dispatch(ShowGlobalLoading);

      await setNewImage("data:image/png;base64," + res.assets[0].base64);
      if (checkType.face_yn === "Y") {
        const data = base64ToArrayBuffer.decode(res.assets[0].base64);
        const config = {
          method: "POST",
          url: url + "detect",
          data,
          headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": "36776dfe819949979fd58ac13631f21d",
          },
        };
        await axios(config)
          .then((rs) => {
            const configFace = {
              method: "POST",
              url: url + "verify",
              data: {
                faceId: rs.data[0].faceId,
                personId: PersonId,
                largePersonGroupId: "tvs-large-groups",
              },
              headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "36776dfe819949979fd58ac13631f21d",
              },
            };
            axios(configFace)
              .then((rsFace) => {
                if (rsFace.data.confidence > 0.7) {
                  imageIns = res.assets[0].base64;
                  // locationIns = location;
                  longitudeIns = longitude;
                  latitudeIns = latitude;
                  insertData(res.assets[0].base64, longitude, latitude);
                } else {
                  dispatch(HideGlobalLoading);
                  Alert.alert("Thông báo", "Chấm công thất bại! Xin thử lại", [
                    { text: "Xác nhận" },
                  ]);
                }
              })
              .catch(() => {
                dispatch(HideGlobalLoading);
                Alert.alert("Thông báo", "Chấm công thất bại! Xin thử lại", [
                  { text: "Xác nhận" },
                ]);
              });
          })
          .catch((error) => {
            dispatch(HideGlobalLoading);
            Alert.alert("Thông báo", "Chấm công thất bại! Xin thử lại", [
              { text: "Xác nhận" },
            ]);
          });
      } else {
        imageIns = res.assets[0].base64;
        // locationIns = location;
        longitudeIns = longitude;
        latitudeIns = latitude;
        insertData(res.assets[0].base64, longitude, latitude);
      }
    });
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {
          menu.filter((x) => x.menu_cd === "MBHRTI001")[0][
            currentLangue.toLowerCase()
          ]
        }
      </TVSHeader>
      <Block flex backgroundColor={Color.white}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={onChangeImage}
            style={styles.registerFaceContainer}
          >
            <View>
              <View style={styles.avatarViewRF}>
                <Image style={styles.avatarRF} source={{ uri: NewImage }} />
              </View>
            </View>
            <View style={styles.footer}>
              <TVSButton onPress={onChangeImage} icon={"camera-front-variant"}>
                Chấm công
              </TVSButton>
            </View>
          </TouchableOpacity>
          <Block backgroundColor={"white"}>
            <Block style={styles.blockApproveInfo}>
              <Block
                border={1}
                padding={10}
                borderColor={Color.gray}
                radius={6}
                borderWidth={1}
                marginBottom={5}
                marginLeft={5}
                marginRight={5}
              >
                <Block
                  padding={3}
                  paddingLeft={5}
                  radius={4}
                  height={40}
                  alignCenter
                  row
                  style={styles.approveIntoTitle}
                >
                  <Text color={Color.mainColor} fontWeight={"bold"}>
                    Phương thức chấm công
                  </Text>
                </Block>
                <Block>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: Color.gray,
                      paddingLeft: 10,
                      maxHeight: 50,
                      borderRadius: 6,
                      padding: 5,
                      borderBottomWidth: 1,
                      borderBottomColor: Color.mainColor,
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <Text paddingTop={5}>
                        <Icon
                          name={
                            checkType.wifi_yn === "Y"
                              ? "checkbox-marked"
                              : "checkbox-blank-outline"
                          }
                          size={20}
                          color={Color.mainColor}
                        />
                      </Text>
                      <Text style={styles.textTitle}>Wifi</Text>
                    </View>
                    <ScrollView
                      style={{
                        flex: 1,
                      }}
                    >
                      {ipList.map((item) => (
                        <TouchableOpacity
                          // onPress={() => onShowLocation(item.location)}
                          style={{
                            flex: 1,
                            paddingBottom: 2,
                            paddingTop: 2,
                          }}
                        >
                          <View>
                            <Text style={styles.textDetail}>
                              {item.wifi_name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: Color.gray,
                      paddingLeft: 10,
                      maxHeight: 50,
                      borderBottomWidth: 1,
                      borderBottomColor: Color.mainColor,
                      borderRadius: 6,
                      padding: 5,
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <Text paddingTop={5}>
                        <Icon
                          name={
                            checkType.location_yn === "Y"
                              ? "checkbox-marked"
                              : "checkbox-blank-outline"
                          }
                          size={20}
                          color={Color.mainColor}
                        />
                      </Text>
                      <Text style={styles.textTitle}>Vị trí</Text>
                    </View>
                    <ScrollView
                      style={{
                        flex: 1,
                      }}
                    >
                      {locationList.map((item) => (
                        <TouchableOpacity
                          onPress={() => onShowLocation(item.location)}
                          style={{
                            flex: 1,
                            paddingBottom: 2,
                            paddingTop: 2,
                          }}
                        >
                          <View>
                            <Text style={styles.textDetail}>{item.loc_nm}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: Color.gray,
                      paddingLeft: 10,
                      borderRadius: 6,
                      padding: 5,
                    }}
                  >
                    <Text paddingTop={5}>
                      <Icon
                        name={
                          checkType.face_yn === "Y"
                            ? "checkbox-marked"
                            : "checkbox-blank-outline"
                        }
                        size={20}
                        color={Color.mainColor}
                      />
                    </Text>
                    <Text style={styles.textTitle}>Khuôn mặt</Text>
                  </View>
                </Block>
              </Block>
              {/* approve info end */}
            </Block>
          </Block>

          <ScrollView
            marginTop={0}
            paddingTop={0}
            padding={10}
            backgroundColor={Color.white}
            flex={1}
          >
            <Text
              style={{
                color: Color.titleColor,
                paddingBottom: 5,
              }}
              fontWeight={"bold"}
              size={16}
            >
              Lịch sử chấm công
            </Text>

            {history.filter(
              (x) => x.work_dt === moment(new Date()).format("YYYYMMDD")
            ).length > 0 ? (
              <>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    color: Color.titleColor,
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                  }}
                  size={16}
                >
                  Hôm nay
                </Text>
                <View style={{ padding: 10, paddingTop: 5 }}>
                  <FlatList
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                    data={history.filter(
                      (x) => x.work_dt === moment(new Date()).format("YYYYMMDD")
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <OneRecordRecognize item={item} />
                    )}
                  />
                </View>
              </>
            ) : null}

            {history.filter(
              (x) => x.work_dt !== moment(new Date()).format("YYYYMMDD")
            ).length > 0 ? (
              <>
                {history.filter(
                  (x) => x.work_dt === moment(new Date()).format("YYYYMMDD")
                ).length > 0 ? (
                  <>
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        height: 3,
                        backgroundColor: Color.mainColor,
                        marginVertical: 10,
                      }}
                    />
                    <Text
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        color: Color.titleColor,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                      }}
                      size={16}
                    >
                      Trước đó
                    </Text>
                  </>
                ) : null}
                <View style={{ padding: 10, paddingTop: 5 }}>
                  <FlatList
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                    data={history.filter(
                      (x) => x.work_dt !== moment(new Date()).format("YYYYMMDD")
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <OneRecordRecognize item={item} />
                    )}
                  />
                </View>
              </>
            ) : null}
          </ScrollView>
          {modal}
        </View>
      </Block>
    </Block>
  );
};

export default ChamCongKhuonMat;
