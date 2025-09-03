import React from 'react';
import {View} from 'react-native';
import Block from '../../../../components/Block';
import Text from '../../../../components/Text';
import TVSButton from '../../../../components/Tvs/Button';
import {useSelector} from 'react-redux';
const PheDuyetDiCongTac = ({navigation: {goBack}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  return (
    <Block flex justifyCenter alignCenter>
      <View>
        <Text> Đang phát triển</Text>
      </View>
      {/* <Button
        backgroundColor={Color.mainColor}
        radius={10}
        justifyCenter
        alignCenter
        height={50}
        width={150}
        nextScreen={() => goBack()}>
        <Text color={'#fff'}>Trở về</Text>
      </Button> */}
      <TVSButton
        paddingHorizontal={80}
        paddingVertical={20}
        borderRadius={30}
        // icon={'check'}
        type={'login'}
        onPress={() => goBack()}>
        Trở về
      </TVSButton>
    </Block>
  );
};
export default PheDuyetDiCongTac;
