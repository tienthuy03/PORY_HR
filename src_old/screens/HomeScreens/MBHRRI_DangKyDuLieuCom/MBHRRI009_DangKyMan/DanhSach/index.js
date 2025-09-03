/************************************************ START: IMPORT ************************************************/
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
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
import { showAlert } from "../../../../../components/Tvs/TVSAlertORA";
import PopupPDF from "./Popup_PDF";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
/************************************************ END: IMPORT ************************************************/

const DanhSach = ({ onCallbackSetDate, startDate, endDate }) => {
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
    console.log(error);
  }
  //******************************************************************** END: VARIABLE ********************************************************************

  //************************************************ START: STATE ************************************************
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("01/MM/YYYY") +
      " - " +
      moment(new Date()).endOf("month").format("DD/MM/YYYY")
  );
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState("");
  const [actionByPk, setActionByPk] = useState("");
  const [action, setAction] = useState("");
  let [lengthDataProps, setLengthDataProps] = useState(0);
  let [numberRecord, setNumberRecord] = useState(3);
  const [approve_data, setApprove_data] = useState([]);
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  const [approveStatusItem, setApproveStatusItem] = useState();

  //************************************************ END: STATE ************************************************

  //************************************************ START: HANDLE FUNCTION ***********************************************
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
      p5_varchar2: APP_VERSION,
      p6_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRRI009002",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(fromday).format("YYYYMMDD"),
          p3_varchar2: moment(enday).format("YYYYMMDD"),
          p5_varchar2: APP_VERSION,
          p6_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_app",
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
            setLengthDataProps(rs.data.lst_app.length);
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

  const OnDelete = (
    pk,
    limit_1,
    limit_2,
    limit_3,
    limit_4,
    num1,
    num2,
    num3,
    num4
  ) => {
    const pro = "UPDHRRI009000";
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: pk,
      p3_varchar2: "",
      p4_varchar2: num1,
      p5_varchar2: num2,
      p6_varchar2: num3,
      p7_varchar2: num4,
      p8_varchar2: "",
      p9_varchar2: "",
      p10_varchar2: "",
      p11_varchar2: "",
      p12_varchar2: "",
      p13_varchar2: "",
      p14_varchar2: "",
      p15_varchar2: "",
      p16_varchar2: "",
      p17_varchar2: "",
      p18_varchar2: "",
      p19_varchar2: limit_1,
      p20_varchar2: limit_2,
      p21_varchar2: limit_3,
      p22_varchar2: limit_4,
      p23_varchar2: "",
      p24_varchar2: "",
      p25_varchar2: APP_VERSION,
      p26_varchar2: crt_by,
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
            handleGetData();
          } else {
            showAlert(rs.errorData);
            handleGetData();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const comfirmAlert = (
    actionByPk,
    limit_1,
    limit_2,
    limit_3,
    limit_4,
    num1,
    num2,
    num3,
    num4
  ) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá dữ liệu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () =>
            OnDelete(
              actionByPk,
              limit_1,
              limit_2,
              limit_3,
              limit_4,
              num1,
              num2,
              num3,
              num4
            ),
        },
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

  const handleGetData = () => {
    getData(startDate, endDate);
  };
  const [modalPDFVisible, setModalPDFVisible] = useState(false);
  const [PDFContent, setPDFContent] = useState("");
  const modalPDF = (
    <PopupPDF
      title={"File đính kèm"}
      isShow={modalPDFVisible}
      dataPDF={PDFContent}
      onHide={() => {
        setModalPDFVisible(false);
      }}
    ></PopupPDF>
  );
  const OnViewPDF = (pk) => {
    console.log("show ", pk);
    getDataBase64(pk);
  };
  const getDataBase64 = (table_pk) => {
    dispatch(ShowGlobalLoading);

    sysFetch(
      API,
      {
        pro: "SELHRRI009007",
        in_par: {
          p1_varchar2: table_pk,
          p2_varchar2: crt_by,
          p3_varchar2: APP_VERSION,
        },
        out_par: {
          p1_sys: "data_base64",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
          dispatch(HideGlobalLoading);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.data_base64.length > 0) {
              setPDFContent(rs.data.data_base64[0].base64);
              setModalPDFVisible(true);
              dispatch(HideGlobalLoading);
            } else {
              Alert.alert(
                "Thông báo",
                "Không tìm thấy file đính kèm",
                [
                  {
                    text: "Đóng",
                    onPress: () => {},
                  },
                ],
                { cancelable: true }
              );
              dispatch(HideGlobalLoading);
            }
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const Item_LS = ({ item }) => {
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
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
          {item.att_file_pk != "" ? (
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  marginLeft: 5,
                  marginVertical: 5,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text>File đính kèm</Text>
              </View>
              <View style={{ marginRight: 5, marginVertical: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    OnViewPDF(item.att_file_pk);
                  }}
                  style={{
                    borderWidth: 0.5,
                    borderRadius: 5,
                    borderColor: "#F39C12",
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "#F39C12" }}>Xem file</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <Block flex row justifyCenter marginTop={5}>
            <TVSButton
              onPress={() => {
                navigation.navigate("ChiTietMan", {
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
              onPress={() =>
                comfirmAlert(
                  item.pk,
                  item.limit_1,
                  item.limit_2,
                  item.limit_3,
                  item.limit_4,
                  item.num1,
                  item.num2,
                  item.num3,
                  item.num4
                )
              }
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

  const onSelectedAS = (value) => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
  };

  //************************************************ END: HANDLE FUNCTION ***********************************************

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
      {modalPDF}
    </Block>
  );
};

export default DanhSach;
