import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
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
import ModalApproveStatus from "./ModalTinhTrangPheDuyet";
import ApproveStatus from "./TrangThaiPheDuyet";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";

const LS = ({ onCallbackSetDate, startDate, endDate }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);

  const loginReducers = useSelector((state) => state.loginReducers);

  const [approve_data, setApprove_data] = useState([]);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let fullnames = "";
  let crt_by = "";
  // let approve_data = [];
  let send_mail = "N";
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    console.log("error MBHRRE012_DangKyXeDuaRuoc Danh sách");
    console.log(error);
  }

  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("01/MM/YYYY") +
      " - " +
      moment(new Date()).endOf("month").format("DD/MM/YYYY")
  );
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState("");
  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  let [lengthDataProps, setLengthDataProps] = useState(0);
  let [numberRecord, setNumberRecord] = useState(3);

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

  const getData = (fromday, enday) => {
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: moment(fromday).format("YYYYMMDD"),
      p3_varchar2: moment(enday).format("YYYYMMDD"),
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRBS003003",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(fromday).format("YYYYMMDD"),
          p3_varchar2: moment(enday).format("YYYYMMDD"),
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "ls_dkxdr",
          p2_sys: "approve_status",
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
            setApprove_data(rs.data.approve_status);
            send_mail = rs.data.send_mail;
            setData(rs.data.ls_dkxdr);
            console.log("data::::::::::", rs.data.ls_dkxdr);
            setLengthDataProps(rs.data.ls_dkxdr.length);
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

  const updateExperience = (p_pk) => {
    console.log({
      p1_varchar2: "DELETE",
      p2_varchar2: p_pk,
      p3_varchar2: thr_emp_pk,
      p4_varchar2: "",
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: "",
      p8_varchar2: "",
      p9_varchar2: "",
      p10_varchar2: APP_VERSION,
      p11_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "UPDHRBS003000",
        in_par: {
          p1_varchar2: "DELETE",
          p2_varchar2: p_pk,
          p3_varchar2: thr_emp_pk,
          p4_varchar2: "",
          p5_varchar2: "",
          p6_varchar2: "",
          p7_varchar2: "",
          p8_varchar2: "",
          p9_varchar2: "",
          p10_varchar2: APP_VERSION,
          p11_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "upd_dkv",
          p2_sys: "noti",
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
            Alert.alert(
              "Thông báo",
              "Xoá dữ liệu thành công.",
              [
                {
                  text: "Thoát",
                  onPress: () => {
                    getData(startDate, endDate);
                  },
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          } else if (rs.results === "F") {
            var newText = rs.errorData.split(":");
            let errors = newText[1].trim().split("\n")[0];
            dialogNoti(errors);
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
  const comfirmAlert = (p_pk) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá dữ liệu xe đưa rước không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: async () => updateExperience(p_pk) },
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
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
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
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}
        >
          <ApproveStatus value={item} onSelectedAS={onSelectedAS} />
          {Object.entries(item).map((oneField, index) => {
            return (
              oneField[0].substr(0, 1) === "_" && (
                <OneField
                  value={oneField[1]}
                  keyName={
                    oneField[0].replace("_", "").substr(0, 1).toUpperCase() +
                    oneField[0]
                      .replace("_", "")
                      .substr(1, oneField[0].replace("_", "").length)
                  }
                />
              )
            );
          })}

          <Block flex alignCenter marginTop={5}>
            <TVSButton
              onPress={() => comfirmAlert(item.pk)}
              disabled={item["active_button"] === "N"}
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
            data={data.slice(0, numberRecord)}
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
