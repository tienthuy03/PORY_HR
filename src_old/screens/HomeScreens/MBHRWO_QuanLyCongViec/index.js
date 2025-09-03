import React from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../Language";
import List_MBHRWO from "../../../utils/List_MBHRWO";

const index = ({ navigation: { goBack }, route }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const menuReducer = useSelector((state) => state.menuReducer);
  const loginReducers = useSelector((state) => state.loginReducers);
  let dataMenuMBHRs;
  let language;
  try {
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
  } catch (error) {}
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          "MBHRWO",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRWO")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex paddingTop={10}>
        <List_MBHRWO />
      </Block>
    </Block>
  );
};

export default index;
