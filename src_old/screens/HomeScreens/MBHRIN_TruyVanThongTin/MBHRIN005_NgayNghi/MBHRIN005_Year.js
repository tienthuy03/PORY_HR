/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";
import Block from "../../../../components/Block";
import moment from "moment";
import Icon_calendar from "../../../../icons/Datev";
import OneField from "../../../../components/OneFieldKeyValue";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
const MBHRIN005_Year = () => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const [currentYear, setCurrentYear] = useState(
    moment(new Date()).format("YYYY")
  );
  const styles = StyleSheet.create({
    container: { marginTop: 5, marginRight: 10, marginLeft: 10 },
    pContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(00,00,00,.3)",
      zIndex: 999,
      justifyContent: "center",
      alignItems: "center",
    },
    pContent: {
      width: 300,
      height: 400,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 10,
    },
    pOneItem: {
      padding: 10,
      backgroundColor: Color.inputBackgroundColor,
      marginBottom: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const [showPopupYear, setShowPopupYear] = useState(false);
  const [data, setData] = useState([]);
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk;
  let tokenLogin;
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}
  useEffect(() => {
    getYearData();
  }, [currentYear]);
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
        if (obj == "getYearData") {
          getYearData();
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
  //get data of year
  const getYearData = () => {
    sysFetch(
      API,
      {
        pro: "SELHRIN0052100",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: currentYear,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getYearData");
        }
        if (rs != "Token Expired") {
          console.log(rs);
          if (rs.results === "S") {
            setData(rs.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //popup select year
  const PopupYear = () => {
    const currentYearRef = useRef();
    const tempYear = moment(new Date()).format("YYYY");
    const arrYear = [];
    const startYear = parseInt(tempYear) - 5;
    const endYear = parseInt(tempYear) + 10;
    for (let i = startYear; i < endYear; i++) {
      arrYear.push({ year: i });
    }
    const tempYearForCheck = arrYear.filter(
      (i) => i.year === parseInt(currentYear)
    );
    return (
      <TVSControlPopup
        title={"Chọn năm"}
        onHide={() => setShowPopupYear(false)}
      >
        <FlatList
          ref={currentYearRef}
          data={arrYear}
          renderItem={({ item }) => {
            if (item.year !== currentYear) {
              return (
                <TouchableOpacity
                  style={styles.pOneItem}
                  activeOpacity={currentYear === item.year ? 1 : 0.7}
                  onPress={
                    currentYear === item.year
                      ? null
                      : () => {
                          setCurrentYear(item.year);
                          setShowPopupYear(!showPopupYear);
                        }
                  }
                >
                  <Text
                    color={
                      currentYear === item.year ? Color.grayPlahoder : null
                    }
                  >
                    {item.year}
                  </Text>
                </TouchableOpacity>
              );
            } else {
              return null;
            }
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </TVSControlPopup>
    );
  };

  const renderItem = ({ item, index }) => {
    console.log("item year ", item);
    var m1 = "";
    let styleTitle = {
      color: Color.mainColor,
    };
    var tempTitle = item.style_title.split(",");
    tempTitle.forEach(function (itemTitle, idx) {
      m1 = m1 + '"' + itemTitle.trim().replace(":", '":"') + '"' + ",";
    });
    if (item.style_title != "") {
      m1 = m1.substring(0, m1.length - 1);
      m1 = `{${m1}}`;
      styleTitle = JSON.parse(m1);
    }

    var m2 = "";
    let styleValue = { color: Color.mainColor };
    var tempValue = item.style_value.split(",");
    tempValue.forEach(function (itemValue, idx) {
      m2 = m2 + '"' + itemValue.trim().replace(":", '":"') + '"' + ",";
    });
    if (item.style_value != "") {
      m2 = m2.substring(0, m2.length - 1);
      m2 = `{${m2}}`;
      styleValue = JSON.parse(m2);
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
      >
        <Text flex={1} style={styleTitle}>
          {item.title}
        </Text>
        <Text flex={1} right flexWrap={"wrap"} style={styleValue}>
          {item.value}
        </Text>
      </Block>
    );
  };

  return (
    <>
      {showPopupYear ? <PopupYear /> : null}
      <Block margin={10} radius={8} backgroundColor={Color.white}>
        <Button
          nextScreen={() => {
            setShowPopupYear(true);
          }}
          row
          alignCenter
          padding={10}
          justifyContent={"space-between"}
        >
          <Icon_calendar color={Color.mainColor} marginLeft={20} />
          <Text
            paddingRight={50}
            center
            size={14}
            color={Color.mainColor}
            flex
            height={60}
          >
            Năm {currentYear}
          </Text>
        </Button>
      </Block>
      <Block flex>
        <Block paddingRight={10} paddingLeft={10} flex>
          <Block flex radius={10}>
            <Block flex>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={() => getYearData()}
                refreshing={false}
                ListEmptyComponent={() => (
                  <View style={styles.container}>
                    <Text>Không có dữ liệu !</Text>
                  </View>
                )}
              />
            </Block>
          </Block>
        </Block>
      </Block>
    </>
  );
};
export default MBHRIN005_Year;
