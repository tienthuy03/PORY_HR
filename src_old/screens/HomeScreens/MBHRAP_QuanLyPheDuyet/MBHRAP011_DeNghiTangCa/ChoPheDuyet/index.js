import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../../config/Pro";
import sysFetch from "../../../../../services/fetch_v1";
import TVSButton from "../../../../../components/Tvs/Button";
import axios from "axios";
import RequestSendNotificationV1 from "../../../../../services/notification/send_v1";
import RNRestart from "react-native-restart";
import { useNavigation } from "@react-navigation/native";

const ChoPheDuyet = ({
  onReload,
  data,
  dataOT,
  dataInfo,
  dataMeal,
  flagReload,
}) => {
  const navigation = useNavigation();
  const [dataSlip, setDataSlip] = useState([]);
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
  const [countStatus3, setCountStatus3] = useState(0);
  const [countStatus4, setCountStatus4] = useState(0);
  const [countStatus5, setCountStatus5] = useState(0);
  const styles = StyleSheet.create({
    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
  });

  useEffect(() => {
    setDataSlip(data);
    setCountStatus3(0);
    setCountStatus4(0);
    setCountStatus5(0);
    flagReload = 0;
  }, [flagReload]);
  const OnChecked = (itemPk, status, oldStatus) => {
    let cnt3 = countStatus3;
    let cnt4 = countStatus4;
    let cnt5 = countStatus5;
    let newLst = [...dataSlip];
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

    setDataSlip(newLst);
    switch (oldStatus) {
      case "3":
        cnt3 -= 1;
        switch (status) {
          case "3":
            cnt3 += 1;
            break;
          case "4":
            cnt4 += 1;
            break;
          case "5":
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "4":
        cnt4 -= 1;
        switch (status) {
          case "3":
            cnt3 += 1;
            break;
          case "4":
            cnt4 += 1;
            break;
          case "5":
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "5":
        cnt5 -= 1;
        switch (status) {
          case "3":
            cnt3 += 1;
            break;
          case "4":
            cnt4 += 1;
            break;
          case "5":
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      case "0":
        switch (status) {
          case "3":
            cnt3 += 1;
            break;
          case "4":
            cnt4 += 1;
            break;
          case "5":
            cnt5 += 1;
            break;
          default:
            console.log("out case new");
        }
        break;
      default:
        console.log("out case");
    }
    setCountStatus3(cnt3);
    setCountStatus4(cnt4);
    setCountStatus5(cnt5);
  };
  const UpdateDescription = (pk, value) => {
    let newLst = [...dataSlip];
    newLst = newLst.map((obj) => {
      if (obj.pk === pk) {
        return { ...obj, checked: "Y", approve_description: value };
      } else {
        return obj;
      }
    });

    setDataSlip(newLst);
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
          {item.status == "3" ? (
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
              <Text style={{ color: "#3FCB89" }}>Chọn phê duyệt</Text>
            </Block>
          ) : item.status == "4" ? (
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
              <Text style={{ color: "#F64E60" }}>Chọn không duyệt</Text>
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
                navigation.navigate("MBHRAP011_EDIT_REG_INFO", {
                  masterPK: item.pk,
                  isEdit: false,
                });
              }}
            >
              <Icon name={"pencil-outline"} size={20} color={"#5A94E7"} />
            </TouchableOpacity>
          </View>
          {item.info.split("|").map((x) => (
            <View style={{ paddingTop: 5 }}>
              <Text style={{ color: "gray" }}>{x}</Text>
            </View>
          ))}
          {/* <View style={{paddingTop: 5}}>
            <Text style={{color: 'gray'}}>{item.decis_dt}</Text>
          </View>
          <View style={{paddingTop: 5}}>
            <Text style={{color: 'gray'}}>{item.approve_status}</Text>
          </View>
          <View style={{paddingTop: 5}}>
            <Text style={{color: 'gray'}}>{item.org_nm}</Text>
          </View>
          <View style={{paddingTop: 5}}>
            <Text style={{color: 'gray'}}>{item.description}</Text>
          </View> */}
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
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                color: "gray",
              }}
            >
              Phản hồi phê duyệt
            </Text>
            <TextInput
              value={item.approve_description}
              onChangeText={(e) => {
                UpdateDescription(item.pk, e.toString());
              }}
              style={{
                backgroundColor: Color.inputBackgroundColor,
                paddingBottom: 10,
                paddingHorizontal: 10,
                paddingTop: 12,
                borderRadius: 5,
                marginTop: 10,
              }}
            />
          </View>
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
              {item.status != "3" ? (
                <TouchableOpacity
                  onPress={() => {
                    OnChecked(item.pk, "3", item.status);
                  }}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: "#E7F2FE",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    flexDirection: "row",
                    flex: 1,
                    marginHorizontal: 2,
                  }}
                >
                  <View style={{ paddingHorizontal: 1 }}>
                    <Icon name={"check"} color={"#3FCB89"} size={15} />
                  </View>
                  <View style={{ paddingHorizontal: 2 }}>
                    <Text style={{ color: "#3FCB89", fontSize: 15 }}>
                      Phê duyệt
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    OnChecked(item.pk, "0", item.status);
                  }}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: "#E7F2FE",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    flexDirection: "row",
                    flex: 1,
                    marginHorizontal: 2,
                  }}
                >
                  <View style={{ paddingHorizontal: 1 }}>
                    <Icon name={"sync"} color={"#FFA800"} size={15} />
                  </View>
                  <View style={{ paddingHorizontal: 2 }}>
                    <Text style={{ color: "#FFA800", fontSize: 15 }}>
                      Huỷ bỏ
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {item.status != "4" ? (
                <TouchableOpacity
                  onPress={() => {
                    OnChecked(item.pk, "4", item.status);
                  }}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: "#E7F2FE",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    flexDirection: "row",
                    flex: 1,
                    marginHorizontal: 2,
                  }}
                >
                  <View style={{ paddingHorizontal: 1 }}>
                    <Icon
                      name={"close-circle-outline"}
                      color={"#F64E60"}
                      size={15}
                    />
                  </View>
                  <View style={{ paddingHorizontal: 2 }}>
                    <Text style={{ color: "#F64E60", fontSize: 15 }}>
                      Không duyệt
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    OnChecked(item.pk, "0", item.status);
                  }}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: "#E7F2FE",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    flexDirection: "row",
                    flex: 1,
                    marginHorizontal: 2,
                  }}
                >
                  <View style={{ paddingHorizontal: 1 }}>
                    <Icon name={"sync"} color={"#FFA800"} size={15} />
                  </View>
                  <View style={{ paddingHorizontal: 2 }}>
                    <Text style={{ color: "#FFA800", fontSize: 15 }}>
                      Huỷ bỏ
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {item.status != "5" ? (
                <TouchableOpacity
                  onPress={() => {
                    OnChecked(item.pk, "5", item.status);
                  }}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: "#E7F2FE",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    flexDirection: "row",
                    flex: 1,
                    marginHorizontal: 2,
                  }}
                >
                  <View style={{ paddingHorizontal: 1 }}>
                    <Icon name={"backup-restore"} color={"#5A94E7"} size={15} />
                  </View>
                  <View style={{ paddingHorizontal: 2 }}>
                    <Text style={{ color: "#5A94E7", fontSize: 15 }}>
                      Huỷ phiếu
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    OnChecked(item.pk, "0", item.status);
                  }}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: "#E7F2FE",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    flexDirection: "row",
                    flex: 1,
                    marginHorizontal: 2,
                  }}
                >
                  <View style={{ paddingHorizontal: 1 }}>
                    <Icon name={"sync"} color={"#FFA800"} size={15} />
                  </View>
                  <View style={{ paddingHorizontal: 2 }}>
                    <Text style={{ color: "#FFA800", fontSize: 15 }}>
                      Huỷ bỏ
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Block>
    );
  };
  const renderItemOT = ({ item }) => {
    return (
      <>
        {/* {item.count_ot != '' ? ( */}
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
            <Text style={{ color: "gray" }}>Khung {item.time_ot}</Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={{ color: "gray" }}>{item.count_ot}</Text>
          </View>
        </View>
        {/* ) : null} */}
      </>
    );
  };
  const renderItemInfo = ({ item }) => {
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
    let arrData = [...dataSlip].filter((x) => x.checked == "Y");
    let lstPK = "";
    let lstDt = "";
    let lstStatus = "";
    let lstDescription = "";
    let l_action = "UPDATE";
    if (arrData.length > 0) {
      arrData.forEach(function (item) {
        lstPK += item.pk + "|";
        lstDt += item.detail_dt + "|";
        lstStatus += item.status + "|";
        lstDescription += item.approve_description + "|";
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
                  pro: "UPDHRAP011000",
                  in_par: {
                    p1_varchar2: l_action,
                    p2_varchar2: lstStatus,
                    p3_varchar2: lstPK,
                    p4_varchar2: lstDt,
                    p5_varchar2: lstDescription,
                    p6_varchar2: thr_emp_pk,
                    p7_varchar2: arrData[0].approve_role_type,
                    p8_varchar2: arrData[0].approve_name,
                    p9_varchar2: arrData.length,
                    p10_varchar2: APP_VERSION,
                    p11_varchar2: crt_by,
                  },
                  out_par: {
                    p1_varchar2: "result",
                    p2_sys: "noti",
                  },
                },
                tokenLogin
              )
                .then((rs) => {
                  if (rs == "Token Expired") {
                    refreshNewToken("OnSave");
                  }
                  if (rs != "Token Expired") {
                    if (rs.results == "F") {
                      var newText = rs.errorData.split(":");
                      let errors = newText[1].trim().split("\n")[0];
                      dialogNoti(errors);
                    } else if (rs.data.result == "1") {
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
                      onReload();
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
                      onReload();
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
        if (obj == "OnSave") {
          let arrData = [...dataSlip].filter((x) => x.checked == "Y");
          let lstPK = "";
          let lstDt = "";
          let lstStatus = "";
          let lstDescription = "";
          let l_action = "UPDATE";
          if (arrData.length > 0) {
            arrData.forEach(function (item) {
              lstPK += item.pk + "|";
              lstDt += item.detail_dt + "|";
              lstStatus += item.status + "|";
              lstDescription += item.approve_description + "|";
            });
            sysFetch(
              API,
              {
                pro: "UPDHRAP011000",
                in_par: {
                  p1_varchar2: l_action,
                  p2_varchar2: lstStatus,
                  p3_varchar2: lstPK,
                  p4_varchar2: lstDt,
                  p5_varchar2: lstDescription,
                  p6_varchar2: thr_emp_pk,
                  p7_varchar2: arrData[0].approve_role_type,
                  p8_varchar2: arrData[0].approve_name,
                  p9_varchar2: arrData.length,
                  p10_varchar2: APP_VERSION,
                  p11_varchar2: crt_by,
                },
                out_par: {
                  p1_varchar2: "result",
                  p2_sys: "noti",
                },
              },
              tokenLogin
            )
              .then((rs) => {
                if (rs == "Token Expired") {
                  refreshNewToken("OnSave");
                }
                if (rs != "Token Expired") {
                  if (rs.results == "F") {
                    var newText = rs.errorData.split(":");
                    let errors = newText[1].trim().split("\n")[0];
                    dialogNoti(errors);
                  } else if (rs.data.result == "1") {
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
                    onReload();
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
                    onReload();
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
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
  return (
    <Block paddingTop={5} backgroundColor={Color.gray} flex>
      <View style={{ flex: 1, marginTop: 5 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => onReload()}
          refreshing={false}
          data={dataSlip}
          renderItem={renderItem}
          listKey="slip"
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
            <Text style={{ color: "#3FCB89" }}>Chọn phê duyệt: </Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#F64E60" }}>Chọn không duyệt: </Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#5A94E7" }}>Chọn huỷ phiếu: </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#3FCB89" }}>{countStatus3}</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#F64E60" }}>{countStatus4}</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ color: "#5A94E7" }}>{countStatus5}</Text>
          </View>
        </View>
        <View style={{ flex: 6 }}>
          <View paddingRight={10}>
            <TVSButton
              buttonStyle="3"
              icon={"content-save"}
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

export default ChoPheDuyet;
