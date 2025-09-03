import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import { setHeader2 } from "../../../Language";
import List_MBHRBS from "../../../utils/List_MBHRBS";
const Index = ({ navigation: { goBack } }) => {
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
        {setHeader2(language, dataMenuMBHRs, "MBHRBS")}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <List_MBHRBS />
      </Block>
    </Block>
  );
};

export default Index;
