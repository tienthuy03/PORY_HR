/* eslint-disable react-hooks/exhaustive-deps */
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import Calender from "../../../../components/Calendes";
import Icon_calendar from "../../../../icons/Datev";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
import PopupItem from "./Popup_Item";
const QuanLyCacQuyetDinh = ({ navigation: { goBack } }) => {
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
  try {
    language = loginReducers.data.data.user_language;
    dataMenuMBHRs = menuReducer.data.data.menu;
  } catch (error) {
    console.log(error);
  }
  useEffect(() => {
    GetData();
  }, []);

  const styles = StyleSheet.create({});

  const [data, setData] = useState([]);

  const GetData = () => {
    dispatch(ShowGlobalLoading);
    console.log(tokenLogin);
    sysFetch(
      API,
      {
        pro: "SELHRIN012000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
          p2_sys: "data_item",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs.data.data);
        if (rs == "Token Expired") {
          // refreshNewToken('fetchData');
        }
        if (rs != "Token Expired") {
          setData(rs.data.data);
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log("error ", error);
        dispatch(HideGlobalLoading);
      });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 5 }}>
        <TouchableOpacity
          onPress={() => {
            setModalItemVisible(true);
            setFolderPK(item.pk);
            setFolderName(item.folder_name);
          }}
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          {/* render item text */}
          <View
            style={{
              flexDirection: "row",
              minHeight: 60,
            }}
          >
            <View
              style={{
                minWidth: 60,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name={item.icon} size={50} />
                </View>
                <LinearGradient
                  colors={[item.icon_from_color, item.icon_to_color]}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginLeft: 10,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text>{item.folder_name}</Text>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 2,
              paddingHorizontal: 5,
              marginLeft: 1,
              marginVertical: 15,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                color: item.count_color,
                fontSize: 17,
              }}
            >
              {item.count}
            </Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Icon name={"chevron-right"} color={Color.mainColor} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [folderPK, setFolderPK] = useState("");
  const [folderName, setFolderName] = useState("");
  const modalItem = (
    <PopupItem
      title={folderName}
      isShow={modalItemVisible}
      folderPK={folderPK}
      onHide={() => setModalItemVisible(false)}
    ></PopupItem>
  );

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRMN012",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRMN012")[0].p_pk
        )}
      </TVSHeader>

      <Block backgroundColor={Color.gray} flex>
        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            refreshing={false}
            onRefresh={() => {
              GetData();
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            marginHorizontal: 10,
            marginBottom: 20,
          }}
        ></View>
        {modalItem}
      </Block>
    </Block>
  );
};
export default QuanLyCacQuyetDinh;
