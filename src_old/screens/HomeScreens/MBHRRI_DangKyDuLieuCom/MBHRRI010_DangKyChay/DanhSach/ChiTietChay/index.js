/**************** START: IMPORT ****************/
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Text from "../../../../../../components/Text";
import { updateUserAction } from "../../../../../../actions";
import sysFetch from "../../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../../config/Pro";

import Block from "../../../../../../components/Block";
import Button from "../../../../../../components/Button";
import TVSButton from "../../../../../../components/Tvs/Button";
import TVSList2 from "../../../../../../components/Tvs/TVSList2";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import TVS2Date from "../../../../../../components/Tvs/TVS2Date";
import TVSTextInput from "../../../../../../components/Tvs/TVSTextInput";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../../services/redux/GlobalLoading/action";
import { showAlert } from "../../../../../../components/Tvs/TVSAlertORA";
import { useNavigation } from "@react-navigation/native";
import TVSHeader from "../../../../../../components/Tvs/Header";
/************************************************ END: IMPORT ************************************************/

const ChiTietChay = ({ navigation: { goBack }, route }) => {
  //************************************************ START: VARIABLE ************************************************
  const { item, onRefresh } = route.params;
  console.log("route ", route.params);
  /**************** START: IMPORT ****************/
  const navigation = useNavigation();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  let thr_emp_pk = "";
  let tokenLogin = "";
  let tes_user_pk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    tes_user_pk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  useEffect(() => {
    // dispatch(ShowGlobalLoading);
    // OnLoadingData();
    OnLoadingList();
  }, []);
  //************ START: STATE ************
  //
  const [dataMealMethod, setDataMealMethod] = useState([]);
  const onChangeMealMethod = (pk, result) => {
    let arr = [...dataMain];
    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.meal_method_code = result.code;
        item.meal_method_code_nm = result.code_nm;
      }
    });
    setDataMain(arr);
    setModalVisibleMealMethod(false);
  };
  const [modalVisibleMealMethod, setModalVisibleMealMethod] = useState(false);

  const modalMealMethod = (
    <TVSControlPopup
      title={"Chọn phương thức"}
      isShow={modalVisibleMealMethod}
      onHide={() => setModalVisibleMealMethod(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleMealMethod(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataMealMethod}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeMealMethod(currentPK, item);
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
    </TVSControlPopup>
  );
  //
  //
  const [dataCanteen, setDataCanteen] = useState([]);
  const onChangeCanteen = (pk, result) => {
    console.log("update pk ", pk);
    let arr = [...dataMain];
    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.canteen_code = result.code;
        item.canteen_code_nm = result.code_nm;
      }
    });
    setDataMain(arr);
    setModalVisibleCanteen(false);
  };
  const [currentPK, setCurrentPK] = useState("");
  const [modalVisibleCanteen, setModalVisibleCanteen] = useState(false);

  const modalCanteen = (
    <TVSControlPopup
      title={"Chọn vị trí ăn"}
      isShow={modalVisibleCanteen}
      onHide={() => setModalVisibleCanteen(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleCanteen(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataCanteen}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeCanteen(currentPK, item);
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
    </TVSControlPopup>
  );
  //
  const [textDescription, setTextDescription] = useState("");
  const OnEditDescription = (pk, text) => {
    let arr = [...dataMain];

    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.description = text;
      }
    });
    setDataMain(arr);
  };
  //
  const OnEditRow = (pk, type, val) => {
    let arr = [...dataMain];

    arr.forEach(function (item) {
      if (item.pk == pk) {
        switch (type) {
          case 1:
            item.num_1 = val;
            break;
          case 2:
            item.num_2 = val;
            break;
          case 3:
            item.num_3 = val;
            break;
          case 4:
            item.num_4 = val;
            break;
          default:
            console.log("out case");
        }
      }
    });

    setDataMain(arr);
  };
  //************ END: STATE ************

  //RefreshToken
  const refreshNewToken = (obj) => {
    axios
      .post(API + "User/RefreshToken/", {
        token: tokenLogin,
        userPk: tes_user_pk,
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
  //
  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };
  //****************************************** START: HANDLE FUNCTIONS ******************************************
  const [dataMain, setDataMain] = useState([]);
  const OnLoadingList = () => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRRI010003";
    const in_par = {
      p1_varchar2: item.pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "lst_data",
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnLoadingData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log(rs.data.lst_data);
            setDataMain(rs.data.lst_data);
            OnLoadingControlData();
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
        dispatch(HideGlobalLoading);
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  const OnLoadingControlData = () => {
    const pro = "SELHRRI010004";
    const in_par = {
      p1_varchar2: tes_user_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    const out_par = {
      p2_sys: "lst_meal_method",
      p3_sys: "lst_canteen",
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnLoadingData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log(rs.data);
            setDataMealMethod(rs.data.lst_meal_method);
            setDataCanteen(rs.data.lst_canteen);
            OnLoadingListDetail();
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
        dispatch(HideGlobalLoading);
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  const [dataDetail, setDataDetail] = useState([]);
  const OnLoadingListDetail = () => {
    const pro = "SELHRRI010005";
    const in_par = {
      p1_varchar2: item.pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    const out_par = {
      p2_sys: "lst_detail",
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnLoadingData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log(rs.data.lst_detail);
            setDataDetail(rs.data.lst_detail);

            dispatch(HideGlobalLoading);
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
        dispatch(HideGlobalLoading);
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  const OnReset = () => {
    navigation.goBack();
    navigation.navigate("MBHRRI009");
  };

  const OnValidate = (pk) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn sao lưu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => OnSave(pk),
        },
      ],
      { cancelable: false }
    );
  };

  const OnSave = (pk) => {
    let arrUpd = dataMain.filter((x) => x.pk == pk);
    const pro = "UPDHRRI010001";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: pk,
      p3_varchar2: thr_emp_pk,
      p4_varchar2: arrUpd[0].rice_set_type,
      p5_varchar2: arrUpd[0].start_dt,
      p6_varchar2: arrUpd[0].meal_method_code,
      p7_varchar2: arrUpd[0].canteen_code,
      p8_varchar2: arrUpd[0].rice_kind,
      p9_varchar2: arrUpd[0].num_1,
      p10_varchar2: arrUpd[0].num_2,
      p11_varchar2: arrUpd[0].num_3,
      p12_varchar2: arrUpd[0].num_4,
      p13_varchar2: arrUpd[0].description,
      p14_varchar2: arrUpd[0].limit_1,
      p15_varchar2: arrUpd[0].limit_2,
      p16_varchar2: arrUpd[0].limit_3,
      p17_varchar2: arrUpd[0].limit_4,
      p18_varchar2: APP_VERSION,
      p19_varchar2: crt_by,
    };
    const out_par = {
      p1_varchar2: "rtn_value",
    };
    console.log(in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("OnGetGridData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            showAlert(rs.data.rtn_value);
          } else {
            showAlert(rs.errorData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //****************************************** START: HANDLE FUNCTIONS ******************************************
  //renderitem list

  const ItemDetail = ({ item }) => {
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

    return item.value == "" ? null : (
      <Block
        row
        borderBottomWidth={1}
        borderBottomColor={"#F4F6F7"}
        paddingLeft={10}
        paddingRight={10}
        backgroundColor={Color.white}
        paddingTop={item.title == " " ? 0 : 5}
        paddingBottom={item.title == " " ? 0 : 5}
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

  const ItemMain = ({ item }) => {
    console.log(
      "dataDetail ",
      dataDetail.filter((x) => x.pk == item.pk)
    );

    return (
      <View>
        <View
          style={{
            marginHorizontal: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: "white",
            marginTop: 10,
          }}
        >
          <View>
            <View style={{ marginTop: 10, marginLeft: 10, marginBottom: 10 }}>
              <Text style={{ color: Color.mainColor, fontWeight: "bold" }}>
                {item.label}
              </Text>
            </View>
          </View>
          {/*  */}
          <FlatList
            data={dataDetail.filter((x) => x.pk == item.pk)}
            renderItem={ItemDetail}
            keyExtractor={(item, index) => index.toString()}
          />
          <View>
            <Block style={{ margin: 10 }}>
              <Block
                style={{
                  flexDirection: "row",
                  paddingBottom: 5,
                  paddingLeft: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Color.mainColor }}>Phương thức</Text>
                <Text style={{ color: Color.red }}> *</Text>
              </Block>
              <Button
                nextScreen={() => {
                  setCurrentPK(item.pk);
                  setModalVisibleMealMethod(true);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: Color.gray,
                  borderRadius: 6,
                }}
              >
                <Block
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingLeft: 10,
                    paddingVertical: 10,
                  }}
                >
                  <Text>{item.meal_method_code_nm}</Text>
                </Block>
                <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                  <Icon
                    name={"chevron-down"}
                    color={Color.mainColor}
                    size={30}
                  />
                </Block>
              </Button>
              {modalMealMethod}
            </Block>
          </View>
          <View>
            {/*  */}
            <View>
              <Block style={{ margin: 10, marginTop: 0 }}>
                <Block
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                    paddingLeft: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: Color.mainColor }}>Vị trí ăn</Text>
                  <Text style={{ color: Color.red }}> *</Text>
                </Block>
                <Button
                  nextScreen={() => {
                    setCurrentPK(item.pk);
                    setModalVisibleCanteen(true);
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: Color.gray,
                    borderRadius: 6,
                  }}
                >
                  <Block
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      paddingLeft: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <Text>{item.canteen_code_nm}</Text>
                  </Block>
                  <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                    <Icon
                      name={"chevron-down"}
                      color={Color.mainColor}
                      size={30}
                    />
                  </Block>
                </Button>
                {modalCanteen}
              </Block>
            </View>
          </View>
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ borderRadius: 2 }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    height: 30,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: 100,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Loại suất ăn</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 50,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Sáng</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 50,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Trưa</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 50,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Chiều</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 50,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Đêm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 100,
                      borderWidth: 0.2,
                      borderColor: "#BDBDBD",
                    }}
                  >
                    <Text>Tổng số suất</Text>
                  </View>
                </View>
                <View style={{ maxHeight: 120 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      height: Platform.OS == "ios" ? 30 : 40,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: 100,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftColor: "#BDBDBD",
                        borderLeftWidth: 0.2,
                        borderRightColor: "#BDBDBD",
                        borderRightWidth: 0.2,
                      }}
                    >
                      <Text>{item.rice_kind}</Text>
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: 50,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftColor: "#BDBDBD",
                        borderLeftWidth: 0.2,
                        borderRightColor: "#BDBDBD",
                        borderRightWidth: 0.2,
                      }}
                    >
                      <TextInput
                        style={{
                          width: "100%",
                          textAlign: "center",
                        }}
                        value={item.num_1.toString()}
                        // placeholder={item.num_1.toString()}
                        onChangeText={(text) => OnEditRow(item.pk, 1, text)}
                        keyboardType={"numeric"}
                        returnKeyType="done"
                      />
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: 50,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftColor: "#BDBDBD",
                        borderLeftWidth: 0.2,
                        borderRightColor: "#BDBDBD",
                        borderRightWidth: 0.2,
                      }}
                    >
                      <TextInput
                        style={{
                          width: "100%",
                          textAlign: "center",
                        }}
                        value={item.num_2.toString()}
                        // placeholder="0"
                        onChangeText={(text) => OnEditRow(item.pk, 2, text)}
                        keyboardType={"numeric"}
                        returnKeyType="done"
                      />
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: 50,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftColor: "#BDBDBD",
                        borderLeftWidth: 0.2,
                        borderRightColor: "#BDBDBD",
                        borderRightWidth: 0.2,
                      }}
                    >
                      <TextInput
                        style={{
                          width: "100%",
                          textAlign: "center",
                        }}
                        value={item.num_3.toString()}
                        onChangeText={(text) => OnEditRow(item.pk, 3, text)}
                        keyboardType={"numeric"}
                        returnKeyType="done"
                      />
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: 50,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftColor: "#BDBDBD",
                        borderLeftWidth: 0.2,
                        borderRightColor: "#BDBDBD",
                        borderRightWidth: 0.2,
                      }}
                    >
                      <TextInput
                        style={{
                          width: "100%",
                          textAlign: "center",
                        }}
                        value={item.num_4.toString()}
                        onChangeText={(text) => OnEditRow(item.pk, 4, text)}
                        keyboardType={"numeric"}
                        returnKeyType="done"
                      />
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: 100,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftColor: "#BDBDBD",
                        borderLeftWidth: 0.2,
                        borderRightColor: "#BDBDBD",
                        borderRightWidth: 0.2,
                      }}
                    >
                      <TextInput
                        style={{
                          width: "100%",
                          textAlign: "center",
                        }}
                        value={item.total_num.toString()}
                        // onChangeText={(text) => OnEditRow(item.pk, 4, text)}
                        keyboardType={"numeric"}
                        returnKeyType="done"
                        editable={false}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          {/*  */}
          <View>
            {/* <TVSTextInput
              label={"Ghi chú"}
              value={item.description}
              changeValue={(text) => OnEditDescription(item.pk, text)}
              multiLine={true}
            /> */}
            <Block style={{ margin: 10 }}>
              <Block
                style={{
                  flexDirection: "row",
                  paddingBottom: 5,
                  paddingLeft: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Color.mainColor }}>Ghi chú</Text>
              </Block>
              <Block
                style={{
                  backgroundColor: Color.gray,
                  paddingHorizontal: 5,
                  paddingVertical: Platform.OS == "ios" ? 8 : 0,
                  borderRadius: 6,
                  // minHeight: multiLine ? 70 : null,
                }}
              >
                <TextInput
                  value={item.description}
                  multiline={true}
                  onChangeText={(text) => OnEditDescription(item.pk, text)}
                />
              </Block>
            </Block>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            marginHorizontal: 10,
            backgroundColor: "white",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            paddingBottom: 10,
          }}
        >
          <View>
            <TVSButton
              onPress={() => {
                OnValidate(item.pk);
              }}
              icon={"content-save"}
              buttonStyle={"3"}
              minWidth={150}
            >
              Sao lưu
            </TVSButton>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>Chi tiết đăng ký chay</TVSHeader>
      <FlatList
        style={{ paddingTop: 5, paddingBottom: 10, flex: 1 }}
        data={dataMain}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemMain}
      />
    </Block>
  );
};

export default ChiTietChay;
