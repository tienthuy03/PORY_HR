/* eslint-disable react-native/no-inline-styles */
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
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
import Block from "../../../../components/Block";
import OneField from "../../../../components/OneFieldKeyValuePheDuyet";
import TVSButton from "../../../../components/Tvs/Button";
import sysFetch from "../../../../services/fetch_v1";
import RequestSendNotificationV1 from "../../../../services/notification/send_v1";
import ModalApproveStatus from "../ModalTinhTrangPheDuyet";
import { APP_VERSION } from "../../../../config/Pro";
const ChoPheDuyet = ({
  data,
  onReload,
  approveInfo,
  approveStatusPopup,
  pro,
  flagReload,
}) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  const { width, height } = Dimensions.get("screen");
  const [cntStatus2, setCntStatus2] = useState("0");
  const [cntStatus3, setCntStatus3] = useState("0");
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
  let cntS = 0;
  let cntF = 0;
  useEffect(() => {
    setCntStatus2("0");
    setCntStatus3("0");
    flagReload = 0;
  }, [flagReload]);
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
    if (arrayParam.length > 0) {
      let p1_varchar2 = "";
      let p2_varchar2 = "";
      let p3_varchar2 = "";
      let p4_varchar2 = "";
      let p5_varchar2 = "";
      let p6_varchar2 = "";
      let p7_varchar2 = "";
      let p8_varchar2 = "";

      arrayParam.forEach(function (item) {
        p1_varchar2 = item.p1_varchar2;
        p2_varchar2 += item.p2_varchar2 + "|";
        p3_varchar2 += item.p3_varchar2 + "|";
        p4_varchar2 += item.p4_varchar2 + "|";
        p5_varchar2 = item.p5_varchar2;
        p6_varchar2 = item.p6_varchar2;
        p7_varchar2 += item.p7_varchar2 + "|";
        p8_varchar2 += item.p8_varchar2 + "|";
      });

      const in_par = {
        p1_varchar2: p1_varchar2,
        p2_varchar2: p2_varchar2,
        p3_varchar2: p3_varchar2,
        p4_varchar2: p4_varchar2,
        p5_varchar2: p5_varchar2,
        p6_varchar2: p6_varchar2,
        p7_varchar2: p7_varchar2,
        p8_varchar2: p8_varchar2,
        p9_varchar2: arrayParam.length,
        p10_varchar2: APP_VERSION,
        p11_varchar2: crt_by,
      };

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
        console.log("API response:", res); // Log toàn bộ response
        if (rs == "Token Expired") {
          refreshNewToken("onUpdateData");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            Alert.alert(
              "Thông báo",
              "Xác nhận phê duyệt thành công",
              [
                {
                  text: "Đóng",
                  onPress: () => {
                    setCntStatus2(0);
                    setCntStatus3(0);
                    setArrayParam([]);
                    onReload();
                    RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
                  },
                },
              ],
              { cancelable: true }
            );
          } else {
            let newText = rs.errorData.split("ORA");
            let errors = "";
            try {
              errors = newText[1].trim().split(":")[1];
            } catch (error) {
              errors = "Lỗi: đăng ký không thành công.";
            }

            Alert.alert(
              "Thông báo",
              errors,
              [
                {
                  text: "Thoát",
                  onPress: () => { },
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          }
        }
      });
      //waiting();
    } else {
      console.log("No data");
    }
  };
  const waiting = () => {
    if (
      parseInt(cntS) + parseInt(cntF) <
      parseInt(cntStatus2) + parseInt(cntStatus3)
    ) {
      setTimeout(function () {
        waiting();
      }, 1000);
    } else {
      Alert.alert(
        "Thông báo",
        "Xác nhận phê duyệt thành công",
        [
          {
            text: "Đóng",
            onPress: () => {
              cntS = 0;
              cntF = 0;
              setCntStatus2(0);
              setCntStatus3(0);
              setArrayParam([]);
              onReload();
            },
          },
        ],
        { cancelable: true }
      );
    }
  };
  const processParam = (param) => {
    if (param.p3_varchar2 == "0") {
      let newArr = [...arrayParam];
      setArrayParam(newArr.filter((x) => x.p2_varchar2 != param.p2_varchar2));
    } else {
      let newArr = [...arrayParam];
      if (newArr.filter((x) => x.p2_varchar2 == param.p2_varchar2).length > 0) {
        setArrayParam(newArr.filter((x) => x.p2_varchar2 != param.p2_varchar2));
        newArr = newArr.filter((x) => x.p2_varchar2 != param.p2_varchar2);
        newArr.unshift(param);
        setArrayParam(newArr);
      } else {
        newArr.unshift(param);
        setArrayParam(newArr);
      }
    }
  };
  const refreshNewToken = (obj, p1, p2) => {
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
          data={data}
          keyExtractor={(item, index) => index.toString() + "e1"}
          renderItem={({ item, index }) => (
            <OneItem
              item={item}
              approveInfo={approveInfo}
              onReload={onReload}
              approveStatusPopup={approveStatusPopup}
              pro={pro}
              countStatus2={cntStatus2}
              setCountStatus2={(item) => setCntStatus2(item)}
              countStatus3={cntStatus3}
              setCountStatus3={(item) => setCntStatus3(item)}
              processParam={(item) => processParam(item)}
            />
          )}
        />
      )}
      {arrayParam.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            // marginBottom: 20,
            height: height / 12,
            // marginHorizontal: 25,
            // marginLeft: 25,
            paddingTop: 10,
            alignItems: "flex-start",
            // paddingBottom: 20,
          }}
        >
          <View style={{ flex: 4, marginLeft: 20 }}>
            <View style={{ alignSelf: "flex-start", color: "" }}>
              <Text style={{ color: "#5A94E7" }}>Chọn phê duyệt: </Text>
            </View>
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={{ color: "#F64E60" }}>Chọn không duyệt: </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={{ color: "#5A94E7" }}>{cntStatus2}</Text>
            </View>
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={{ color: "#F64E60" }}>{cntStatus3}</Text>
            </View>
          </View>
          <View style={{ flex: 6 }}>
            <View paddingRight={10}>
              <TVSButton
                icon={"content-save"}
                // buttonStyle={'2'}
                onPress={onSave}
                paddingHorizontal={30}
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

