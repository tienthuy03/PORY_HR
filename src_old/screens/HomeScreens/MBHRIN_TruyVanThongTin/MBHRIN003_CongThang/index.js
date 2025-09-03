/* eslint-disable react-native/no-inline-styles */
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import MonthPicker from "react-native-month-year-picker";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";
import Icon_next from "../../../../icons/Drop";
import { setHeaderChil2 } from "../../../../Language";
import ShowError from "../../../../services/errors";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
import { screenHeight } from "react-native-calendars/src/expandableCalendar/commons";

const CongThang = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    modalOneRecord1: {
      flexDirection: "row",
      padding: 5,
      borderRadius: 5,
      borderColor: "#ccc",
      backgroundColor: Color.white,
    },
    modalOneRecord2: {
      flexDirection: "row",
      padding: 5,
      borderRadius: 5,
      borderColor: "#ccc",
      backgroundColor: Color.blueB,
    },
    modalOneRecord3: {
      flexDirection: "row",
      padding: 5,
      borderRadius: 5,
      borderColor: "#ccc",
      backgroundColor: Color.backgroundHol,
    },
    modalOneRecord4: {
      flexDirection: "row",
      padding: 5,
      borderRadius: 5,
      borderColor: "#ccc",
      backgroundColor: Color.backgroundSun,
    },
    modalOneRecordHeader: {
      flexDirection: "row",
      padding: 5,
      borderRadius: 5,
      borderColor: "#ccc",
      marginBottom: 5,
      backgroundColor: Color.blueB,
    },
    modalOneCol1: {
      width: "25%",
    },
    modalOneCol2: {
      textAlign: "center",
      width: "30%",
    },
    modalOneCol3: {
      textAlign: "center",
      width: "15%",
    },
    modalOneCol4: {
      textAlign: "center",
      width: "15%",
    },
    modalOneCol5: {
      textAlign: "center",
      width: "15%",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      width: "100%",
      height: 600,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 50,
    },
    modalHeaderView: {
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
      width: "100%",
      paddingBottom: 10,
      marginBottom: 10,
    },
    modalHeaderText: {
      fontSize: 20,
      fontWeight: "bold",
      color: Color.mainColor,
    },
    modalBodyView: {
      padding: 5,
      flex: 1,
    },
    modalFooterView: {
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      width: "100%",
      alignItems: "center",
      paddingTop: 10,
      marginTop: 10,
    },
    modalbtnClose: {
      borderRadius: 10,
      backgroundColor: Color.mainColor,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
    },
    modalbtnText: {
      color: "white",
    },
  });
  console.log("test");
  const loginReducers = useSelector((state) => state.loginReducers);
  const [IsShow, setIsShow] = useState(false);
  let emp_pk;
  let language = "";
  let dataMenuMBHRs;
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk;
  let refreshToken;
  const menuReducer = useSelector((state) => state.menuReducer);
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }

  try {
    emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    language = loginReducers.data.data.user_language;
  } catch (error) {
    //
  }
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [sts, setSts] = useState(false);
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [show, setShow] = useState(false);
  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker]
  );
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
    setData([]);
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRIN0030102",
        in_par: {
          p1_varchar2: emp_pk,
          p2_varchar2: p_work_mon,
        },
        out_par: {
          p1_sys: "ttct",
          p2_sys: "ttct_detail",
        },
      },
      tokenLogin
    )
      .then((res) => {
        console.log("res ", res);
        if (res == "Token Expired") {
          refreshNewToken("getData", p_work_mon);
        }
        if (res != "Token Expired") {
          if (res.data.ttct.length > 0) {
            //Change language
            //   let map = new Map(Object.entries(res.data.ttct[0]));
            //   map.forEach((value, key) => {
            //     if (
            //       key === 'org_nm' ||
            //       key === 'emp_id' ||
            //       key === 'full_name' ||
            //       key === 'dataday'
            //     ) {
            //     } else {
            //       datass.push({
            //         key: key,
            //         val: {
            //           pk: '',
            //           obj_id: '',
            //           field_name: '',
            //           eng: '',
            //           vie: '',
            //           kor: '',
            //           chi: '',
            //           jap: '',
            //           fra: '',
            //         },
            //         val2: value,
            //       });
            //     }
            //   });
            //   dataLanguage.map(value => {
            //     const lang = value;
            //     datass.map(value => {
            //       if (lang.field_name === value.key) {
            //         value.val = lang;
            //       }
            //     });
            //   });
            setData(res.data.ttct);
            setData1(res.data.ttct_detail);
          }
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData(moment(date).format("YYYYMM"));
      } else {
        ShowError("No internet");
      }
    });
  }, [date]);

  const fetchItems = () => {
    console.log("fetch");
    getData(moment(date).format("YYYYMM"));
  };

  function setValueLanguage(item) {
    if (language === "VIE") {
      return item.val.vie.length === 0
        ? item.key[0].toUpperCase() + item.key.substring(1)
        : item.val.vie;
    } else if (language === "ENG") {
      return item.val.eng.length === 0
        ? item.key[0].toUpperCase() + item.key.substring(1)
        : item.val.eng;
    } else if (language === "KOR") {
      return item.val.kor.length === 0
        ? item.key[0].toUpperCase() + item.key.substring(1)
        : item.val.kor;
    } else if (language === "CHI") {
      return item.val.chi.length === 0
        ? item.key[0].toUpperCase() + item.key.substring(1)
        : item.val.chi;
    } else if (language === "JAP") {
      return item.val.jap.length === 0
        ? item.key[0].toUpperCase() + item.key.substring(1)
        : item.val.jap;
    } else if (language === "FRA") {
      return item.val.fra.length === 0
        ? item.key[0].toUpperCase() + item.key.substring(1)
        : item.val.fra;
    }
  }
  const renderItemss = ({ item, index }) => {
    let tempStyle = null;
    switch (item.hol_type) {
      case "SUN":
        tempStyle = styles.modalOneRecord4;
        break;
      case "HOL":
        tempStyle = styles.modalOneRecord3;
        break;
      default:
        tempStyle = index % 2 ? styles.modalOneRecord1 : styles.modalOneRecord2;
    }
    return (
      <View style={tempStyle}>
        <Text style={styles.modalOneCol1}>{item.date_label}</Text>
        <Text style={styles.modalOneCol2}>
          {item.time_in === "0" ? "--:--" : item.time_in} -{" "}
          {item.time_out === "0" ? "--:--" : item.time_out}
        </Text>
        <Text style={styles.modalOneCol3}>{item.wt}</Text>
        <Text style={styles.modalOneCol4}>{item.ot}</Text>
        <Text style={styles.modalOneCol4}>{item.total}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (item.title == "null") {
      return null;
    } else {
      var m1 = "";
      var m2 = "";
      var m3 = "";
      let styleTitle = {};
      let styleKey = {};
      let styleRow = {};
      let tempTitle = [];
      tempTitle = item.style_title.split(",");
      if (tempTitle.length > 0) {
        tempTitle.forEach(function (itemTitle, idx) {
          m1 = m1 + '"' + itemTitle.trim().replace(":", '":"') + '"' + ",";
        });
      }

      if (item.style_title != "") {
        m1 = m1.substring(0, m1.length - 1);
        m1 = `{${m1}}`;
        styleTitle = JSON.parse(m1);
      }
      let tempKey = [];
      tempKey = item.style_key.split(",");
      if (tempKey.length > 0) {
        tempKey.forEach(function (itemKey, idx) {
          m2 = m2 + '"' + itemKey.trim().replace(":", '":"') + '"' + ",";
        });
      }
      if (item.style_key != "") {
        m2 = m2.substring(0, m2.length - 1);
        m2 = `{${m2}}`;
        styleKey = JSON.parse(m2);
      }

      let tempRow = [];
      tempRow = item.style_row.split(";");

      if (tempRow.length > 0) {
        tempRow.forEach(function (itemRow, idx) {
          m3 = m3 + '"' + itemRow.trim().replace(":", '":"') + '"' + ",";
        });
      }
      if (item.style_row != "") {
        m3 = m3.substring(0, m3.length - 1);
        m3 = `{${m3}}`;
        styleRow = JSON.parse(m3);
      }
      return (
        <View
          flexDirection={"row"}
          backgroundColor={"white"}
          paddingVertical={10}
          paddingLeft={item.title == " " && item.key == " " ? 0 : 5}
          paddingRight={item.title == " " && item.key == " " ? 0 : 5}
          marginHorizontal={10}
          borderBottomWidth={1}
          borderBottomColor={"#F4F6F7"}
          justifyContent={"space-between"}
          style={styleRow}
        >
          <View flex={1}>
            <Text flexWrap={"wrap"} style={styleTitle}>
              {item.title}
            </Text>
          </View>
          <View flex={1}>
            <Text paddingRight={5} style={styleKey} right flexWrap={"wrap"}>
              {item.key}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <Modal visible={sts} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalHeaderView}
            activeOpacity={0.7}
            onPress={() => {
              setIsShow(!IsShow);
            }}
          >
            <Text style={styles.modalHeaderText}>CHI TIẾT CÔNG THÁNG</Text>
          </TouchableOpacity>
          <View style={styles.modalBodyView}>
            <View style={styles.modalOneRecordHeader}>
              <Text style={styles.modalOneCol1}>Ngày</Text>
              <Text style={styles.modalOneCol2}>Vào - ra</Text>
              <Text style={styles.modalOneCol3}>Giờ làm</Text>
              <Text style={styles.modalOneCol4}>Tăng ca</Text>
              <Text style={styles.modalOneCol5}>Tổng</Text>
            </View>
            <FlatList
              data={data1}
              renderItem={renderItemss}
              keyExtractor={(item) => item.car_date}
            />
          </View>
          <View style={styles.modalFooterView}>
            <TouchableOpacity
              style={styles.modalbtnClose}
              onPress={() => {
                setSts(!sts);
              }}
            >
              <Text style={styles.modalbtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRIN003",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN003")[0].p_pk
        )}
      </TVSHeader>

      <Block backgroundColor={Color.gray} flex>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => setShow(true)}
            row
            alignCenter
            padding={10}
            justifyContent={"space-between"}
          >
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              size={14}
              paddingRight={20}
              center
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}
            >
              Tháng {moment(date).format("MM-YYYY")}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(date)}
            okButton="Chọn"
            cancelButton="Huỷ"
            enableAutoDarkMode={Platform.OS === "ios" ? true : false}
          />
        )}
        <Block flex>
          {IsShow ? null : (
            <Block flex height={(screenHeight / 3) * 2} marginBottom={5}>
              <Block flex>
                {/* <SafeAreaView style={{flex: 1}}> */}
                <FlatList
                  data={data}
                  refreshing={false}
                  onRefresh={() => fetchItems()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  onEndReachedThreshold={0.5}
                  extraData={data}
                  ListEmptyComponent={() => (
                    <Block alignCenter justifyCenter marginTop={20}>
                      <Text>Không có dữ liệu !</Text>
                    </Block>
                  )}
                />
                {/* </SafeAreaView> */}
              </Block>
            </Block>
          )}
          {data1.length > 0 ? (
            <>
              <Block
                flex={IsShow ? 1 : 0}
                backgroundColor={Color.white}
                radius={5}
                marginRight={10}
                marginLeft={10}
                marginTop={0}
                marginBottom={20}
              >
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => {
                    setIsShow(!IsShow);
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                      flex: 1,
                      fontWeight: "bold",
                      color: Color.mainColor,
                      textTransform: "uppercase",
                    }}
                  >
                    Chi tiết công tháng
                  </Text>
                  <Icon_next
                    color={Color.titleColor}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                {IsShow ? (
                  <View style={styles.modalBodyView}>
                    <View style={styles.modalOneRecordHeader}>
                      <Text style={styles.modalOneCol1}>Ngày</Text>
                      <Text style={styles.modalOneCol2}>Vào - ra</Text>
                      <Text style={styles.modalOneCol3}>Giờ làm</Text>
                      <Text style={styles.modalOneCol4}>Tăng ca</Text>
                      <Text style={styles.modalOneCol5}>Tổng</Text>
                    </View>
                    <FlatList
                      data={data1}
                      renderItem={renderItemss}
                      keyExtractor={(item) => item.car_date}
                    />
                  </View>
                ) : null}
              </Block>
            </>
          ) : null}
        </Block>
      </Block>
    </Block>
  );
};

export default CongThang;
