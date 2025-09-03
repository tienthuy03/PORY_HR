/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Calender from "../../../../components/Calendes";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import TVSHeader from "../../../../components/Tvs/Header";
import TVSTab from "../../../../components/Tvs/Tab";
import { setHeaderChil2 } from "../../../../Language";
import ShowError from "../../../../services/errors";
import DangKy from "./DangKy";
import DanhSach from "./DanhSach";

import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";

const DangKyTangCa = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const menuReducer = useSelector((state) => state.menuReducer);
  const loginReducers = useSelector((state) => state.loginReducers);

  let thr_emp_pk = "";
  let tokenLogin = "";
  let fullnames = "";
  let org_pks = "";
  let userPk;
  let refreshToken;
  let crt_by = loginReducers.data.data.crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    org_pks = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-01")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("YYYY-MM-DD")
  );

  const onCallbackSetDate = (sDate, eDate) => {
    setStartDate(sDate);
    setEndDate(eDate);
  };

  /* START: CSS */
  const Color = useSelector((s) => s.SystemReducer.theme);
  /*END: CSS*/

  /*START: STATE */
  const [data, setData] = useState([]);
  const [dataApprove, setDataAPprove] = useState([]);
  const [dataApproveDefault, setDataAPproveDefault] = useState([]);

  let limit_reg_dt;
  /*END: STATE */

  const getData = async (fromdate, todate) => {
    console.log(crt_by);
    console.log(thr_emp_pks);
    sysFetch(
      API,
      {
        pro: "SELHRRE0070101",
        in_par: {
          p1_varchar2: thr_emp_pks,
          p2_varchar2: moment(fromdate).format("YYYYMMDD"),
          p3_varchar2: moment(todate).format("YYYYMMDD"),
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "xntc",
          p2_sys: "approve_data",
          p3_sys: "thongtinnguoipheduyet",
          p4_varchar2: "limit_reg_date",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", fromdate, todate);
        }
        if (rs != "Token Expired") {
          dispatch(fetchXntcSuccessAction(null));
          dispatch(
            fetchXntcAction({
              token: tokenLogin,
              machine_id: deviceId,
              user_pk: thr_emp_pks,
              p_fromdate: moment(fromdate).format("YYYYMMDD"),
              p_todate: moment(todate).format("YYYYMMDD"),
              version: APP_VERSION,
              crt_by: crt_by,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.backgroundColor }}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRRG003",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRG003")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <TVSTab
          fullTab={true}
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: "Đăng ký",
              screen: (
                <DangKy
                  data={data.filter((x) => x["0_pk"] === "")}
                  dataApprove={dataApprove}
                  dataApproveDefault={dataApproveDefault}
                  limitRegDt={limit_reg_dt}
                />
              ),
            },
            {
              id: 1,
              name: "Danh sách",
              screen: (
                <DanhSach
                  onCallbackSetDate={onCallbackSetDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              ),
            },
          ]}
        />
      </Block>
    </View>
  );
};

export default DangKyTangCa;
