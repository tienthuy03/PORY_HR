import React from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import { setHeader2 } from "../../../Language";
import List_MBHRPR from "../../../utils/List_MBHRPR";

const Index = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const state = useSelector((state) => state);
  let dataMenuMBHRs = state.menuReducer.data.data.menu;
  let language = state.loginReducers.data.data.user_language;

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, "MBHRPR")}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <List_MBHRPR />
      </Block>
    </Block>
  );
};

export default Index;
