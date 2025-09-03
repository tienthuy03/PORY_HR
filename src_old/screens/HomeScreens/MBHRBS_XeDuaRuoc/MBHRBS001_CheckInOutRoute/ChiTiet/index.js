/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Calender from "../../../../../components/Calendes";
import Text from "../../../../../components/Text";
// import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSHeader from "../../../../../components/Tvs/Header";
import TVSTab from "../../../../../components/Tvs/Tab";
import Icon_calendar from "../../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../../Language";
import sysFetch from "../../../../../services/fetch_v1";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import { APP_VERSION } from "../../../../../config/Pro";
import TVSButton from "../../../../../components/Tvs/Button";
import ChiTietChuyenDi from "./ChiTietChuyenDi";
import ChiPhi from "./ChiPhi";
import DanhSachNguoiDiXe from "./DanhSachNguoiDiXe";

const ChiTiet = ({ navigation: { goBack }, route }) => {
  const { route_pk, car_reg_pk } = route.params;
  console.log("recived ", route_pk);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);

  const language = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  //token query data
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
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Chi tiết</TVSHeader>

      <Block backgroundColor={Color.gray} flex>
        <Block flex backgroundColor={Color.gray}>
          <TVSTab
            data={[
              {
                id: 0,
                name: "Chi tiết chuyến đi",
                screen: (
                  <ChiTietChuyenDi
                    route_pk={route_pk}
                    car_reg_pk={car_reg_pk}
                  />
                ),
              },
              {
                id: 1,
                name: "Chi phí",
                screen: <ChiPhi route_pk={route_pk} car_reg_pk={car_reg_pk} />,
              },
              {
                id: 2,
                name: "Danh sách người đi xe",
                screen: <DanhSachNguoiDiXe route_pk={route_pk} />,
              },
            ]}
          />
        </Block>
      </Block>
    </Block>
  );
};
export default ChiTiet;
