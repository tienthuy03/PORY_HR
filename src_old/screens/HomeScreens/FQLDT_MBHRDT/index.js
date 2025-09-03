import React from 'react';
import {Dimensions, Platform, StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../components/Block';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import Icon_back from '../../../icons/Back';
import {setHeader2} from '../../../Language';
import List_MBHRDT from '../../../utils/List_MBHRDT';
import TVSHeader from '../../../components/Tvs/Header';

const {width, height} = Dimensions.get('screen');
const Index = ({navigation: {goBack}, route}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state);
  let dataMenuMBHRs = state.menuReducer.data.data.menu;
  let language = state.loginReducers.data.data.user_language;

  return (
    // <Block flex backgroundColor={Color.backgroundColor}>
    //   <StatusBar
    //     translucent={true}
    //     backgroundColor={'transparent'}
    //     barStyle="light-content"
    //   />
    //   <Block
    //     row
    //     alignCenter
    //     justifyContent={'space-between'}
    //     paddingLeft={15}
    //     paddingBottom={Platform.OS === 'ios' ? 10 : 15}
    //     paddingTop={Platform.OS === 'ios' ? 15 : 5}
    //     marginTop={30}>
    //     <Button
    //       paddingTop={10}
    //       width={40}
    //       height={40}
    //       nextScreen={() => goBack()}>
    //       <Icon_back color={Color.white} />
    //     </Button>
    //     <Text
    //       size={20}
    //       color={Color.white}
    //       fontFamily={'Roboto-Bold'}
    //       paddingRight={40}
    //       textAlign={'center'}>
    //       {setHeader2(language, dataMenuMBHRs, 'MBHRDT')}
    //     </Text>
    //     <Block backgroundColor={Color.white} width={7} height={29} />
    //   </Block>
    //   <Block flex backgroundColor={Color.gray}>
    //     <List_MBHRDT />
    //   </Block>
    // </Block>
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeader2(language, dataMenuMBHRs, 'MBHRDT')}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex paddingTop={10}>
        <List_MBHRDT />
      </Block>
    </Block>
  );
};

export default Index;
