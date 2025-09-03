import React from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import { setHeader2 } from "../../../Language";
import List_MBHRSV from "../../../utils/List_MBHRSV";
const Index = ({ navigation: { goBack }, route }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const menuReducer = useSelector((state) => state.menuReducer);
  const loginReducers = useSelector((state) => state.loginReducers);
  let dataMenuMBHRs = [];
  let language;
  try {
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
  } catch (error) {}

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, "MBHRSV")}
      </TVSHeader>

      <Block flex backgroundColor={Color.gray} paddingTop={10}>
        <List_MBHRSV />
      </Block>
    </Block>
  );
};

export default Index;
