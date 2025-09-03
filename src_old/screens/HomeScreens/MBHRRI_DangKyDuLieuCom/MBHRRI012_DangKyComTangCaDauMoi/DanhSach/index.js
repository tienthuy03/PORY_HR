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
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import { useNavigation } from "@react-navigation/native";
/************************************************ END: IMPORT ************************************************/

const DS = ({}) => {
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
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-01")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("YYYY-MM-DD")
  );
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("01/MM/YYYY") +
      " - " +
      moment(new Date()).endOf("month").format("DD/MM/YYYY")
  );
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
    setDateSelect(result.daySelecteds);
    setStartDate(result.startingDays);
    setEndDate(result.endingDays);
    await getData(result.startingDays, result.endingDays);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const getData = (fromday, enday) => {
    const pro = "SELHRRI012002";
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
          p1_sys: "lst_data",
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
            setData(rs.data.lst_data);
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

  const refreshData = () => {
    getData(startDate, endDate);
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

  const updateExperience = (pk) => {
    const pro = "UPDHRRI012001";
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: pk,
      p3_varchar2: "",
      p4_varchar2: "",
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: "",
      p8_varchar2: "",
      p9_varchar2: "",
      p10_varchar2: APP_VERSION,
      p11_varchar2: crt_by,
    };

    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_varchar2: "status",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("RSS DELETE", rs);
        if (rs == "Token Expired") {
          refreshNewToken("updateExperience", pk, null);
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            dialogNoti("Xóa dữ liệu thành công.");
            getData(startDate, endDate);
          } else if (rs.results === "F") {
            var newText = rs.errorData.split(":");
            let errors = newText[1].trim().split("\n")[0];
            dialogNoti(errors);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const comfirmAlert = (pk) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá dữ liệu không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => updateExperience(pk),
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

  const renderItem = ({ item }) => {
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
          padding={5}
        >
          {Object.entries(item).map((oneField) => {
            if (
              oneField[0].substr(0, 1) === "_"
              //&&
              // oneField[1] !== "" &&
              // oneField[1] !== 0
            ) {
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <TVSButton
              onPress={() => {
                navigation.navigate("ChiTietComTangCa", {
                  item: item,
                  onRefresh: refreshData,
                });
              }}
              icon={"eye"}
              type={"secondary"}
              buttonStyle={"3"}
              minWidth={150}
              disabled={item["edit_yn"] == "N" ? true : false}
            >
              Chi tiết
            </TVSButton>
            <TVSButton
              onPress={() => comfirmAlert(item.pk)}
              type={"danger"}
              icon={"delete-forever"}
              buttonStyle={"3"}
              disabled={item["del_yn"] == "N" ? true : false}
            >
              Xoá bỏ
            </TVSButton>
          </View>
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
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={onRenderNoItem}
          />
        </Block>
      </Block>
      {modal}
    </Block>
  );
};

export default DS;
