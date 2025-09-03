import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  View,
  Keyboard,
  FlatList,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import axios from "axios";
import Block from "../../../../../../components/Block";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../../config/Pro";
import Button from "../../../../../../components/Button";
import TVSButton from "../../../../../../components/Tvs/Button";
import Load from "../../../../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSHeader from "../../../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../../../Language";
import TVSList from "../../../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import OneField from "../../../../../../components/OneFieldKeyValue";
import TVSSignature from "../../../../../../components/Tvs/TVSSignature";
import IconDate from "../../../../../../icons/Datev";
import IconTime from "../../../../../../icons/Time";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SignatureScreen from "react-native-signature-canvas";
import { launchCamera } from "react-native-image-picker";
// import { request, PERMISSIONS } from "react-native-permissions";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../../services/redux/GlobalLoading/action";

const DanhSachNguoiDiXe = ({ route_pk }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);

  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  const [dataMain, setDataMain] = useState([]);
  const [countEmp, setCountEmp] = useState(0);
  useEffect(() => {
    getDataMain(route_pk);
  }, []);

  const getDataMain = (route_pk) => {
    console.log("get data main ", route_pk);
    sysFetch(
      API,
      {
        pro: "SELHRBS001003",
        in_par: {
          p1_varchar2: route_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data_main",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs bs001003 ", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setCountEmp(rs.data.lst_data_main.length);
            setDataMain(rs.data.lst_data_main);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        </Block>
      </View>
    );
  };

  return (
    <Block flex>
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
          alignItems: "flex-end",
        }}
      >
        <Text>Số người: {countEmp}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
          marginBottom: 20,
          flex: 1,
        }}
      >
        {dataMain.length > 0 && (
          <View
            style={{
              paddingTop: 5,
              paddingBottom: 10,
              // flex: 1,
            }}
          >
            {dataMain.map((x) => (
              <ItemMain item={x} />
            ))}
          </View>
        )}
      </ScrollView>
    </Block>
  );
};

export default DanhSachNguoiDiXe;
