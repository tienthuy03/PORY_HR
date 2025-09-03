import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import { setHeader2 } from "../../../Language";
import List_MBHRIN from "../../../utils/Listtvtt(MBHRIN)";
const Index = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  let dataMenuMBHRs;
  let language;
  try {
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.loginReducers.data.data.user_language;
  } catch (error) {}
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, "MBHRIN")}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <List_MBHRIN />
      </Block>
    </Block>
  );
};

export default Index;
