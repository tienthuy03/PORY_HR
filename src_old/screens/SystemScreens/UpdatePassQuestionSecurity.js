import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../components/Block";
import Button from "../../components/Button";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import TVSButton from "../../components/Tvs/Button";
import TVSHeader from "../../components/Tvs/Header";
import EyeClose from "../../icons/EyeClose";
import EyeOpen from "../../icons/EyeOpen";
import Icon_pass from "../../icons/Password";
import ShowError from "../../services/errors";
import axios from "axios";
import { APP_VERSION } from "../../config/Pro";
import Load from "../../components/Loading";
import sysFetch from '../../services/fetch_v2';
import md5 from "md5";

const UpdatePassQuestionSecurity = ({ navigation: { goBack }, route }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const state = useSelector((state) => state.loginReducers);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { username, cauHoi1, cauHoi2, deviceId, deviceName } = route.params;

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [load, setLoad] = useState(false);
  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);
  let user_name = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  try {
    user_name = state.user_name;
    tokenLogin = state.data.data.tokenLogin;
    userPk = state.data.data.tes_user_pk;
    refreshToken = state.data.data.refreshToken;
  } catch (error) { }

  const validate = () => {
    if (passwordNew === "") {
      dialogNoti("Vui lòng nhập mật khẩu mới!");
      return;
    }
    if (passwordNew.length < 6) {
      dialogNoti("Vui lòng nhập mật khẩu có ít nhất 6 ký tự!");
      return;
    }
    if (passwordConfirm === "") {
      dialogNoti("Vui lòng nhập mật khẩu xác nhận!");
      return;
    }

    if (passwordNew !== passwordConfirm) {
      dialogNoti("Xác nhận mật khẩu không trùng khớp!");
      return;
    }

    Alert.alert(
      "Cập nhật mật khẩu",
      "Xác nhận cập nhật mật khẩu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                getSchema();
                // navigation.push('CheckLogin');
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

  function dialogNoti(text, flagCheck) {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Thoát",
          onPress: () => {
            if (flagCheck) {
              RNRestart.Restart();
            }
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  const getSchema = () => {
    let url = API + 'User/GetSchemaByUserId?userId=' + username + '&version=' + APP_VERSION;
    axios
      .get(url)
      .then((res) => {
        console.log('res', res.data.data.length);
        if (res.data.data.length > 0 && res.data.results == "S") {
          const schema = res.data.data[0].schema;
          if(schema) {
            updatePass(schema);
          }
        } else {
          dialogNoti("Tài khoản không tồn tại");
        }
      })
      .catch((err) => console.log(err));
  };

  const updatePass = async (schema) => {
    setLoad(true);
    const passwordMd5 = md5(passwordNew);
    const pro = 'UPDREPW000010';
    const in_par = {
      p1_varchar2: 'UPDATE',
      p2_varchar2: username,
      p3_varchar2: passwordMd5,
    };
    const config = {
      schema: schema,
      site: "STV",
      obj: "MBI"
    }
    console.log('UPDREPW000010', in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_varchar2: "lst_data"
        },
      },
      config
    )
      .then((rs) => {
        console.log('rs', rs);
        if (rs == 'Token Expired') {
          console.log('Token Expired');
        } else {
          if (rs.results == "F") {
            console.log("errors getData HomeMain.js");
          } else {
            setLoad(false);
            Alert.alert('Thông báo', 
            'Cập nhật mật khẩu thành công!'
            , [
              {
                text: 'Đóng',
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });



    // let url = API + "User/SetPasswordQuestionSecurityMBI";
    // let obj = {
    //   user_id: username,
    //   password_new: passwordNew,
    //   pasword_confirm: passwordConfirm,
    //   ques_code_1: cauHoi1.code,
    //   value_1: cauHoi1.value,
    //   ques_code_2: cauHoi2.code,
    //   value_2: cauHoi2.value,
    //   device_id: deviceId,
    //   device_name: deviceName,
    //   version: APP_VERSION,
    // };
    // axios
    //   .post(url, obj, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((res) => {
    //     if (res.data.result == "F") {
    //       var newText = res.errorData.split(":");
    //       let errors = newText[1].trim().split("\n")[0];
    //       dialogNoti(errors);
    //     } else {
    //       dialogNoti("Cập nhật mật khẩu thành công!", true);
    //     }
    //   })
    //   .catch((err) => console.log(err))
    //   .finally(() => setLoad(false));
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={() => goBack()}>Thay đổi mật khẩu</TVSHeader>

      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <ScrollView>
          <Block
            padding={10}
            backgroundColor={Color.white}
            margin={20}
            radius={10}
          >
            <Text color={Color.mainColor} size={18} fontFamily={"Roboto-Bold"}>
              Thay đổi mật khẩu
            </Text>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              alignCenter
              row
              backgroundColor={Color.inputBackgroundColor}
            >
              <Icon_pass />
              <TextInput
                flex
                height={55}
                fontFamily={"Roboto-Medium"}
                paddingLeft={15}
                placeholder={"Nhập mật khẩu mới"}
                autoCompleteType={"password"}
                placeholderTextColor={Color.grayPlahoder}
                secureTextEntry={eye1}
                value={passwordNew}
                onChangeText={(text) => setPasswordNew(text)}
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
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              alignCenter
              row
              backgroundColor={Color.inputBackgroundColor}
            >
              <Icon_pass />
              <TextInput
                flex
                height={55}
                fontFamily={"Roboto-Medium"}
                paddingLeft={15}
                placeholder={"Xác nhận mật khẩu"}
                autoCompleteType={"password"}
                placeholderTextColor={Color.grayPlahoder}
                secureTextEntry={eye2}
                value={passwordConfirm}
                onChangeText={(text) => setPasswordConfirm(text)}
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
          </Block>

          <Block flex justifyEnd alignCenter paddingBottom={8}>
            <TVSButton
              paddingHorizontal={50}
              onPress={() => validate()}
              icon={"check"}
            >
              Xác nhận
            </TVSButton>
          </Block>
        </ScrollView>
        <Load visible={load} />
      </Block>
    </Block>
  );
};
export default UpdatePassQuestionSecurity;
