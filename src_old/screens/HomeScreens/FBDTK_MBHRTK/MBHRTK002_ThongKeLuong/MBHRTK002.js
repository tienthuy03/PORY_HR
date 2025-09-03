/* eslint-disable react-native/no-inline-styles */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Platform, StatusBar, Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import TextSYS from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_back from "../../../../icons/Back";
import Icon_calendar from "../../../../icons/Calendar";
import { setHeaderChil2 } from "../../../../Language";
import {
  HRTK002LayDanhSachPhongBan,
  HRTK002ShowPopupPhongBan,
  HRTK002ShowPopupYear,
} from "../../../../services/redux/HRTK002_ThongKeLuong/action";
import PopUpPhongBan from "../MBHRTK002_ThongKeLuong/PopUpPhongBan";
import PopUpYear from "./PopUpYear";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
const { width } = Dimensions.get("screen");

const MBHRTK002 = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const state = useSelector((stateTemp) => stateTemp);
  const [date, setDate] = useState(moment().format("MMYYYY"));
  let dataMenuMBHRs;
  let language = "";
  const { DanhSachPhongBan } = useSelector(
    (state) => state.HRTK002_ThongKeLuongReducer
  );
  const { DuLieuLuong } = useSelector(
    (state) => state.HRTK002_ThongKeLuongReducer
  );
  const { ChonPhongBan } = useSelector(
    (state) => state.HRTK002_ThongKeLuongReducer
  );
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );

  const { ChonNam } = useSelector((state) => state.HRTK002_ThongKeLuongReducer);
  let dataTemp = [];
  DuLieuLuong.map((x) => dataTemp.push(x.net_am / 1000000));
  const data = {
    labels: [
      "T.1",
      "T.2",
      "T.3",
      "T.4",
      "T.5",
      "T.6",
      "T.7",
      "T.8",
      "T.9",
      "T.10",
      "T.11",
      "T.12",
    ],
    datasets: [
      {
        data: dataTemp,
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: Color.mainColor,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: Color.mainColor,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(23, 32, 42, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: Color.mainColor,
    fillShadowGradientOpacity: 1,
    // propsForHorizontalLabels: {
    //   x: 100,
    // },
  };
  try {
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.loginReducers.data.data.user_language;
  } catch (error) {}
  useEffect(() => {
    // dispatch(HRTK002LayDanhSachPhongBan());
    getData();
  }, []);
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
    sysFetch(
      API,
      {
        pro: "SELHRTK0020100",
        in_par: {
          p1_varchar2: userPk,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          dispatch(HRTK002LayDanhSachPhongBan());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderDesItem = ({ item }) => {
    return (
      <Block
        key={item.work_mon.toString()}
        flexDirection={"row"}
        marginBottom={5}
        borderBottomColor={"#ccc"}
        borderBottomWidth={1}
        padding={10}
      >
        <TextSYS flex={1} center>
          {item.work_mon}
        </TextSYS>
        <TextSYS flex={1} center>
          {item.net_am_convert.toString().trim()}
        </TextSYS>
      </Block>
    );
  };

  return (
    <>
      <PopUpPhongBan />
      <PopUpYear />
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {setHeaderChil2(
            language,
            dataMenuMBHRs,
            "MBHRTK002",
            dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRTK")[0].pk
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <Block
            column
            backgroundColor={"#fff"}
            radius={8}
            marginTop={5}
            marginLeft={10}
            padding={5}
            marginRight={10}
          >
            <Button
              nextScreen={() => dispatch(HRTK002ShowPopupPhongBan())}
              row
              height={40}
              alignCenter
              justifyCenter
              backgroundColor={Color.inputBackgroundColor}
              radius={8}
            >
              <Block flex height={40} paddingLeft={10} justifyCenter>
                <TextSYS size={16} color={Color.mainColor}>
                  {ChonPhongBan.code_nm}
                </TextSYS>
              </Block>
              <Block justifyCenter paddingRight={10}>
                <Icon
                  name={"arrow-down-drop-circle-outline"}
                  color={Color.mainColor}
                  size={24}
                />
              </Block>
            </Button>
          </Block>
          <Block backgroundColor="#fff" padding={5} margin={10} radius={5}>
            <Block
              column
              backgroundColor={Color.inputBackgroundColor}
              radius={5}
              alignCenter
              justifyCenter
              height={40}
            >
              <Button
                nextScreen={() => dispatch(HRTK002ShowPopupYear())}
                row
                height={40}
                paddingLeft={20}
                alignCenter
                justifyCenter
              >
                <Icon_calendar color={Color.mainColor} />
                <TextSYS
                  paddingRight={10}
                  center
                  color={Color.mainColor}
                  flex
                  size={14}
                  paddingLeft={10}
                >
                  Năm {ChonNam}
                </TextSYS>
                <TextSYS marginRight={10} />
              </Button>
            </Block>
          </Block>
          <Block padding={5}>
            <BarChart
              style={{ color: Color.btnMain }}
              data={data}
              width={width - 20}
              height={300}
              chartConfig={chartConfig}
              horizontalLabelRotation={0}
              // fromZero={true}
              verticalLabelRotation={0}
            />
          </Block>
          <Block flex marginBottom={20} padding={10}>
            <Block
              borderTopLeftRadius={5}
              borderTopRightRadius={5}
              backgroundColor={Color.backgroundColor}
              flexDirection={"row"}
              marginBottom={5}
              borderBottomColor={Color.mainColor}
              borderBottomWidth={1}
              padding={10}
            >
              <TextSYS flex={1} color={Color.white} center>
                Tháng
              </TextSYS>
              <TextSYS flex={1} color={Color.white} center>
                Lương
              </TextSYS>
            </Block>
            <FlatList
              data={DuLieuLuong}
              renderItem={renderDesItem}
              key={(item, index) => index.toString()}
            />
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default MBHRTK002;
