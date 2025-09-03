import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import Signature from 'react-native-signature-canvas';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Block from '../../../../../../components/Block';

const SignInWritting = ({ onClose }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef();
  const navigation = useNavigation();


  const handleSignature = (signatureData) => {
    setSignature(signatureData);
  };

  const clearSignature = () => {
    setSignature(null);
    signatureRef.current.clearSignature();
  };

  // const HandleNavigationScreenSignInSuccess = () => {
  //   if (onClose) {
  //     onClose(); // Call onClose if it exists
  //   }
  //   navigation.navigate("KyThanhCong");
  // };
  return (
    <Block border={1} padding={12} borderRadius={12} borderColor={Color.gray}>
      <Text size={16} color={Color.textPrimary2}>
        Vui lòng ký tên của bạn vào ô bên dưới
      </Text>
      <Block
        height={200}
        borderWidth={1}
        borderRadius={12}
        marginVertical={8}
        borderColor="#D9EAFD"
        overflow="hidden"
      >
        {/* Canvas ký */}
        <Signature
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={() => alert('Bạn chưa vẽ gì cả!')}
          descriptionText="Ký tên tại đây"
          clearText="Xóa"
          confirmText="Lưu"
          webStyle={`.m-signature-pad--footer { display: none; }`}
          bgSrc="https://via.placeholder.com/300x200/ff726b"
        />
      </Block>
      <View style={{ flexDirection: 'row', justifyContent: "space-between", gap: 12 }} >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ backgroundColor: Color.textPrimary3, borderRadius: 4, padding: 8, flex: 1, }}
          onPress={clearSignature}
        >
          <Text style={{ fontSize: 14, textAlign: 'center', color: Color.white }} >Ký lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ backgroundColor: Color.btnPrimary2, borderRadius: 4, padding: 8, flex: 1 }}
          onPress={onClose}
        >
          <Text style={{ fontSize: 14, textAlign: 'center', color: Color.white }}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </Block>
  )
}

export default SignInWritting