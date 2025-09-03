/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Person from "../../../../icons/Person";
import { setHeaderChil } from "../../../../Language";
import List_TTCN from "../../../../utils/ListTTCN(MBHRIN001)";
import axios from "axios";
import sysFetch from "../../../../services/fetch_v1";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import Calender from "../../../../components/Calendes";
import Button from "../../../../components/Button";
import Icon_time from "../../../../icons/Datev";
import TVSButton from "../../../../components/Tvs/Button";
import { useNavigation } from "@react-navigation/native";
import { APP_VERSION } from "../../../../config/Pro";
import OneField from "../../../../components/OneFieldKeyValue";
import { useIsFocused } from "@react-navigation/native";

const ThongTinCaNhan = ({ navigation: { goBack } }) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("focus ", isFocused);
    if (isFocused) {
      console.log("focus");
      getData();
    }
  }, [isFocused]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let dataMenuMBHRs;
  let language;
  let fullname;
  let avartar;
  let empId;
  let tokenLogin;
  let thr_emp_pk;
  let userPk;
  let refreshToken;
  let crt_by;
  try {
    avartar = loginReducers.data.data.avatar;
    fullname = loginReducers.data.data.full_name;
    empId = loginReducers.data.data.emp_id;
    language = loginReducers.data.data.user_language;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    dataMenuMBHRs = menuReducer.data.data.menu;
    refreshToken = loginReducers.data.data.refreshToken;
    userPk = loginReducers.data.data.tes_user_pk;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    console.log(error);
  }
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

  useEffect(() => {
    getData();
  }, []);

  const [dataMain, setDataMain] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYYMMDD")
  );
  const [endDate, setEndDate] = useState(moment(new Date()).format("YYYYMMDD"));
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const getStateCalendar = async (result) => {
    setModalVisible(false);
    setDateSelect(result.daySelecteds);
    setStartDate(result.startingDays);
    setEndDate(result.endingDays);
    getDataMain(result.startingDays, result.endingDays, selectCodeStatus);
  };
  const modal = (
    <TVSControlPopup
      maxHeight={500}
      title={"Chọn ngày"}
      onHide={() => setModalVisible(false)}
      isShow={modalVisible}
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

  //
  const [dataStatus, setDataStatus] = useState([]);
  const [selectNameStatus, setSelectNameStatus] = useState("Chọn tình trạng");
  const [selectCodeStatus, setSelectCodeStatus] = useState("");
  const onChangeStatus = (result) => {
    setSelectNameStatus(result.code_nm);
    setSelectCodeStatus(result.code);

    setModalVisibleStatus(false);
    setColorStatus(null);
    getDataMain(startDate, endDate, result.code);
  };
  const [colorStatus, setColorStatus] = useState("#B2B2B2");
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);

  const modalStatus = (
    <TVSControlPopup
      title={"Chọn tình trạng"}
      isShow={modalVisibleStatus}
      onHide={() => setModalVisibleStatus(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleStatus(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeStatus(item);
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
  const ItemMain = ({ item }) => {
    return (
      <View style={{ marginBottom: 10 }}>
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
          {item.status != "" ? (
            <Block
              row
              borderBottomWidth={1}
              borderBottomColor={"#F4F6F7"}
              paddingLeft={5}
              paddingRight={5}
              paddingTop={10}
              paddingBottom={10}
              // style={style}
              justifyContent={"space-between"}
            >
              <Text flex={0}>Trạng thái</Text>

              <Text style={{ color: item.color_status }} right flex={1}>
                {item.status}
              </Text>
            </Block>
          ) : null}
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
          <View style={{ alignItems: "center" }}>
            <TVSButton
              type={"primary"}
              icon={"eye"}
              buttonStyle={"3"}
              onPress={() => OnNavigateChiTiet(item.pk, item.car_reg_pk)}
            >
              Chi tiết
            </TVSButton>
          </View>
        </Block>
      </View>
    );
  };

  const OnNavigateChiTiet = (pk, car_reg_pk) => {
    console.log("navigate ", pk);
    navigation.navigate("MBHRBS001_ChiTiet", {
      route_pk: pk,
      car_reg_pk: car_reg_pk,
    });
  };
  //
  const getData = () => {
    console.log("get data ");
    sysFetch(
      API,
      {
        pro: "SELHRBS001000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p5_varchar2: APP_VERSION,
          p6_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_status",
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
            setDataStatus(rs.data.lst_status);
            if (
              rs.data.lst_status.length > 0 &&
              rs.data.lst_status.filter((x) => x.default_yn == "Y").length > 0
            ) {
              onChangeStatus(
                rs.data.lst_status.filter((x) => x.default_yn == "Y")[0]
              );
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDataMain = (from, to, status) => {
    console.log("get data main ", from, "|", to, "|", status);
    sysFetch(
      API,
      {
        pro: "SELHRBS001001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: from,
          p3_varchar2: to,
          p4_varchar2: status,
          p5_varchar2: APP_VERSION,
          p6_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data_main",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataMain(rs.data.lst_data_main);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil(
          language,
          dataMenuMBHRs,
          0,
          "MBHRBS001",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRBS001")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block
          marginTop={10}
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
        {modal}
        <Block style={{ margin: 10 }}>
          <Block
            style={{
              flexDirection: "row",
              paddingBottom: 5,
              paddingLeft: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ color: Color.mainColor }}>Tình trạng</Text>
          </Block>
          <Button
            nextScreen={() => setModalVisibleStatus(true)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: Color.white,
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
              <Text style={{ color: colorStatus }}>{selectNameStatus}</Text>
            </Block>
            <Block style={{ justifyContent: "center", paddingRight: 10 }}>
              <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
            </Block>
          </Button>
          {modalStatus}
        </Block>
        <FlatList
          style={{
            paddingTop: 5,
            paddingBottom: 10,
            flex: 1,
            paddingHorizontal: 10,
          }}
          data={dataMain}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemMain}
        />
      </Block>
    </Block>
  );
};
export default ThongTinCaNhan;
