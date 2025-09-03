/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Person from "../../../../icons/Person";
import { setHeaderChil } from "../../../../Language";
import List_TTCN from "../../../../utils/ListTTCN(MBHRIN001)";
import axios from "axios";
import sysFetch from "../../../../services/fetch";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
const ThongTinCaNhan = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    img: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    boxI: {
      borderRadius: 12,
      overflow: "hidden",
      width: 80,
      height: 80,
      backgroundColor: Color.white,
      alignItems: "center",
    },
    imgs: {
      width: 60,
      height: 80,
    },
  });
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let dataMenuMBHRs;
  let language;
  let fullname;
  let avartar;
  let empId;
  let tokenLogin;
  let thr_emp_pk;
  let userPk;
  let refreshToken;
  try {
    avartar = loginReducers.data.data.avatar;
    fullname = loginReducers.data.data.full_name;
    empId = loginReducers.data.data.emp_id;
    language = loginReducers.data.data.user_language;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    dataMenuMBHRs = menuReducer.data.data.menu;
    refreshToken = loginReducers.data.data.refreshToken;
    userPk = loginReducers.data.data.tes_user_pk;
  } catch (error) {
    console.log(error);
  }
  const [dataTTCN, setTTCN] = useState([]);
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
  const getData = () => {
    console.log("api ", API);
    sysFetch(
      API,
      {
        pro: "SELHRIN0010100",
        in_par: {
          p1_varchar2: thr_emp_pk,
        },
        out_par: {
          p1_sys: "o1",
          p2_sys: "o2",
          p3_sys: "o3",
          p4_sys: "o4",
          p5_sys: "o5",
          p6_sys: "o6",
          p7_sys: "o7",
          p8_sys: "o8",
          p9_sys: "o9",
          p10_sys: "o10",
          p11_sys: "o11",
          p12_sys: "o12",
          p13_sys: "o13",
          p14_sys: "o14",
          p15_sys: "o15",
          p16_sys: "o16",
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
            setTTCN(rs.data);
          }
        }
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };
  const fetch = () => {
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  function infor(size, text) {
    return (
      <Text marginTop={3} color={Color.mainColor} size={size}>
        {text}
      </Text>
    );
  }
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil(
          language,
          dataMenuMBHRs,
          0,
          "MBHRIN001",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN001")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block
          shadow
          justifyContent={"space-between"}
          radius={8}
          row
          marginRight={10}
          marginLeft={10}
          marginBottom={10}
          marginTop={5}
          backgroundColor={Color.white}
        >
          <Block>
            <Block row justifyCenter alignCenter>
              {avartar.length > 0 ? (
                <View style={styles.boxI}>
                  <Image style={styles.imgs} source={{ uri: avartar }} />
                </View>
              ) : (
                <View style={styles.img}>
                  <Person />
                </View>
              )}
              <Block column paddingLeft={15}>
                {infor(20, fullname)}
                {infor(12, empId)}
                {infor(12, "Trạng thái: Đang làm việc")}
              </Block>
            </Block>
          </Block>
        </Block>
        <List_TTCN fetchItems={fetch} refreshing={false} data={dataTTCN} />
      </Block>
    </Block>
  );
};
export default ThongTinCaNhan;