const OneItem = ({
  item,
  approveInfo,
  onReload,
  approveStatusPopup,
  pro = { pro },
  countStatus2,
  countStatus3,
  setCountStatus2,
  setCountStatus3,
  processParam,
}) => {
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  const [arrApprove, setArrApprove] = useState([]);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  useEffect(() => {
    handleApproveInfo();
  }, [approveInfo]);
  const handleApproveInfo = () => {
    let arrLevelName = [];
    let arrApproveTemp = [];
    if (approveInfo.length > 0) {
      arrApproveTemp.push({
        name: "Chọn vai trò phê duyệt",
        thr_reg_pk: "",
        arr: [],
      });
    }

    approveInfo.map((i) => {
      if (arrLevelName.indexOf(i.level_name) === -1) {
        arrLevelName.push(i.level_name);
      }
    });
    arrLevelName.map((levelName) => {
      let temp = [];
      approveInfo.map((approve) => {
        if (
          approve.level_name === levelName &&
          approve.thr_reg_pk === item["0_pk"]
        ) {
          temp.push(approve);
        }
      });
      if (temp.length > 0) {
        arrApproveTemp.push({
          name: levelName,
          thr_reg_pk: temp[0].thr_reg_pk,
          arr: temp,
        });
      }
    });
    setArrApprove(arrApproveTemp);

    if (item["0_approve_role_type_next"] && item["0_approve_pk_next"]) {
      //handle get approve role info
      const tempInfo = approveInfo.filter(
        (x) =>
          x.level_type.toString() ===
          item["0_approve_role_type_next"].toString() &&
          x.thr_emp_pk.toString() === item["0_approve_pk_next"].toString()
      )[0];
      if (tempInfo && arrApproveTemp) {
        setCurrentApprovePerson(tempInfo);
        setCurrentApproveLevel({
          name: tempInfo.level_name,
          arr: arrApproveTemp.filter((x) => x.name === tempInfo.level_name)[0]
            .arr,
          thr_reg_pk: tempInfo.thr_reg_pk,
        });
      }
    }
  };
  const Color = useSelector((s) => s.SystemReducer.theme);
  const [description, setDescription] = useState("");
  const [approveStatusOneItem, setApproveStatusOneItem] = useState("0");
  const [showCurrentApproveLevel, setShowCurrentApproveLevel] = useState(false);
  const [currentApproveLevel, setCurrentApproveLevel] = useState({
    arr: [],
    name: "Chọn vai trò phê duyệt",
  });

  const [showCurrentApprovePerson, setShowCurrentApprovePerson] =
    useState(false);
  const [currentApprovePerson, setCurrentApprovePerson] = useState({
    approve_name: "Chọn người phê duyệt",
  });

  const onChangeStatus = (approveStatus, oldStatus, noNextApprove) => {
    switch (approveStatus) {
      case "0":
        if (oldStatus == "2") {
          setCountStatus2(parseInt(countStatus2) - 1);
        }
        if (oldStatus == "3") {
          setCountStatus3(parseInt(countStatus3) - 1);
        }
        break;
      case "2":
        if (approveStatusOneItem == "3") {
          setCountStatus2(parseInt(countStatus2) + 1);
          setCountStatus3(parseInt(countStatus3) - 1);
        }
        if (approveStatusOneItem == "0") {
          setCountStatus2(parseInt(countStatus2) + 1);
        }
        break;
      case "3":
        if (approveStatusOneItem == "2") {
          setCountStatus2(parseInt(countStatus2) - 1);
          setCountStatus3(parseInt(countStatus3) + 1);
        }
        if (approveStatusOneItem == "0") {
          setCountStatus3(parseInt(countStatus3) + 1);
        }
        break;
      default:
        console.log("out case");
    }
    setApproveStatusOneItem(approveStatus);
    processParam({
      p1_varchar2: "UPDATE",
      p2_varchar2: item["0_pk"],
      p3_varchar2: approveStatus,
      p4_varchar2: description ? description : "",
      p5_varchar2: item["0_role_type"],
      p6_varchar2: employee_pk,
      p7_varchar2: noNextApprove
        ? currentApprovePerson.level_type.toString()
        : "",
      p8_varchar2: noNextApprove
        ? currentApprovePerson.thr_emp_pk.toString()
        : "",
    });
  };

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
              <Text style={{ color: Color.mainColor }}>{item["3_label"]}</Text>
            </Block>
          )}
          {approveStatusOneItem == "0" ? null : approveStatusOneItem == "2" ? (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              // borderColor={Color.primaryText}
              // borderWidth={1}
              backgroundColor={Color.primaryButton2}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: Color.primaryText }}>Chọn phê duyệt</Text>
            </Block>
          ) : (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              // borderColor={Color.dangerText}
              // borderWidth={1}
              backgroundColor={Color.primaryButton2}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: Color.dangerText }}>Chọn không duyệt</Text>
            </Block>
          )}
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
                <TextInput
                  value={description}
                  onChangeText={(e) => {
                    setDescription(e.toString());
                  }}
                  style={{
                    backgroundColor: Color.inputBackgroundColor,
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    paddingTop: 12,
                    borderRadius: 5,
                    marginVertical: 10,
                  }}
                />
              </View>
              {arrApprove.length > 0 ? (
                <View>
                  <View
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: Color.borderColor,
                      padding: 10,
                      margin: 5,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: -10,
                        left: 0,
                        backgroundColor: Color.white,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text
                        style={{ color: Color.mainColor, fontWeight: "bold" }}
                      >
                        Thông tin người phê duyệt (cấp trên)
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingTop: 10,
                      }}
                    >
                      <Text style={{ color: Color.mainColor }}>
                        Vai trò phê duyệt
                      </Text>
                      <View
                        style={{
                          marginVertical: 10,
                          backgroundColor: Color.inputBackgroundColor,
                          borderRadius: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            setShowCurrentApproveLevel(!showCurrentApproveLevel)
                          }
                          style={{
                            padding: 10,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ flex: 1 }}>
                            {currentApproveLevel.name}
                          </Text>
                          <Icon
                            name={"arrow-down-drop-circle-outline"}
                            size={24}
                            color={Color.mainColor}
                          />
                        </TouchableOpacity>
                        {showCurrentApproveLevel ? (
                          <View style={{ margin: 10 }}>
                            {arrApprove.map((app) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setCurrentApproveLevel(app);
                                    setShowCurrentApproveLevel(false);
                                    setCurrentApprovePerson({
                                      approve_name: "Chọn người phê duyệt",
                                    });
                                  }}
                                  style={{
                                    backgroundColor: Color.white,
                                    borderRadius: 10,
                                    padding: 12,
                                    marginBottom: 5,
                                  }}
                                >
                                  <Text>{app.name}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <View
                      style={{
                        paddingTop: 10,
                      }}
                    >
                      <Text style={{ color: Color.mainColor }}>
                        Người phê duyệt
                      </Text>
                      <View
                        style={{
                          marginVertical: 10,
                          backgroundColor: Color.inputBackgroundColor,
                          borderRadius: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            currentApproveLevel.arr.length === 0
                              ? null
                              : setShowCurrentApprovePerson(
                                !showCurrentApprovePerson
                              )
                          }
                          style={{
                            padding: 10,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ flex: 1 }}>
                            {currentApprovePerson.approve_name}
                          </Text>
                          <Icon
                            name={"arrow-down-drop-circle-outline"}
                            size={24}
                            color={Color.mainColor}
                          />
                        </TouchableOpacity>
                        {showCurrentApprovePerson ? (
                          <View style={{ margin: 10 }}>
                            {currentApproveLevel.arr.map((per) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setCurrentApprovePerson(per);
                                    setShowCurrentApprovePerson(false);
                                  }}
                                  style={{
                                    backgroundColor: Color.white,
                                    borderRadius: 10,
                                    padding: 12,
                                    marginBottom: 5,
                                  }}
                                >
                                  <Text>{per.approve_name}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
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
            {approveStatusOneItem == "3" ? (
              <TVSButton
                disabled={item["0_active_yn"] === "N"}
                type={"secondary"}
                icon={"sync"}
                buttonStyle={"2"}
                onPress={() =>
                  onChangeStatus(
                    "0",
                    "3",
                    currentApprovePerson.approve_name === "Chọn người phê duyệt"
                      ? false
                      : true
                  )
                }
                paddingHorizontal={15}
              >
                Huỷ bỏ
              </TVSButton>
            ) : (
              <TVSButton
                disabled={item["0_active_yn"] === "N"}
                type={"danger"}
                icon={"close"}
                buttonStyle={"2"}
                onPress={() =>
                  onChangeStatus(
                    "3",
                    null,
                    currentApprovePerson.approve_name === "Chọn người phê duyệt"
                      ? false
                      : true
                  )
                }
                paddingHorizontal={15}
              >
                Chọn không duyệt
              </TVSButton>
            )}

            {approveStatusOneItem == "2" ? (
              <TVSButton
                disabled={item["0_active_yn"] === "N"}
                type={"secondary"}
                icon={"sync"}
                buttonStyle={"2"}
                onPress={() =>
                  onChangeStatus(
                    "0",
                    "2",
                    currentApprovePerson.approve_name === "Chọn người phê duyệt"
                      ? false
                      : true
                  )
                }
                paddingHorizontal={15}
              >
                Huỷ bỏ
              </TVSButton>
            ) : (
              <TVSButton
                disabled={item["0_active_yn"] === "N"}
                icon={"check"}
                buttonStyle={"2"}
                onPress={() =>
                  onChangeStatus(
                    "2",
                    null,
                    currentApprovePerson.approve_name === "Chọn người phê duyệt"
                      ? false
                      : true
                  )
                }
                paddingHorizontal={15}
              >
                Chọn phê duyệt
              </TVSButton>
            )}
          </View>
        </Block>
      </Block>
    </>
  );
};

export default ChoPheDuyet;
