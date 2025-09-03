import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { useSelector } from 'react-redux';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
import TVSControlPopup from '../../../../../../components/Tvs/ControlPopup';
import SignInLibrary from '../SignInLibrary';
import SignInSimple from '../SignInSimple';
import SignInWritting from '../SignInWritting';

const ModalSignIn = ({ visible, onClose }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const [selectedSignInMethod, setSelectedSignInMethod] = useState("1");
  const navigation = useNavigation();

  // Danh sách phương thức ký
  const signInMethods = [
    { id: "1", label: 'Ký bằng chữ viết', description: 'Viết trực tiếp lên màn hình điện thoại' },
    { id: "2", label: 'Ký bằng chữ ký mẫu', description: 'Sử dụng mẫu chữ ký bạn đã tạo sẵn' },
    { id: "3", label: 'Ký bằng hình ảnh', description: 'Sử dụng hình ảnh có trong thư viện' },
  ];

  const saveImage = () => {
    navigation.navigate("KyThanhCong")
  }
  const HandleNavigationScreenSignInSuccess = () => {
    onClose()
    navigation.navigate("KyThanhCong")
  }
  // Render nội dung vùng thao tác theo phương thức được chọn
  const renderMethodContent = (methodId) => {
    switch (methodId) {
      case "1":
        return <SignInWritting onClose={HandleNavigationScreenSignInSuccess} />;
      case "2":
        return <SignInSimple onClose={HandleNavigationScreenSignInSuccess} />;
      case "3":
        return <SignInLibrary onSave={saveImage} />
      default:
        return null;
    }
  };

  return (
    <TVSControlPopup title="Chọn phương thức ký tên" isShow={visible} onHide={onClose} showCloseButton={false}>
      {signInMethods.map((option) => (
        <Block key={option.id}>
          <Block row justifyContent="flex-start" alignCenter="center">
            <CheckBox
              checked={selectedSignInMethod === option.id}
              onPress={() =>
                setSelectedSignInMethod(selectedSignInMethod === option.id ? null : option.id)
              } // Toggle chọn/bỏ chọn
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
            <Block>
              <Text size={16} fontWeight={600} color={Color.textPrimary2}>
                {option.label}
              </Text>
              <Text size={12} fontWeight={400} color={Color.textPrimary3}>
                {option.description}
              </Text>
            </Block>
          </Block>

          {selectedSignInMethod === option.id && (
            <Block padding={8}>
              {renderMethodContent(option.id)}
            </Block>
          )}
        </Block>
      ))}
    </TVSControlPopup>
  );
};

export default ModalSignIn;
