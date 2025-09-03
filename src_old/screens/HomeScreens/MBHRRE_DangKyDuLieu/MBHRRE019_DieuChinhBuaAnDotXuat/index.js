import { View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import TVSTab from "../../../../components/Tvs/Tab";
import Register from "./DangKy";
import DanhSach from "./DanhSach";

const DieuChinhBuaAnDotXuat = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const menuReducer = useSelector((state) => state.menuReducer);
  let user_language = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  return (
    <Block style={{ flex: 1 }} backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          user_language,
          menuReducer.data.data.menu,
          "MBHRRE019",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRE019")[0]
            .p_pk
        )}
      </TVSHeader>
      <View style={{ flex: 1 }} backgroundColor={Color.gray}>
        <TVSTab
          fullTab
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: "Đăng ký",
              count: null,
              screen: <Register />,
            },
            {
              id: 1,
              name: "Danh sách",
              count: null,
              screen: <DanhSach />,
            },
          ]}
        />
      </View>
    </Block>
  );
};

export default DieuChinhBuaAnDotXuat;
