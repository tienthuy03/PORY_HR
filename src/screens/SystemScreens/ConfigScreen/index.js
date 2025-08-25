import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color } from '../../../assets/colors/colortv';
import { useDispatch } from 'react-redux';
import { SetApiURL, sysLoadTheme } from '../../../redux/slices/systemSlice';
import { ServerIP, configAPI } from '../../../config/clientConfig';
import axios from 'axios';
import CryptoJS from 'crypto-js';
const ConfigScreen = ({ onConfigurationSuccess }) => {
  const dispatch = useDispatch();
  const [clientId, setClientId] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [currentNumber, setCurrentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [isShow, setIsShow] = useState(false);

  // Tạo số ngẫu nhiên khi component mount
  useEffect(() => {
    generateRandomNumber();
  }, []);

  const generateRandomNumber = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Số 4 chữ số
    setCurrentNumber(randomNum.toString());
  };


  const onCancel = () => {
    // Handle cancel action
    Alert.alert("Thông báo", "Bạn có chắc muốn huỷ bỏ?", [
      { text: "Không" },
      {
        text: "Có",
        onPress: () => {
          // Handle cancel logic here
        }
      }
    ]);
  };

  const onSave = () => {
    if (clientId.length === 0) {
      Alert.alert("Thông báo", "Bạn chưa nhập Client Id.", [{ text: "Đóng" }]);
      return;
    }
    if (captchaText.length === 0) {
      Alert.alert("Thông báo", "Vui lòng nhập số xác nhận bên trên.", [
        { text: "Đóng" },
      ]);
      return;
    }
    let originNumber = currentNumber;
    let inputNumber = captchaText;
    console.log(captchaText);
    console.log(currentNumber);
    if (originNumber === inputNumber) {
      console.log("check");
      setLoad(true);
      checkAPI(clientId);
    } else {
      Alert.alert(
        "Thông báo",
        "Số xác nhận không trùng khớp vui lòng kiểm tra lại",
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

    await AsyncStorage.setItem("API_URL", originalText);
    await AsyncStorage.setItem("themeName", "1");
    await AsyncStorage.setItem("CLIENT_ID", clientId.toUpperCase());
    dispatch(SetApiURL(originalText));
    Alert.alert("Thông báo", "Cấu hình thành công.", [
      {
        text: "Đóng",
        onPress: () => {
          setIsShow(false);
          if (onConfigurationSuccess) {
            onConfigurationSuccess();
          }
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
            if (onConfigurationSuccess) {
              onConfigurationSuccess();
            }
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
              if (onConfigurationSuccess) {
                onConfigurationSuccess();
              }
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
  // Theme array - you'll need to define this based on your theme structure
  const arr = [
    { id: "1", color: { primary: "#007AFF", secondary: "#5856D6" } }
  ];

  useEffect(() => {
    const CLIENT_ID = "";
    const API_URL = "";
    fetchData();
    async function fetchData() {
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
          navigation.replace("LoginScreen"); // Commented out since navigation is not set up
        }
      } catch (error) { }
    };
    return () => { };
  }, []);


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


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cấu hình tài khoản</Text>

        <View style={styles.formContainer}>
          {/* Mã khách hàng */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mã khách hàng</Text>
            <View style={styles.inputContainer}>
              <Icon name="card-account-details" size={20} color={Color.textPrimary3} style={styles.inputIcon} />
              <TextInput
                value={clientId}
                onChangeText={setClientId}
                style={styles.input}
                placeholder="Nhập mã khách hàng"
                placeholderTextColor="#999"
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Số xác nhận */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số xác nhận</Text>
            <View style={styles.captchaContainer}>
              <View style={styles.captchaInputContainer}>
                <Icon name="shield-check" size={20} color={Color.textPrimary3} style={styles.inputIcon} />
                <TextInput
                  value={captchaText}
                  onChangeText={setCaptchaText}
                  style={styles.input}
                  placeholder="Nhập số xác nhận"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.captchaBox}>
                <Text style={styles.captchaText}>{currentNumber}</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Huỷ bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.disabledButton]}
              onPress={onSave}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: Color.textPrimary2,
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: Color.textPrimary3,
    fontFamily: 'Roboto-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 42,
    color: '#333',
    fontFamily: 'Roboto-Regular',
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captchaInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    marginRight: 10,
  },
  captchaBox: {
    width: 80,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  captchaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.mainColor,
    fontFamily: 'Roboto-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Color.mainColor,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});

export default ConfigScreen;