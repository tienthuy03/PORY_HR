// ImagePickerComponent.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // Đảm bảo cài đặt đúng thư viện này
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Đảm bảo đã cài đặt icon
import { Color } from '../../../../../../colors/colorhp';
import { useSelector } from 'react-redux';

const SignInLibrary = ({ onSave }) => {
  const [imageUri, setImageUri] = useState(null);
  const Color = useSelector((state) => state.SystemReducer.theme);
  // Hàm chọn ảnh từ thư viện hoặc chụp ảnh
  const pickImage = () => {
    Alert.alert(
      "",
      "Bạn muốn chụp ảnh hay chọn từ thư viện?",
      [
        {
          text: "Chụp ảnh",
          onPress: () => launchCamera({ mediaType: 'photo', quality: 1 }, handleResponse),
        },
        {
          text: "Chọn từ thư viện",
          onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 1 }, handleResponse),
        },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  // Hàm xử lý kết quả từ camera hoặc thư viện
  const handleResponse = (response) => {
    if (response.assets && response.assets.length > 0) {
      setImageUri(response.assets[0].uri); // Lưu URI ảnh đã chọn
    }
  };


  return (
    <View style={{ paddingHorizontal: 24 }}>
      {imageUri ? (
        // Khi có ảnh, hiển thị ảnh và các nút
        <>
          <Image
            source={{ uri: imageUri }}
            style={{ height: 160, borderRadius: 10, marginBottom: 10 }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={pickImage}
              style={{ backgroundColor: Color.textPrimary3, borderRadius: 4, padding: 6, flex: 1 }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>Chọn lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSave}
              style={{ backgroundColor: Color.btnPrimary2, borderRadius: 4, padding: 6, flex: 1 }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Khi chưa có ảnh, hiển thị khung chọn ảnh
        <TouchableOpacity
          onPress={pickImage}
          style={{
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 120,
          }}
        >
          <Icon name="camera-plus-outline" size={24} />
          <Text style={{ fontSize: 14, fontFamily: 'Roboto-Medium' }}>
            Chọn ảnh của bạn
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SignInLibrary;
