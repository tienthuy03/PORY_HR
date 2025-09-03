import React from 'react';
import {Dimensions, Platform, StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../components/Block';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import TVSHeader from '../../../components/Tvs/Header';
import Icon_back from '../../../icons/Back';
import {setHeader2} from '../../../Language';
import List_MBHRMN from '../../../utils/List_MBHRMN';

const {width, height} = Dimensions.get('screen');
const Index = ({navigation: {goBack}, route}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state);
  let dataMenuMBHRs = [];
  dataMenuMBHRs = state.menuReducer.data.data.menu;

  let language = state.loginReducers.data.data.user_language;

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, 'MBHRMN')}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <List_MBHRMN />
      </Block>
    </Block>
  );
};

export default Index;
