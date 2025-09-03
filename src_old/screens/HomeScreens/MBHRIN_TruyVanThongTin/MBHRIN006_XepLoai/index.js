import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, View } from "react-native";
import MonthPicker from "react-native-month-year-picker";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";
import TVSButton from "../../../../components/Tvs/Button";
import Icon_calendar from "../../../../icons/Datev";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
const XepLoai = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    pContent: {
      backgroundColor: "white",
      width: "100%",
      borderRadius: 20,
    },
    pContainer: {
      paddingHorizontal: 10,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(00,00,00,.3)",
      zIndex: 90,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  const [startMonth, setStartMonth] = useState();
  // moment(new Date()).format('01/YYYY'),
  const [endMonth, setEndMonth] = useState();
  // moment(new Date()).format('MM/YYYY'),
  const [startMonthTemp, setStartMonthTemp] = useState();
  // moment(new Date()).format('01/YYYY'),
  const [endMonthTemp, setEndMonthTemp] = useState();
  // moment(new Date()).format('MM/YYYY'),
  const [showStartMonth, setShowStartMonth] = useState(false);
  const [showEndMonth, setShowEndMonth] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const menuReducer = useSelector((state) => state.menuReducer);

  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk;
  let tokenLogin;
  let language;
  let dataMenuMBHRs;
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}

  //handle Change date
  const onValueChange = () => {
    setStartMonthTemp(startMonth);
    setEndMonthTemp(endMonth);
    setModalVisible(!modalVisible);
  };
  const refreshNewToken = (obj, param1, param2) => {
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
        if (obj == "getMonthBinding") {
          getMonthBinding();
        }
        if (obj == "getData") {
          getData(param1, param2);
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
  //get month binding default
  const getMonthBinding = () => {
    sysFetch(
      API,
      {
        pro: "SELHRIN0060100",
        in_par: {
          p1_varchar2: thr_emp_pk,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getMonthBinding", null, null);
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            setStartMonth(rs.data.data[0].start_month);
            setEndMonth(rs.data.data[0].end_month);
            getData(rs.data.data[0].start_month, rs.data.data[0].end_month);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //get data of month
  const getData = (start_month, end_month) => {
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: start_month.split("/")[1] + "" + start_month.split("/")[0],
      p3_varchar2: end_month.split("/")[1] + "" + end_month.split("/")[0],
    });
    sysFetch(
      API,
      {
        pro: "SELHRIN0061100",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2:
            start_month.split("/")[1] + "" + start_month.split("/")[0],
          p3_varchar2: end_month.split("/")[1] + "" + end_month.split("/")[0],
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs.data);
        if (rs == "Token Expired") {
          refreshNewToken("getData", start_month, end_month);
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            setData(rs.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getMonthBinding();
  }, []);

  //create modal
  const PopupDatePicker = () => {
    return (
      <>
        {modalVisible ? (
          <View style={styles.pContainer}>
            <View style={styles.pContent}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  backgroundColor: "rgba(00,00,00,.03)",
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}
              >
                <Text
                  color={Color.mainColor}
                  fontWeight={"bold"}
                  style={{
                    textTransform: "uppercase",
                  }}
                  size={15}
                  marginBottom={5}
                >
                  Chọn tháng
                </Text>
              </View>
              <View
                style={{
                  padding: 20,
                }}
              >
                <Text>Từ tháng</Text>
                <Button
                  nextScreen={() => {
                    setShowStartMonth(true);
                    setShowEndMonth(false);
                  }}
                  row
                  backgroundColor={Color.blueB}
                  marginBottom={10}
                  padding={10}
                  radius={6}
                  marginTop={5}
                >
                  <Icon_calendar />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Tháng {startMonthTemp}</Text>
                  </View>
                </Button>
                <Text>Đến tháng</Text>
                <Button
                  nextScreen={() => {
                    setShowEndMonth(true);
                    setShowStartMonth(false);
                  }}
                  row
                  backgroundColor={Color.blueB}
                  marginBottom={10}
                  padding={10}
                  radius={6}
                  marginTop={5}
                >
                  <Icon_calendar />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Tháng {endMonthTemp}</Text>
                  </View>
                </Button>
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    backgroundColor: "rgba(00,00,00,.03)",
                    justifyContent: "center",
                  }}
                >
                  <TVSButton
                    type={"danger"}
                    icon={"close"}
                    onPress={() => {
                      setModalVisible(false);
                      setShowEndMonth(false);
                      setShowStartMonth(false);
                    }}
                  >
                    Đóng lại
                  </TVSButton>
                  <TVSButton
                    icon={"check"}
                    onPress={async () => {
                      if (showEndMonth || showStartMonth) {
                      } else {
                        const tempEM = parseInt(
                          endMonthTemp.split("/")[1] +
                            endMonthTemp.split("/")[0]
                        );
                        const tempSM = parseInt(
                          startMonthTemp.split("/")[1] +
                            startMonthTemp.split("/")[0]
                        );
                        if (tempEM < tempSM) {
                          Alert.alert(
                            "Thông báo",
                            "Tháng bắt đầu phải nhỏ hơn hoặc bằng tháng kết thúc.",
                            [{ text: "Đóng" }]
                          );
                        } else {
                          setEndMonth(endMonthTemp);
                          setStartMonth(startMonthTemp);
                          setModalVisible(false);
                          getData(startMonthTemp, endMonthTemp);
                        }
                      }
                    }}
                  >
                    Xác nhận
                  </TVSButton>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  };
  const RenderItem = ({ item }) => {
    if (item.title == "null") {
      return null;
    } else {
      var m1 = "";
      var m2 = "";
      var m3 = "";
      let styleTitle = { color: Color.mainColor };
      let styleKey = { color: Color.mainColor };
      let styleRow = {};
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

      var tempRow = item.style_row.split(";");

      tempRow.forEach(function (itemRow, idx) {
        m3 = m3 + '"' + itemRow.trim().replace(":", '":"') + '"' + ",";
      });
      if (item.style_row != "") {
        m3 = m3.substring(0, m3.length - 1);
        m3 = `{${m3}}`;
        styleRow = JSON.parse(m3);
      }
      // console.log(item);
      // if (item.key != '' || item.title != '') {
      return (
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={"#F4F6F7"}
          paddingLeft={item.title == " " && item.key == " " ? 0 : 5}
          paddingRight={item.title == " " && item.key == " " ? 0 : 5}
          backgroundColor={Color.white}
          paddingTop={item.title == " " && item.key == " " ? 0 : 10}
          paddingBottom={item.title == " " && item.key == " " ? 0 : 10}
          justifyContent={"space-between"}
          marginHorizontal={10}
          style={styleRow}
        >
          <Text flex={1} style={styleTitle}>
            {item.title}
          </Text>
          <Text flex={1} right flexWrap={"wrap"} style={styleKey}>
            {item.key}
          </Text>
        </Block>
      );
      // } else {
      //   return null;
      // }
    }
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRIN006",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN006")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <>
          {showStartMonth && (
            <MonthPicker
              onChange={(value, newStartDate) => {
                setShowStartMonth(false);
                if (newStartDate) {
                  setStartMonthTemp(moment(newStartDate).format("MM/YYYY"));
                }
              }}
              value={
                new Date(
                  startMonthTemp.split("/")[1],
                  startMonthTemp.split("/")[0]
                )
              }
              minimumDate={new Date(2014, 12)}
              maximumDate={new Date(2030, 12)}
              enableAutoDarkMode={Platform.OS === "ios" ? true : false}
            />
          )}
          {showEndMonth && (
            <MonthPicker
              onChange={(value, newEndDate) => {
                setShowEndMonth(false);
                if (newEndDate) {
                  setEndMonthTemp(moment(newEndDate).format("MM/YYYY"));
                }
              }}
              value={
                new Date(endMonthTemp.split("/")[1], endMonthTemp.split("/")[0])
              }
              minimumDate={new Date(2014, 12)}
              maximumDate={new Date(2030, 12)}
              enableAutoDarkMode={Platform.OS === "ios" ? true : false}
            />
          )}
          <Block margin={10} radius={8} backgroundColor={Color.white}>
            <Button
              nextScreen={() => onValueChange()}
              row
              alignCenter
              padding={10}
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
                {startMonth} - {endMonth}
              </Text>
              <Text marginRight={10} />
            </Button>
          </Block>
          <PopupDatePicker />
          <Block flex paddingBottom={20}>
            {/* <Block paddingRight={10} paddingLeft={10} paddingBottom={20} flex>
              <Block flex radius={10}>
                <Block flex> */}
            <FlatList
              onRefresh={() => getData(startMonth, endMonth)}
              refreshing={false}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => <RenderItem item={item} />}
              extraData={data}
              ListEmptyComponent={() => (
                <Block alignCenter justifyCenter marginTop={20}>
                  <Text>Không có dữ liệu !</Text>
                </Block>
              )}
            />
            {/* </Block>
              </Block>
            </Block> */}
          </Block>
        </>
      </Block>
    </Block>
  );
};
export default XepLoai;
