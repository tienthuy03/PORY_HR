import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  View,
  Alert,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import Block from "../../components/Block";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Icon_TVTT_V2 from "../../icons/Menu/TruyVanThongTin";
import Icon_DKDL_V2 from "../../icons/Menu/DangKyDuLieu";
import Icon_PDDL_V2 from "../../icons/Menu/PheDuyetDuLieu";
import Icon_CCKM_V2 from "../../icons/Menu/ChamCongKhuonMat";
import Icon_BDTK_V2 from "../../icons/Menu/BieuDoThongKe";
import Icon_QLDL_V2 from "../../icons/Menu/QuanLyDuLieu";
import Icon_DKDLC_V2 from "../../icons/Menu/DangKyCom";
import Icon_XDR_V2 from "../../icons/Menu/XeDuaRuoc";
import Icon_TH_V2 from "../../icons/Menu/TongHop";
import Icon_QLDT_V2 from "../../icons/Menu/QuanLyDonTu";
import Icon_QLCV_V2 from "../../icons/Menu/QuanLyCongViec";
import Icon_NONE_V2 from "../../icons/Menu/NoneIcon";
import Icon_KSDG_V2 from "../../icons/Menu/KhaoSatDanhGia";
import Icon_KDOL_V2 from "../../icons/Menu/KyDuyetOnline";
import Icon_bdtk from "../../icons/BDTK";
import Icon_cc from "../../icons/CC";
import Icon_dkdl from "../../icons/DKDL";
import Icon_qldl from "../../icons/QLDL";
import Icon_qldl_v2 from "../../icons/QLDLV2";
import Icon_qldt from "../../icons/QLDT";
import Icon_qldt_v2 from "../../icons/QLDTV2";
import Icon_gs from "../../icons/GS";
import Icon_lsl from "../../icons/LSL";
import Icon_qlpd from "../../icons/QLPD";
import Icon_pddl_v2 from "../../icons/PDDLV2";
import Icon_st from "../../icons/ST";
import Icon_tb from "../../icons/TB";
import Icon_tvtt from "../../icons/TVTT";
import Icon_bus from "../../icons/Bus";

import { selectLanguageDM } from "../../Language";
import axios from "axios";
import { updateUserAction } from "../../actions";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import sysFetch from "../../services/fetch_v1";
import { home } from "../../styles";
import { APP_VERSION } from "../../config/Pro";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Svg, { Path } from "react-native-svg";

