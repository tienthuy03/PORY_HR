/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Dimensions,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import * as ColorHP from "../../../colors/colorhp";
import * as ColorTV from "../../../colors/colortv";
import TVSButton from "../../../components/Tvs/Button";
import {
  buildFor,
  ServerIP,
  ClientIdDefault,
  configAPI,
} from "../../../config/Pro";
import { SetApiURL } from "../../../services/redux/SysConfig/action";
import { sysLoadTheme } from "../../../services/redux/System/action";
import ScanQR from "./ScanQR";
import CaptchaComponent from "./CaptchaComponent";
// import CryptoJS from "crypto-js";
import CryptoJS from "react-native-crypto-js";
import Load from "../../../components/Loading";

const arr = [
  { id: "1", name: "Theme 01", color: ColorTV.Color },
  { id: "2", name: "Theme 02", color: ColorHP.Color },
];

const ConfigThemeScreen = ({ navigation }) => {
  const [load, setLoad] = useState(false);
  const [ClientId, setClientId] = useState("");
  const [ClientKey, setClientKey] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const onSave = () => {
    if (ClientId.length === 0) {
      Alert.alert("Thông báo", "Bạn chưa nhập Client Id.", [{ text: "Đóng" }]);
      return;
    }
    if (captchaText.length === 0) {
      Alert.alert("Thông báo", "Vui lòng nhập các ký tự bên trên.", [
        { text: "Đóng" },
      ]);
      return;
    }
    let originCaptcha = currentCaptcha;
    let inputCaptcha = captchaText;
    console.log(captchaText);
    console.log(currentCaptcha);
    if (originCaptcha.toLowerCase() == inputCaptcha.toLowerCase()) {
      console.log("check");
      setLoad(true);
      checkAPI(ClientId);
    } else {
      Alert.alert(
        "Thông báo",
        "Các ký tự không trùng khớp vui lòng kiểm tra lại",
        [
          {
            text: "Đóng",
            onPress: () => {
              // setIsShow(false);
              // RNRestart.Restart();
            },
          },
        ]
      );
    }
  };
  const checkQR = async (qrdata) => {
    console.log("qrdata ", qrdata);
    let clientId = qrdata.split("+|+")[0];
    let cryptoString = qrdata.split("+|+")[1];
    let secretKey = "tinvietsoft@1911";
    console.log("decode ", cryptoString);
    let bytes = CryptoJS.AES.decrypt(cryptoString, secretKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log("originalText ", originalText);

    await AsyncStorage.setItem("API_URL", originalText);
    await AsyncStorage.setItem("themeName", "1");
    await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
    dispatch(SetApiURL(originalText));
    Alert.alert("Thông báo", "Cấu hình thành công.", [
      {
        text: "Đóng",
        onPress: () => {
          setIsShow(false);
          RNRestart.Restart();
        },
      },
    ]);
  };
  const checkAPI = async (clientId) => {
    let rsCheck = await checkConfigAPI(clientId);
    if (rsCheck) {
      Alert.alert("Thông báo", "Cấu hình thành công.", [
        {
          text: "Đóng",
          onPress: () => {
            setIsShow(false);
            RNRestart.Restart();
          },
        },
      ]);
    } else {
      //checkoffline
      let rsCheckOffline = await checkConfigAPIOffline(clientId);
      console.log("check config ", rsCheckOffline);
      if (rsCheckOffline) {
        setLoad(false);
        Alert.alert("Thông báo", "Cấu hình thành công.", [
          {
            text: "Đóng",
            onPress: () => {
              setIsShow(false);
              RNRestart.Restart();
            },
          },
        ]);
      } else {
        setLoad(false);
        Alert.alert("Thông báo", "Cấu hình thất bại.", [
          {
            text: "Đóng",
          },
        ]);
      }
    }
    setLoad(false);
  };
  const checkConfigAPIOffline = (clientId) => {
    return new Promise(async (resolve) => {
      let flag = false;
      configAPI.forEach(async function (item) {
        if (item.CLIENT_ID.toLowerCase() == clientId.toLowerCase()) {
          flag = true;
          console.log("item ", item);
          await AsyncStorage.setItem("API_URL", item.API_NAME);
          await AsyncStorage.setItem("themeName", "1");
          await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
          dispatch(SetApiURL(item.API_NAME));
          resolve(true);
        }
      });
      if (flag) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };
  const checkConfigAPI = (clientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 10000);
      const URL =
        ServerIP.tvs + "User/CheckClient?clientId=" + clientId + "&clientKey=";
      console.log(URL);
      axios
        .post(URL, null)
        .then(async (response) => {
          console.log(response.data);
          if (response.data.data.length > 0) {
            await AsyncStorage.setItem(
              "API_URL",
              response.data.data[0].api_name
            );
            await AsyncStorage.setItem(
              "themeName",
              response.data.data[0].theme_type
            );
            await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
            // AsyncStorage.setItem('client_nm', response.data.data[0].client_nm);
            dispatch(SetApiURL(response.data.data[0].api_name));
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(async (error) => {
          console.log(error);
          resolve(false);
        });
    });
  };
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const CLIENT_ID = "";
    const API_URL = "";
    fetchData();
    async function fetchData() 
    {
      CLIENT_ID = await AsyncStorage.getItem("CLIENT_ID");
      API_URL = await AsyncStorage.getItem("API_URL");      
    }
    if (API_URL == "http://14.241.235.252:8081/api/" && CLIENT_ID == null) {
      setClientId("");
    } else if (API_URL == null && CLIENT_ID == null) {
      setClientId("");
    } else {
      setClientId(CLIENT_ID);
    }

    if (API_URL != "http://14.241.235.252:8081/api/" && CLIENT_ID == null) {
      if (configAPI != null && configAPI != []) {
        configAPI.forEach(async function (item) {
          if (item.API_NAME.toLowerCase() == API_URL.toLowerCase()) {
            console.log("item ", item);
            setClientId(item.CLIENT_ID.toUpperCase());
          }
        });
      }
    }

    AsyncStorage.getItem("firstLoadApp").then(async (rs) => {
      if (rs) {
        getTheme();
      } else {
        AsyncStorage.setItem("themeName", "1");
        AsyncStorage.setItem("API_URL", ServerIP.tvs);
        dispatch(SetApiURL(ServerIP.tvs));
        dispatch(sysLoadTheme(arr[0].color));
        AsyncStorage.setItem("firstLoadApp", "yes");
        setIsShow(true);
      }
    });
    const getTheme = async () => {
      try {
        const themeName = await AsyncStorage.getItem("themeName");
        if (!themeName) {
          setIsShow(true);
        } else {
          const tempTheme = arr.filter((i) => i.id === themeName)[0].color;
          dispatch(sysLoadTheme(tempTheme));
          navigation.replace("LoginScreen");
        }
      } catch (error) {}
    };
    return () => {};
  }, []);

  // const OnGetStorageData = async () => {
  //   const CONFIG_API = await AsyncStorage.getItem("CONFIG_API");
  //   console.log("CONFIG_API ", CONFIG_API);
  // };

  const OnGetDataConfig = async () => {
    const CONFIG_API = await AsyncStorage.getItem("CONFIG_API");
    console.log(ServerIP.tvs + "Exec/ExecNoAuth/");
    // if (CONFIG_API == null) {
    axios
      .post(ServerIP.tvs + "Exec/ExecNoAuth/", {
        pro: "SELHRDB000000",
        in_par: {
          p1_varchar2: "1.1.1",
        },
        out_par: {
          p1_sys: "lst_data",
        },
        machine_id: "mbi",
        token: "tvs",
        schema: "TS",
        site: "STV",
        obj: "MBI",
      })
      .then(async (rs) => {
        console.log(rs.data.data.lst_data);
        // if (CONFIG_API == null && rs.data.data.lst_data.length > 0) {
        //   await AsyncStorage.setItem(
        //     "CONFIG_API",
        //     JSON.stringify(rs.data.data.lst_data)
        //   );
        // }
        if (rs.data.data.lst_data.length > 0) {
          await AsyncStorage.setItem(
            "CONFIG_API",
            JSON.stringify(rs.data.data.lst_data)
          );
        }
      })
      .catch((err) => {
        console.log("err ", err);
      });
    // }
  };
  const [currentCaptcha, setCurrentCaptcha] = useState("");

  const handleCaptchaChange = (newCaptchaText) => {
    setCurrentCaptcha(newCaptchaText);
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(translation, {
      toValue: isKeyboardVisible ? -40 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isKeyboardVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        console.log("show");
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        console.log("hide");

        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return isShow ? (
    <SafeAreaView style={styles.container}>
      <Load visible={load} />
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateY: translation }],
          },
        ]}
      >
        <View style={{ marginBottom: 50 }}>
          <Text style={{ opacity: 0.5 }}>
            Vui lòng cấu hình ứng dụng nếu bạn không dùng hệ thống trên Cloud
            của chúng tôi. Liên hệ bộ phận quản trị nhân sự của bạn để cung cấp
            thông tin cấu hình.
          </Text>
        </View>
        <Text style={styles.title}>Cấu hình ứng dụng</Text>
        <View style={styles.render}>
          <View>
            <Text>Mã khách hàng</Text>
            <TextInput
              editable={true}
              value={ClientId}
              onChangeText={(value) => {
                setClientId(value);
              }}
              style={{
                marginBottom: 20,
                marginTop: 10,
                backgroundColor: ColorTV.Color.inputBackgroundColor,
                padding: Platform.OS == "ios" ? 10 : 5,
                borderRadius: 8,
              }}
            />
          </View>
          <View>
            <Text>Nhập vào các ký tự</Text>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  value={captchaText}
                  onChangeText={(value) => {
                    setCaptchaText(value);
                  }}
                  style={{
                    marginBottom: 20,
                    marginTop: 10,
                    backgroundColor: ColorTV.Color.inputBackgroundColor,
                    padding: Platform.OS == "ios" ? 10 : 5,
                    borderRadius: 8,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CaptchaComponent onCaptchaChange={handleCaptchaChange} />
              </View>
            </View>
          </View>
          {/* <Text>Current CAPTCHA: {currentCaptcha}</Text> */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <TVSButton
                buttonStyle={"3"}
                type={"danger"}
                icon={"close"}
                onPress={() => {
                  AsyncStorage.setItem("themeName", "1");
                  RNRestart.Restart();
                  // try {
                  //   AsyncStorage.getItem("oldTheme")
                  //     .then((rs) => {
                  //       console.log("===>", rs);
                  //       if (rs) {
                  //         if (rs === "1") {
                  //           AsyncStorage.setItem("themeName", "1");
                  //         } else {
                  //           AsyncStorage.setItem("themeName", "2");
                  //         }
                  //         RNRestart.Restart();
                  //       }
                  //     })
                  //     .catch((error) => {
                  //       console.log(error);
                  //     });
                  // } catch (error) {
                  //   console.log(error);
                  // }
                }}
              >
                Hủy bỏ
              </TVSButton>
            </View>
            <View style={{ flex: 1 }}>
              <TVSButton buttonStyle={"3"} onPress={onSave} icon={"check"}>
                Xác nhận
              </TVSButton>
            </View>
          </View>

          <View>
            <ScanQR checkApi={checkQR} />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  ) : (
    <View style={{ backgroundColor: "#01acec" }} />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    padding: 20,
    width: "90%",
    borderColor: ColorTV.Color.borderColor,
  },
  title: {
    color: ColorTV.Color.mainColor,
    fontWeight: "bold",
    fontSize: 20,
  },
  oneField: {
    backgroundColor: ColorTV.Color.inputBackgroundColor,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
  },
  render: {
    margin: 20,
  },
  oneNameView: {
    justifyContent: "center",
    alignItems: "center",
  },
  oneName: {},
});
export default ConfigThemeScreen;
