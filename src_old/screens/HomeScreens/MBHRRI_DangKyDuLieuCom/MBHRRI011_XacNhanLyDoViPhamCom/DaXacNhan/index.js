import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
  SafeAreaView,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Block from "../../../../../components/Block";
import OneField from "../../../../../components/OneFieldKeyValue";
// import TextInput from "../../../../../components/TextInput";
import TVSButton from "../../../../../components/Tvs/Button";
import Button from "../../../../../components/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import sysFetch from "../../../../../services/fetch_v1";
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";
import { APP_VERSION } from "../../../../../config/Pro";
import ModalApproveStatus from "./ModalTinhTrangPheDuyet";
import ApproveStatus from "./TrangThaiPheDuyet";
import {
  HRRI011LayDanhSachDXNS,
  HRRI011LayDanhSachXN,
} from "../../../../../services/redux/HRRI011_XacNhanLyDoViPhamCom/action";
import RNRestart from "react-native-restart";

const DaXacNhan = ({ data, onReload }) => {
  const dispatch = useDispatch();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
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

  const DsDXN = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.DsDXN
  );
  const DsApprove = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.DsApprove
  );
  const DsVP1 = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.DsVP1
  );
  const DsVP2 = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.DsVP2
  );
  const from_dt = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.From_dt
  );
  const to_dt = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.To_dt
  );
  useEffect(() => {
    getData();
  }, [from_dt, to_dt]);
  const [dataDsDXN, setDataDsDXN] = useState([]);
  const getData = () => {
    const pro = "SELHRRI011000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: from_dt,
      p3_varchar2: to_dt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "rtn_value_cxn",
      p2_sys: "rtn_value_dxn",
      p3_sys: "rtn_value_lydo_1",
      p4_sys: "rtn_value_lydo_2",
      p5_sys: "rtn_value_1",
      p6_sys: "rtn_value_22",
    };
    console.log("in_par ", in_par);
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
        if (rs == "Token Expired") {
          // refreshNewToken("OnSave");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log("refresh new");
            setDataDsDXN(rs.data.rtn_value_dxn);
          } else {
            showAlert(rs.errorData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const changeValue = (pk, text) => {
    let arr = [...dataDsDXN];
    // const arr2 = [...dataNPD];
    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.confirm_note = text;
      }
    });
    setDataDsDXN(arr);
    // dispatch(HRRI011LayDanhSachDXNS(arr, dataNPD));
  };
  const ConvertText = (text) => {
    let originText = text;
    if (text.split("(").length > 1) {
      let keyw = text.split("(")[1].split(")")[0];
      originText =
        text.split("(")[0] +
        "(" +
        keyw.toUpperCase() +
        ")" +
        text.split(")")[1];
      // console.log("ConvertText ", originText);
    }
    return originText;
  };
  const OnSelect = (item) => {
    // setCurrentItem(item);
    // setModalSelectVisible(true);

    setCurrentItem(item);
    setIsShowApprove(item.org_app_yn == "Y");
    getDataLyDoVP(
      item.thr_meal_act_pk,
      item.meal_dt,
      item.status_1 ? 1 : 2,
      item.approve_by_pk,
      item.approve_by_role
    );
  };
  const OnCloseSelect = (pk) => {
    let arr = [...dataDsDXN];
    // const arr2 = [...DsApprove];
    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.vp1_code = item.vp1_code_old;
        item.vp1_code_nm = item.vp1_code_nm_old;
        item.vp2_code = item.vp2_code_old;
        item.vp2_code_nm = item.vp2_code_nm_old;
      }
    });
    setDataDsDXN(arr);
    // dispatch(HRRI011LayDanhSachDXNS(arr, dataNPD));
    setModalSelectVisible(false);
  };
  const [dataVP, setDataVP] = useState([]);
  const getDataLyDoVP = (pk, date, type, approve_pk, approve_role) => {
    const pro = "SELHRRI011001";
    const in_par = {
      p1_varchar2: pk,
      p2_varchar2: thr_emp_pk,
      p3_varchar2: date,
      p4_varchar2: type,
      p5_varchar2: approve_pk,
      p6_varchar2: approve_role,

      p7_varchar2: APP_VERSION,
      p8_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "rtn_value",
      p2_sys: "rtn_value_npd",
      p3_sys: "rtn_value_current_npd",
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
        if (rs == "Token Expired") {
          // refreshNewToken("OnSave");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            // showAlert(rs.data.rtn_value);
            // dispatch(HRRI011LayDanhSachXN());
            setDataVP(rs.data.rtn_value);
            setDataNPD(rs.data.rtn_value_npd);
            console.log(rs.data.rtn_value_current_npd);
            if (rs.data.rtn_value_npd && rs.data.rtn_value_npd.length > 0) {
              hanleDataApproveInfo(rs.data.rtn_value_npd);
            }
            console.log(approve_pk);
            if (approve_pk) {
              if (rs.data.rtn_value_current_npd.length > 0) {
                setCurrentSelectedPerson(rs.data.rtn_value_current_npd[0]);
              } else {
                console.log("test1");

                setCurrentSelectedPerson({
                  approve_name: "Chọn người phê duyệt",
                });
              }
            } else {
              setCurrentSelectedPerson({
                approve_name: "Chọn người phê duyệt",
              });
            }
            if (approve_role) {
              if (rs.data.rtn_value_current_npd.length > 0) {
                setCurrentSelectedLevel({
                  arr: rs.data.rtn_value_current_npd,
                  name: rs.data.rtn_value_current_npd[0].level_name,
                });
              } else {
                console.log("test2");
                setCurrentSelectedLevel({
                  arr: [],
                  name: "Chọn vai trò phê duyệt",
                });
              }
            } else {
              setCurrentSelectedLevel({
                arr: [],
                name: "Chọn vai trò phê duyệt",
              });
            }
            setModalSelectVisible(true);
          } else {
            showAlert(rs.errorData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const hanleDataApproveInfo = (arrayData) => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    arrayData.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = arrayData.filter((y) => {
        return y.level_name === x;
      });
      let default_yn = null;
      let required_yn = false;
      tempArr.map((z) => {
        if (z.required_yn === "Y") {
          required_yn = true;
        }
        if (default_yn === null && z.default_yn === "Y") {
          default_yn = z;
        }
      });
      if (!required_yn && default_yn !== null) {
        arrApproveDefault = arrApproveDefault.filter(
          (item) => item.approve_role_type !== default_yn.approve_role_type
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === "Y") {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    console.log("arrApproveInfo ", arrApproveInfo.length);
    setCurrentApproveInfo(arrApproveInfo);
    // setApproveDefault(arrApproveDefault);
  };
  const [modalSelectVisible, setModalSelectVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState([]);
  const [currentApproveInfo, setCurrentApproveInfo] = useState([]);
  const [isShowApprove, setIsShowApprove] = useState(false);
  const [approveInfo, setApproveInfo] = useState([]);
  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: "Chọn vai trò phê duyệt",
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: "Chọn người phê duyệt",
  });

  const onChangeSelectedLevel = (value) => {
    console.log("currentSelectedLevel ", currentSelectedLevel);
    setCurrentSelectedLevel(value);
  };
  //handle when approve person change
  const onChangeSelectedPerson = (value) => {
    console.log("currentSelectedPerson ", currentSelectedPerson);
    setCurrentSelectedPerson(value);
  };
  const [dataNPD, setDataNPD] = useState([]);
  // useEffect(() => {
  //   if (DsNPD && DsNPD.length > 0) {
  //     hanleApproveInfo(DsNPD);
  //   }
  // }, [DsNPD]);
  useEffect(() => {
    if (dataNPD && dataNPD.length > 0) {
      hanleApproveInfo(dataNPD);
    }
  }, [dataNPD]);
  const hanleApproveInfo = (arrayData) => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    arrayData.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = arrayData.filter((y) => {
        return y.level_name === x;
      });
      let default_yn = null;
      let required_yn = false;
      tempArr.map((z) => {
        if (z.required_yn === "Y") {
          required_yn = true;
        }
        if (default_yn === null && z.default_yn === "Y") {
          default_yn = z;
        }
      });
      if (!required_yn && default_yn !== null) {
        arrApproveDefault = arrApproveDefault.filter(
          (item) => item.approve_role_type !== default_yn.approve_role_type
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === "Y") {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    setApproveInfo(arrApproveInfo);
    // setApproveDefault(arrApproveDefault);
  };

  const SelectLevelApprove = ({
    onChangeSelectedPerson,
    currentSelectedLevel,
    onChangeSelectedLevel,
    approveInfo,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
          Vai trò duyệt <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            backgroundColor: Color.gray,
            padding: 10,
            marginTop: 5,
            borderBottomColor: Color.inputBackgroundColor,
            borderBottomWidth: 1,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color:
                    currentSelectedLevel.name === "Chọn vai trò phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedLevel.name}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              size={24}
              color={Color.mainColor}
            />
          </Button>
          {isShow && (
            <ScrollView
              style={{
                marginTop: 10,
                maxHeight: 100,
              }}
            >
              {approveInfo.map((item, index) => {
                if (item.name === currentSelectedLevel.name) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedLevel(item);
                      onChangeSelectedPerson({
                        approve_name: "Chọn người phê duyệt",
                      });
                    }}
                    key={index.toString()}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      backgroundColor: "white",
                      marginBottom: 5,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      // flex={1}
                      // flexWrap={"wrap"}
                      // paddingLeft={5}
                      // paddingRight={5}
                      style={{
                        flex: 1,
                        flexWrap: "wrap",
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  const SelectApprovePerson = ({
    currentSelectedPerson,
    onChangeSelectedPerson,
    currentSelectedLevel,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
          Người phê duyệt <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            backgroundColor: Color.gray,
            padding: 10,
            marginTop: 5,
            borderBottomColor: Color.inputBackgroundColor,
            borderBottomWidth: 1,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedPerson.approve_name ===
                    "Chọn người phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedPerson.approve_name}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView
              style={{
                marginTop: 10,
                maxHeight: 100,
              }}
            >
              {currentSelectedLevel.arr.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedPerson(item);
                    }}
                    key={index.toString()}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      backgroundColor: "white",
                      marginBottom: 5,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        flexWrap: "wrap",
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    >
                      {item.approve_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  const modalSelect = (
    <TVSControlPopup
      title={"CHỌN LÝ DO VI PHẠM"}
      maxHeight={(Dimensions.get("window").height * 8) / 10}
      isShow={modalSelectVisible}
      onHide={() => OnCloseSelect(currentItem.pk)}
      bottom={
        <View style={{ flexDirection: "row" }}>
          <TVSButton
            //   type={"danger"}
            icon={"content-save"}
            buttonStyle={"3"}
            onPress={() => OnConfirmSave()}
          >
            Sao lưu
          </TVSButton>
          <TVSButton
            type={"danger"}
            buttonStyle={"3"}
            icon={"close"}
            onPress={() => OnCloseSelect(currentItem.pk)}
          >
            Đóng lại
          </TVSButton>
        </View>
      }
    >
      <View>
        {currentItem.status_1 ? (
          <View style={{ marginBottom: 10 }}>
            <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
              <Text>Vi phạm 1</Text>
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: Color.blueB,
                marginHorizontal: 10,
              }}
            >
              <Text>{currentItem.status_1}</Text>
            </View>
            <View>
              <Block style={{ margin: 10 }}>
                <Button
                  nextScreen={() => {
                    if (
                      currentItem.check_1 == "Y" ||
                      currentItem.status_1 == ""
                    ) {
                    } else {
                      setModalSelectVisible(false);
                      setModalVisibleVP1(true);
                    }
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
                    <Text>{currentItem.vp1_code_nm}</Text>
                  </Block>
                  <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                    <Icon
                      name={"chevron-down"}
                      color={Color.mainColor}
                      size={30}
                    />
                  </Block>
                </Button>
              </Block>
            </View>
          </View>
        ) : null}
        {currentItem.status_2 ? (
          <View style={{ marginBottom: 10 }}>
            <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
              <Text>Vi phạm 2</Text>
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: Color.blueB,
                marginHorizontal: 10,
              }}
            >
              <Text>{currentItem.status_2}</Text>
            </View>
            <View>
              <Block style={{ margin: 10 }}>
                <Button
                  nextScreen={() => {
                    if (
                      currentItem.check_2 == "Y" ||
                      currentItem.status_2 == ""
                    ) {
                    } else {
                      setModalSelectVisible(false);
                      setModalVisibleVP2(true);
                    }
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
                    <Text>{currentItem.vp2_code_nm}</Text>
                  </Block>
                  <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                    <Icon
                      name={"chevron-down"}
                      color={Color.mainColor}
                      size={30}
                    />
                  </Block>
                </Button>
              </Block>
            </View>
          </View>
        ) : null}
        {isShowApprove &&
          (currentApproveInfo.length > 0 ? (
            <Block>
              <Block style={{ marginTop: 10 }}>
                <Block
                  border={1}
                  padding={10}
                  borderColor={Color.gray}
                  radius={6}
                  marginBottom={20}
                >
                  <Block radius={4} alignCenter row>
                    <Text style={{ fontWeight: "bold", opacity: 0.7 }}>
                      Thông tin người phê duyệt
                    </Text>
                  </Block>
                  <Block>
                    <SelectLevelApprove
                      onChangeSelectedPerson={onChangeSelectedPerson}
                      currentSelectedLevel={currentSelectedLevel}
                      approveInfo={currentApproveInfo}
                      onChangeSelectedLevel={onChangeSelectedLevel}
                    />
                    <SelectApprovePerson
                      currentSelectedLevel={currentSelectedLevel}
                      currentSelectedPerson={currentSelectedPerson}
                      onChangeSelectedPerson={onChangeSelectedPerson}
                    />
                  </Block>
                </Block>
              </Block>
            </Block>
          ) : null)}
      </View>
    </TVSControlPopup>
  );
  const OnConfirmSave = () => {
    if (isShowApprove) {
      console.log(
        "currentSelectedPerson.approve_role_type ",
        currentSelectedPerson
      );
      if (currentSelectedPerson.thr_emp_pk == undefined) {
        Alert.alert(
          "Thông báo",
          "Vui lòng chọn người phê duyệt",
          [
            {
              text: "Xác nhận",
              onPress: () => {
                return;
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }
    }
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
          onPress: () => OnSave(),
        },
      ],
      { cancelable: false }
    );
  };
  const OnSave = () => {
    const pro = "UPDHRRI011000";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: currentItem.thr_meal_act_pk,
      p3_varchar2: currentItem.vp1_code,
      p4_varchar2: currentItem.vp2_code,
      p5_varchar2: isShowApprove
        ? approveInfo.length > 0
          ? currentSelectedPerson.approve_role_type
          : ""
        : "",
      p6_varchar2: isShowApprove
        ? approveInfo.length > 0
          ? currentSelectedPerson.thr_emp_pk
          : ""
        : "",
      p7_varchar2: isShowApprove ? "Y" : "N",

      p8_varchar2: APP_VERSION,
      p9_varchar2: crt_by,
    };
    const out_par = {
      p1_varchar2: "rtn_value",
    };
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
        if (rs == "Token Expired") {
          refreshNewToken("OnSave");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            showAlert(rs.data.rtn_value);
            dispatch(HRRI011LayDanhSachXN());
          } else {
            showAlert(rs.errorData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //
  const onChangeVP2 = (pk, result) => {
    // let arr = [...DsDXN];
    // const arr2 = [...DsApprove];
    // arr.forEach(function (item) {
    //   if (item.pk == pk) {
    //     item.vp2_code = result.code;
    //     item.vp2_code_nm = result.code_nm;
    //   }
    // });
    // dispatch(HRRI011LayDanhSachDXNS(arr, arr2));
    // setModalVisibleVP2(false);
    // setModalSelectVisible(true);

    let arr = [...dataDsDXN];
    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.vp2_code = result.code;
        item.vp2_code_nm = result.code_nm;
      }
    });

    setIsShowApprove(result.org_app_yn == "Y");
    setDataDsDXN(arr);
    // dispatch(HRRI011LayDanhSachDXNS(arr, dataNPD));
    setModalVisibleVP2(false);
    setModalSelectVisible(true);
  };
  const [modalVisibleVP2, setModalVisibleVP2] = useState(false);

  const modalVP2 = (
    <TVSControlPopup
      title={"Chọn lý do"}
      isShow={modalVisibleVP2}
      onHide={() => {
        setModalVisibleVP2(false);
        setModalSelectVisible(true);
      }}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => {
            setModalVisibleVP2(false);
            setModalSelectVisible(true);
          }}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataVP}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeVP2(currentItem.pk, item);
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
  const onChangeVP1 = (pk, result) => {
    let arr = [...dataDsDXN];
    // const arr2 = [...DsApprove];
    arr.forEach(function (item) {
      if (item.pk == pk) {
        item.vp1_code = result.code;
        item.vp1_code_nm = result.code_nm;
      }
    });
    setDataDsDXN(arr);
    // dispatch(HRRI011LayDanhSachDXNS(arr, arr2));
    setModalVisibleVP1(false);
    setModalSelectVisible(true);
  };
  const [modalVisibleVP1, setModalVisibleVP1] = useState(false);

  const modalVP1 = (
    <TVSControlPopup
      title={"Chọn lý do"}
      isShow={modalVisibleVP1}
      onHide={() => {
        setModalVisibleVP1(false);
        setModalSelectVisible(true);
      }}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => {
            setModalVisibleVP1(false);
            setModalSelectVisible(true);
          }}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataVP}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeVP1(currentItem.pk, item);
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
  const [approve_data, setApprove_data] = useState([]);
  useEffect(() => {
    if (DsApprove && DsApprove.length > 0) {
      setApprove_data(DsApprove);
    }
  }, [DsApprove]);

  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  const onSelectedAS = (value) => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
  };
  const RenderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 10, marginHorizontal: 10 }}>
        <ModalApproveStatus
          isShow={isShowModalAS}
          item={approveStatusItem}
          close={() => setIsShowModalAS(false)}
          approve_data={approve_data}
        />
        <Block row justifyContent={"space-between"}>
          {item.label && (
            <Block
              borderTopLeftRadius={6}
              borderTopRightRadius={6}
              backgroundColor={Color.white}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text color={Color.mainColor} size={14}>
                {item.label}
              </Text>
            </Block>
          )}
          <Text color={Color.white} size={13} />
        </Block>
        <Block
          backgroundColor={Color.white}
          paddingBottom={5}
          borderTopColor={Color.oneContentBorder}
          borderTopWidth={1}
        >
          {/* <ApproveStatus value={item} onSelectedAS={onSelectedAS} /> */}
          {Object.entries(item).map((oneField, index) => {
            //Bo qua truong oneField  ["_tình trạng", "Được xác nhận"]
            // && oneField[0] != "approve_status"
            return (
              oneField[0].substr(0, 1) === "_" &&
              (oneField[1] != "" ? (
                <OneField
                  value={oneField[1]}
                  keyName={ConvertText(
                    oneField[0].replace("_", "").substr(0, 1).toUpperCase() +
                      oneField[0]
                        .replace("_", "")
                        .substr(1, oneField[0].replace("_", "").length)
                  )}
                />
              ) : null)
            );
          })}
        </Block>
        <Block backgroundColor={Color.white}>
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: Platform.OS == "ios" ? 18 : 0,
                borderRadius: 6,
              }}
            >
              <TextInput
                value={item.confirm_note}
                placeholder={"Nhập ghi chú"}
                // multiline={true}
                onChangeText={(text) => changeValue(item.pk, text)}
                keyboardType={"default"}
              />
            </Block>
          </Block>
        </Block>
        <Block
          backgroundColor={Color.white}
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          paddingBottom={5}
          flexDirection={"row"}
        >
          <View style={{ flex: 1 }}>
            <TVSButton
              disabled={item.active_yn == "N"}
              icon={"square-edit-outline"}
              buttonStyle={"3"}
              onPress={() => OnSelect(item)}
            >
              Lý do
            </TVSButton>
          </View>
          <View style={{ flex: 1 }}>
            <TVSButton
              disabled={item.active_yn == "N"}
              type={"danger"}
              icon={"sync"}
              buttonStyle={"3"}
              onPress={() => OnConfirm(item)}
            >
              Hủy xác nhận
            </TVSButton>
          </View>
        </Block>
        {modalVP1}
        {modalVP2}
      </View>
    );
  };
  const OnConfirm = (item) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn hủy xác nhận?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => OnConfirmData(item),
        },
      ],
      { cancelable: false }
    );
  };
  const refreshNewToken = (obj, p1) => {
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
        if (obj == "OnConfirmData") {
          OnConfirmData(p1);
        }
        if (obj == "OnSave") {
          OnSave();
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
  const OnConfirmData = (item) => {
    const pro = "UPDHRRI011001";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: item.pk,
      p3_varchar2: item.thr_meal_act_pk,
      p4_varchar2: "1",
      p5_varchar2: thr_emp_pk,
      p6_varchar2: item.confirm_note,
      p7_varchar2: APP_VERSION,
      p8_varchar2: crt_by,
    };
    const out_par = {
      p1_varchar2: "rtn_value",
    };
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
        if (rs == "Token Expired") {
          refreshNewToken("OnConfirmData", item);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            getData();
            dispatch(HRRI011LayDanhSachXN());
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        style={{
          paddingVertical: 10,
        }}
        onRefresh={() => {
          getData();
        }}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        data={dataDsDXN}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <Block flex alignCenter justifyCenter marginTop={20}>
            <Text>Không có dữ liệu !</Text>
          </Block>
        )}
      />
      {modalSelect}
    </SafeAreaView>
  );
};

export default DaXacNhan;
