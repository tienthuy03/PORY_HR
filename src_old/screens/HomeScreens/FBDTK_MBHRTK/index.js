import React from 'react';
import {useSelector} from 'react-redux';
import Block from '../../../components/Block';
import TVSHeader from '../../../components/Tvs/Header';
import {setHeader2} from '../../../Language';
import List_MBHRTK from '../../../utils/List_MBHRTK';
//import {Color} from '../../../colors/color';

const Index = ({navigation: {goBack}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state);
  let dataMenuMBHRs = [];
  let language;

  try {
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.loginReducers.data.data.user_language;
  } catch (error) {}

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, 'MBHRTK')}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <List_MBHRTK />
      </Block>
    </Block>
  );
};

export default Index;
