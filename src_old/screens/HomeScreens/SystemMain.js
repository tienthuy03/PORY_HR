/* eslint-disable react-native/no-inline-styles */
import NetInfo from "@react-native-community/netinfo";
import md5 from "md5";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DefaultPreference from "react-native-default-preference";
import RNRestart from "react-native-restart";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAction } from "../../actions";
import Block from "../../components/Block";
import Button from "../../components/Button";
import DropdownLogin from "../../components/DropdowLogin";
import RadioButton from "../../components/RadioButton";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import TVSControlPopup from "../../components/Tvs/ControlPopup";
import TVSPopup from "../../components/Tvs/Popup2";
import { APP_VERSION } from "../../config/Pro";
import IconDown from "../../icons/Back";
import Icon_email from "../../icons/Email";
import EyeClose from "../../icons/EyeClose";
import EyeOpen from "../../icons/EyeOpen";
import Icon_infor from "../../icons/Infor";
import Icon_next from "../../icons/Next";
import Icon_face from "../../icons/Face";
import Icon_finger from "../../icons/Finger";
import ShowError from "../../services/errors";
import {
  GetDataReceiceNotification,
  SetReveiceNotification,
} from "../../services/redux/System/action";
import sysFetch from "../../services/fetch";
import axios from "axios";
const { width, height } = Dimensions.get("screen");

const PROP = [
  {
    key: "VIE",
    text: "Việt Nam",
    url: require("../../assets/images/vietnam.png"),
  },
  {
    key: "ENG",
    text: "English",
    url: require("../../assets/images/uk.png"),
  },
  {
    key: "KOR",
    text: "Korea",
    url: require("../../assets/images/kor.png"),
  },
  {
    key: "CHI",
    text: "China",
    url: require("../../assets/images/china.png"),
  },
  {
    key: "JAP",
    text: "Japan",
    url: require("../../assets/images/japan.png"),
  },
  {
    key: "FRA",
    text: "France",
    url: require("../../assets/images/france.png"),
  },
];