const HomeMain = ({ navigation }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  const languageReducer = useSelector((state) => state.languageReducer);
  const [dataMenuMBHR, setDataMenuMBHR] = useState([]);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const numColumns = loginReducers.data.data.menu_type == 2 ? 3 : 2;
  const [loadMenu, setLoadMenu] = useState(true);
  let dataMenuMBHRs;
  let dataLanguage;
  let language;
  let fullname;
  let empId;
  let urlImage;
  // let loadMenu;
  function SetIcon(name) {
    if (loginReducers.data.data.menu_type == 2) {
      if (name === "account-card-details") {
        return <Icon_TVTT_V2 />;
      } else if (name === "file-document-edit") {
        return <Icon_DKDL_V2 />;
      } else if (name === "calendar-check") {
        return <Icon_QLDL_V2 />;
      } else if (name === "bell") {
        return <Icon_tb />;
      } else if (name === "camera-front-variant") {
        return <Icon_CCKM_V2 />;
      } else if (name === "chart-bar") {
        return <Icon_BDTK_V2 />;
      } else if (name === "file-document-box-multiple") {
        return <Icon_QLDT_V2 />;
      } else if (name === "file-table") {
        return <Icon_qldl />;
      } else if (name === "settings") {
        return <Icon_st />;
      } else if (name === "form-qldt") {
        return <Icon_QLDT_V2 />;
      } else if (name === "form-lsl") {
        return <Icon_lsl />;
      } else if (name === "form-gs") {
        return <Icon_gs />;
      } else if (name === "form-pddlv2") {
        return <Icon_PDDL_V2 />;
      } else if (name === "form-qldlv2") {
        return <Icon_QLDL_V2 />;
      } else if (name === "bus") {
        return <Icon_XDR_V2 />;
      } else if (name === "icon-tvtt-v2") {
        return <Icon_TVTT_V2 />;
      } else if (name === "icon-dkdl-v2") {
        return <Icon_DKDL_V2 />;
      } else if (name === "icon-cckm-v2") {
        return <Icon_CCKM_V2 />;
      } else if (name === "icon-bdtk-v2") {
        return <Icon_BDTK_V2 />;
      } else if (name === "icon-pddl-v2") {
        return <Icon_PDDL_V2 />;
      } else if (name === "icon-qldl-v2") {
        return <Icon_QLDL_V2 />;
      } else if (name === "icon-dkdlc-v2") {
        return <Icon_DKDLC_V2 />;
      } else if (name === "icon-xdr-v2") {
        return <Icon_XDR_V2 />;
      } else if (name === "icon-th-v2") {
        return <Icon_TH_V2 />;
      } else if (name === "icon-qldt-v2") {
        return <Icon_QLDT_V2 />;
      } else if (name === "icon-qlcv-v2") {
        return <Icon_QLCV_V2 />;
      } else if (name === "icon-ksdg-v2") {
        return <Icon_KSDG_V2 />;
      } else if (name === "icon-kdol-v2") {
        return <Icon_KDOL_V2 />;
      } else if (name === "icon-tvtt-v2") {
        return <Icon_TVTT_V2 />;
      } else if (name === "icon-dkdl-v2") {
        return <Icon_DKDL_V2 />;
      } else if (name === "icon-cckm-v2") {
        return <Icon_CCKM_V2 />;
      } else if (name === "icon-bdtk-v2") {
        return <Icon_BDTK_V2 />;
      } else if (name === "icon-pddl-v2") {
        return <Icon_PDDL_V2 />;
      } else if (name === "icon-qldl-v2") {
        return <Icon_QLDL_V2 />;
      } else if (name === "icon-dkdlc-v2") {
        return <Icon_DKDLC_V2 />;
      } else if (name === "icon-xdr-v2") {
        return <Icon_XDR_V2 />;
      } else if (name === "icon-th-v2") {
        return <Icon_TH_V2 />;
      } else if (name === "icon-qldt-v2") {
        return <Icon_QLDT_V2 />;
      } else if (name === "icon-qlcv-v2") {
        return <Icon_QLCV_V2 />;
      } else if (name === "icon-ksdg-v2") {
        return <Icon_KSDG_V2 />;
      } else if (name === "icon-kdol-v2") {
        return <Icon_KDOL_V2 />;
      } else {
        return <Icon_NONE_V2 />;
      }
    } else {
      if (name === "account-card-details") {
        return <Icon_tvtt />;
      } else if (name === "file-document-edit") {
        return <Icon_dkdl />;
      } else if (name === "calendar-check") {
        return <Icon_qlpd />;
      } else if (name === "bell") {
        return <Icon_tb />;
      } else if (name === "camera-front-variant") {
        return <Icon_cc />;
      } else if (name === "chart-bar") {
        return <Icon_bdtk />;
      } else if (name === "file-document-box-multiple") {
        return <Icon_qldt />;
      } else if (name === "file-table") {
        return <Icon_qldl />;
      } else if (name === "settings") {
        return <Icon_st />;
      } else if (name === "form-qldt") {
        return <Icon_qldt_v2 />;
      } else if (name === "form-lsl") {
        return <Icon_lsl />;
      } else if (name === "form-gs") {
        return <Icon_gs />;
      } else if (name === "form-pddlv2") {
        return <Icon_pddl_v2 />;
      } else if (name === "form-qldlv2") {
        return <Icon_qldl_v2 />;
      } else if (name === "bus") {
        return <Icon_bus />;
      }
    }
    // http://14.241.235.252:8484/tvs_api_v1/api/
    // http://tinvietsoft.com/tinviet_api/api/
  }
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
  // loadMenu = menuReducer.isLoading;
  try {
    dataLanguage = languageReducer.data.data.language;
  } catch (error) {}

  try {
    language = loginReducers.data.data.user_language;
    urlImage = loginReducers.data.data.avatar;
    fullname = loginReducers.data.data.full_name;
    empId = loginReducers.data.data.emp_id;
  } catch (error) {}

  useEffect(() => {
    setLoadMenu(true);
    getMenu();
    checkBaoMat();
  }, []);

  const checkBaoMat = () => {
    const pro = "SELHRHM001000";
    const in_par = {
      p1_varchar2: userPk,
      p2_varchar2: thr_emp_pk,
    };
    const out_par = {
      p1_sys: "value1",
      p2_sys: "value2",
      p3_sys: "value_email",
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
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            const value1 = rs.data.value1;
            const value2 = rs.data.value2;
            const value_email = rs.data.value_email;
            const check1 = value_email[0].email == "" || !value_email[0].email;
            const check2 = value1.length == 0;
            const check3 = value2.length == 0;

            if (check1 && check2 && check3) {
              Alert.alert(
                "Thông báo",
                "Vui lòng cập nhật thông tin bảo mật để bảo vệ tài khoản của bạn",
                [
                  {
                    text: "Đóng",
                    onPress: () => {},
                  },
                  {
                    text: "Xác nhận",
                    onPress: () => {
                      navigation.navigate("EmailSecurity", { first: true });
                    },
                  },
                ],
                { cancelable: true }
              );
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        if (obj == "getMenu") {
          getMenu();
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
  const getMenu = () => {
    console.log({
      p1_varchar2: userPk,
      p2_varchar2: thr_emp_pk,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        // pro: 'SELHRMENU0100',
        pro: "SELHRMENU0",
        in_par: {
          p1_varchar2: userPk,
          p2_varchar2: thr_emp_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "menu",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getMenu");
        }
        if (rs != "Token Expired") {
          setLoadMenu(false);
          dataMenuMBHRs = rs.data.menu;
          let dataMenuMBHRc = [];
          try {
            dataMenuMBHRs.map((item) => {
              if (item.menu_cd.length === 6) {
                dataMenuMBHRc.push(item);
              }
            });
            //Chia cột cho menu home
            if (loginReducers.data.data.menu_type == 2) {
              if (
                (dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length -
                  1) %
                  3 ===
                1
              ) {
                dataMenuMBHRc.push({ pk: "pk", parent: true });
              }
              if (
                (dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length -
                  1) %
                  3 ===
                2
              ) {
                dataMenuMBHRc.push(
                  { pk: "pk", parent: true },
                  { pk: "pk", parent: true }
                );
              }
            } else {
              if (
                dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length %
                  2 ===
                1
              ) {
                dataMenuMBHRc.push({ pk: "pk", parent: true });
              }
            }

            setDataMenuMBHR(
              dataMenuMBHRc.filter(
                (x) => x.menu_cd !== "MBHRAN" && x.menu_cd !== "MBSYSY"
              )
            );
          } catch (error) {
            setLoadMenu(false);
            console.log(error);
          }
        }
      })
      .catch((error) => {
        setLoadMenu(false);
        console.log(error);
      });
  };

  function selectSystem(params, index) {
    let data = [];
    try {
      dataLanguage.map((item) => {
        if (item.field_name === "welcome" || item.field_name === "menu") {
          data.push(item);
        }
      });
      return data[index][params.toString().toLowerCase()];
    } catch (error) {}
  }

  const infor = useMemo(() => {
    return (
      <Block row justifyStart alignCenter paddingLeft={20}>
        <View style={home.boxI}>
          <Image style={home.img} source={{ uri: urlImage }} />
          <FastImage
            style={home.image}
            source={{
              uri: urlImage,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.normal,
            }}
          />
        </View>

        <Block column paddingLeft={20}>
          <Text
            size={15}
            marginBottom={2}
            color={Color.white}
            fontFamily={"RobotoCondensed-Regular"}
          >
            {selectSystem(language, 1)}
          </Text>
          <Text size={15} color={Color.white} fontFamily={"Roboto-Medium"}>
            {empId}
          </Text>
          <Text size={24} color={Color.white} fontFamily={"Roboto-Medium"}>
            {fullname}
          </Text>
        </Block>
      </Block>
    );
  }, [language]);
  // }, [language, loadMenu]);

  const renderItem = ({ item }) => {
    if (item.parent === true) {
      return (
        <Block flex height={120} margin={10} borderRadius={20} justifyCenter />
      );
    } else {
      return (
        <Block
          shadow
          flex={1}
          height={120}
          margin={10}
          borderRadius={20}
          justifyCenter
          backgroundColor={Color.white}
        >
          <Button nextScreen={() => navigation.navigate(item.menu_cd)}>
            <Block
              row
              justifyContent={"space-between"}
              paddingLeft={15}
              paddingRight={15}
            >
              {SetIcon(item.icon)}
            </Block>
            <Text
              numberOfLines={1}
              fontWeight={"bold"}
              size={14}
              color={Color.mainColor}
              paddingLeft={10}
              paddingTop={3}
            >
              {selectLanguageDM(item, language)}
            </Text>
          </Button>
        </Block>
      );
    }
  };
  const renderItemV1 = ({ item }) => {
    if (item.parent === true) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: 10,
            marginHorizontal: 20,
          }}
        ></View>
      );
    } else {
      return (
        // <View
        //   style={{
        //     flex: 1,
        //     marginTop: 10,
        //     marginHorizontal: 5,
        //     backgroundColor: "white",
        //     borderRadius: 8,
        //     padding: 10,
        //   }}
        // >
        //   {/* <LinearGradient
        //     start={{ x: 0, y: 0 }}
        //     end={{ x: 0, y: 1 }}
        //     colors={["#498DE3", "#25399F"]}
        //     style={{
        //       marginTop: 5,
        //       backgroundColor: Color.mainColor,
        //       borderRadius: 50,
        //       padding: 10,
        //     }}
        //   > */}
        //   <Icon color={Color.mainColor} size={30} name={item.icon} />
        //   {/* </LinearGradient> */}
        //   <View
        //     style={{
        //       marginTop: 5,
        //     }}
        //   >
        //     <Text style={{}} numberOfLines={1}>
        //       {item.title}
        //     </Text>
        //   </View>
        // </View>
        <View style={{ height: 100, margin: 5, flex: 1, marginBottom: 30 }}>
          <Block
            shadow
            marginHorizontal={15}
            height={80}
            borderRadius={20}
            justifyCenter
            backgroundColor={Color.white}
          >
            <Button nextScreen={() => navigation.navigate(item.menu_cd)}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {SetIcon(item.icon)}
              </View>
            </Button>
          </Block>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              numberOfLines={1}
              fontWeight={"bold"}
              size={12}
              color={Color.mainColor}
              paddingLeft={5}
              paddingRight={5}
              paddingTop={10}
            >
              {selectLanguageDM(item, language)}
            </Text>
          </View>
        </View>
      );
    }
  };
  const dataTest = [
    {
      icon: "home",
      title: "Truy vấn thông tin",
      from_color: "#498DE3",
      to_color: "#25399F",
    },
    {
      icon: "chevron-down",
      title: "Đăng ký dữ liệu công",
      from_color: "#498DE3",
      to_color: "#25399F",
    },
    {
      icon: "checkbook",
      title: "Đăng ký dữ liệu cơm",
      from_color: "#498DE3",
      to_color: "#25399F",
    },
    {
      icon: "email-search-outline",
      title: "Đăng ký dữ liệu xe tuyến",
      from_color: "#498DE3",
      to_color: "#25399F",
    },
    { parent: true },
    { parent: true },
  ];
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.3 }}
      // colors={['#0176C7', Color.mainColor, Color.mainColor]}
      colors={["#498DE3", "#25399F"]}
      style={home.linearGradient}
    >
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle="light-content"
      />
      <View style={home.over} />
      <Block
        row
        justifyContent={"space-between"}
        alignCenter
        paddingTop={40}
        paddingRight={20}
      >
        <Block justifyCenter paddingLeft={20} height={50} />
      </Block>
      {infor}
      <Block flex>
        <Block
          flex
          backgroundColor={Color.gray}
          borderTopRightRadius={30}
          borderTopLeftRadius={30}
          paddingLeft={10}
          marginTop={30}
          paddingRight={10}
        >
          <Block>
            <Text
              paddingLeft={20}
              paddingTop={10}
              size={22}
              fontFamily={"Roboto-Bold"}
              color={Color.mainColor}
            >
              {selectSystem(language, 0)}
            </Text>
          </Block>
          {loadMenu ? (
            <Block flex>
              <ActivityIndicator size="large" color="grey" />
            </Block>
          ) : (
            <Block flex>
              <FlatList
                data={dataMenuMBHR.filter((x) => x !== "MBHRAN")}
                renderItem={
                  loginReducers.data.data.menu_type == 2
                    ? renderItemV1
                    : renderItem
                }
                numColumns={numColumns}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
              {/* <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 6,
                  paddingBottom: 10,
                }}
              >
                <View
                  style={{
                    // top: -10,
                    // marginLeft: 10,
                    backgroundColor: Color.white,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>Main title</Text>
                </View>
                <FlatList
                  data={dataTest}
                  renderItem={renderItemV1}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View> */}
            </Block>
          )}
        </Block>
      </Block>
    </LinearGradient>
  );
};
export default HomeMain;
