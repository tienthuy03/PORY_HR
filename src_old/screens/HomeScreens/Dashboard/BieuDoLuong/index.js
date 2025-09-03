/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View, Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import { HRDB001LayDuLieuLuong } from "../../../../services/redux/Dashboard/action";
//import {Color} from '../../../../colors/color';
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";

const { width } = Dimensions.get("screen");

const HoatDong = ({ image }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let empPk = useSelector((state) => state.loginReducers.data.data.thr_emp_pk);
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {},
    titleView: {
      padding: 10,
      backgroundColor: Color.btnMain,
    },
    titleText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    body: {
      padding: 5,
    },
    oneRow: {
      flexDirection: "row",
    },
    oneItemView: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: Color.white,
      margin: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    oneItemImage: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginRight: 10,
    },
    oneItemName: {
      fontWeight: "bold",
      color: Color.mainColor,
      fontSize: 15,
    },
    oneItemContent: {
      marginBottom: 5,
      marginTop: 5,
    },
    oneItemCD: {
      color: Color.grayPlahoder,
    },
  });

  const yearTemp = moment().format("YYYY");
  // const dataTemp = useSelector(
  //   state => state.HRDB001_DashboardReducer.DuLieuLuong,
  // );
  let dataTemp = [];
  useEffect(() => {
    // dispatch(HRDB001LayDuLieuLuong());
    getData();
  }, []);
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
        data: dataTemp.map((item) => item.value / 1000000),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#FDFEFE",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FDFEFE",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(23, 32, 42, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: "#8E44AD",
    fillShadowGradientOpacity: 1,
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
    sysFetch(
      API,
      {
        pro: "SELHRDB0012100",
        in_par: {
          p1_varchar2: empPk,
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
          if (rs.results == "S") {
            dataTemp = rs.data.data;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Lương năm {yearTemp}</Text>
      </View>
      <View style={styles.body}>
        <BarChart
          style={{ color: Color.btnMain }}
          data={data}
          width={width - 20}
          height={300}
          chartConfig={chartConfig}
          horizontalLabelRotation={0}
          yAxisSuffix={" Tr"}
          verticalLabelRotation={0}
        />
      </View>
    </View>
  );
};

export default HoatDong;
