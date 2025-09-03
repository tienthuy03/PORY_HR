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
import TVSList from "../../../../components/Tvs/TVSList";
import Typography from "../../../../components/Text";
import TVSButton from "../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import TVSDate from "../../../../components/Tvs/TVSDate";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";
import TVSTab from "../../../../components/Tvs/Tab";
import DK from "./DangKy";
import DS from "./DanhSach";

const PhieuDanhGia = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRSV004",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRSV004")[0]
            .p_pk
        )}
      </TVSHeader>
      <TVSTab
        fullTab
        scrollEnabled={false}
        data={[
          {
            id: 0,
            name: "Đánh giá",
            count: null,
            screen: <DK />,
          },
          {
            id: 1,
            name: "Danh sách",
            count: null,
            screen: <DS />,
          },
        ]}
      />
    </Block>
  );
};
export default PhieuDanhGia;
