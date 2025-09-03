import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StatusBar } from "react-native";
import Block from "../../components/Block";
import Button from "../../components/Button";
import Load from "../../components/Loading";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import Icon_back from "../../icons/Back";
import Icon_email from "../../icons/Email";
import axios from "axios";
import { updateUserAction } from "../../actions";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import sysFetch from "../../services/fetch";

const CheckLogin = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const state = useSelector((state) => state.loginReducers);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(false);

  let emp_pk = "";
  let userId = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  try {
    emp_pk = state.data.data.thr_emp_pk;
    userId = state.user_name;
    tokenLogin = state.data.data.tokenLogin;
    userPk = state.data.data.tes_user_pk;
    refreshToken = state.data.data.refreshToken;
  } catch (error) {}

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    sysFetch(
      API,
      {
        pro: "SELCFMA0010100",
        in_par: {
          p1_varchar2: emp_pk,
        },
        out_par: {
          p1_varchar2: "email",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            if (rs.totalRow > 0) {
              if (rs.data.email === "null") {
                setEmail("");
              } else {
                setEmail(rs.data.email);
              }
            }
          } else {
            setEmail("");
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
        if (obj == "getData") {
          getData();
        }
        if (obj == "setValidate") {
          sysFetch(
            API,
            {
              pro: "UPDCFMA0010100",
              in_par: {
                p1_varchar2: userId,
                p2_varchar2: email,
              },
              out_par: {
                p1_sys: "ttlt",
              },
            },
            tokenLogin
          )
            .then((rs) => {
              if (rs == "Token Expired") {
                refreshNewToken("setValidate");
              }
              if (rs != "Token Expired") {
                if (rs.results === "S") {
                  Alert.alert("Thông báo", "Xác nhận thành công!", [
                    {
                      text: "Thoát",
                      onPress: async () => {
                        navigation.navigate("Index");
                      },
                    },
                  ]);
                } else {
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

  function dialogNoti(text) {
    Alert.alert("Thông báo", text, [{ text: "Thoát" }], {
      cancelable: false,
    });
  }

  const setValidate = () => {
    var check = /\S+@\S+\.\S+/;
    var checkMail = check.test(email);
    if (email == "") {
      dialogNoti("Vui lòng không để trống email!");
      return;
    }
    if (!checkMail) {
      dialogNoti("Vui lòng nhập đúng đinh dạng email!");
      return;
    }
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xác nhận " + email + " hay không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            //update email
            sysFetch(
              API,
              {
                pro: "UPDCFMA0010100",
                in_par: {
                  p1_varchar2: userId,
                  p2_varchar2: email,
                },
                out_par: {
                  p1_sys: "ttlt",
                },
              },
              tokenLogin
            )
              .then((rs) => {
                if (rs == "Token Expired") {
                  refreshNewToken("setValidate");
                }
                if (rs != "Token Expired") {
                  if (rs.results === "S") {
                    Alert.alert("Thông báo", "Xác nhận thành công!", [
                      {
                        text: "Thoát",
                        onPress: async () => {
                          navigation.navigate("Index");
                        },
                      },
                    ]);
                  } else {
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
          },
        },
      ],
      { cancelable: false }
    );
  };
  const onCancel = () => {
    navigation.navigate("Index");
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle="light-content"
      />
      <Block
        row
        alignCenter
        justifyContent={"center"}
        paddingBottom={Platform.OS === "ios" ? 10 : 15}
        paddingTop={Platform.OS === "ios" ? 15 : 5}
        marginTop={30}
      >
        <Button
          paddingTop={10}
          width={40}
          height={40}
          marginLeft={20}
          flex={0}
          nextScreen={() => goBack()}
        >
          <Icon_back color={Color.white} />
        </Button>
        <Block flex={1} justifyCenter alignCenter marginRight={60}>
          <Text
            size={20}
            color={Color.white}
            fontFamily={"Roboto-Bold"}
            textAlign={"center"}
          >
            Xác nhận email
          </Text>
        </Block>
      </Block>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <ScrollView>
          <Block
            padding={10}
            backgroundColor={Color.white}
            marginLeft={10}
            marginRight={10}
            marginTop={10}
            radius={10}
          >
            <Text
              color={Color.mainColor}
              size={18}
              fontFamily={"Roboto-Medium"}
            >
              Nhập thông tin
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
              <Icon_email />
              <TextInput
                flex
                height={55}
                fontFamily={"Roboto-Medium"}
                paddingLeft={15}
                placeholder={"Nhập email"}
                placeholderTextColor={Color.grayPlahoder}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </Block>
          </Block>
          <Button
            nextScreen={() => setValidate()}
            backgroundColor={Color.btnMain}
            height={60}
            margin={10}
            borderTopLeftRadius={10}
            borderBottomLeftRadius={10}
            borderBottomRightRadius={10}
            borderTopRightRadius={10}
            row
            alignCenter
            justifyCenter
          >
            <Text fontFamily={"Roboto-Bold"} color={Color.white} size={20}>
              Xác nhận
            </Text>
          </Button>
          <Button
            nextScreen={() => onCancel()}
            height={30}
            margin={10}
            borderTopLeftRadius={10}
            borderBottomLeftRadius={10}
            borderBottomRightRadius={10}
            borderTopRightRadius={10}
            row
            alignCenter
            justifyCenter
          >
            <Text color={Color.mainColor}>Bỏ qua</Text>
          </Button>
        </ScrollView>
        <Load visible={load} />
      </Block>
    </Block>
  );
};
export default CheckLogin;
