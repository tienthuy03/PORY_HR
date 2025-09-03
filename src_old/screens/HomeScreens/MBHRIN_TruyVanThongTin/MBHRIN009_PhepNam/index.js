import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import MonthPicker from "react-native-month-year-picker";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Icon_next from "../../../../icons/Drop";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../Language";
import ShowError from "../../../../services/errors";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
import { APP_VERSION } from "../../../../config/Pro";
import Modal from "react-native-modal";
import { screenHeight } from "react-native-calendars/src/expandableCalendar/commons";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";

//SELHRIN0090100
const PhepNam = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const menuReducer = useSelector((state) => state.menuReducer);
  const loginReducers = useSelector((state) => state.loginReducers);

  let thr_emp_pk = "";
  let crt_by = "";
  let dataMenuMBHRs;
  let language = "";
  let userPk;
  let refreshToken;
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
    userPk = loginReducers.data.data.tes_user_pk;
    crt_by = loginReducers.data.data.emp_id;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }

  try {
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    language = loginReducers.data.data.user_language;
  } catch (error) {
    //
  }

  //initial default data
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth()))
  );
  const [show, setShow] = useState(false);
  const [IsShow, setIsShow] = useState(false);
  const showPicker = useCallback((value) => setShow(value), []);
  const [sts, setSts] = useState(false);
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker]
  );

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
      width: "50%",
    },
    modalOneCol3: {
      textAlign: "center",
      width: "25%",
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

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData(moment(date).format("YYYYMM"));
      } else {
        ShowError("No internet");
      }
    });
  }, [date]);

  const refreshNewToken = (obj, p1) => {
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
          getData(p1);
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

  const getData = (p_year) => {
    dispatch(ShowGlobalLoading);
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: p_year,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRIN009000000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: p_year,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "ls_phepnam",
          p2_sys: "ls_phepnam_detail",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        // console.log('rs ', rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", p_year);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setData(rs.data.ls_phepnam);
            setData2(rs.data.ls_phepnam_detail);
            // console.log('data', rs.data.ls_phepnam);
            console.log("data_length", rs.data.ls_phepnam.length);
            console.log("data2", rs.data.ls_phepnam_detail.length);
          }
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

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

  //Render Item 1
  const renderItem = ({ item }) => {
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
        {data.map((dataItem, index) => (
          <Block
            key={index}
            flexDirection={"row"}
            backgroundColor={Color.white}
            paddingLeft={dataItem.title == " " && dataItem.value == " " ? 0 : 5}
            paddingRight={
              dataItem.title == " " && dataItem.value == " " ? 0 : 5
            }
            borderBottomWidth={1}
            borderBottomColor={"#F4F6F7"}
            borderColor={Color.oneContentBorder}
            borderWidth={1}
            marginHorizontal={10}
            paddingVertical={10}
            justifyContent={"space-between"}
          >
            {console.log(dataItem)}
            <View flex={1}>
              <Text flexWrap={"wrap"} numberOfLines={2} color={Color.mainColor}>
                {dataItem.title}
              </Text>
            </View>
            <View flex={1}>
              <Text
                paddingRight={5}
                right
                flexWrap={"wrap"}
                color={Color.mainColor}
              >
                {dataItem.value === "" ? 0 : dataItem.value}
              </Text>
            </View>
          </Block>
        ))}
      </Block>
    );
  };

  //RenderEmpty
  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };

  //Render Item 2
  const renderItem2 = ({ item, index }) => {
    let tempStyle = null;
    if (item.type == 1) {
      tempStyle = styles.modalOneRecord4;
    } else if (item.type == 2) {
      tempStyle = styles.modalOneRecord1;
      item.title = "-";
    } else {
      tempStyle = styles.modalOneRecord1;
    }
    return (
      <View style={tempStyle}>
        <Text style={styles.modalOneCol1}>{item.title}</Text>
        <Text style={styles.modalOneCol2}>{item.value}</Text>
        <Text style={styles.modalOneCol3}>{item.absence_time}</Text>
      </View>
    );
  };

  //RenderALL
  return (
    <Block backgroundColor={Color.gray} flex>
      <Modal style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalHeaderView}
            activeOpacity={0.7}
            onPress={() => {
              setIsShow(!IsShow);
            }}
          >
            <Text style={styles.modalHeaderText}>CHI TIẾT PHÉP NĂM</Text>
          </TouchableOpacity>
          <View style={styles.modalBodyView}>
            <View style={styles.modalOneRecordHeader}>
              <Text style={styles.modalOneCol1}>Tháng</Text>
              <Text style={styles.modalOneCol2}>Ngày</Text>
              <Text style={styles.modalOneCol3}>Số giờ nghỉ</Text>
            </View>
            <FlatList
              data={data2}
              renderItem={renderItem2}
              // keyExtractor={item => item.car_date}
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
          "MBHRIN009",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN009")[0].p_pk
        )}
      </TVSHeader>
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
          // <Block flex height={(screenHeight / 2) - 20} marginBottom={5}>
          <Block height={(screenHeight / 3) * 2} marginBottom={5}>
            <FlatList
              data={data.slice(0, 1)}
              refreshing={false}
              onRefresh={() => fetchItems()}
              renderItem={renderItem}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={onRenderNoItem}
            />
          </Block>
          // </Block>
        )}
        <Block flex={1}>
          {data2.length > 0 ? (
            <>
              <Block
                flex={IsShow ? 1 : 0}
                backgroundColor={Color.white}
                radius={5}
                marginRight={20}
                marginLeft={20}
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
                    Chi tiết phép năm
                  </Text>
                  <Icon_next
                    color={Color.titleColor}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                {IsShow ? (
                  <View style={styles.modalBodyView}>
                    <View style={styles.modalOneRecordHeader}>
                      <Text style={styles.modalOneCol1}>Tháng</Text>
                      <Text style={styles.modalOneCol2}>Ngày</Text>
                      <Text style={styles.modalOneCol3}>Số giờ nghỉ</Text>
                    </View>
                    <FlatList
                      data={data2}
                      renderItem={renderItem2}
                      // keyExtractor={item => item.car_date}
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

export default PhepNam;
