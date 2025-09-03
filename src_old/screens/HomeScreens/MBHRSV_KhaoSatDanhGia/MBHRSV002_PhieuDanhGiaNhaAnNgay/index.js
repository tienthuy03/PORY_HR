import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSTab from "../../../../components/Tvs/Tab";
import DGNAN from "./DangKy";
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
          "MBHRSV002",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRSV002")[0]
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
            screen: <DGNAN />,
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
