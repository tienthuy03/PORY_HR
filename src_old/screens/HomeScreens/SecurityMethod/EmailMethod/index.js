import React, { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import TVSButton from "../../../../components/Tvs/Button";
import sysFetch from "../../../../services/fetch";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import EyeClose from "../../../../icons/EyeClose";
import EyeOpen from "../../../../icons/EyeOpen";
import Icon_pass from "../../../../icons/Password";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button.js";
import md5 from "md5";

const EmailMethod = ({ isFirst }) => {
  const navigation = useNavigation();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      borderRadius: 5,
    },
    textBold: {
      fontWeight: "bold",
      color: Color.mainColor,
    },
    content: {
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 16,
    },
    inputEmail: {
      backgroundColor: Color.gray,
      marginTop: 10,
      marginBottom: 5,
      padding: 10,
      borderRadius: 12,
      borderColor: "#F8F9F9",
      borderWidth: 1,
    },
    inputAccount: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    btnSave: {
      backgroundColor: Color.mainColor,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnSaveText: {
      color: "white",
    },
  });
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  const username = useSelector((state) => state.loginReducers.user_name);


  const [smData, setSmData] = useState("");
  const [Email, setEmail] = useState("");
  const [isFirstState, setIsFirstState] = useState(false);
  const [isShowPopupPassword, setIsShowPopupPassword] = useState(false);
  const [eye, setEye] = useState(true);
  const [password, setPassword] = useState("");
  const [emailHide, setEmailHide] = useState("");

  useEffect(() => {
    if (isFirst != undefined) {
      setIsFirstState(isFirst);
    }
  }, [isFirst]);

  useEffect(() => {
    if (smData) {
      onChangeEmail(smData === "null" ? "" : smData);
      const emailSplit = smData.split('@');
      const emailHideTemp = emailSplit[0].slice(0, -3) + '***@' + emailSplit[1];
      setEmailHide(emailHideTemp);
    } 
    if(smData == 'null' || smData == null){
      setEmailHide('');
    }
  }, [smData]);

  const onChangeEmail = (value) => {
    setEmail(value);
    ChangeEmail(value);
  };

  const ChangeEmail = (value) => {
    setEmail(value);
  };

  const ValidUpdate = () => {
    if (Email.toString().trim().length === 0) {
      Alert.alert("Thông báo", "Email không được bỏ trống.", [
        {
          text: "Xác nhận",
          onPress: () => { },
        },
      ]);
      return;
    } else {
      var check = /\S+@\S+\.\S+/;
      var checkMail = check.test(Email.toString().trim());
      if (!checkMail) {
        Alert.alert("Thông báo", "Email không đúng định dạng.", [
          {
            text: "Xác nhận",
            onPress: () => { },
          },
        ]);
        return;
      }
    }
    // checkPassword()
    Update();
  };

  const modalCheckPassword = () => {
    return (
      <TVSControlPopup
        title={"Xác nhận mật khẩu"}
        isShow={isShowPopupPassword}
        onHide={() => setIsShowPopupPassword(false)}
        bottom={
          <View>
            <TVSButton
              type="primary"
              onPress={() => checkPassword()}
              icon={"update"}
              buttonStyle="3"
            >
              Xác nhận
            </TVSButton>
          </View>
        }
      >
        <Block
          marginHorizontal={10}
          paddingLeft={10}
          alignCenter
          row
          backgroundColor={Color.gray}
          radius={12}
          marginTop={10}
        >
          <Icon_pass />
          <TextInput
            style={{ flex: 1, }}
            size={15}
            height={55}
            paddingLeft={15}
            placeholder={"Nhập mật khẩu xác nhận"}
            autoCompleteType={"password"}
            color={Color.mainColor}
            placeholderTextColor={Color.grayPlahoder}
            secureTextEntry={eye}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button
            justifyCenter
            height={30}
            width={30}
            nextScreen={() => setEye(!eye)}
          >
            {eye ? <EyeOpen /> : <EyeClose />}
          </Button>
        </Block>

      </TVSControlPopup>
    );
  };

  const checkPassword = () => {
    console.log('password', password);
    const pw_md5 = md5(password);
    const pro = "SELCFMA0010101";
    const in_par = {
      p1_varchar2: username,
      p2_varchar2: pw_md5,
    };
    const out_par = { p1_sys: "data" };
    sysFetch(API, { pro, in_par, out_par }, tokenLogin)
      .then((res) => {
        console.log('res', res.data.data);
        setIsShowPopupPassword(false);
        if (res == "Token Expired") {
          refreshNewToken("checkPassword");
        }
        if (res != "Token Expired") {
          if (res.results === "S") {
            if (res.data.data.length > 0 && res.data.data[0].status == 1) {
              console.log('res', res.data.data[0].status);
              // setPassword("");
              // Update();
              setIsShowPopupPassword(false);
              setEmailHide('');
            } else {
              Alert.alert("Thông báo", "Mật khẩu không đúng.", [
                {
                  text: "Xác nhận",
                  onPress: () => { },
                },
              ])
            }
          } else {
            Alert.alert("Thông báo", "Lỗi hệ thống.", [
              {
                text: "Xác nhận",
                onPress: () => { },
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setIsShowPopupPassword(false);
      });
    // Update();
  };

  const Update = async () => {
    sysFetch(
      API,
      {
        pro: "UPDCFMA0010100",
        in_par: {
          p1_varchar2: username,
          p2_varchar2: Email.toString().trim().toLowerCase(),
        },
        out_par: {},
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("Update");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            Alert.alert("Thông báo", "Thay đổi email thành công.", [
              {
                text: "Xác nhận", onPress: async () => {
                  if (isFirstState) {
                    navigation.popToTop();
                  } else {
                    navigation.goBack();
                  }
                }
              },
            ]);
            // dispatch(SMLoadData);
          } else {
            Alert.alert("Thông báo", "Thay đổi email thất bại.", [
              { text: "Xác nhận" },
            ]);
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
        if (obj == "Update") {
          Update();
        }
        if (obj == "getData") {
          getData();
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
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await sysFetch(
      API,
      {
        pro: "SELCFMA0010100",
        in_par: {
          p1_varchar2: username,
        },
        out_par: { p1_varchar2: "data" },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            setSmData(rs.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={[styles.container, {
      paddingHorizontal: 10,
    }]}>
      <View style={styles.content}>
        <Text style={{
          fontSize: 13,
          color: 'black',
          opacity: 0.4,
          marginTop: 4,
        }}>
          {
            isFirstState
              ? "Email này sẽ được sử dụng để lấy lại mật khẩu khi bạn quên mật khẩu. Nếu bạn không có email, chuyển đến trang thiết lập câu hỏi bảo mật."
              : "Email này sẽ được sử dụng để lấy lại mật khẩu khi bạn quên mật khẩu."
          }
        </Text>
        {
          emailHide == '' ? (
            <TextInput
              placeholder={"Nhập thông tin email"}
              style={[styles.inputEmail, { marginTop: 10 }]}
              value={Email ?? ""}
              onChangeText={onChangeEmail}
            />
          ) : (
            <TextInput
              editable={false}
              disabled={true}
              placeholder={"Nhập thông tin email"}
              style={[styles.inputEmail, { marginTop: 10 }]}
              value={emailHide ?? ""}
            // onChangeText={setEmailHide}
            />
          )
        }

      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 10
      }}>
        {
          emailHide == '' ? (
            <TVSButton
              onPress={ValidUpdate}
              icon={"content-save"}
              buttonStyle="3"
            >
              Sao lưu
            </TVSButton>
          ) : (
            <TVSButton
              onPress={() => setIsShowPopupPassword(true)}
              icon={"content-save"}
              buttonStyle="3"
            >
              Cập nhật
            </TVSButton>
          )
        }

        {
          isFirstState && (
            <TVSButton
              type="secondary"
              onPress={() => {
                navigation.navigate("QuestionSecurity", { first: true });
              }}
              icon={"content-save"}
              buttonStyle="3"
              style={{
                marginLeft: 10
              }}
            >
              Câu hỏi bảo mật
            </TVSButton>
          )
        }
      </View>
      {isShowPopupPassword && modalCheckPassword()}
    </View>
  );
};

export default EmailMethod;
