import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Block from "../../../../components/Block";
import TVSControlPopup2 from "../../../../components/Tvs/ControlPopup2";
import TVSList from "../../../../components/Tvs/TVSList";
import TVSButton from "../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../config/Pro";
import sysFetch from "../../../../services/fetch";
import NetInfo from "@react-native-community/netinfo";

import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import EyeClose from "../../../../icons/EyeClose";
import EyeOpen from "../../../../icons/EyeOpen";
import Icon_pass from "../../../../icons/Password";
import Button from "../../../../components/Button.js";
import md5 from "md5";

const QuestionMethod = ({ isFirst }) => {
  const navigation = useNavigation();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      backgroundColor: "white",
      padding: 10,
      borderRadius: 5,
    },
    textBold: {
      fontWeight: "bold",
      color: Color.mainColor,
    },
    content: {
      marginTop: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: "#F8F9F9",
      borderWidth: 1,
    },
    title: {
      fontSize: 16,
    },
    inputEmail: {
      backgroundColor: Color.inputBackgroundColor,
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: "#F8F9F9",
      borderWidth: 1,
    },
    selectQues: {
      flexDirection: "row",
      marginTop: 5,
      marginBottom: 5,
      alignItems: "center",
      padding: 10,
      borderRadius: 5,
      borderColor: "#F8F9F9",
      borderWidth: 1,
    },
    selectTitle: {
      flex: 1,
    },
    btnChangeEmail: {
      paddingBottom: 10,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 10,
      borderRadius: 5,
      backgroundColor: Color.btnMain,
    },
    btnChangeEmailText: {
      color: "white",
    },
    btnChangeEmailView: {
      alignItems: "center",
    },
  });
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const state = useSelector((state) => state);
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);

  let language;
  let loadLanguage;
  let user_name;
  let pass;
  let fullname;
  let emp_pk;
  let dataLanguage;
  let userPk;
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
    userPk = state.loginReducers.data.data.tes_user_pk;
    dataLanguage = state.languageReducer.data.data.language;
  } catch (error) {
    //
  }
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
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
  const getStateQuestion = (result) => {
    if (typeQuestion == 1) setCauHoi1(result);
    else if (typeQuestion == 2) setCauHoi2(result);
    setModalChooseQuestionVisible(false);
    console.log('isHide', isHide);
  };
  const [dataQuestion, setDataQuestion] = useState([]);
  const [typeQuestion, setTypeQuestion] = useState(0);
  const [questionAlert, setQuestionAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");

  const [alert, setAlert] = useState("");
  const [modalChooseQuestionVisible, setModalChooseQuestionVisible] = useState(false);
  const [isFirstState, setIsFirstState] = useState(false);

  const username = useSelector((state) => state.loginReducers.user_name);
  const [password, setPassword] = useState("");
  const [isHide, setIsHide] = useState(false);
  const [eye, setEye] = useState(true);
  const [isShowPopupPassword, setIsShowPopupPassword] = useState(false);

  const [cauHoi1Show, setCauHoi1Show] = useState({
    code: "",
    code_nm: "Chọn câu hỏi 1",
    value: "",
  });
  const [cauHoi2Show, setCauHoi2Show] = useState({
    code: "",
    code_nm: "Chọn câu hỏi 2",
    value: "",
  });

  useEffect(() => {
    if (isFirst != undefined) {
      setIsFirstState(isFirst);
    }
  }, [isFirst]);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    const pro = "SELQUES000013";
    const in_par = {
      p1_varchar2: userPk,
      p2_varchar2: APP_VERSION,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "question",
          p2_varchar2: "alert",
          p3_varchar2: "color",
          p4_varchar2: "question_alert",
          p5_sys: "question_success"
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log('rs', rs);
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            setDataQuestion(rs.data.question);
            setColorAlert(rs.data.color);
            setAlert(rs.data.alert);
            setQuestionAlert(rs.data.question_alert);
            if (rs.data.question_success.length > 0) {
              setIsHide(true);
              const boCauHoi1 = {
                code: rs.data.question_success[0].ques_code_1,
                code_nm: rs.data.question_success[0].ques_name_1,
                value: '*******'
              }
              const boCauHoi2 = {
                code: rs.data.question_success[0].ques_code_2,
                code_nm: rs.data.question_success[0].ques_name_2,
                value: '*******'
              }
              setCauHoi1(boCauHoi1);
              setCauHoi2(boCauHoi2);
              const boCauHoi1Show = {
                code: rs.data.question_success[0].ques_code_1,
                code_nm: rs.data.question_success[0].ques_name_1,
                value: rs.data.question_success[0].value_1
              }
              const boCauHoi2Show = {
                code: rs.data.question_success[0].ques_code_2,
                code_nm: rs.data.question_success[0].ques_name_2,
                value: rs.data.question_success[0].value_2
              };
              setCauHoi1Show(boCauHoi1Show);
              setCauHoi2Show(boCauHoi2Show);
            }

          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function dialogNoti(text, isOut) {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Thoát",
          onPress: () => {
            if (isOut) {
              if (isFirstState) {
                navigation.popToTop();
              } else {
                navigation.goBack();
              }
            }

          },
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  const onChecking = () => {
    if (cauHoi1.code.trim() == "" || cauHoi2.code.trim() == "") {
      dialogNoti("Vui lòng chọn câu hỏi bảo mật", false);
      return;
    }

    if (cauHoi1.value == "" || cauHoi2.value == "") {
      dialogNoti("Vui lòng chọn câu trả lời", false);
      return;
    }

    Alert.alert(
      "Thông báo",
      questionAlert,
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
                let action = '';
                if (alert == 'Chưa thiết lập') {
                  action = 'INSERT';
                } else if (alert == 'Đã thiết lập') {
                  action = 'UPDATE';
                }
                const pro = "UPDQUES000013";
                const in_par = {
                  p1_varchar2: action,
                  p2_varchar2: userPk,
                  p3_varchar2: user_name, //user_id
                  p4_varchar2: cauHoi1.code,
                  p5_varchar2: cauHoi1.code_nm,
                  p6_varchar2: cauHoi1.value,
                  p7_varchar2: cauHoi2.code,
                  p8_varchar2: cauHoi2.code_nm,
                  p9_varchar2: cauHoi2.value,
                  p10_varchar2: APP_VERSION,
                };

                console.log(pro, in_par);

                sysFetch(
                  API,
                  {
                    pro,
                    in_par,
                    out_par: {
                      p1_varchar2: "status",
                    },
                  },
                  tokenLogin
                )
                  .then((rs) => {
                    if (rs != "Token Expired") {
                      if (rs.results == "F") {
                        var newText = rs.errorData.split(":");
                        let errors = newText[1].trim().split("\n")[0];
                        dialogNoti(errors, false);
                      } else if (rs.results === "S") {
                        dialogNoti("Lưu câu hỏi bảo mật thành công", true);
                        getQuestions();
                      }
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                dialogNoti("No internet", false);
              }
            });
          },
        },
      ],
      { cancelable: false }
    );
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
              setIsHide(false);
              setCauHoi1(cauHoi1Show);
              setCauHoi2(cauHoi2Show);
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

  return (
    <Block paddingHorizontal={20}>
      {/* <Block flexDirection={"row"} marginBottom={5} overflow="hidden">
        <Text>Thiết lập câu hỏi bảo mật</Text>
        {alert ? <Text style={{ color: colorAlert }}> - {alert}</Text> : null}
      </Block> */}
      <Block flexDirection={"row"} marginBottom={4} overflow="hidden">
        {/* <Text style={{
          fontSize: 16,
          color: 'black',
          fontWeight: '600',
          opacity: 0.8,
        }}>Thiết lập câu hỏi bảo mật</Text> */}
        {
          alert ? <Text style={{
            color: colorAlert,
            fontWeight: '600',
            fontSize: 14,
          }}>{alert}</Text> : null
        }
      </Block>
      <Text style={{
        fontSize: 13,
        color: 'black',
        opacity: 0.4,
        marginBottom: 10,
      }}>
        Câu hỏi bảo mật sẽ được sử dụng để xác thực khi bạn quên mật khẩu.
      </Text>
      <Text style={{
        fontSize: 14,
        color: 'black',
        opacity: 0.6,
        marginBottom: 5,
      }}>Câu hỏi bảo mật 1</Text>
      <Block style={{ marginBottom: 5 }}>
        <TVSList
          {...!isHide ? {} : { disabled: true }}
          onPress={() => {
            console.log('isHide', isHide);
            setTypeQuestion(1);
            setModalChooseQuestionVisible(true);
          }}
          colorText={cauHoi1.code_nm == "Chọn câu hỏi 1" ? "#B2B2B2" : null}
          code_nm={cauHoi1.code_nm == "" ? "Chọn câu hỏi 1" : cauHoi1.code_nm}
        />
      </Block>
      <Block
        marginTop={2}
        paddingLeft={5}
        radius={8}
        height={55}
        marginBottom={15}
        alignCenter
        backgroundColor={Color.gray}
        row
      >
        {/* <MaterialCommunityIcons
          name="lock-question"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        /> */}
        <TextInput
          // flex
          // style={{ flex: 1 }}
          height={55}
          // paddingLeft={15}
          {...!isHide ? {} : { editable: false }}
          placeholder={"Nhập câu trả lời câu hỏi bảo mật 1"}
          autoCompleteType={"password"}
          placeholderTextColor={Color.grayPlahoder}
          value={cauHoi1.value.toString()}
          onChangeText={(text) =>
            setCauHoi1((prevCauHoi1) => ({
              ...prevCauHoi1,
              value: text,
            }))
          }
        />
      </Block>
      <Text style={{
        fontSize: 14,
        color: 'black',
        opacity: 0.6,
        marginBottom: 5,
      }}>Câu hỏi bảo mật 2</Text>
      <TVSList
        {...!isHide ? {} : { disabled: true }}
        onPress={() => {
          setTypeQuestion(2);
          setModalChooseQuestionVisible(true);
        }}
        colorText={cauHoi2.code_nm == "Chọn câu hỏi 2" ? "#B2B2B2" : null}
        code_nm={cauHoi2.code_nm == "" ? "Chọn câu hỏi 2" : cauHoi2.code_nm}
      />
      <Block
        marginTop={10}
        marginBottom={10}
        paddingLeft={5}
        radius={8}
        height={55}
        alignCenter
        backgroundColor={Color.gray}
        row
      >
        {/* <MaterialCommunityIcons
          name="lock-question"
          size={20}
          style={{ marginLeft: 5, color: Color.mainColor }}
        /> */}
        <TextInput
          // flex
          height={55}
          // paddingLeft={15}
          {...!isHide ? {} : { editable: false }}
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

      {/* <TVSButton onPress={() => onChecking} icon={"content-save"}>
        Lưu câu hỏi bảo mật
      </TVSButton> */}

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 10
      }}>

        {
          isHide ? (
            <TVSButton
              onPress={() => setIsShowPopupPassword(true)}
              icon={"content-save"}
              buttonStyle="3"
            >
              Cập nhật
            </TVSButton>
          ) : (
            <TVSButton
              onPress={onChecking}
              icon={"content-save"}
              buttonStyle="3"
            >
              Sao lưu
            </TVSButton>
          )
        }
      </View>

      {/* MODAL QUESTION */}
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
            (item) => item.code != cauHoi1.code && item.code != cauHoi2.code
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
      {modalCheckPassword()}
    </Block>
  );
};

export default QuestionMethod;
