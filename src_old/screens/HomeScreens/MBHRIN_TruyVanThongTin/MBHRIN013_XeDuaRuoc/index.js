import { View, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MonthPicker from "react-native-month-year-picker";

import { setHeaderChil2 } from "../../../../Language";
import Icon_calendar from "../../../../icons/Datev";
import sysFetch from "../../../../services/fetch_v1";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
// Component
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import Button from "../../../../components/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../components/Tvs/Button";
import Text from "../../../../components/Text";
// refreshToken
import { APP_VERSION } from "../../../../config/Pro";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import QRCode from "react-native-qrcode-svg";

const XeDuaRuoc = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let dataMenuMBHRs;
  let language;
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let tes_user_pk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let emp_id = useSelector((state) => state.loginReducers.data.data.emp_id);
  try {
    language = loginReducers.data.data.user_language;
    dataMenuMBHRs = menuReducer.data.data.menu;
  } catch (error) {
    console.log(error);
  }
  // Declare variable
  const [data, setData] = useState([]);
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth()))
  );
  const [show, setShow] = useState(false);
  // Control month
  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker]
  );
  //   Effect data
  useEffect(() => {
    GetDataBinding();
  }, [date]);

  //   useEffect(() => {
  //     GetData();
  //   }, [selectCodePeriod]);
  //Control chu ky
  const [dataPeriod, setDataPeriod] = useState([]);
  const [selectNamePeriod, setSelectNamePeriod] = useState("Chọn chu kỳ");
  const [selectCodePeriod, setSelectCodePeriod] = useState("");
  const onChangePeriod = (result) => {
    setSelectNamePeriod(result.code_nm);
    setSelectCodePeriod(result.code);

    setModalVisiblePeriod(false);
    setColorPeriod(null);

    GetData(result.code);
  };
  const [colorPeriod, setColorPeriod] = useState("#B2B2B2");
  const [modalVisiblePeriod, setModalVisiblePeriod] = useState(false);
  const modalPeriod = (
    <TVSControlPopup
      title={"Chọn chu kỳ"}
      isShow={modalVisiblePeriod}
      onHide={() => setModalVisiblePeriod(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePeriod(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPeriod}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangePeriod(item);
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
  const [activeQR, setActiveQR] = useState("N");
  const GetDataBinding = () => {
    console.log("date ", moment(date).format("YYYYMM"));
    sysFetch(
      API,
      {
        pro: "SELHRIN013000",
        in_par: {
          p1_varchar2: moment(date).format("YYYYMM"),
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data_period",
          p2_sys: "lst_active_qr",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("GetDataBinding");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataPeriod(rs.data.lst_data_period);
            setActiveQR(rs.data.lst_active_qr[0].active_qr);
            if (rs.data.lst_data_period.length > 0) {
              onChangePeriod(rs.data.lst_data_period[0]);
              GetData(rs.data.lst_data_period[0].code);
            } else {
              setSelectNamePeriod("");
              setSelectCodePeriod("");

              setModalVisiblePeriod(false);
              setColorPeriod(null);
              GetData("");
            }
            // dispatch(HideGlobalLoading);
          } else {
            // dispatch(HideGlobalLoading);
          }
        } else {
          // dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  const GetData = (fromDt) => {
    console.log("fromDt ", fromDt);
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRIN013001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: fromDt,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("GetData", fromDt);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setData(rs.data.lst_data);
            dispatch(HideGlobalLoading);
          } else {
            dispatch(HideGlobalLoading);
          }
        } else {
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
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
        if (obj == "GetData") {
          GetData(p1);
        }
        if (obj == "GetDataBinding") {
          GetDataBinding();
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

  const renderItem = ({ item, index }) => {
    var m1 = "";
    var m2 = "";
    let styleTitle = { color: Color.mainColor };
    let styleKey = { color: Color.mainColor };
    var tempTitle = item.style_title.split(",");
    tempTitle.forEach(function (itemTitle, idx) {
      m1 = m1 + '"' + itemTitle.trim().replace(":", '":"') + '"' + ",";
    });
    if (item.style_title != "") {
      m1 = m1.substring(0, m1.length - 1);
      m1 = `{${m1}}`;
      styleTitle = JSON.parse(m1);
    }

    var tempKey = item.style_key.split(",");
    tempKey.forEach(function (itemKey, idx) {
      m2 = m2 + '"' + itemKey.trim().replace(":", '":"') + '"' + ",";
    });
    if (item.style_key != "") {
      m2 = m2.substring(0, m2.length - 1);
      m2 = `{${m2}}`;
      styleKey = JSON.parse(m2);
    }
    return (
      <Block
        row
        borderBottomWidth={1}
        borderBottomColor={"#F4F6F7"}
        paddingLeft={item.title == " " ? 0 : 5}
        paddingRight={item.title == " " ? 0 : 5}
        backgroundColor={Color.white}
        paddingTop={item.title == " " ? 0 : 10}
        paddingBottom={item.title == " " ? 0 : 10}
        justifyContent={"space-between"}
      >
        <Text flex={1} style={styleTitle}>
          {item.title}
        </Text>
        <Text flex={1} right flexWrap={"wrap"} style={styleKey}>
          {item.key}
        </Text>
      </Block>
    );
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRIN013",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRIN013")[0].p_pk
        )}
      </TVSHeader>

      <Block backgroundColor={Color.gray} flex>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => setShow(true)}
            row
            alignCenter
            padding={10}
            justifyContent={"space-between"}
          >
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              size={14}
              paddingRight={20}
              center
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}
            >
              Tháng {moment(date).format("MM-YYYY")}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(date)}
            okButton="Chọn"
            cancelButton="Huỷ"
            enableAutoDarkMode={Platform.OS === "ios" ? true : false}
          />
        )}
        <Block style={{ margin: 10 }}>
          <Button
            nextScreen={() => setModalVisiblePeriod(true)}
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
              <Text style={{ color: colorPeriod }}>{selectNamePeriod}</Text>
            </Block>
            <Block style={{ justifyContent: "center", paddingRight: 10 }}>
              <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
            </Block>
          </Button>
          {modalPeriod}
        </Block>
        <Block flex>
          <Block paddingRight={10} paddingLeft={10} flex>
            <Block flex radius={10}>
              <Block flex>
                {activeQR == "Y" ? (
                  <View style={{ alignItems: "center", marginBottom: 10 }}>
                    <QRCode value={emp_id.toUpperCase()} />
                  </View>
                ) : null}
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  onRefresh={() => GetData(selectCodePeriod)}
                  refreshing={false}
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
                />
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
export default XeDuaRuoc;
