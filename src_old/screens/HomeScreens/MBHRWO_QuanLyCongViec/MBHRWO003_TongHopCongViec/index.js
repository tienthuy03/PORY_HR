import moment from "moment";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";

import BieuDo from "./BieuDo";

const MBHRWO003 = ({ navigation: { goBack } }) => {
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let thr_emp_pk = "";
  let tokens = "";
  let fullname = "";
  let crt_by = "";
  // let arr = [];

  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRWO003",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRWO003")[0]
            .p_pk
        )}
      </TVSHeader>
      <BieuDo />
    </Block>
  );
};
export default MBHRWO003;
