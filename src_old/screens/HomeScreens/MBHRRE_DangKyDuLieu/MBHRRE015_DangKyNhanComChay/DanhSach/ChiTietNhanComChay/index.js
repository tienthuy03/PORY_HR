/************************************************ START: IMPORT ************************************************/
import NetInfo from "@react-native-community/netinfo";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import Block from "../../../../../../components/Block";
import TVSHeader from "../../../../../../components/Tvs/Header";
import Typography from "../../../../../../components/Text";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../../../config/Pro";
import TVSButton from "../../../../../../components/Tvs/Button";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Load from "../../../../../../components/Loading";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import TVSList from "../../../../../../components/Tvs/TVSList";
/************************************************ END: IMPORT ************************************************/

const ChiTiet = ({ navigation: { goBack }, route }) => {
  //************************************************ START: VARIABLE ************************************************
  const { item, onRefresh } = route.params;
  const navigation = useNavigation();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  // Theme Color
  const Color = useSelector((s) => s.SystemReducer.theme);
  // Reducers info login
  const loginReducers = useSelector((state) => state.loginReducers);
  // Reducers menu
  const menuReducer = useSelector((state) => state.menuReducer);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk;
  let tokenLogin;
  let fullname;
  let crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  const screenWidth = Dimensions.get("window").width;

  //******************************************************************** END: VARIABLE ********************************************************************

  //************************************************ START: STATE ************************************************
  const [lyDo, setLyDo] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const styles = StyleSheet.create({
    titleText2: {
      flex: 1,
    },
    container2: {
      flexDirection: "row",
      marginBottom: 5,
      alignItems: "center",
      borderBottomWidth: 1,
      radius: 6,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      borderColor: "#F4F6F7",
    },
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleContainer2: {
      flex: 1,
      paddingHorizontal: 5,
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    warning: {
      color: "#ffc107",
    },
    success: {
      color: "#28a745",
    },
    danger: {
      color: "#dc3545",
    },

    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: "#5A94E7",
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },

    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      height: 120,
      justifyContent: "center",
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      borderStyle: "dashed",
      height: 120,
      justifyContent: "center",
    },
    blockApproveInfo: {
      marginTop: 10,
    },
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
    },
  });

  //************************************************ START: HANDLE FUNCTION ***********************************************

  useEffect(() => {
    if (item) {
      console.log(item);
      setLyDo(item.reason);
      setGhiChu(item.description);
    }
  }, [item]);

  const validate = () => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn sao lưu không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                onSave();
              } else {
                ShowError("No internet");
              }
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    if (item.edit_yn === "N") {
      dialogNoti(item.noti_edit_yn);
      return;
    }

    const pro = "UPDHRRE015000";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: item.pk,
      p3_varchar2: "",
      p4_varchar2: "",
      p5_varchar2: lyDo,
      p6_varchar2: ghiChu,
      p7_varchar2: "",
      p8_varchar2: "",
      p9_varchar2: APP_VERSION,
      p10_varchar2: crt_by,
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
        console.log("rs save ", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: đăng ký không thành công.";
          }
          dialogNoti(errors);
        } else {
          if (rs.data.status == item.pk) {
            dialogNoti("Cập nhật thành công");
            onRefresh();
          } else {
            dialogNoti("Cập nhật thất bại");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <Block flex>
      {/* set dong header */}
      <TVSHeader goBack={goBack}>Chi tiết nhận cơm chay</TVSHeader>
      <Block
        backgroundColor={"#FFFFFF"}
        alignCenter
        margin={10}
        padding={10}
        radius={10}
      >
        <Typography
          size={20}
          center
          color={Color.mainColor}
          fontFamily={"Roboto-Bold"}
        >
          Ngày ăn chay {moment(item.start_dt, "YYYYMMDD").format("DD/MM/YYYY")}
        </Typography>
      </Block>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                {/* Control Text Area */}
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Lý do</Text>
                  </Block>
                  <Block
                    style={{
                      backgroundColor: Color.gray,
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      borderRadius: 6,
                      minHeight: 50,
                    }}
                  >
                    <TextInput
                      multiline={true}
                      placeholder={"Nhập lý do"}
                      value={lyDo}
                      onChangeText={setLyDo}
                    />
                  </Block>
                </Block>

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Ghi chú</Text>
                  </Block>
                  <Block
                    style={{
                      backgroundColor: Color.gray,
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      borderRadius: 6,
                      minHeight: 50,
                    }}
                  >
                    <TextInput
                      multiline={true}
                      placeholder={"Nhập ghi chú"}
                      value={ghiChu}
                      onChangeText={setGhiChu}
                    />
                  </Block>
                </Block>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <TVSButton
                      onPress={validate}
                      icon={"content-save"}
                      buttonStyle={"3"}
                      minWidth={150}
                    >
                      Sao lưu
                    </TVSButton>
                  </View>
                </View>
              </Block>
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default ChiTiet;
