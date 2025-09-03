import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useSelector } from 'react-redux';
import Block from '../../../../../components/Block';
import TVSHeader from '../../../../../components/Tvs/Header';
import CustomButtonContract from '../components/ButtonContract';
import ModalSignIn from '../components/ModalSignIn';
import { useRoute } from '@react-navigation/native';
const ChiTietHopDongLaoDong = ({ navigation }) => {
  //params
  const route = useRoute();
  const { contract_pk, status_val } = route.params;
  console.log("contract_pk: " + contract_pk, "status_val: " + status_val);


  const Color = useSelector((state) => state.SystemReducer.theme);
  // state
  const [showModalSignIn, setShowModalSignIn] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleCheckBoxChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSignContract = () => {
    if (isAgreed) {
      setShowModalSignIn(true);
    } else {
      Alert.alert('Thông báo', 'Vui lòng đồng ý với các điều khoản của hợp đồng trước khi ký.', [
        { text: 'Đồng ý', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <TVSHeader goBack={navigation.goBack}>Chi tiết hợp đồng</TVSHeader>
      <Image
        style={{ height: 600 }}
        source={{
          uri: 'https://lh3.googleusercontent.com/WnjnXYEEjMJ2JbERNJk6Dcc7nqXm7fRwoMECjfk-yyzxK-9b3AtLMjfTSb4uPK1pqs_uqqrclEejsfTtZx4ymP_mD3Sdd6q07J4iOmu04P1WJaCykJKtYuQ8k6Y1NZWDItjC7Aon',
        }}
      />
      {status_val !== '2' ? (
        <>
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent' }}
            title="Bạn có đồng ý với các điều khoản của hợp đồng không?"
            checked={isAgreed}
            onPress={handleCheckBoxChange}
          />

          <Block row justifyContent="space-around" flex paddingHorizontal={16} paddingBottom={16}>
            <CustomButtonContract title="Từ chối ký" color={Color.textPrimary3} icon="close" />
            <CustomButtonContract
              title="Ký hợp đồng"
              color={Color.btnRed2}
              icon="grease-pencil"
              onPress={handleSignContract}
            />
          </Block>
        </>
      ) : (
        <Block paddingHorizontal={16} paddingVertical={8}>
          <Text style={{ fontSize: 12, fontWeight: 600, color: Color.btnRed2, fontStyle: "italic" }}>Hợp đồng đã ký thành công</Text>
        </Block>
      )}
      {showModalSignIn && <ModalSignIn onClose={() => setShowModalSignIn(false)} />}
    </ScrollView>
  );
};

export default ChiTietHopDongLaoDong;


