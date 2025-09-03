import moment from "moment";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  View,
} from "react-native";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
//Control tab
import TVSTab from "../../../../components/Tvs/Tab";
//
import ThemMoi from "./ThemMoi";
import DanhSach from "./DanhSach";

import {
  HRWO001LayDanhSachListControl,
  HRWO001ResetAllData,
} from "../../../../services/redux/HRWO001_CongViecGiao/action";
import { useNavigation } from "@react-navigation/native";

const MBHRWO001 = ({ reloadConfig }) => {
  const navigation = useNavigation();

  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  const nguoiGiaoViec = useSelector(
    (state) => state.HRWO001_CongViecGiaoReducer.ListNguoiGiaoViecDefault
  );
  let thr_emp_pk = "";
  let tokens = "";
  let fullname = "";
  let crt_by = "";

  const refreshTab1 = () => {
    console.log("test");
    //dispatch(HRWO001ResetAllData(nguoiGiaoViec));
    navigation.goBack();
    navigation.navigate("MBHRWO001");
  };
  const GoBack = () => {
    dispatch(HRWO001ResetAllData(nguoiGiaoViec));
    navigation.goBack();
  };

  const goUpdate = (dataUpdate) => {
    navigation.navigate("MBHRWO001_Update", { dataUpdate: dataUpdate });
  };

  const goDetail = (dataUpdate) => {
    navigation.navigate("MBHRWO001_ChiTiet", { itemCongViec: dataUpdate });
  }
  
  // let arr = [];

  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  useEffect(() => {
    //dispatch(HRWO001LayDanhSachListControl());
    // dispatch(HRWO001ChonNguoiGiaoViec(nguoiGiaoViec));
  }, []);
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={() => GoBack()}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRWO001",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRWO001")[0]
            .p_pk
        )}
      </TVSHeader>
      <View style={{ flex: 1, paddingTop: 5 }}>
        <TVSTab
          fullTab
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: "Thêm mới công việc",
              count: null,
              screen: <ThemMoi refresh={refreshTab1}/>,
            },
            {
              id: 1,
              name: "Danh sách",
              count: null,
              screen: <DanhSach 
                goUpdate={(item) => goUpdate(item)} 
                goDetail={(item) => goDetail(item)}
              />,
            },
          ]}
        />
      </View>
    </Block>
  );
};
export default MBHRWO001;
