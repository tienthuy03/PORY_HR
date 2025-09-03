import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
import { useNavigation } from '@react-navigation/native';

const SignInSimple = ({ onClose }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const navigation = useNavigation()

  // const handelNavigation = () => {
  //   navigation.navigate('KyThanhCong')
  // }

  return (
    <Block marginTop={10}>
      <Text size={16} color={Color.textPrimary2}>
        Chữ ký của bạn hiển thị ở ô bên dưới
      </Text>
      <Block height={160} borderWidth={1} borderRadius={12} marginVertical={8} borderColor="#D9EAFD" justifyCenter={"center"} >
        <Image source={{ uri: "https://vuanem.com/blog/wp-content/uploads/2023/03/tao-chu-ky-dep-theo-ten.jpg" }} style={{ height: 120 }} />
      </Block>
      <TouchableOpacity activeOpacity={0.7} onPress={onClose}
        style={{ backgroundColor: Color.btnPrimary2, borderRadius: 4, padding: 4 }} >
        <Text center={"center"} size={14} color={Color.white}>Xác nhận</Text>
      </TouchableOpacity>
    </Block>
  );
};

export default SignInSimple;
