/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Calender from "../../../../../components/Calendes";
import Icon_calendar from "../../../../../icons/Datev";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup";
import Icon_time from "../../../../../icons/Datev";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../../config/Pro";
import sysFetch from "../../../../../services/fetch_v1";
import TVSButton from "../../../../../components/Tvs/Button";
import RNRestart from "react-native-restart";
import RequestSendNotificationV1 from "../../../../../services/notification/send_v1";
import { useNavigation } from "@react-navigation/native";

const DaDangKy = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let full_name = useSelector(
    (state) => state.loginReducers.data.data.full_name
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  const [countStatus1, setCountStatus1] = useState(0);
  const [countStatus2, setCountStatus2] = useState(0);
  const [countStatus5, setCountStatus5] = useState(0);
  const [startDay, setStartDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDay, setEndDay] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [modalVisible, setModalVisible] = useState(false);

  const showPicker = useCallback((value) => setModalVisible(value), []);

  const onValueChange = useCallback(() => {
    showPicker(true);
  }, [showPicker]);

  const getState = (result) => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    console.log("result ", result);
  };
  const styles = StyleSheet.create({
    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
  });

  const modal = (
    <TVSControlPopup
      maxHeight={500}
      isShow={modalVisible}
      title={"Chọn ngày"}
      onHide={() => setModalVisible(false)}
    >
      <Calender getState={getState} startDayss={startDay} endDayss={endDay} />
    </TVSControlPopup>
  );
  const convertDateYYYYMMDD = (date, character) => {
    console.log("date ", date);
    let newDt = date.split(character);
    return newDt[0] + "" + newDt[1] + "" + newDt[2];
  };
  useEffect(() => {
    getData();
  }, [startDay, endDay]);
  const [data, setData] = useState([]);
  const [dataOT, setDataOT] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [dataMeal, setDataMeal] = useState([]);

  const getData = () => {
    console.log(
      "startDay ",
      startDay.length > 8 ? convertDateYYYYMMDD(startDay, "-") : startDay
    );
    console.log(
      "endDay ",
      endDay.length > 8 ? convertDateYYYYMMDD(endDay, "-") : endDay
    );
    console.log("SELHRRE011008 SELHRRE011008");
    sysFetch(
      API,
      {
        // pro: "SELHRRE011003",
        pro: "SELHRRE011008",
        in_par: {
          p1_varchar2:
            startDay.length > 8 ? convertDateYYYYMMDD(startDay, "-") : startDay,
          p2_varchar2:
            endDay.length > 8 ? convertDateYYYYMMDD(endDay, "-") : endDay,
          p3_varchar2: thr_emp_pk,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          // p1_sys: 'ds_nguoipheduyet',
          p1_sys: "lst_data",
          p2_sys: "lst_data_ot",
          p3_sys: "lst_data_info",
          p4_sys: "lst_data_meal",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setData(rs.data.lst_data);
            setDataOT(rs.data.lst_data_ot);
            setDataInfo(rs.data.lst_data_info);
            setDataMeal(rs.data.lst_data_meal);

            setCountStatus1(0);
            setCountStatus2(0);
            setCountStatus5(0);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const OnChecked = (itemPk, status, oldStatus) => {
    let cnt1 = countStatus1;
    let cnt2 = countStatus2;
    let cnt5 = countStatus5;
    let newLst = [...data];
    newLst = newLst.map((obj) => {
      if (obj.pk === itemPk) {
        if (status == "0") {
          return { ...obj, checked: "N", status: status };
        } else {
          return { ...obj, checked: "Y", status: status };
        }
      } else {
        return obj;
      }
    });
    setData(newLst);
    switch (oldStatus) {
      case "2":
        console.log("old 2");
        cnt2 -= 1;
        switch (status) {
          case "2":
            console.log("new 2");
            cnt2 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          case "1":
            console.log("new 1");
            cnt1 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "5":
        console.log("old 5");
        cnt5 -= 1;
        switch (status) {
          case "2":
            console.log("new 2");
            cnt2 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          case "1":
            console.log("new 1");
            cnt1 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "1":
        console.log("old 1");
        cnt1 -= 1;
        switch (status) {
          case "2":
            console.log("new 2");
            cnt2 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          case "1":
            console.log("new 1");
            cnt1 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "0":
        console.log("old 0");
        switch (status) {
          case "2":
            console.log("new 2");
            cnt2 += 1;
            break;
          case "5":
            console.log("new 5");
            cnt5 += 1;
            break;
          case "1":
            console.log("new 1");
            cnt1 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      default:
        console.log("out case");
    }
    setCountStatus1(cnt1);
    setCountStatus2(cnt2);
    setCountStatus5(cnt5);
  };
  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Block flex marginLeft={10} marginRight={10} marginBottom={5}>
        <Block row justifyContent={"space-between"} alignCenter>
          <Block
            borderTopRightRadius={6}
            borderTopLeftRadius={6}
            height={35}
            alignCenter
            justifyCenter
            paddingLeft={10}
            paddingRight={10}
            style={{
              backgroundColor: item.bg_color,
            }}
          >
            <Text style={{ color: Color.mainColor }}>{item.decis_no}</Text>
          </Block>
          {item.status == "2" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={"#E7F2FE"}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: "#3FCB89" }}>Chọn trình ký</Text>
            </Block>
          ) : item.status == "5" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={"#E7F2FE"}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: "#5A94E7" }}>Chọn huỷ phiếu</Text>
            </Block>
          ) : item.status == "1" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={"#E7F2FE"}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: "#F64E60" }}>Chọn xoá phiếu</Text>
            </Block>
          ) : null}
        </Block>
        <View
          style={{
            backgroundColor: Color.white,
            borderColor: Color.oneContentBorder,
            borderWidth: 1,
            borderBottomRightRadius: 6,
            borderBottomLeftRadius: 6,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              borderRadius: 50,
              padding: 10,
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              style={{}}
              onPress={() => {
                item.edit_yn == "Y"
                  ? navigation.navigate("MBHRRE011_EDIT_REG_INFO", {
                      masterPK: item.pk,
                      isEdit: true,
                    })
                  : dialogNoti(item.text_alert);
              }}
            >
              <Icon name={"pencil-outline"} size={20} color={"#5A94E7"} />
            </TouchableOpacity>
          </View>

          {item.info.length > 0 &&
            item.info.split("|").map((x) => (
              <View style={{ paddingTop: 5 }}>
                <Text style={{ color: "gray" }}>{x}</Text>
              </View>
            ))}
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: "#F4F4F4",
                paddingVertical: 5,
                paddingLeft: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text style={{ color: "gray" }}>Khung giờ</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshing={false}
              data={dataOT.filter((x) => x.pk == item.pk)}
              renderItem={renderItemOT}
              scrollEnabled={false}
              listKey={(item, index) => index.toString()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                backgroundColor: "#F4F4F4",
                paddingVertical: 5,
                paddingLeft: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text style={{ color: "gray" }}>Chức vụ</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshing={false}
              data={dataInfo.filter((x) => x.pk == item.pk)}
              renderItem={renderItemInfo}
              //   horizontal={true}
              scrollEnabled={false}
              listKey={(item, index) => index.toString()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                backgroundColor: "#F4F4F4",
                paddingVertical: 5,
                paddingLeft: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text style={{ color: "gray" }}>Cơm tăng ca</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshing={false}
              data={dataMeal.filter((x) => x.pk == item.pk)}
              renderItem={renderItemMeal}
              //   horizontal={true}
              scrollEnabled={false}
              listKey={(item, index) => index.toString()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          {item.approve_status_code == "1" ||
          item.approve_status_code == "2" ||
          item.approve_status_code == "5" ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  {item.status != "2" ? (
                    <View style={{ flex: 1 }}>
                      <TVSButton
                        onPress={() => {
                          OnChecked(item.pk, "2", item.status);
                        }}
                        icon={"check"}
                        buttonStyle={"3"}
                        type={"success"}
                        minWidth={100}
                      >
                        Trình ký
                      </TVSButton>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <TVSButton
                        onPress={() => {
                          OnChecked(item.pk, "0", item.status);
                        }}
                        icon={"sync"}
                        buttonStyle={"3"}
                        type={"secondary"}
                        minWidth={100}
                      >
                        Huỷ bỏ
                      </TVSButton>
                    </View>
                  )}
                  {item.status != "5" ? (
                    <View style={{ flex: 1 }}>
                      <TVSButton
                        onPress={() => {
                          OnChecked(item.pk, "5", item.status);
                        }}
                        icon={"close-circle-outline"}
                        buttonStyle={"3"}
                        type={"primary"}
                        minWidth={100}
                      >
                        Huỷ phiếu
                      </TVSButton>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <TVSButton
                        onPress={() => {
                          OnChecked(item.pk, "0", item.status);
                        }}
                        icon={"sync"}
                        buttonStyle={"3"}
                        type={"secondary"}
                        minWidth={100}
                      >
                        Huỷ bỏ
                      </TVSButton>
                    </View>
                  )}
                  {item.status != "1" ? (
                    <View style={{ flex: 1 }}>
                      <TVSButton
                        onPress={() => {
                          OnChecked(item.pk, "1", item.status);
                        }}
                        icon={"trash-can-outline"}
                        buttonStyle={"3"}
                        type={"danger"}
                        minWidth={100}
                      >
                        Xoá phiếu
                      </TVSButton>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <TVSButton
                        onPress={() => {
                          OnChecked(item.pk, "0", item.status);
                        }}
                        icon={"sync"}
                        buttonStyle={"3"}
                        type={"secondary"}
                        minWidth={100}
                      >
                        Huỷ bỏ
                      </TVSButton>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Block>
    );
  };
  const renderItemOT = ({ item }) => {
    console.log("item ot", item);
    return (
      <>
        {item.count_ot != "" ? (
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#BDBDBD",
              borderBottomWidth: 0.2,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "gray" }}>Khung {item.time_ot}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: "gray" }}>{item.count_ot}</Text>
            </View>
          </View>
        ) : null}
      </>
    );
  };
  const renderItemInfo = ({ item }) => {
    return (
      <>
        {item.count_info != "" ? (
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#BDBDBD",
              borderBottomWidth: 0.2,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "gray" }}>{item.info_nm}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: "gray" }}>{item.count_info}</Text>
            </View>
          </View>
        ) : null}
      </>
    );
  };
  const renderItemMeal = ({ item }) => {
    return (
      <>
        {item.count_info !== "" ? (
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "gray",
              borderBottomWidth: 0.2,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "gray" }}>{item.info_nm}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: "gray" }}>{item.count_info}</Text>
            </View>
          </View>
        ) : null}
      </>
    );
  };
  const OnSave = () => {
    let arrData = [...data].filter((x) => x.checked == "Y");
    let lstPK = "";
    let lstStatus = "";
    if (arrData.length > 0) {
      arrData.forEach(function (item) {
        lstPK += item.pk + "|";
        lstStatus += item.status + "|";
      });
      console.log({
        p1_varchar2: "UPDATE",
        p2_varchar2: thr_emp_pk,
        p3_varchar2: lstPK,
        p4_varchar2: lstStatus,
        p5_varchar2: arrData.length,
        p6_varchar2: APP_VERSION,
        p7_varchar2: crt_by,
      });
      Alert.alert(
        "Thông báo",
        "Bạn có muốn xác nhận?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              sysFetch(
                API,
                {
                  pro: "UPDHRRE011003",
                  in_par: {
                    p1_varchar2: "UPDATE",
                    p2_varchar2: thr_emp_pk,
                    p3_varchar2: lstPK,
                    p4_varchar2: lstStatus,
                    p5_varchar2: arrData.length,
                    p6_varchar2: APP_VERSION,
                    p7_varchar2: crt_by,
                  },
                  out_par: {
                    p1_varchar2: "result",
                    p2_sys: "noti",
                  },
                },
                tokenLogin
              )
                .then((rs) => {
                  console.log("rs save ", rs);
                  if (rs == "Token Expired") {
                    refreshNewToken("OnSave");
                  }
                  if (rs != "Token Expired") {
                    if (rs.data.result == "1") {
                      Alert.alert(
                        "Thông báo",
                        "Xác nhận thành công",
                        [
                          {
                            text: "Thoát",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                      getData();
                      RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
                    } else {
                      Alert.alert(
                        "Thông báo",
                        "Xác nhận không thành công",
                        [
                          {
                            text: "Thoát",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                      getData();
                    }
                  }
                })
                .catch((error) => {
                  console.log("error save");
                  console.log(error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
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
        if (obj == "OnSave") {
          let arrData = [...data].filter((x) => x.checked == "Y");
          let lstPK = "";
          let lstStatus = "";
          if (arrData.length > 0) {
            arrData.forEach(function (item) {
              lstPK += item.pk + "|";
              lstStatus += item.status + "|";
            });
            console.log({
              p1_varchar2: "UPDATE",
              p2_varchar2: thr_emp_pk,
              p3_varchar2: lstPK,
              p4_varchar2: lstStatus,
              p5_varchar2: arrData.length,
              p6_varchar2: APP_VERSION,
              p7_varchar2: crt_by,
            });
            Alert.alert(
              "Thông báo",
              "Bạn có muốn xác nhận?",
              [
                {
                  text: "Hủy bỏ",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Xác nhận",
                  onPress: () => {
                    sysFetch(
                      API,
                      {
                        pro: "UPDHRRE011003",
                        in_par: {
                          p1_varchar2: "UPDATE",
                          p2_varchar2: thr_emp_pk,
                          p3_varchar2: lstPK,
                          p4_varchar2: lstStatus,
                          p5_varchar2: arrData.length,
                          p6_varchar2: APP_VERSION,
                          p7_varchar2: crt_by,
                        },
                        out_par: {
                          p1_varchar2: "result",
                          p2_sys: "noti",
                        },
                      },
                      tokenLogin
                    )
                      .then((rs) => {
                        console.log("rs save ", rs);
                        if (rs.data.result == "1") {
                          Alert.alert(
                            "Thông báo",
                            "Xác nhận thành công",
                            [
                              {
                                text: "Thoát",
                                style: "cancel",
                              },
                            ],
                            { cancelable: false }
                          );
                          getData();
                          RequestSendNotificationV1(
                            rs.data.noti,
                            API,
                            tokenLogin
                          );
                        } else {
                          Alert.alert(
                            "Thông báo",
                            "Xác nhận không thành công",
                            [
                              {
                                text: "Thoát",
                                style: "cancel",
                              },
                            ],
                            { cancelable: false }
                          );
                          getData();
                        }
                      })
                      .catch((error) => {
                        console.log("error save");
                        console.log(error);
                      });
                  },
                },
              ],
              { cancelable: false }
            );
          }
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
  return (
    <Block paddingTop={10} backgroundColor={Color.gray} flex>
      <Block
        marginLeft={10}
        marginRight={10}
        radius={8}
        backgroundColor={Color.white}
      >
        <TouchableOpacity
          onPress={() => onValueChange()}
          style={{
            padding: 10,
            paddingLeft: 20,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Icon_calendar color={Color.mainColor} marginLeft={20} />
          <View
            style={{
              paddingRight: 20,
              paddingLeft: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: Color.mainColor,
              }}
            >
              Ngày {daySelect}
            </Text>
          </View>
          <Text marginRight={10} />
        </TouchableOpacity>
        {modal}
      </Block>
      <View style={{ flex: 1, marginTop: 5 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => getData()}
          refreshing={false}
          data={data}
          renderItem={renderItem}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          height: height / 11,
          paddingTop: 10,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 4, marginLeft: 20 }}>
          <View style={{ alignSelf: "flex-start", color: "" }}>
            <Text style={{ color: "#3FCB89" }}>Chọn trình ký: </Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#5A94E7" }}>Chọn huỷ phiếu: </Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#F64E60" }}>Chọn xoá phiếu: </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#3FCB89" }}>{countStatus2}</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#5A94E7" }}>{countStatus5}</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#F64E60" }}>{countStatus1}</Text>
          </View>
        </View>
        <View style={{ flex: 6, paddingTop: 10 }}>
          <View paddingRight={10}>
            <TVSButton
              icon={"content-save"}
              buttonStyle={"3"}
              onPress={OnSave}
              paddingHorizontal={30}
            >
              Xác nhận
            </TVSButton>
          </View>
        </View>
      </View>
    </Block>
  );
};

export default DaDangKy;
