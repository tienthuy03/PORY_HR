import React from 'react';
import {Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../components/Block';
import TVSHeader from '../../../components/Tvs/Header';
import {setHeader2} from '../../../Language';
import List_MBHRTI from '../../../utils/List_MBHRTI';

const Index = ({navigation: {goBack}, route}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state);
  let dataMenuMBHRs = state.menuReducer.data.data.menu;
  let language = state.loginReducers.data.data.user_language;
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, 'MBHRTI')}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <List_MBHRTI />
      </Block>
    </Block>
  );
};

export default Index;
