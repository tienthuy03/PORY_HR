/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Calender from "../../../../components/Calendes";
import Text from "../../../../components/Text";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../Language";
import ShowError from "../../../../services/errors";
import List_MBHRIN002 from "../../../../utils/ListTTNC(MBHRIN002)";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
const NgayCong = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  const [dataTtnc, setDataTtnc] = useState([]);

  let thr_emp_pk;
  let tokenLogin;
  let fullname;
  let dataMenuMBHRs;
  let language;
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    console.log(error);
  }

  const [startDay, setStartDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDay, setEndtDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
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
    setEndtDay(result.endingDays);
    setDateSelect(result.daySelecteds);
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
        if (obj == "getData") {
          getData();
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
  const getData = () => {
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRIN0020101",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: fullname,
          p3_varchar2: moment(startDay).format("YYYYMMDD"),
          p4_varchar2: moment(endDay).format("YYYYMMDD"),
        },
        out_par: {
          p1_sys: "ttnc",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results === "S") {
            setDataTtnc(rs.data.ttnc);
          }
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log("error");
        console.log(error);
      });
  };
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData();
      } else {
        ShowError("No internet");
      }
    });
  }, [startDay, endDay]);
  const onReload = () => {
    getData();
  };

  const modal = (
    <TVSControlPopup
      maxHeight={500}
      isShow={modalVisible}
      title={"Chọn ngày"}
      onHide={() => setModalVisible(false)}
    >
      <Calender getState={getState} startDayss={startDay} endDayss={endDay} />
    </TVSControlPopup>
  );

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRIN002",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN002")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray}>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => onValueChange()}
            padding={10}
            row
            alignCenter
            paddingLeft={20}
            justifyContent={"space-between"}
          >
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              paddingRight={20}
              size={14}
              center
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}
            >
              Ngày {daySelect}
            </Text>
            <Text marginRight={10} />
          </Button>
          {modal}
        </Block>
      </Block>

      <Block flex backgroundColor={Color.gray}>
        <Block flex>
          <Block flex>
            <List_MBHRIN002 datas={dataTtnc} onReload={onReload} />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default NgayCong;
