/* eslint-disable react-native/no-inline-styles */
import axios from "axios";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import OneField from "../../../../../components/OneFieldKeyValuePheDuyet";
import TVSButton from "../../../../../components/Tvs/Button";
import sysFetch from "../../../../../services/fetch_v1";
import RequestSendNotification from "../../../../../services/notification/send";
import ModalApproveStatus from "../ModalTinhTrangPheDuyet";
import { APP_VERSION } from "../../../../../config/Pro";
const KhongPheDuyet = ({
  data,
  onReload,
  approveInfo,
  approveStatusPopup,
  pro,
  flagReload,
  send_mail_yn,
}) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  const { width, height } = Dimensions.get("screen");
  const [cntStatus1, setCntStatus1] = useState("0");
  let [arrayParam, setArrayParam] = useState([]);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let cntS = 0;
  let cntF = 0;
  useEffect(() => {
    setArrayParam(data);
    setCntStatus1(0);
    flagReload = 0;
  }, [flagReload]);
  const setDescriptionItem = (itemSEQ, item_thr_emp_pk, textDesc) => {
    let newLst = [...arrayParam];
    newLst = newLst.map((obj) => {
      if (obj["0_seq"] === itemSEQ && obj["0_thr_emp_pk"] === item_thr_emp_pk) {
        return { ...obj, "0_approve_note": textDesc };
      } else {
        return obj;
      }
    });
    setArrayParam(newLst);
  };
  const OnChecked = (itemSEQ, item_thr_emp_pk, status, oldStatus) => {
    let cnt1 = cntStatus1;
    let newLst = [...arrayParam];

    console.log("newlist ", newLst);
    newLst = newLst.map((obj) => {
      if (obj["0_seq"] === itemSEQ && obj["0_thr_emp_pk"] === item_thr_emp_pk) {
        if (status == "0") {
          return { ...obj, "0_checked": "N", "0_status": status };
        } else {
          return { ...obj, "0_checked": "Y", "0_status": status };
        }
      } else {
        return obj;
      }
    });
    setArrayParam(newLst);
    // data = newLst;
    switch (oldStatus) {
      case "1":
        console.log("old 1");
        cnt1 -= 1;
        break;
      case "0":
        console.log("old 0");
        switch (status) {
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
    setCntStatus1(cnt1);
  };
  const onSave = () => {
    if (arrayParam.length == 0) {
      return;
    }
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xác nhận?",
      [
        { text: "Có", onPress: () => onUpdateData() },
        {
          text: "Không",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };
  const onUpdateData = () => {
    let arrData = [...arrayParam].filter((x) => x["0_checked"] == "Y");
    let l_action = "UPDATE";
    let lstSEQ = "";
    let lst_thr_emp_pk = "";
    let lstStatus = "";
    let lstNote = "";

    if (arrData.length > 0) {
      arrData.forEach(function (item) {
        lstSEQ += item["0_seq"] + "|";
        lst_thr_emp_pk += item["0_thr_emp_pk"] + "|";
        lstStatus += item["0_status"] + "|";
        lstNote +=
          item["0_approve_note"] == undefined
            ? "|"
            : item["0_approve_note"] + "|";
      });
      const in_par = {
        p1_varchar2: l_action,
        p2_varchar2: lstSEQ,
        p3_varchar2: lst_thr_emp_pk,
        p4_varchar2: lstStatus,
        p5_varchar2: lstNote,
        p6_varchar2: arrData[0]["0_role_type"],
        p7_varchar2: thr_emp_pk,
        p8_varchar2: arrData.length,
        p9_varchar2: APP_VERSION,
        p10_varchar2: crt_by,
      };

      console.log(pro, in_par);
      sysFetch(
        API,
        {
          pro,
          in_par,
          out_par: {
            p1_varchar2: "cpd_send",
            p2_sys: "noti",
          },
        },
        tokenLogin
      ).then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("onUpdateData");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            console.log(rs.data.noti);
            Alert.alert(
              "Thông báo",
              "Xác nhận phê duyệt thành công",
              [
                {
                  text: "Đóng",
                  onPress: () => {
                    setCntStatus1(0);
                    setArrayParam([]);
                    onReload();
                    RequestSendNotification(rs.data.noti, API, tokenLogin);
                  },
                },
              ],
              { cancelable: true }
            );
          }
        }
      });
      //waiting();
    } else {
      console.log("No data");
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
        if (obj == "onUpdateData") {
          onUpdateData();
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

  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const Color = useSelector((s) => s.SystemReducer.theme);

  const renderItem = ({ item }) => {
    console.log(item["0_status"]);
    console.log(item["0_pk"]);
    console.log(item["0_checked"]);
    return (
      <>
        <ModalApproveStatus
          item={item}
          isShow={showApprovePopup}
          close={() => setShowApprovePopup(false)}
          approveStatus={approveStatusPopup}
        />
        <Block flex marginLeft={10} marginRight={10} marginBottom={10}>
          <Block row justifyContent={"space-between"} alignCenter>
            {item["3_label"] && (
              <Block
                borderTopRightRadius={6}
                borderTopLeftRadius={6}
                backgroundColor={Color.white}
                height={35}
                alignCenter
                justifyCenter
                paddingLeft={10}
                paddingRight={10}
              >
                <Text style={{ color: Color.mainColor }}>
                  {item["3_label"]}
                </Text>
              </Block>
            )}
            {item["0_status"] == "0" ? null : item["0_status"] == "1" ? (
              <Block
                style={{
                  backgroundColor: Color.white,
                  borderColor: Color.secondaryText,
                  borderBottomColor: Color.white,
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 35,
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                }}
              >
                <Text style={{ color: Color.secondaryText }}>
                  Chọn chờ duyệt
                </Text>
              </Block>
            ) : null}
          </Block>
          <Block
            backgroundColor={Color.white}
            borderColor={Color.oneContentBorder}
            borderWidth={1}
            borderBottomRightRadius={6}
            borderBottomLeftRadius={6}
            paddingBottom={5}
          >
            <View style={{ flexDirection: "row", padding: 5 }}>
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text>Trạng thái phê duyệt</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowApprovePopup(true);
                  }}
                  style={{
                    borderRadius: 5,
                    borderColor: Color.mainColor,
                    borderWidth: 1,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: Color.mainColor,
                    }}
                  >
                    {item["0_approve_info"]}{" "}
                    <Icon name={"eye-outline"} size={16} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {Object.entries(item).map((of) => {
              if (of[0] === "3_label") {
                return null;
              }
              if (of[0].substr(0, 1) === "1" || of[0].substr(0, 1) === "3") {
                const currentKey =
                  of[0].substr(2, 1).toUpperCase() +
                  of[0].substr(3, of[0].length);
                return <OneField value={of[1]} keyName={currentKey} />;
              }
              return null;
            })}

            {item["0_active_yn"] === "N" ? null : (
              <>
                <View style={{ padding: 5, marginTop: 10 }}>
                  <Text
                    style={{
                      color: Color.mainColor,
                      fontWeight: "bold",
                    }}
                  >
                    Phản hồi phê duyệt
                  </Text>
                  <Block
                    style={{
                      backgroundColor: Color.gray,
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      borderRadius: 6,
                      minHeight: 50,
                      marginTop: 5,
                    }}
                  >
                    <TextInput
                      multiline={true}
                      value={item["0_approve_note"]}
                      onChangeText={(text) =>
                        setDescriptionItem(
                          item["0_seq"],
                          item["0_thr_emp_pk"],
                          text
                        )
                      }
                    />
                  </Block>
                </View>
              </>
            )}
            {item["0_note"] ? (
              <View
                style={{
                  padding: 10,
                }}
              >
                <Text style={{ color: "red", fontSize: 12 }}>
                  <Icon name={"alert"} /> {item["0_note"]}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1 }}></View>
              {item["0_status"] == "1" ? (
                <View style={{ flex: 2 }}>
                  <TVSButton
                    disabled={item["0_active_yn"] === "N"}
                    type={"secondary"}
                    icon={"sync"}
                    buttonStyle={"3"}
                    onPress={() => {
                      OnChecked(
                        item["0_seq"],
                        item["0_thr_emp_pk"],
                        "0",
                        item["0_status"]
                      );
                    }}
                  >
                    Huỷ bỏ
                  </TVSButton>
                </View>
              ) : (
                <View style={{ flex: 2 }}>
                  <TVSButton
                    disabled={item["0_active_yn"] === "N"}
                    type={"secondary"}
                    icon={"backup-restore"}
                    buttonStyle={"3"}
                    onPress={() => {
                      OnChecked(
                        item["0_seq"],
                        item["0_thr_emp_pk"],
                        "1",
                        item["0_status"]
                      );
                    }}
                  >
                    Chọn chờ duyệt
                  </TVSButton>
                </View>
              )}
              <View style={{ flex: 1 }}></View>
            </View>
          </Block>
        </Block>
      </>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
      }}
    >
      {!isLoading && (
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={false}
          onRefresh={() => {
            onReload();
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                margin: 10,
                marginTop: 20,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Không có dữ liệu !</Text>
            </View>
          )}
          data={arrayParam}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
      {arrayParam.filter((x) => x["0_checked"] == "Y").length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            height: height / 12,
            paddingTop: 10,
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 4, marginLeft: 20 }}>
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={{ color: "#FFA800" }}>Chọn chờ duyệt: </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={{ color: "#FFA800" }}>{cntStatus1}</Text>
            </View>
          </View>
          <View style={{ flex: 6 }}>
            <View>
              <TVSButton
                icon={"content-save"}
                buttonStyle={"3"}
                onPress={onSave}
              >
                Xác nhận
              </TVSButton>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default KhongPheDuyet;
