import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, View, Alert } from "react-native";
import MonthPicker from "react-native-month-year-picker";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../Language";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";

const LuongThang = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);

  let language = "";
  let user_pk = "";
  let tokenLogin = "";
  let dataMenuMBHRs;
  let userPk;
  let refreshToken;
  try {
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
    tokenLogin = loginReducers.data.data.tokenLogin;
    user_pk = loginReducers.data.data.thr_emp_pk;
    userPk = loginReducers.data.tes_user_pk;
    refreshToken = loginReducers.data.refreshToken;
  } catch (error) {
    //
  }
  const [dataLuong, setDataLuong] = useState([]);
  const [news, SetNew] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1)).format("YYYYMM")
  );
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [dateString, setDateString] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1)).format("MM-YYYY")
  );
  const [show, setShow] = useState(false);

  const onValueChange = async (event, newDate) => {
    setShow(false);
    setDate(newDate);
    setDateString(moment(newDate).format("MM-YYYY"));
    SetNew(moment(newDate).format("YYYYMM"));
    getData(moment(newDate).format("YYYYMM"));
  };
  const refreshNewToken = (obj, param1) => {
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
          getData(param1);
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

  const getData = (p_work_mon) => {
    dispatch(ShowGlobalLoading);
    console.log({
      p1_varchar2: user_pk,
      p2_varchar2: p_work_mon,
    });
    sysFetch(
      API,
      {
        pro: "SELHRIN0040101",
        in_par: {
          p1_varchar2: user_pk,
          p2_varchar2: p_work_mon,
        },
        out_par: {
          p1_sys: "ttlt",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("====>", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", p_work_mon);
        }
        if (rs != "Token Expired") {
          setDataLuong(rs.data.ttlt);
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  useEffect(() => {
    getData(
      new moment(new Date().setMonth(new Date().getMonth() - 1)).format(
        "YYYYMM"
      )
    );
  }, []);

  const fetchItems = () => {
    getData(news);
  };

  const renderItem = ({ item, index }) => {
    var m1 = "";
    var m2 = "";
    let styleTitle = { color: Color.mainColor };
    let styleKey = { color: Color.mainColor };
    var tempTitle = item.style_title.split(",");
    tempTitle.forEach(function (itemTitle, idx) {
      m1 = m1 + '"' + itemTitle.trim().replace(":", '":"') + '"' + ",";
    });
    if (item.style_title != "") {
      m1 = m1.substring(0, m1.length - 1);
      m1 = `{${m1}}`;
      styleTitle = JSON.parse(m1);
    }

    var tempKey = item.style_key.split(",");
    tempKey.forEach(function (itemKey, idx) {
      m2 = m2 + '"' + itemKey.trim().replace(":", '":"') + '"' + ",";
    });
    if (item.style_key != "") {
      m2 = m2.substring(0, m2.length - 1);
      m2 = `{${m2}}`;
      styleKey = JSON.parse(m2);
    }
    return (
      <Block
        row
        borderBottomWidth={1}
        borderBottomColor={"#F4F6F7"}
        paddingLeft={item.title == " " ? 0 : 5}
        paddingRight={item.title == " " ? 0 : 5}
        backgroundColor={Color.white}
        paddingTop={item.title == " " ? 0 : 10}
        paddingBottom={item.title == " " ? 0 : 10}
        justifyContent={"space-between"}
        marginHorizontal={10}
      >
        <Text flex={1} style={styleTitle}>
          {item.title}
        </Text>
        <Text flex={1} right flexWrap={"wrap"} style={styleKey}>
          {item.key}
        </Text>
      </Block>
    );
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRIN004",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN004")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => setShow(true)}
            row
            padding={10}
            alignCenter
            justifyContent={"space-between"}
          >
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              paddingRight={20}
              size={14}
              center
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}
            >
              Tháng {dateString}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(date)}
            maximumDate={new Date()}
            enableAutoDarkMode={Platform.OS === "ios" ? true : false}
          />
        )}
        <View style={{ flex: 1, paddingBottom: 10 }}>
          <FlatList
            data={dataLuong}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            ListEmptyComponent={() => (
              <View style={styles.container}>
                <Text>Không có dữ liệu !</Text>
              </View>
            )}
          />
        </View>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default LuongThang;