const SystemMain = ({ navigation }) => {
  const dispatch = useDispatch();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const state = useSelector((state) => state);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  const loginReducers = useSelector((state) => state.loginReducers);
  let urlImageLogin;
  let fullnameLogin;
  let empIdLogin;
  try {
    urlImageLogin = loginReducers.data.data.avatar;
    fullnameLogin = loginReducers.data.data.full_name;
    empIdLogin = loginReducers.data.data.emp_id;
  } catch (error) {
    console.log("error home main2");
    console.log(error);
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCheckLoginVisible, setModalCheckLoginVisible] = useState(false);
  const [modalPass, setModalPass] = useState(false);
  const [modalPass1, setModalPass1] = useState(false);
  const [modalConfirmm, setModalConfirmm] = useState(false);
  const [values, setValue] = useState("");
  const [img, setImg] = useState();
  const [load, setLoad] = useState(false);
  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);
  const [eye3, setEye3] = useState(true);
  const [exist, setExist] = useState(false);
  const [modalQues, setModalQues] = useState(false);
  const [modalSetQuestionVisible, setModalSetQuestionVisible] = useState(false);

  const [emailDefault, setEmailDefault] = useState("");

  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question_1, setQuestion_1] = useState([]);
  const [question_2, setQuestion_2] = useState([]);
  const [value1, setValue1] = useState("- Chọn câu 1 -");
  const [pkValue1, setPkValue1] = useState("");
  const [code1, setCode1] = useState("");
  const [value2, setValue2] = useState("- Chọn câu 2 -");
  const [pkValue2, setPkValue2] = useState("");
  const [code2, setCode2] = useState("");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);

  const [emailValidate, setEmailValidate] = useState("");
  const [quesOld1, setQuesOld1] = useState("");
  const [quesOld2, setQuesOld2] = useState("");
  const [quesValue1, setQuesValue1] = useState("");
  const [quesValue2, setQuesValue2] = useState("");

  const [emailChange, setEmailChange] = useState("");
  const [emailOld, setEmailOld] = useState("");

  const [passwordChange, setPasswordChange] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwords, setPasswords] = useState("");
  const [status, setStatus] = useState();
  const [valueAuthen, setValueAuthen] = useState("");
  const [checkLogin, setCheckLogin] = useState();

  //State language
  const [changeLanguage, setChanguage] = useState("Thay đổi ngôn ngữ");
  // const [inforApp, setInforApp] = useState('app_inf');
  const [logOut, setLogOut] = useState("Đăng xuất");
  const [changePass, setchangePass] = useState("Đổi mật khẩu");
  const [system, setSystem] = useState("Hệ thống");
  // const [authenLanguage, setAuthenLanguage] = useState('');
  const [securityMethod, setSecurityMethod] = useState("Phương thức bảo mật");
  const [loginWithFaceOrFinger, setLoginWithFaceOrFinger] = useState(
    "Đăng nhập bằng khuôn mặt hoặc vân tay"
  );
  const [fingerLogin, setFingerLogin] = useState();
  // const [notification, setNotification] = useState(false);
  const [ReceiveNotification, setReceiveNotification] =
    useState("Nhận thông báo");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const isReceiveNotification = useSelector(
    (state) => state.SystemReducer.receiveNotification
  );
  let language;
  let loadLanguage;
  let user_name;
  let pass;
  let fullname;
  let emp_pk;
  let dataLanguage;
  try {
    loadLanguage = state.languageReducer.isLoading;
    language =
      state.loginReducers.data.data.user_language == undefined
        ? "VIE"
        : state.loginReducers.data.data.user_language;
    user_name = state.loginReducers.user_name;
    pass = state.loginReducers.pass_word;
    fullname = state.loginReducers.data.data.full_name;
    tokenss = state.loginReducers.data.data.tokenLogin;
    emp_pk = state.loginReducers.data.data.thr_emp_pk;
    dataLanguage = state.languageReducer.data.data.language;
  } catch (error) {
    //
  }
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );

  //Thông báo vân tay or khuôn mặt
  const modalCheckLogin = (
    <TVSPopup
      title={"Kích hoạt đăng nhập nhanh"}
      isShow={modalCheckLoginVisible}
      onHide={() => {
        DefaultPreference.set("temp", "1");
        setModalCheckLoginVisible(false);
      }}
      onAccept={() => activeLoginFast()}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        {valueAuthen === "face_id" ? (
          <Icon_face style={{ width: 50, height: 50, marginRight: 20 }} />
        ) : (
          <Icon_finger style={{ width: 50, height: 50, marginRight: 20 }} />
        )}
      </View>
      <View>
        <Text
          style={{
            marginBottom: 5,
            textAlign: "center",
          }}
        >
          Bạn có muốn sử dụng{""}{" "}
          {valueAuthen == "face_id" ? "nhận dạng khuôn mặt" : "vân tay"}
          {""} để đăng nhập nhanh?
        </Text>
      </View>
    </TVSPopup>
  );

  const activeLoginFast = async () => {
    DefaultPreference.getAll().then((valueAll) => {
      setPasswords(valueAll.passwords);
    });
    save();
  };

  useEffect(() => {
    // getQuestions();
    DefaultPreference.getAll().then((valueAll) => {
      setValueAuthen(valueAll.nameAuthen);
      console.log("valueAll.temp", valueAll.temp);
      console.log("valueAll.status", valueAll.status);
      if (valueAll.status === "1") {
        setCheckLogin(true);
      } else if (valueAll.status === "11") {
        if (valueAll.temp === "1") {
          setCheckLogin(true);
        } else {
          setCheckLogin(false);
        }
      } else {
        if (valueAll.temp === "1") {
          setCheckLogin(true);
        } else {
          setCheckLogin(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (checkLogin === false && valueAuthen !== undefined) {
      setModalCheckLoginVisible(true);
    }
  }, [fingerLogin]);

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
        if (obj == "updatePass") {
          updatePass();
        }
        if (obj == "updateConfirm") {
          updateConfirm(p1);
        }
        if (obj == "confirmValidate") {
          confirmValidate();
        }
        if (obj == "deleteDataUser") {
          deleteDataUser();
        }
      })
      .catch((error) => {
        if (
          error == "AxiosError: Request failed with status code 400" &&
          obj !== "deleteDataUser"
        ) {
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
        if (
          error == "AxiosError: Request failed with status code 400" &&
          obj == "deleteDataUser"
        ) {
          console.log("error refresh ", error);
          DefaultPreference.set("logout", "true");

          RNRestart.Restart();
        }
      });
  };
  const setDialogPass = () => {
    setModalPass(true);
  };
  const getState1 = async (result) => {
    setTimeout(() => {
      setPkValue1(result.pk);
      setValue1(result.ques_name);
      setCode1(result.ques_code);
      setCheck1(false);
    }, 100);
  };

  const getState2 = async (result) => {
    setTimeout(() => {
      setPkValue2(result.pk);
      setValue2(result.ques_name);
      setCode2(result.ques_code);
      setCheck2(false);
    }, 100);
  };

  useEffect(() => {
    DefaultPreference.getAll().then((valueAll) => {
      if (valueAll.status === "1") {
        setStatus(true);
      } else if (valueAll.status === "11") {
        setStatus(false);
      } else {
        setStatus(false);
      }
    });
  }, [status]);
  useEffect(() => {
    dispatch(GetDataReceiceNotification());
  }, []);
  const checkEmailnull = () => {
    if (emailChange == "") {
      return true;
    } else {
      return false;
    }
  };

  function checkAuthens() {
    if (
      valueAuthen === "face_id" ||
      valueAuthen === "touch_id" ||
      valueAuthen === "finger_print"
    ) {
      return (
        <Button
          shadow
          height={60}
          justifyContent={"space-between"}
          alignCenter
          marginLeft={20}
          marginRight={20}
          marginBottom={10}
          radius={8}
          row
          nextScreen={() => setModalPass(true)}
          backgroundColor={Color.tabColor}
        >
          {valueAuthen == "face_id" ? (
            <MaterialCommunityIcons
              name="face-recognition"
              size={20}
              style={{ marginLeft: 5, color: Color.mainColor }}
            />
          ) : (
            <MaterialCommunityIcons
              name="fingerprint"
              size={20}
              style={{ marginLeft: 5, color: Color.mainColor }}
            />
          )}
          <Text
            flex
            paddingLeft={10}
            height={60}
            size={16}
            color={Color.mainColor}
            fontFamily={"Roboto-Bold"}
          >
            {loginWithFaceOrFinger}
          </Text>
          <Switch
            value={status}
            style={{ marginRight: 10 }}
            onValueChange={setDialogPass}
          />
        </Button>
      );
    }
  }

  function save() {
    DefaultPreference.get("passwords").then((passwords) => {
      const pass_md5 = md5(passwords);
      if (status === false) {
        if (pass_md5 === pass) {
          DefaultPreference.set("password", passwords);
          DefaultPreference.set("status", "1");
          DefaultPreference.set("nameAuthen", valueAuthen);
          setStatus(true);
          setPasswords("");
          setModalPass(false);
        } else if (pass !== pass_md5) {
          Alert.alert("Mật khẩu không trùng khớp!");
        }
      } else if (status === true) {
        if (pass_md5 === pass) {
          DefaultPreference.set("status", "11");
          DefaultPreference.set("nameAuthen", valueAuthen);
          setStatus(false);
          setModalPass(false);
          setPasswords("");
        } else if (pass !== pass_md5) {
          Alert.alert("Mật khẩu không trùng khớp!");
        }
      }
    });
  }

  const getState = async (result) => {
    setValue(result.val);
  };

  const changeLanguages = (user_language) => {
    dispatch(
      updateUserAction({ index: 0, value: user_language, key: "user_language" })
    );
    DefaultPreference.set("userLanguage", user_language);
    setModalVisible(false);
  };

  useEffect(() => {
    DefaultPreference.getAll().then((valueAll) => {
      if (valueAll.status === "1") {
        setStatus(true);
      } else {
        setStatus(false);
      }
      if (language === "VIE") {
        setImg(require("../../assets/images/vietnam.png"));
      } else if (language === "ENG") {
        setImg(require("../../assets/images/uk.png"));
      } else if (language === "KOR") {
        setImg(require("../../assets/images/kor.png"));
      } else if (language === "CHI") {
        setImg(require("../../assets/images/china.png"));
      } else if (language === "JAP") {
        setImg(require("../../assets/images/japan.png"));
      } else if (language === "FRA") {
        setImg(require("../../assets/images/france.png"));
      }
      try {
        dataLanguage.filter((item) => {
          var lowerLanguage = language.toLowerCase();
          if (item.field_name === "change_language") {
            setChanguage(item[lowerLanguage]);
          }
          // if (item.field_name === 'app_inf') {
          //   setInforApp(item[lowerLanguage]);
          // }
          if (item.field_name === "log_out") {
            setLogOut(item[lowerLanguage]);
          }
          if (item.field_name === "change_pass") {
            setchangePass(item[lowerLanguage]);
          }
          if (item.field_name === "security_method") {
            setSecurityMethod(item[lowerLanguage]);
          }
          if (item.field_name === "receive_notification") {
            setReceiveNotification(item[lowerLanguage]);
          }
          if (item.field_name === "finger_login") {
            setFingerLogin(item[lowerLanguage]);
          }
          if (item.field_name === "system") {
            setSystem(item[lowerLanguage]);
          }

          if (valueAuthen == "face_id") {
            if (item.field_name === "face_login") {
              setLoginWithFaceOrFinger(item[lowerLanguage]);
            }
          } else {
            if (item.field_name === "finger_login") {
              setLoginWithFaceOrFinger(item[lowerLanguage]);
            }
          }

          // if (item.field_name === valueAll.nameAuthen) {
          //   setAuthenLanguage(item[lowerLanguage]);
          // }
        });
      } catch (error) {}
    });
  }, [language, loadLanguage]);
  const CustomProgressBar = ({ visible }) => (
    <Modal transparent={true} onRequestClose={() => null} visible={visible}>
      <Block flex alignCenter justifyCenter backgroundColor={"rgba(0,0,0,0.2)"}>
        <Block
          alignCenter
          width={150}
          height={100}
          borderRadius={10}
          backgroundColor={Color.white}
          padding={25}
        >
          <Text size={15} fontWeight={"200"}>
            Loading
          </Text>
          <ActivityIndicator size="small" color="grey" />
        </Block>
      </Block>
    </Modal>
  );
  const modalConfirm = (
    <Modal animationType="fade" transparent={true} visible={modalConfirmm}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          justifyContent: "flex-end",
        }}
        behavior={Platform.OS === "ios" ? "padding" : ""}
        enabled
      >
        <Block
          backgroundColor={"rgba(0,0,0,0.4)"}
          flex
          justifyCenter
          alignCenter
        >
          <Block
            backgroundColor={Color.white}
            width={width * 0.8}
            radius={10}
            paddingTop={15}
            alignSelf={"stretch"}
          >
            <Block alignCenter justifyCenter>
              <Text
                fontFamily={"Roboto-Bold"}
                size={20}
                color={Color.mainColor}
              >
                Nhập email
              </Text>
            </Block>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              margin={5}
              alignCenter
              backgroundColor={Color.gray}
              row
            >
              <Icon_email />
              <TextInput
                flex
                height={55}
                paddingLeft={15}
                placeholder={"Email"}
                autoCompleteType={"email"}
                placeholderTextColor={Color.grayPlahoder}
                defaultValue={emailDefault}
                onChangeText={(emailChange) => setEmailChange(emailChange)}
              />
            </Block>
            <Block
              row
              justifyContent={"space-between"}
              marginBottom={10}
              alignCenter
            >
              <Button
                padding={15}
                margin={5}
                alignCenter
                flex
                radius={4}
                backgroundColor={Color.gray}
                nextScreen={() => {
                  setModalConfirmm(false),
                    setModalQues(true),
                    setEmailChange("");
                }}
              >
                <Text color={Color.red}>Bỏ qua</Text>
              </Button>

              <Button
                nextScreen={() => {
                  setValidateMail();
                }}
                padding={15}
                alignCenter
                margin={5}
                radius={4}
                backgroundColor={Color.gray}
                flex
              >
                <Text color={Color.green}>Xác nhận</Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    </Modal>
  );

  const modalConfirmQues = (
    <Modal animationType="fade" transparent={true} visible={modalQues}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          justifyContent: "flex-end",
        }}
        behavior={Platform.OS === "ios" ? "padding" : ""}
        enabled
      >
        <Block
          backgroundColor={"rgba(0,0,0,0.4)"}
          flex
          justifyCenter
          alignCenter
        >
          <Block
            padding={10}
            backgroundColor={Color.white}
            marginLeft={10}
            marginRight={10}
            radius={10}
            width={width * 0.9}
          >
            <Text
              color={Color.mainColor}
              size={18}
              fontFamily={"Roboto-Medium"}
            >
              Chọn câu hỏi bảo mật?
            </Text>
            <Block
              radius={10}
              marginLeft={10}
              marginRight={10}
              alignCenter
              paddingBottom={10}
              backgroundColor={Color.white}
            >
              <Button
                nextScreen={() => setCheck1(true)}
                height={60}
                row
                alignCenter
                borderBottomWidth={1}
                borderBottomColor={"rgba(0,0,0,0.2)"}
                justifyContent={"space-between"}
              >
                <Text
                  paddingRight={20}
                  color={Color.mainColor}
                  flex
                  fontFamily={"Roboto-Medium"}
                  size={16}
                  paddingLeft={10}
                  height={60}
                >
                  {value1}
                </Text>
                <Block
                  paddingBottom={30}
                  style={{ transform: [{ rotate: "-90deg" }] }}
                >
                  <IconDown color={Color.mainColor} />
                </Block>
              </Button>
              {modalPK1}
              <Block
                marginTop={10}
                paddingLeft={20}
                radius={8}
                height={55}
                alignCenter
                row
                backgroundColor={Color.inputBackgroundColor}
              >
                <TextInput
                  flex
                  height={55}
                  fontFamily={"Roboto-Medium"}
                  placeholder={"Nhập câu trả lời"}
                  color={Color.mainColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={question1}
                  onChangeText={(text) => setQuestion1(text)}
                />
              </Block>
              <Button
                nextScreen={() => setCheck2(true)}
                height={60}
                row
                alignCenter
                borderBottomWidth={1}
                borderBottomColor={"rgba(0,0,0,0.2)"}
                justifyContent={"space-between"}
              >
                <Text
                  paddingRight={20}
                  color={Color.mainColor}
                  flex
                  fontFamily={"Roboto-Medium"}
                  size={16}
                  paddingLeft={10}
                  height={60}
                >
                  {value2}
                </Text>
                <Block
                  paddingBottom={30}
                  style={{ transform: [{ rotate: "-90deg" }] }}
                >
                  <IconDown color={Color.mainColor} />
                </Block>
              </Button>
              {modalPK2}
              <Block
                marginTop={10}
                paddingLeft={20}
                radius={8}
                height={55}
                alignCenter
                row
                backgroundColor={Color.inputBackgroundColor}
              >
                <TextInput
                  flex
                  height={55}
                  fontFamily={"Roboto-Medium"}
                  placeholder={"Nhập câu trả lời"}
                  color={Color.mainColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={question2}
                  onChangeText={(text) => setQuestion2(text)}
                />
              </Block>
            </Block>
            <Block shadow>
              <Block
                height={80}
                borderTopLeftRadius={8}
                borderTopRightRadius={8}
                justifyEnd
                alignCenter
              >
                <Button
                  nextScreen={() => setValidate()}
                  backgroundColor={Color.mainColor}
                  height={60}
                  row
                  width={"90%"}
                  radius={10}
                  alignCenter
                  justifyCenter
                >
                  <Text
                    fontFamily={"Roboto-Bold"}
                    color={Color.white}
                    size={20}
                  >
                    Xác nhận
                  </Text>
                </Button>
              </Block>
              <Block alignCenter paddingBottom={20} marginTop={5}>
                <Button
                  nextScreen={() => {
                    if (checkEmailnull()) {
                      Alert.alert(
                        "Xác thực bảo mật",
                        "Chưa nhập bất kỳ thông tin gì, thông tin bảo mật sẽ bị hủy cập nhật",
                        [
                          {
                            text: "Hủy bỏ",
                            onPress: () => {
                              setEmailChange(emailDefault);
                            },
                            style: "cancel",
                          },
                          {
                            text: "Xác nhận",
                            onPress: () => {
                              setModalQues(false);
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      Alert.alert(
                        "Xác thực bảo mật",
                        "Xác nhận phương thức bảo mật?",
                        [
                          {
                            text: "Hủy bỏ",
                            onPress: () => {
                              setEmailChange(emailDefault);
                            },
                            style: "cancel",
                          },
                          {
                            text: "Xác nhận",
                            onPress: () => {
                              setModalQues(true);
                              updateConfirm(true);
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                >
                  <Text
                    fontFamily={"Roboto-Medium"}
                    size={16}
                    textDecorationLine={"underline"}
                  >
                    Bỏ qua
                  </Text>
                </Button>
              </Block>
              <Block alignCenter paddingBottom={20} marginTop={5}>
                <Button
                  nextScreen={() => {
                    setModalConfirmm(true);
                    setModalQues(false);
                  }}
                >
                  <Text
                    fontFamily={"Roboto-Medium"}
                    size={16}
                    textDecorationLine={"underline"}
                  >
                    Trở về nhập Email
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    </Modal>
  );

  const modal = (
    <TVSControlPopup
      onHide={() => setModalVisible(false)}
      isShow={modalVisible}
      title={"Thay đổi ngôn ngữ"}
      onAccept={() => changeLanguages(values)}
    >
      <RadioButton PROP={PROP} getState={getState} keys={language} />
    </TVSControlPopup>
  );

  const modalPasss = (
    <TVSControlPopup
      title={
        valueAuthen === "face_id"
          ? "Đăng nhập bằng khuôn mặt"
          : "Đăng nhập bằng vân tay"
      }
      isShow={modalPass}
      onHide={() => {
        setModalPass(false);
        setPasswords("");
      }}
      onAccept={save}
    >
      <View>
        <Text
          style={{
            marginBottom: 5,
          }}
        >
          Xác nhận mật khẩu
        </Text>
      </View>
      <Block
        paddingLeft={20}
        radius={8}
        margin={5}
        alignCenter
        backgroundColor={Color.gray}
        row
      >
        <MaterialCommunityIcons
          name="account-lock-outline"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        />
        <TextInput
          flex
          height={55}
          paddingLeft={15}
          placeholder={"Mật khẩu"}
          autoCompleteType={"password"}
          placeholderTextColor={Color.grayPlahoder}
          secureTextEntry={true}
          value={passwords}
          onChangeText={(password) => setPasswords(password)}
        />
      </Block>
    </TVSControlPopup>
  );
  const deleteDataChange = async () => {
    setLoad(true);
    await setTimeout(() => {
      setEmailChange("");
      setQuestion1("");
      setQuestion2("");
      setValue1("- Chọn câu 1 -");
      setValue2("- Chọn câu 2 -");
      setPkValue1("");
      setPkValue2("");
      setCode1("");
      setCode2("");
      setLoad(false);
    }, 1000);
  };

  const setValidateMail = () => {
    var check = /\S+@\S+\.\S+/;
    var checkMail = check.test(emailChange);
    if (emailChange == "") {
      dialogNoti("Vui lòng không để trống email!");
      return;
    }
    if (!checkMail) {
      dialogNoti("Vui lòng nhập đúng đinh dạng email!");
      return;
    }
    setModalConfirmm(false);
    setModalQues(true);
  };

  const setValidate = () => {
    if (pkValue1 == "") {
      dialogNoti("Vui lòng chọn câu hỏi thứ nhất!");
      return;
    }
    if (question1 == "") {
      dialogNoti("Vui lòng nhập câu trả lời thứ nhất!");
      return;
    }
    if (pkValue2 == "") {
      dialogNoti("Vui lòng chọn câu hỏi thứ hai!");
      return;
    }
    if (question2 == "") {
      dialogNoti("Vui lòng nhập câu trả lời thứ hai!");
      return;
    }
    Alert.alert(
      "Xác thực bảo mật",
      "Xác nhận phương thức bảo mật?",
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
                updateConfirm(false);
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
  const validate = () => {
    if (passwordOld === "") {
      dialogNoti("Vui lòng nhập mật khẩu cũ!");
      return;
    }
    if (passwordChange === "") {
      dialogNoti("Vui lòng nhập mật khẩu mới!");
      return;
    }
    if (passwordConfirm === "") {
      dialogNoti("Vui lòng nhập mật khẩu xác nhận!");
      return;
    }

    if (passwordChange !== passwordConfirm) {
      dialogNoti("Xác nhận mật khẩu không trùng khớp!");
      return;
    }

    Alert.alert(
      "Đổi mật khẩu",
      "Bạn có muốn đổi mật khẩu?",
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
                updatePass();
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

  const deleteDataUser = async () => {
    //dispatch({type: RESET_STORE});
    //DefaultPreference.clearAll();
    axios
      .post(API + "User/RevokeToken/", {
        token: tokenLogin,
        userPk: userPk,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error == "AxiosError: Request failed with status code 401") {
          refreshNewToken("deleteDataUser");
        }
        console.log("error logout ", error);
      });
    // RNRestart.Restart();
  };

  const updateConfirm = async (props) => {
    setLoad(true);
    if (isCreate == true) {
      if (props == true) {
        sysFetch(
          API,
          {
            pro: "INSCFQP0010100",
            in_par: {
              p1_varchar2: emp_pk,
              p2_varchar2: emailChange,
              p3_varchar2: null,
              p4_varchar2: null,
              p5_varchar2: null,
              p6_varchar2: null,
            },
            out_par: {
              p1_varchar2: "out_question",
            },
          },
          tokenLogin
        )
          .then((rs) => {
            if (rs == "Token Expired") {
              refreshNewToken("updateConfirm", props);
            }
            if (rs != "Token Expired") {
              if (rs.results === "S") {
                Alert.alert("Thông báo", "Xác nhận thành công!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      setIsCreate(false);
                      setLoad(false);
                    },
                  },
                ]);
              }
              if (rs.results === "F") {
                setLoad(false);
                Alert.alert("Thông báo", "Hệ thống lỗi!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      setLoad(false);
                    },
                  },
                ]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        sysFetch(
          API,
          {
            pro: "INSCFQP0010100",
            in_par: {
              p1_varchar2: emp_pk,
              p2_varchar2: emailChange,
              p3_varchar2: code1,
              p4_varchar2: question1,
              p5_varchar2: code2,
              p6_varchar2: question2,
            },
            out_par: {
              p1_varchar2: "out_question",
            },
          },
          tokenLogin
        )
          .then((rs) => {
            if (rs == "Token Expired") {
              refreshNewToken("updateConfirm", props);
            }
            if (rs != "Token Expired") {
              if (rs.results === "S") {
                Alert.alert("Thông báo", "Xác nhận thành công!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      setIsCreate(false);
                      setLoad(false);
                    },
                  },
                ]);
              }
              if (rs.results === "F") {
                setLoad(false);
                Alert.alert("Thông báo", "Hệ thống lỗi!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      setLoad(false);
                    },
                  },
                ]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (isUpdate == true) {
      if (props == true) {
        sysFetch(
          API,
          {
            pro: "UPDCFQP0010100",
            in_par: {
              p1_varchar2: emp_pk,
              p2_varchar2: emailChange,
              p3_varchar2: null,
              p4_varchar2: null,
              p5_varchar2: null,
              p6_varchar2: null,
            },
            out_par: {
              p1_varchar2: "out_question",
            },
          },
          tokenLogin
        )
          .then((rs) => {
            if (rs == "Token Expired") {
              refreshNewToken("updateConfirm", props);
            }
            if (rs != "Token Expired") {
              if (rs.results === "S") {
                Alert.alert("Thông báo", "Xác nhận thành công!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      deleteDataChange();
                      setModalQues(false);
                      setIsUpdate(false);
                    },
                  },
                ]);
              }
              if (rs.results === "F") {
                setLoad(false);
                Alert.alert("Thông báo", "Hệ thống lỗi!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      setLoad(false);
                    },
                  },
                ]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        sysFetch(
          API,
          {
            pro: "UPDCFQP0010100",
            in_par: {
              p1_varchar2: emp_pk,
              p2_varchar2: emailChange,
              p3_varchar2: code1,
              p4_varchar2: question1,
              p5_varchar2: code2,
              p6_varchar2: question2,
            },
            out_par: {
              p1_varchar2: "out_question",
            },
          },
          tokenLogin
        )
          .then((rs) => {
            if (rs == "Token Expired") {
              refreshNewToken("updateConfirm", props);
            }
            if (rs != "Token Expired") {
              if (rs.results === "S") {
                Alert.alert("Thông báo", "Xác nhận thành công!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      deleteDataChange();
                      setModalQues(false);
                      setIsUpdate(false);
                    },
                  },
                ]);
              }
              if (rs.results === "F") {
                setLoad(false);
                Alert.alert("Thông báo", "Hệ thống lỗi!", [
                  {
                    text: "Thoát",
                    onPress: async () => {
                      setLoad(false);
                    },
                  },
                ]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const modalConfirmExist = (
    <Modal animationType="fade" transparent={true} visible={exist}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          justifyContent: "flex-end",
        }}
        behavior={Platform.OS === "ios" ? "padding" : ""}
        enabled
      >
        <Block
          backgroundColor={"rgba(0,0,0,0.4)"}
          flex
          justifyCenter
          alignCenter
        >
          <Block
            backgroundColor={Color.white}
            width={width * 0.9}
            radius={10}
            paddingTop={15}
            alignSelf={"stretch"}
          >
            <Block alignCenter justifyCenter>
              <Text
                fontFamily={"Roboto-Bold"}
                size={20}
                color={Color.mainColor}
              >
                Thông tin bảo mật đã chọn
              </Text>
            </Block>
            <Block margin={5} height={20}>
              <Text
                fontFamily={"Roboto-Bold"}
                size={15}
                color={Color.mainColor}
              >
                Email:
              </Text>
            </Block>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              margin={5}
              alignCenter
              backgroundColor={Color.gray}
              row
            >
              <Icon_email />
              <TextInput
                flex
                height={55}
                paddingLeft={15}
                editable={false}
                defaultValue={emailValidate}
                placeholder="Chưa cập nhật email"
              />
            </Block>
            <Block margin={5} height={35}>
              <Text
                fontFamily={"Roboto-Bold"}
                size={17}
                color={Color.mainColor}
              >
                Câu hỏi bí mật 1:
              </Text>
              <Text size={15} color={Color.mainColor}>
                {quesOld1}
              </Text>
            </Block>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              margin={5}
              alignCenter
              backgroundColor={Color.gray}
              row
            >
              <Icon_infor />

              <TextInput
                flex
                height={55}
                paddingLeft={15}
                placeholderTextColor={Color.grayPlahoder}
                defaultValue={quesValue1}
                editable={false}
                placeholder="Chưa có câu trả lời"
              />
            </Block>
            <Block margin={5} height={35}>
              <Text
                fontFamily={"Roboto-Bold"}
                size={17}
                color={Color.mainColor}
              >
                Câu hỏi bí mật 2:
              </Text>
              <Text size={15} color={Color.mainColor}>
                {quesOld2}
              </Text>
            </Block>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              margin={5}
              alignCenter
              backgroundColor={Color.gray}
              row
            >
              <Icon_infor />

              <TextInput
                flex
                height={55}
                paddingLeft={15}
                placeholderTextColor={Color.grayPlahoder}
                defaultValue={quesValue2}
                editable={false}
                placeholder="Chưa có câu trả lời"
              />
            </Block>
            <Block
              row
              justifyContent={"space-between"}
              marginBottom={10}
              alignCenter
            >
              <Button
                padding={15}
                margin={5}
                alignCenter
                flex
                radius={4}
                backgroundColor={Color.gray}
                nextScreen={() => {
                  setExist(false);
                }}
              >
                <Text color={Color.red}>Đóng</Text>
              </Button>

              <Button
                nextScreen={() => {
                  setIsUpdate(true);
                  setEmailDefault(emailValidate);
                  setEmailChange(emailValidate);
                  setModalConfirmm(true);
                  setExist(false);
                }}
                padding={15}
                alignCenter
                margin={5}
                radius={4}
                backgroundColor={Color.gray}
                flex
              >
                <Text color={Color.green}>Thay đổi</Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    </Modal>
  );

  const confirmValidate = async () => {
    setLoad(true);

    sysFetch(
      API,
      {
        pro: "SELCFQP0013100",
        in_par: {
          p1_varchar2: emp_pk,
        },
        out_par: {
          p1_varchar2: "ques1Code",
          p2_varchar2: "ques2Code",
          p3_varchar2: "ques1",
          p4_varchar2: "ques2",
          p5_varchar2: "value1",
          p6_varchar2: "value2",
          p7_varchar2: "email",
          p8_varchar2: "count",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("confirmValidate", null);
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            if (res.data.count == "1") {
              if (res.data.email == "null") {
                setEmailValidate("");
              } else {
                setEmailValidate(res.data.email);
              }
              if (res.data.ques1Code == "null") {
                setQuesOld1("Chưa chọn câu hỏi bí mật");
                setQuesValue1("");
                setQuesOld2("Chưa chọn câu hỏi bí mật");
                setQuesValue2("");
              } else {
                setQuesOld1(res.data.ques1);
                setQuesOld2(res.data.ques2);
                setQuesValue1(res.data.value1);
                setQuesValue2(res.data.value2);
              }
              setLoad(false);
              setExist(true);
            }
          }
          if (rs.results === "F") {
            setLoad(false);
            Alert.alert(
              "Chưa cập nhật thông tin bảo mật",
              "Xác nhận cập nhật?",
              [
                {
                  text: "Xác nhận",
                  onPress: async () => {
                    setEmailDefault(emailOld);
                    setEmailChange(emailOld);
                    setModalConfirmm(true);
                    setIsCreate(true);
                    setLoad(false);
                  },
                },
              ]
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePass = async () => {
    // setModalPass1(false);
    setLoad(true);
    let pass_old = md5(passwordOld);
    let pass_new = md5(passwordChange);
    sysFetch(
      API,
      {
        pro: "UPDGSAU0040100",
        in_par: {
          p1_varchar2: user_name,
          p2_varchar2: pass_old,
          p3_varchar2: pass_new,
        },
        out_par: {
          p1_varchar2: "alert",
          p2_varchar2: "output",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("updatePass", null);
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            if (rs.data.output === "Y") {
              setLoad(false);
              Alert.alert("Thông báo", rs.data.alert, [
                {
                  text: "Thoát",
                  onPress: async () => {
                    setTimeout(async () => {
                      setModalPass1(false);
                      deleteDataUser();
                    }, 0);
                  },
                },
              ]);
            } else if (rs.data.output === "N") {
              setLoad(false);
              Alert.alert("Thông báo", rs.data.alert, [
                {
                  text: "Thoát",
                  onPress: async () => {
                    setModalPass1(false);
                  },
                },
              ]);
            }
          }
          if (rs.results === "F") {
            setLoad(false);
            Alert.alert("Thông báo", "Hệ thống lỗi!", [
              {
                text: "Thoát",
                onPress: async () => {
                  setModalPass1(false);
                  console.log("Error");
                },
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalChangePass = (
    <TVSControlPopup
      title={changePass}
      isShow={modalPass1}
      onHide={() => setModalPass1(false)}
      onAccept={validate}
    >
      <Text>Mật khẩu cũ</Text>
      <Block
        paddingLeft={20}
        radius={8}
        height={55}
        marginTop={10}
        marginBottom={15}
        alignCenter
        backgroundColor={Color.gray}
        row
      >
        <MaterialCommunityIcons
          name="lock"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        />
        <TextInput
          flex
          height={55}
          paddingLeft={15}
          placeholder={"Nhập mật khẩu cũ"}
          autoCompleteType={"password"}
          placeholderTextColor={Color.grayPlahoder}
          secureTextEntry={eye1}
          value={passwordOld}
          onChangeText={(password) => setPasswordOld(password)}
        />
        <Button
          justifyCenter
          height={30}
          width={30}
          nextScreen={() => setEye1(!eye1)}
        >
          {eye1 ? <EyeOpen /> : <EyeClose />}
        </Button>
      </Block>
      <Text>Mật khẩu mới</Text>
      <Block
        marginTop={2}
        paddingLeft={20}
        radius={8}
        height={55}
        // marginTop={10}
        marginBottom={15}
        alignCenter
        backgroundColor={Color.gray}
        row
      >
        <MaterialCommunityIcons
          name="lock"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        />
        <TextInput
          flex
          height={55}
          paddingLeft={15}
          placeholder={"Nhập mật khẩu mới"}
          autoCompleteType={"password"}
          placeholderTextColor={Color.grayPlahoder}
          secureTextEntry={eye2}
          value={passwordChange}
          onChangeText={(password) => setPasswordChange(password)}
        />
        <Button
          justifyCenter
          height={30}
          width={30}
          nextScreen={() => setEye2(!eye2)}
        >
          {eye2 ? <EyeOpen /> : <EyeClose />}
        </Button>
      </Block>
      <Text>Nhập lại mật khẩu mới</Text>
      <Block
        marginTop={10}
        paddingLeft={20}
        radius={8}
        height={55}
        alignCenter
        backgroundColor={Color.gray}
        row
      >
        <MaterialCommunityIcons
          name="lock"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        />
        <TextInput
          flex
          height={55}
          paddingLeft={15}
          placeholder={"Xác nhận mật khẩu"}
          autoCompleteType={"password"}
          placeholderTextColor={Color.grayPlahoder}
          secureTextEntry={eye3}
          value={passwordConfirm}
          onChangeText={(password) => setPasswordConfirm(password)}
        />
        <Button
          justifyCenter
          height={30}
          width={30}
          nextScreen={() => setEye3(!eye3)}
        >
          {eye3 ? <EyeOpen /> : <EyeClose />}
        </Button>
      </Block>
    </TVSControlPopup>
  );

  const modalPK1 = (
    <Modal animationType="fade" transparent={true} visible={check1}>
      <Block flex backgroundColor={"rgba(0,0,0,0.3)"} justifyCenter alignCenter>
        <Block
          backgroundColor={Color.white}
          width={width * 0.9}
          justifyCenter
          radius={10}
          paddingTop={15}
        >
          <Block paddingLeft={10} paddingRight={10}>
            <ScrollView>
              <DropdownLogin
                PROP={question_1.filter((value) => value.pk !== pkValue2)}
                getState={getState1}
                pk={pkValue1}
              />
            </ScrollView>
          </Block>
        </Block>
      </Block>
    </Modal>
  );

  const modalPK2 = (
    <Modal animationType="fade" transparent={true} visible={check2}>
      <Block flex backgroundColor={"rgba(0,0,0,0.3)"} justifyCenter alignCenter>
        <Block
          backgroundColor={Color.white}
          width={width * 0.9}
          justifyCenter
          radius={10}
          paddingTop={15}
        >
          <Block paddingLeft={10} paddingRight={10}>
            <ScrollView>
              <DropdownLogin
                PROP={question_2.filter((value) => value.pk !== pkValue1)}
                getState={getState2}
                pk={pkValue2}
              />
            </ScrollView>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
  function dialogNoti(text) {
    Alert.alert("Thông báo", text, [{ text: "Thoát" }], {
      cancelable: false,
    });
  }

  function logoutApp() {
    Alert.alert(
      "Đăng xuất !",
      "Xác nhận thoát tài khoản",
      [
        {
          text: "Huỷ bỏ",
          onPress: () => console.log("No button clicked"),
          style: "cancel",
        },
        { text: "Đăng xuất", onPress: () => deleteDataUser() },
      ],
      {
        cancelable: true,
      }
    );
  }

  function itemSystem(ic, stateChange) {
    return (
      <Button
        nextScreen={() => {
          if (ic === 3) {
            setModalPass1(true);
          } else if (ic === 2) {
            confirmValidate();
          } else if (ic == 1) {
            setModalVisible(true);
          } else {
          }
        }}
        shadow
        height={60}
        justifyContent={"space-between"}
        alignCenter
        marginLeft={20}
        marginRight={20}
        marginBottom={10}
        radius={8}
        row
        backgroundColor={Color.tabColor}
      >
        <MaterialCommunityIcons
          name="lock"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        />
        <Text
          flex
          paddingLeft={10}
          height={60}
          size={16}
          color={Color.mainColor}
          fontFamily={"Roboto-Bold"}
        >
          {stateChange}
        </Text>
        <Icon_next color={Color.mainColor} style={{ marginRight: 10 }} />
      </Button>
    );
  }
  const onReceiveNotification = () => {
    dispatch(SetReveiceNotification(isReceiveNotification === "Y" ? "N" : "Y"));
  };
  //loadSMethod
  const loadSMethod = () => {
    navigation.navigate("SecurityMethod");
    // console.log("test");
  };

  return (
    <>
      <Block flex backgroundColor={Color.gray}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle="dark-content"
        />

        <Block row marginTop={55} alignCenter>
          <Block backgroundColor={Color.mainColor} width={7} height={29} />
          <Text
            size={26}
            color={Color.mainColor}
            fontFamily={"Roboto-Bold"}
            paddingLeft={20}
            textAlign={"center"}
          >
            {system}
          </Text>
          <Block width={7} height={29} flex alignEnd />
        </Block>

        <Block flex={1} animated paddingTop={14}>
          {/* Thong tin tai khoan */}
          <LinearGradient
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 1.5 }}
            // colors={['#498DE3', '#25399F']}
            colors={[Color.white, Color.white]}
            style={[styles.viewProfile, { height: 80 }]}
          >
            <View style={[styles.viewImgProfile]}>
              <View
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  padding: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 62,
                  height: 62,
                  overflow: "hidden",
                }}
              >
                <Image
                  style={[
                    styles.iconTopBar,
                    {
                      borderRadius: 12,
                      width: 58,
                      height: 58,
                    },
                  ]}
                  resizeMode="cover"
                  source={{ uri: urlImageLogin }}
                />
              </View>

              <View style={styles.viewInfo}>
                <Text style={[styles.textName, { fontSize: 20 }]}>
                  {fullnameLogin}
                </Text>
                <Text style={[styles.textStatus, { fontSize: 16 }]}>
                  {empIdLogin}
                </Text>
              </View>
            </View>
          </LinearGradient>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* The nhan vien dien tu */}
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("MBHRCD")}
              style={styles.viewOption}
            >
              <View
                style={[
                  styles.viewImgProfile,
                  { flex: 1 },
                ]}
              >
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={30}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
                <View
                  style={[
                    styles.viewInfo,
                    {
                      flex: 1,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Text style={[styles.textName]}>Thẻ nhân viên điện tử</Text>
                  <Text style={[styles.textStatus]}>
                    Quản lý thẻ nhân viên điện tử và các thông tin liên quan
                  </Text>
                </View>
              </View>
              <View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
              </View>
            </TouchableOpacity> */}

            {/* Vi QR code */}
            <TouchableOpacity
              onPress={() => navigation.navigate("QR_WALLET")}
              style={styles.viewOption}
            >
              <View
                style={[
                  styles.viewImgProfile,
                  {
                    flex: 1,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="qrcode"
                  size={30}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
                <View
                  style={[
                    styles.viewInfo,
                    {
                      flex: 1,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Text style={[styles.textName]}>Ví QR Code</Text>
                  <Text style={[styles.textStatus]}>
                    Lưu trữ và xuất trình các mã QR code quan trọng
                  </Text>
                </View>
              </View>
              <View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
              </View>
            </TouchableOpacity>

            {/* Dang nhap van tay */}
            {valueAuthen === "face_id" ||
            valueAuthen === "touch_id" ||
            valueAuthen === "finger_print" ? (
              <TouchableOpacity style={styles.viewOption}>
                <View style={[styles.viewImgProfile, { flex: 1 }]}>
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={30}
                    style={{
                      marginLeft: 5,
                      color: Color.mainColor,
                    }}
                  />
                  <View
                    style={[
                      styles.viewInfo,
                      {
                        flex: 1,
                        overflow: "hidden",
                      },
                    ]}
                  >
                    <Text style={[styles.textName]}>
                      {loginWithFaceOrFinger}
                    </Text>
                    <Text style={[styles.textStatus]}>
                      Dùng khi đăng nhập hệ thống thông qua xác thực khuôn mặt
                      hoặc vân tay trên thiết bị
                    </Text>
                  </View>
                </View>
                <View>
                  <Switch value={status} onValueChange={setDialogPass} />
                </View>
              </TouchableOpacity>
            ) : null}

            {/* Quan ly thong bao */}
            <TouchableOpacity style={styles.viewOption}>
              <View style={[styles.viewImgProfile, { flex: 1 }]}>
                <MaterialCommunityIcons
                  name="bell-ring-outline"
                  size={30}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
                <View
                  style={[
                    styles.viewInfo,
                    {
                      flex: 1,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Text style={[styles.textName]}>{ReceiveNotification}</Text>
                  <Text style={[styles.textStatus]}>
                    Thiết lập quản lý nhận thông báo cho các nghiệp vụ trong hệ
                    thống
                  </Text>
                </View>
              </View>
              <View>
                {/* Toggle button */}
                <Switch
                  value={isReceiveNotification === "Y" ? true : false}
                  onValueChange={onReceiveNotification}
                />
              </View>
            </TouchableOpacity>

            {/* Ngon ngu he thong */}
            <TouchableOpacity
              style={styles.viewOption}
              onPress={() => setModalVisible(true)}
            >
              <View
                style={[
                  styles.viewImgProfile,
                  {
                    flex: 1,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="google-translate"
                  size={30}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
                <View
                  style={[
                    styles.viewInfo,
                    {
                      flex: 1,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Text style={[styles.textName]}>{changeLanguage}</Text>
                  <Text style={[styles.textStatus]}>
                    Thiết lập ngôn ngữ theo người dùng
                  </Text>
                </View>
              </View>
              <View>
                <Image
                  style={{
                    width: 28,
                    height: 24,
                    marginRight: 10,
                  }}
                  source={img}
                />
              </View>
            </TouchableOpacity>

            {/* Tai khoan va bao mat */}
            <TouchableOpacity
              style={styles.viewOption}
              // onPress={loadSMethod}
              onPress={() => navigation.navigate("SystemSecurity")}
            >
              <View style={[styles.viewImgProfile, { flex: 1 }]}>
                <MaterialCommunityIcons
                  name="shield-account-outline"
                  size={30}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
                <View
                  style={[
                    styles.viewInfo,
                    {
                      flex: 1,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Text style={[styles.textName]}>Tài khoản và bảo mật</Text>
                  <Text style={[styles.textStatus]}>
                    Thiết lập thông tin email và câu hỏi bảo mật bảo vệ tài
                    khoản
                  </Text>
                </View>
              </View>
              <View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
              </View>
            </TouchableOpacity>

            {/*Dang xuat */}
            <TouchableOpacity
              style={[styles.viewOption, { marginBottom: 30 }]}
              onPress={logoutApp}
            >
              <View style={[styles.viewImgProfile, { flex: 1 }]}>
                <MaterialCommunityIcons
                  name="logout"
                  size={30}
                  style={{
                    marginLeft: 5,
                    color: Color.mainColor,
                  }}
                />
                <View
                  style={[
                    styles.viewInfo,
                    {
                      flex: 1,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Text style={[styles.textName]}>{logOut}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Block>

        {modal}
        {modalCheckLogin}
        {modalPasss}
        {modalChangePass}
        {modalConfirm}
        {modalConfirmQues}
        {modalPK1}
        {modalPK2}
        {modalConfirmExist}
        <CustomProgressBar visible={load} />
      </Block>
      {/* <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Color.gray,
        }}
      >
        <Text>Phiên bản {APP_VERSION}</Text>
      </View> */}
    </>
  );
};

export default SystemMain;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#F1f1f1",
  },
  topBarView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#aeea00",
  },
  marginTopBar: {
    padding: 10,
  },
  iconTopBar: {
    width: 24,
    height: 24,
    // marginRight: 10,
  },
  nameText: {
    fontWeight: "500",
    marginStart: 10,
    fontSize: 16,
    color: "#000000",
  },
  viewProfile: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: "white",
  },
  viewOption: {
    width: "100%",
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 2,
    backgroundColor: "white",
  },
  viewImgProfile: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingVertical: 10,
  },
  viewInfo: {
    marginStart: 10,
    paddingRight: 20,
  },
  textName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000000",
    opacity: 0.8,
  },
  textStatus: {
    fontWeight: "400",
    fontSize: 13,
    color: "#000000",
    opacity: 0.6,
    marginTop: 3,
  },
});
