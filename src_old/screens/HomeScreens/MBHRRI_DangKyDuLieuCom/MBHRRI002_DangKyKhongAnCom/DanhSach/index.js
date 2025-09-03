/************************************************ START: IMPORT ************************************************/
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Calender from "../../../../../components/Calendes";
import OneField from "../../../../../components/OneFieldKeyValue";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Icon_time from "../../../../../icons/Datev";
import ShowError from "../../../../../services/errors";
import RequestSendNotification from "../../../../../services/notification/send";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import { useNavigation } from "@react-navigation/native";

/************************************************ END: IMPORT ************************************************/

const LS = ({ onCallbackSetDate, startDate, endDate }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const navigation = useNavigation();

  //************************************************ START: VARIABLE ************************************************
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let fullnames = "";
  let crt_by = "";
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.emp_id;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    console.log(error);
  }
  //******************************************************************** END: VARIABLE ********************************************************************

  //******************************************************************** START: STATE ********************************************************************
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("01/MM/YYYY") +
      " - " +
      moment(new Date()).endOf("month").format("DD/MM/YYYY")
  );
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState("");
  const [action, setAction] = useState("");
  let [lengthDataProps, setLengthDataProps] = useState(0);
  let [numberRecord, setNumberRecord] = useState(3);
  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  const [approve_data, setApprove_data] = useState([]);
  //******************************************************************** END: STATE ********************************************************************

  //******************************************************************** START: FUNCTION ********************************************************************
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
        if (obj == "updateExperience") {
          updateExperience(p1);
        }
        if (obj == "getData") {
          getData(p1, p2);
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

  const getStateCalendar = async (result) => {
    setModalVisible(false);
    onCallbackSetDate(result.startingDays, result.endingDays);
    setDateSelect(result.daySelecteds);
    setDates(result.startingDays + " - " + result.endingDays);
    await getData(result.startingDays, result.endingDays);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLoadMore = (lengthData) => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };

  const handleGetData = () => {
    getData(startDate, endDate);
  };

  const getData = (fromday, enday) => {
    const pro = "SELHRRI002001";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(fromday).format("YYYYMMDD"),
      p3_varchar2: moment(enday).format("YYYYMMDD"),
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_app",
          // p2_sys: "approve_status",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", fromday, enday);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            send_mail = rs.data.send_mail;
            setData(rs.data.lst_app);
            // setApprove_data(rs.data.approve_status);
            setLengthDataProps(rs.data.lst_app.length);
            // console.log("approve_status", rs.approve_status);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData(startDate, endDate);
      } else {
        ShowError("No internet");
      }
    });
  }, []);

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

  const updateExperience = (actionByPk) => {
    const pro = "UPDHRRI002000";
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: actionByPk,
      p3_varchar2: "",
      p4_varchar2: thr_emp_pk,
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: "",
      p8_varchar2: "",

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
          p1_varchar2: "upd_dkv",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("RSS DELETE", rs);
        if (rs == "Token Expired") {
          refreshNewToken("updateExperience", p_pk, null);
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            try {
              RequestSendNotification(rs.data.noti, API, tokenLogin);
            } catch (error) {}
            if (action !== "") {
              Alert.alert(
                "Thông báo",
                "Cập nhật dữ liệu thành công.",
                [
                  {
                    text: "Ok",
                    onPress: () => {
                      getData(startDate, endDate);
                      setAction("");
                    },
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            } else {
              Alert.alert(
                "Thông báo",
                "Xóa dữ liệu thành công.",
                [
                  {
                    text: "Ok",
                    onPress: () => {
                      getData(startDate, endDate);
                      setAction("");
                    },
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            }
          } else if (rs.results === "F") {
            console.log("rs.errorData ", rs.errorData);
            let text = rs.errorData;
            let checkORA = text.indexOf("ORA-", 0);
            let checkORA1 = text.indexOf("ORA-", 1);
            let raiseError = "";
            if (checkORA >= 0) {
              raiseError = text.substring(text.indexOf(":") + 1, checkORA1);
            } else {
              raiseError = text;
            }
            // var newText = rs.errorData.split(":");
            // let errors = newText[1].trim().split("\n")[0];
            dialogNoti(raiseError);
          } else {
            dialogNoti("Cập nhật không thành công!");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSelectedAS = (value) => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
  };

  const comfirmAlert = (actionByPk) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá dữ liệu không nhận không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: async () => updateExperience(actionByPk) },
      ],
      { cancelable: false }
    );
  };

  const modal = (
    <TVSControlPopup
      title={"Chọn ngày"}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}
      maxHeight={500}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisible(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Calender
        getState={getStateCalendar}
        startDayss={startDate}
        endDayss={endDate}
      />
    </TVSControlPopup>
  );

  const Item_LS = ({ item }) => {
    // const showHide = () => {
    //   if (
    //     item.approve_status === "Được phê duyệt" ||
    //     item.approve_status === "Không phê duyệt"
    //   ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // };
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
        {/* <ModalApproveStatus
          isShow={isShowModalAS}
          item={approveStatusItem}
          close={() => setIsShowModalAS(false)}
          approve_data={approve_data}
        /> */}
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
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}
        >
          {/* <ApproveStatus value={item} onSelectedAS={onSelectedAS} /> */}
          {Object.entries(item).map((oneField) => {
            if (oneField[0].substr(0, 1) === "_" && oneField[1] !== "") {
              return (
                <OneField
                  value={oneField[1]}
                  keyName={
                    oneField[0].replace("_", "").substr(0, 1).toUpperCase() +
                    oneField[0]
                      .replace("_", "")
                      .substr(1, oneField[0].replace("_", "").length)
                  }
                />
              );
            }
          })}

          <Block flex row justifyCenter alignCenter marginTop={5}>
            <TVSButton
              onPress={() => {
                navigation.navigate("ChiTietKhongAnCom", {
                  item: item,
                  onRefresh: handleGetData,
                });
              }}
              disabled={item["edit_yn"] === "N"}
              icon={"eye"}
              type={"secondary"}
              buttonStyle={"3"}
            >
              Chi tiết
            </TVSButton>

            <TVSButton
              onPress={() => comfirmAlert(item.pk)}
              disabled={item["del_yn"] === "N"}
              type={"danger"}
              icon={"delete-forever"}
              buttonStyle={"3"}
            >
              Xoá bỏ
            </TVSButton>
          </Block>
        </Block>
      </Block>
    );
  };
  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };
  //******************************************************************** END: FUNCTION ********************************************************************

  return (
    <Block paddingTop={5} backgroundColor={Color.gray} flex>
      <Block
        marginLeft={10}
        marginRight={10}
        radius={8}
        backgroundColor={Color.white}
      >
        <Button
          nextScreen={toggleModal}
          row
          alignCenter
          justifyContent={"space-between"}
        >
          <Icon_time style={{ marginLeft: 20 }} />
          <Text center color={Color.mainColor} flex size={14} padding={10}>
            Ngày {daySelect}
          </Text>
          <Text marginRight={10} />
        </Button>
      </Block>
      <Block flex>
        <Block marginTop={5} flex>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => getData(startDate, endDate)}
            refreshing={false}
            data={data}
            renderItem={Item_LS}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => handleLoadMore(lengthDataProps)}
            onEndReachedThreshold={0.5}
            extraData={data}
            ListEmptyComponent={onRenderNoItem}
          />
        </Block>
      </Block>
      {modal}
    </Block>
  );
};

export default LS;
