import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Alert,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import Block from "../../components/Block";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import TVSButton from "../../components/Tvs/Button";
import TVSHeader from "../../components/Tvs/Header";
import * as action from "../../services/redux/ForgotPassword/action";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TVSControlPopup2 from "../../components/Tvs/ControlPopup2";
import TVSList from "../../components/Tvs/TVSList";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../config/Pro";
import Load from "../../components/Loading";
import sysFetch from "../../services/fetch_v2";

const ForgotPassword = ({ navigation: { goBack }, route }) => {
  const navigation = useNavigation();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const styles = StyleSheet.create({
    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
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
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },

    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
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
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },

    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
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
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },

    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      height: 120,
      justifyContent: "center",
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      borderStyle: "dashed",
      height: 120,
      justifyContent: "center",
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

  const { users } = route.params;
  const [username, setUsername] = useState(users ? users : "");
  const [email, setEmail] = useState("");
  const [emailHide, setEmailHide] = useState("");
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isCheckQuestionSecurity, setIsCheckQuestionSecurity] = useState(false);
  const [cauHoi1, setCauHoi1] = useState({
    code: "",
    code_nm: "Chọn câu hỏi 1",
    value: "",
  });

  const [cauHoi2, setCauHoi2] = useState({
    code: "",
    code_nm: "Chọn câu hỏi 2",
    value: "",
  });

  const [modalChooseQuestionVisible, setModalChooseQuestionVisible] =
    useState(false);
  const [dataQuestion, setDataQuestion] = useState([]);
  const [typeQuestion, setTypeQuestion] = useState(0);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    getDeviceInfo();
  }, []);

  //function get Info machine
  const getDeviceInfo = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const deviceId = await DeviceInfo.getUniqueId();
    return { deviceName, deviceId };
  };

  const OnCheckedEmail = () => {
    setIsCheckEmail(!isCheckEmail);
    if (isCheckQuestionSecurity) {
      setIsCheckQuestionSecurity(false);
    }
  };

  const OnCheckedQuestionSecurity = () => {
    setIsCheckQuestionSecurity(!isCheckQuestionSecurity);
    if (isCheckEmail) {
      setIsCheckEmail(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = () => {
    let url = API + "User/GetQuestionSecurity";
    axios
      .post(url)
      .then((res) => {
        if (res.data.results == "S") {
          if (res.data.data.length > 0) {
            let arr = [];

            res.data.data.map((item) => {
              arr.push({
                pk: item.pk,
                code: item.code,
                code_nm: item.codE_NM,
                value: item.value,
              });
            });
            setDataQuestion(arr);
          }
        } else {
          var newText = res.data.errorData.split(":");
          let errors = newText[1].trim().split("\n")[0];
          dialogNoti(errors);
        }
      })
      .catch((err) => console.log(err));
  };

  const [schema, setSchema] = useState("");
  const getSchema = () => {
    let url =
      API +
      "User/GetSchemaByUserId?userId=" +
      username +
      "&version=" +
      APP_VERSION;
    console.log("url ", url);
    axios
      .get(url)
      .then((res) => {
        console.log("res", res.data.data.length);
        if (res.data.data.length > 0 && res.data.results == "S") {
          const schema = res.data.data[0].schema;
          if (schema) {
            setSchema(schema);
            getQuestionUser(schema);
            //Neu chua chon phuong thuc thi show dialog
            if (!isCheckEmail && !isCheckQuestionSecurity) {
              Alert.alert(
                "Thông báo",
                "Vui lòng chọn phương thức xác thực",
                [
                  {
                    text: "Thoát",
                    onPress: () => {},
                  },
                ],
                {
                  cancelable: false,
                }
              );
            }
          }
        } else {
          dialogNoti("Tài khoản không tồn tại");
        }
      })
      .catch((err) => console.log("err ", err));
  };

  const getQuestionUser = (schema) => {
    if (username.trim().length == 0) {
      dialogNoti("Vui lòng nhập tài khoản");
      return;
    }
    //--------------------------------------
    const pro = "SELREPW000010";
    const in_par = {
      p1_varchar2: username,
    };
    const config = {
      schema: schema,
      site: "STV",
      obj: "MBI",
    };
    console.log("SELREPW000010", in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_data",
          p2_sys: "email_user",
        },
      },
      config
    )
      .then((rs) => {
        console.log("rs", rs);
        if (rs == "Token Expired") {
          console.log("Token Expired");
        } else {
          if (rs.results == "F") {
            console.log("errors getData HomeMain.js");
          } else {
            const dt = rs.data.lst_data;
            if (isCheckQuestionSecurity) {
              if (dt.length == 0) {
                setCauHoi1((prevCauHoi1) => ({
                  ...prevCauHoi1,
                  code: "",
                  code_nm: "Chọn câu hỏi 1",
                  value: "",
                }));
                setCauHoi2((prevCauHoi2) => ({
                  ...prevCauHoi2,
                  code: "",
                  code_nm: "Chọn câu hỏi 2",
                  value: "",
                }));
                dialogNoti("Tài khoản chưa cài đặt câu hỏi bảo mật");
                return;
              }
              if (!dt[0].QUES_CODE_1 || !dt[0].QUES_CODE_2) {
                setCauHoi1((prevCauHoi1) => ({
                  ...prevCauHoi1,
                  code: "",
                  code_nm: "Chọn câu hỏi 1",
                  value: "",
                }));
                setCauHoi2((prevCauHoi2) => ({
                  ...prevCauHoi2,
                  code: "",
                  code_nm: "Chọn câu hỏi 2",
                  value: "",
                }));
                dialogNoti("Tài khoản chưa cài đặt câu hỏi bảo mật");
                return;
              }
              setCauHoi1((prevCauHoi1) => ({
                ...prevCauHoi1,
                code: dt[0].QUES_CODE_1,
                code_nm: dt[0].QUES_NAME_1,
              }));
              setCauHoi2((prevCauHoi2) => ({
                ...prevCauHoi2,
                code: dt[0].QUES_CODE_2,
                code_nm: dt[0].QUES_NAME_2,
              }));
            }

            const dtEmail = rs.data.email_user;
            if (isCheckEmail) {
              if (dtEmail.length == 0) {
                setEmailHide("");
                setEmail("");
                dialogNoti("Tài khoản chưa cài đặt email");
                return;
              }
              if (!dtEmail[0].EMAIL_USER) {
                setEmailHide("");
                setEmail("");
                dialogNoti("Tài khoản chưa cài đặt email");
                return;
              }
              console.log("email", dtEmail[0].EMAIL_USER);
              const email_hide = dtEmail[0].EMAIL_USER.replace(
                /.{5}(?=@)/g,
                "*****"
              );
              setEmail(dtEmail[0].EMAIL_USER);
              setEmailHide(email_hide);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    //--------------------------------------
    // let url = API + "User/CheckUserIdMBI";
    // let obj = {
    //   user_id: username,
    //   version: APP_VERSION,
    // };
    // axios
    //   .post(url, obj, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((res) => {
    //     if (res.data.results == "S") {
    //       if (res.data.data.length > 0) {
    //         let ques_code_1 = res.data.data[0].queS_CODE_1;
    //         let ques_code_2 = res.data.data[0].queS_CODE_2;

    //         if (dataQuestion.length > 0) {
    //           dataQuestion.map((item) => {
    //             if (item.code == ques_code_1) {
    //               setCauHoi1((prevCauHoi1) => ({
    //                 ...prevCauHoi1,
    //                 code: item.code,
    //                 code_nm: item.code_nm,
    //               }));
    //             } else if (item.code == ques_code_2) {
    //               setCauHoi2((prevCauHoi2) => ({
    //                 ...prevCauHoi2,
    //                 code: item.code,
    //                 code_nm: item.code_nm,
    //               }));
    //             }
    //           });
    //         }
    //       }
    //     } else {
    //       var newText = res.data.errorData.split(":");
    //       let errors = newText[1].trim().split("\n")[0];
    //       dialogNoti(errors);
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  const getStateQuestion = (result) => {
    if (typeQuestion == 1)
      setCauHoi1((prevCauHoi1) => ({
        ...prevCauHoi1,
        code: result.code,
        code_nm: result.code_nm,
      }));
    else if (typeQuestion == 2)
      setCauHoi2((prevCauHoi2) => ({
        ...prevCauHoi2,
        code: result.code,
        code_nm: result.code_nm,
      }));
    setModalChooseQuestionVisible(false);
  };

  function dialogNoti(text) {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Thoát",
          onPress: () => {},
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  //onChecking
  const onChecking = (schema) => {
    if (!isCheckEmail && !isCheckQuestionSecurity) {
      dialogNoti("Vui lòng chọn phương thức xác thực");
      return;
    }

    if (username.trim().length == 0) {
      dialogNoti("Vui lòng nhập tài khoản");
      return;
    }

    if (isCheckEmail) {
      if (email.trim().length == 0) {
        dialogNoti("Vui lòng nhập email");
        return;
      }

      //validate email format pattern
      var regexEmail = /\S+@\S+\.\S+/;
      if (!regexEmail.test(email)) {
        dialogNoti("Email không đúng định dạng");
        return;
      }

      getDeviceInfo().then((rs) => {
        dispatch(
          action.fpCheckUsername(username, email, rs.deviceName, rs.deviceId)
        );
      });
    }

    if (isCheckQuestionSecurity) {
      if (cauHoi1.code.trim() == "" || cauHoi2.code.trim() == "") {
        dialogNoti("Vui lòng câu hỏi bảo mật");
        return;
      }

      if (
        cauHoi1.value.trim().length == 0 ||
        cauHoi2.value.trim().length == 0
      ) {
        dialogNoti("Vui lòng chọn câu trả lời");
        return;
      }

      const pro = "SELREPW000010";
      const in_par = {
        p1_varchar2: username,
      };
      const config = {
        schema: schema ? schema : "",
        site: "STV",
        obj: "MBI",
      };
      console.log("SELREPW000010", in_par);
      sysFetch(
        API,
        {
          pro,
          in_par,
          out_par: {
            p1_sys: "lst_data",
            p2_sys: "email_user",
          },
        },
        config
      )
        .then((rs) => {
          console.log("rs", rs);
          if (rs == "Token Expired") {
            console.log("Token Expired");
          } else {
            if (rs.results == "F") {
              console.log("errors getData HomeMain.js");
            } else {
              const dt = rs.data.lst_data;
              if (dt.length > 0) {
                getTokens(dt, rs.deviceName, rs.deviceId);
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      //--------------------------------------------
      // let url = API + "User/CheckQuestionIdMBI";
      // getDeviceInfo().then((rs) => {
      //   let obj = {
      //     user_id: username,
      //     ques_code_1: cauHoi1.code,
      //     value_1: cauHoi1.value,
      //     ques_code_2: cauHoi2.code,
      //     value_2: cauHoi2.value,
      //     device_id: rs.deviceId,
      //     device_name: rs.deviceName,
      //     version: APP_VERSION,
      //   };
      //   setLoad(true);
      //   axios
      //     .post(url, obj, {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     })
      //     .then((res) => {
      //       console.log('res----------------', res);
      //       if (res.data.results == "S") {
      //         navigation.navigate("UpdatePassQuestionSecurity", {
      //           username: username,
      //           cauHoi1: cauHoi1,
      //           cauHoi2: cauHoi2,
      //           deviceName: rs.deviceName,
      //           deviceId: rs.deviceId,
      //         });
      //       } else {
      //         var newText = res.data.errorData.split(":");
      //         let errors = newText[1].trim().split("\n")[0];
      //         dialogNoti(errors);
      //       }
      //     })
      //     .catch((err) => console.log(err))
      //     .finally(() => setLoad(false));
      // });
    }
  };

  async function getTokens(dt, deviceName, deviceId) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        if (fcmToken != dt[0].DEVICE_ID) {
          dialogNoti("Thiết bị không chính xác");
        } else {
          const check1 = cauHoi1.code == dt[0].QUES_CODE_1;
          const check2 = cauHoi1.value == dt[0].VALUE_1;
          const check3 = cauHoi2.code == dt[0].QUES_CODE_2;
          const check4 = cauHoi2.value == dt[0].VALUE_2;
          if (check1 && check2 && check3 && check4) {
            navigation.navigate("UpdatePassQuestionSecurity", {
              username: username,
              cauHoi1: cauHoi1,
              cauHoi2: cauHoi2,
              deviceName: deviceName,
              deviceId: deviceId,
            });
          } else {
            dialogNoti("Câu trả lời không chính xác");
          }
        }
      }
    }
  }

  const modalQuestion = (
    <TVSControlPopup2
      title={"Chọn câu hỏi bảo mật"}
      isShow={modalChooseQuestionVisible}
      onHide={() => setModalChooseQuestionVisible(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalChooseQuestionVisible(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataQuestion.filter(
          (item) =>
            item.code_nm != cauHoi1.code_nm && item.code_nm != cauHoi2.code_nm
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateQuestion(item);
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
    </TVSControlPopup2>
  );

  //render view
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Lấy lại mật khẩu</TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        {/* START */}
        <Block backgroundColor={"#fff"} padding={20} flex={1}>
          <Block marginBottom={10}>
            <Text style={{ color: Color.mainColor, marginBottom: 10 }}>
              Tài khoản đăng nhập
            </Text>
            <Block width={"100%"} flexDirection={"row"}>
              <TextInput
                flex={1}
                size={15}
                padding={15}
                placeholder={"Nhập tài khoản"}
                // borderRadius={5}
                borderBottomLeftRadius={5}
                borderTopLeftRadius={5}
                backgroundColor={Color.gray}
                placeholderTextColor={Color.grayPlahoder}
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                }}
              />

              <TouchableOpacity
                style={{
                  padding: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.gray,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
                onPress={() => {
                  // getQuestionUser();
                  getSchema();
                }}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  style={{ color: Color.mainColor }}
                />
              </TouchableOpacity>
            </Block>
          </Block>

          <TouchableOpacity
            onPress={() => {
              OnCheckedEmail();
            }}
            style={{
              flexDirection: "row",
              justifyCenter: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={
                isCheckEmail ? styles.CheckBoxSquareY : styles.CheckBoxSquareN
              }
            >
              {isCheckEmail ? (
                <Icon name={"check"} color={Color.mainColor} />
              ) : null}
            </View>
            <Text> Quên mật khẩu bằng email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              OnCheckedQuestionSecurity();
            }}
            style={{
              flexDirection: "row",
              justifyCenter: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={
                isCheckQuestionSecurity
                  ? styles.CheckBoxSquareY
                  : styles.CheckBoxSquareN
              }
            >
              {isCheckQuestionSecurity ? (
                <Icon name={"check"} color={Color.mainColor} />
              ) : null}
            </View>
            <Text> Quên mật khẩu bằng câu hỏi bảo mật</Text>
          </TouchableOpacity>

          {isCheckEmail ? (
            <Block marginTop={15}>
              <Text style={{ color: Color.mainColor, marginBottom: 10 }}>
                Thông tin email lấy lại mật khẩu
              </Text>
              <TextInput
                placeholder={"Email lấy lại mật khẩu"}
                size={15}
                disabled={true}
                editable={false}
                padding={15}
                borderRadius={5}
                color={Color.grayPlahoder}
                backgroundColor={Color.gray}
                placeholderTextColor={Color.grayPlahoder}
                value={emailHide}
                onChangeText={(value) => {
                  setEmailHide(value);
                }}
              />
            </Block>
          ) : null}

          {isCheckQuestionSecurity ? (
            <>
              <Text style={{ color: Color.mainColor, marginBottom: 10 }}>
                Câu hỏi bảo mật 1
              </Text>
              <Block style={{ marginBottom: 5 }}>
                <TVSList
                  onPress={() => {
                    setTypeQuestion(1);
                    setModalChooseQuestionVisible(true);
                  }}
                  colorText={
                    cauHoi1.code_nm == "Chọn câu hỏi 1" ? "#B2B2B2" : null
                  }
                  code_nm={
                    cauHoi1.code_nm == "" ? "Chọn câu hỏi 1" : cauHoi1.code_nm
                  }
                />
              </Block>
              <Block
                marginTop={2}
                paddingLeft={20}
                radius={8}
                height={55}
                marginBottom={15}
                alignCenter
                backgroundColor={Color.gray}
                row
              >
                <MaterialCommunityIcons
                  name="lock-question"
                  size={20}
                  style={{ marginLeft: 5, color: Color.mainColor }}
                />
                <TextInput
                  flex
                  height={55}
                  paddingLeft={15}
                  placeholder={"Nhập câu trả lời câu hỏi bảo mật 1"}
                  autoCompleteType={"password"}
                  placeholderTextColor={Color.grayPlahoder}
                  value={cauHoi1.value}
                  onChangeText={(text) =>
                    setCauHoi1((prevCauHoi1) => ({
                      ...prevCauHoi1,
                      value: text,
                    }))
                  }
                />
              </Block>
              <Text style={{ color: Color.mainColor, marginBottom: 10 }}>
                Câu hỏi bảo mật 2
              </Text>
              <TVSList
                onPress={() => {
                  setTypeQuestion(2);
                  setModalChooseQuestionVisible(true);
                }}
                colorText={
                  cauHoi2.code_nm == "Chọn câu hỏi 2" ? "#B2B2B2" : null
                }
                code_nm={
                  cauHoi2.code_nm == "" ? "Chọn câu hỏi 2" : cauHoi2.code_nm
                }
              />
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
                  name="lock-question"
                  size={20}
                  style={{ marginLeft: 5, color: Color.mainColor }}
                />
                <TextInput
                  flex
                  height={55}
                  paddingLeft={15}
                  placeholder={"Nhập câu trả lời câu hỏi bảo mật 2"}
                  autoCompleteType={"password"}
                  placeholderTextColor={Color.grayPlahoder}
                  value={cauHoi2.value}
                  onChangeText={(text) =>
                    setCauHoi2((prevCauHoi2) => ({
                      ...prevCauHoi2,
                      value: text,
                    }))
                  }
                />
              </Block>
            </>
          ) : null}

          <Block marginTop={20} justifyCenter alignCenter>
            <TVSButton
              paddingHorizontal={50}
              onPress={() => {
                onChecking(schema);
              }}
              icon={"check"}
            >
              Xác nhận
            </TVSButton>
          </Block>
          <Load visible={load} />
        </Block>

        {/* END */}
      </Block>
      {modalQuestion}
    </Block>
  );
};

export default ForgotPassword;
