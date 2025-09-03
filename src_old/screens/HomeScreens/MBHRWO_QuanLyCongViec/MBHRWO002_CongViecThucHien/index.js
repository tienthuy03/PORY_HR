import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import DanhSach from "./DanhSach";
import { useNavigation } from "@react-navigation/native";

const MBHRWO003 = ({ navigation: { goBack } }) => {
  const navigation = useNavigation();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let thr_emp_pk = "";
  let tokens = "";
  let fullname = "";
  let crt_by = "";

  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }

  const goDetail = (itemCongViec) => {
    navigation.navigate("MBHRWO002_ChiTiet", { itemCongViec: itemCongViec });
  };
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRWO002",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRWO002")[0]
            .p_pk
        )}
      </TVSHeader>
      <DanhSach goDetail={(item) => goDetail(item)} />
    </Block>
  );
};
export default MBHRWO003;
