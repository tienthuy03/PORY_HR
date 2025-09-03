import React from 'react';
import { Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '../../../../../components/Block';
import { AssestConstants } from '../../../../../constants';
import CustomButtonContract from '../components/ButtonContract';
import { useNavigation } from '@react-navigation/native';
const KyThanhCong = () => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const navigation = useNavigation()

  return (
    <Block flex={1} alignCenter={"center"} >
      <Image source={AssestConstants.SuccessSignIn} style={{ width: 300, height: 300, marginTop: '50%', marginLeft: 12 }} />
      <Text style={{ fontSize: 32, fontWeight: '700', color: Color.btnSuccess2, marginVertical: 10 }}>Thành công</Text>
      <Text style={{ fontSize: 20, fontWeight: '500', color: Color.textPrimary2, textAlign: 'center', lineHeight: 26, marginBottom: 12 }}>Chúc mừng bạn! {'\n'} Đã ký hợp đồng thành công</Text>
      <CustomButtonContract color={Color.btnSuccess2} title="Quay về" onPress={() => navigation.navigate("MBHRSG002")} />
    </Block>
  )
}

export default KyThanhCong
