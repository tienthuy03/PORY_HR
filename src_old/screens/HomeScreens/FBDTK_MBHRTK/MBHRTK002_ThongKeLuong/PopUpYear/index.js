import moment from "moment";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  HRTK002ChonNam,
  HRTK002HidePopupYear,
  HRTK002LayDuLieu,
} from "../../../../../services/redux/HRTK002_ThongKeLuong/action";
import axios from "axios";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch";
const PopUpYear = () => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 888,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,.5)",
    },
    body: {
      height: 300,
    },
    oneFieldQues: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#F3F6F9",
      marginBottom: 5,
    },
    content: {
      width: 300,
      backgroundColor: "white",
      borderRadius: 5,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
    },
    textHeader: {
      fontSize: 20,
      color: Color.mainColor,
      fontWeight: "bold",
    },
    footer: {
      flexDirection: "row",
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    btnClose: {
      backgroundColor: Color.btnForeign,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: "white",
    },
    input: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    oneField: {
      marginBottom: 10,
    },
    textErr: {
      color: "red",
      textAlign: "right",
    },
  });
  const ShowPopUpYear = useSelector(
    (state) => state.HRTK002_ThongKeLuongReducer.ShowPopupYear
  );
  const currentYear = moment().format("YYYY");
  let dataYear = [];
  for (var i = currentYear; i >= 1970; i--) {
    dataYear.push(i);
  }
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  function renderItem({ item }) {
    // const onSelect = () => {
    //   dispatch(HRTK002ChonNam(item));
    //   dispatch(HRTK002HidePopupYear());
    //   dispatch(HRTK002LayDuLieu());
    // };
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
          if (obj == "onSelect") {
            onSelect();
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
    const onSelect = () => {
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
            refreshNewToken("onSelect");
          }
          if (rs != "Token Expired") {
            dispatch(HRTK002ChonNam(item));
            dispatch(HRTK002HidePopupYear());
            dispatch(HRTK002LayDuLieu());
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    return (
      <TouchableOpacity
        style={styles.oneFieldQues}
        activeOpacity={0.7}
        onPress={onSelect}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <>
      {ShowPopUpYear ? (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.textHeader}>CHỌN NĂM</Text>
            </View>
            <View style={styles.body}>
              <FlatList
                data={dataYear}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.btnOk}
                onPress={() => dispatch(HRTK002HidePopupYear())}
              >
                <Text style={styles.btnCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default PopUpYear;
