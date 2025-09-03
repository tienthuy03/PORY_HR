import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Calender from "../../../../components/Calendes";
import OneField from "../../../../components/OneFieldKeyValue";
import Text from "../../../../components/Text";
import TVSButton from "../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import ShowError from "../../../../services/errors";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";
import { setHeaderChil2 } from "../../../../Language";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";

const XeDuaRuoc = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);

  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let fullnames = "";
  let crt_by = "";
  let userPk;
  let refreshToken;
  let language;
  let dataMenuMBHRs;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    language = loginReducers.data.data.user_language;
    dataMenuMBHRs = menuReducer.data.data.menu;
  } catch (error) {
    console.log("error MBHRRE012_DangKyXeDuaRuoc Danh sách");
    console.log(error);
  }

  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };
  const [startDay, setStartDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDay, setEndDay] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [modalVisible, setModalVisible] = useState(false);

  const showPicker = useCallback((value) => setModalVisible(value), []);
  const onValueChange = useCallback(() => {
    showPicker(true);
  }, [showPicker]);
  const getState = (result) => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    console.log("result ", result);
    getData(result.startingDays, result.endingDays);
  };
  const modal = (
    <TVSControlPopup
      maxHeight={500}
      isShow={modalVisible}
      title={"Chọn ngày"}
      onHide={() => setModalVisible(false)}
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
      <Calender getState={getState} startDayss={startDay} endDayss={endDay} />
    </TVSControlPopup>
  );
  const [data, setData] = useState([]);
  const [lengthDataProps, setLengthDataProps] = useState([]);
  const getData = (fromday, enday) => {
    sysFetch(
      API,
      {
        pro: "SELHRIN014000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: fromday,
          p3_varchar2: enday,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
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
            setLengthDataProps(rs.data.lst_data.length);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let [numberRecord, setNumberRecord] = useState(3);

  const handleLoadMore = (lengthData) => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };

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
          paddingBottom={5}
        >
          {Object.entries(item).map((oneField) => {
            if (oneField[0].substr(0, 1) === "_") {
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
        </Block>
      </Block>
    );
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRIN014",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN014")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block backgroundColor={Color.gray}>
          <Block margin={10} radius={8} backgroundColor={Color.white}>
            <TouchableOpacity
              onPress={() => onValueChange()}
              style={{
                padding: 10,
                paddingLeft: 20,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Icon_calendar color={Color.mainColor} marginLeft={20} />
              <View
                style={{
                  paddingRight: 20,
                  paddingLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.mainColor,
                  }}
                >
                  Ngày {daySelect}
                </Text>
              </View>
              <Text marginRight={10} />
            </TouchableOpacity>
            {modal}
          </Block>
        </Block>
        <Block marginTop={5} flex>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => getData(startDay, endDay)}
            refreshing={false}
            data={data.slice(0, numberRecord)}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => handleLoadMore(lengthDataProps)}
            onEndReachedThreshold={0.5}
            extraData={data}
            ListEmptyComponent={onRenderNoItem}
          />
        </Block>
      </Block>
    </Block>
  );
};
export default XeDuaRuoc;
