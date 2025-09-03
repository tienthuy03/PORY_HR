import axios from 'axios';
import md5 from 'md5';
import React, { useState } from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import Block from '../../components/Block';
import Button from '../../components/Button';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput.js';
import { DefaultIP } from '../../config/Pro';
import { deviceId } from '../../constants';
import Icon_back from '../../icons/Back';
const RegisterAccount = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const goBacks = async () => {
    await goBack();
  };
  const onRegister = () => {
    if (username.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập tài khoản', [{ text: 'Đóng' }]);
      return;
    }

    if (password.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập mật khẩu', [{ text: 'Đóng' }]);
      return;
    }

    if (rePassword.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập mật khẩu', [{ text: 'Đóng' }]);
      return;
    }
    if (password.length < 6) {
      Alert.alert('Thông báo', 'Mật khẩu phải có độ dài từ 6 ký tự', [
        { text: 'Đóng' },
      ]);
      return;
    }
    if (password !== rePassword) {
      Alert.alert('Thông báo', 'Nhập lại mật khẩu chưa chính xác.', [
        { text: 'Đóng' },
      ]);
      return;
    }
    if (name.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập Họ và tên', [{ text: 'Đóng' }]);
      return;
    }
    if (companyName.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập tên công ty', [{ text: 'Đóng' }]);
      return;
    }

    if (position.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập chức vụ', [{ text: 'Đóng' }]);
      return;
    }
    if (email.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập email', [{ text: 'Đóng' }]);
      return;
    }
    if (phone.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập số điện thoại', [{ text: 'Đóng' }]);
      return;
    }
    onRequest();
  };

  const onRequest = () => {
    const URL = DefaultIP + 'Exec2/MOBILEAPP';
    const js = {
      pro: 'INSUSER0010100',
      in_par: {
        p1_varchar2: username,
        p2_varchar2: md5(password),
        p3_varchar2: name,
        p4_varchar2: companyName,
        p5_varchar2: position,
        p6_varchar2: phone,
        p7_varchar2: email,
      },
      out_par: {},
      token: 'tvs',
      machine_id: deviceId,
    };
    axios
      .post(URL, js)
      .then((response) => {
        if (response.data.results === 'S') {
          Alert.alert('Thông báo', 'Đăng ký thành công.', [
            {
              text: 'Đóng',
              onPress: () => {
                goBack();
              },
            },
          ]);
        } else {
          Alert.alert(
            'Thông báo',
            'Đăng ký không thành công. Xin liên hệ tới quản trị.',
            [
              {
                text: 'Đóng',
              },
            ],
          );
        }
      })
      .catch((error) => {
        Alert.alert('Thông báo', error.toString(), [
          {
            text: 'Đóng',
          },
        ]);
      });
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      <Block
        row
        alignCenter
        justifyContent={'space-between'}
        paddingBottom={Platform.OS === 'ios' ? 10 : 15}
        paddingTop={Platform.OS === 'ios' ? 15 : 5}
        marginTop={30}>
        <Button
          flex={0}
          padding={10}
          width={40}
          height={40}
          nextScreen={() => goBacks()}>
          <Icon_back color={Color.white} />
        </Button>
        <Block flex={1} alignCenter>
          <Text size={20} color={Color.white} fontFamily={'Roboto-Bold'}>
            Đăng ký tài khoản
          </Text>
        </Block>
      </Block>
      <Block backgroundColor={Color.gray} flex padding={10}>
        <ScrollView>
          <Block
            backgroundColor={Color.white}
            marginBottom={5}
            borderRadius={10}
            padding={10}>
            <Block
              marginBottom={5}
              borderBottomWidth={1}
              borderBottomColor={'#ccc'}
              padding={5}>
              <Text>Thông tin tài khoản</Text>
            </Block>
            <Block padding={10}>
              <Block marginBottom={10}>
                <Text style={{ color: Color.mainColor }}>Tài khoản</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  autoCompleteType={'password'}
                  placeholderTextColor={Color.grayPlahoder}
                  value={username}
                  onChangeText={(value) => setUsername(value)}
                />
              </Block>
              <Block>
                <Text style={{ color: Color.mainColor }}>Mật khẩu</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={password}
                  secureTextEntry
                  onChangeText={(value) => setPassword(value)}
                />
              </Block>
              <Block marginTop={10}>
                <Text style={{ color: Color.mainColor }}>Nhập lại mật khẩu</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={rePassword}
                  secureTextEntry
                  onChangeText={(value) => setRePassword(value)}
                />
              </Block>
            </Block>
          </Block>
          <Block backgroundColor={Color.white} borderRadius={10} padding={10}>
            <Block
              marginBottom={5}
              borderBottomWidth={1}
              borderBottomColor={'#ccc'}
              padding={5}>
              <Text>Thông tin cá nhân</Text>
            </Block>
            <Block padding={10}>
              <Block marginBottom={10}>
                <Text style={{ color: Color.mainColor }}>Họ và tên</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  autoCompleteType={'password'}
                  placeholderTextColor={Color.grayPlahoder}
                  value={name}
                  onChangeText={(value) => setName(value)}
                />
              </Block>
              <Block marginBottom={10}>
                <Text style={{ color: Color.mainColor }}>Công ty</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  autoCompleteType={'password'}
                  placeholderTextColor={Color.grayPlahoder}
                  value={companyName}
                  onChangeText={(value) => setCompanyName(value)}
                />
              </Block>
              <Block>
                <Text style={{ color: Color.mainColor }}>Chức vụ</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={position}
                  onChangeText={(value) => setPosition(value)}
                />
              </Block>
              <Block marginTop={10}>
                <Text style={{ color: Color.mainColor }}>Email</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                />
              </Block>

              <Block marginTop={10}>
                <Text style={{ color: Color.mainColor }}>Số điện thoại</Text>
                <TextInput
                  size={15}
                  padding={15}
                  borderRadius={5}
                  backgroundColor={Color.inputBackgroundColor}
                  placeholderTextColor={Color.grayPlahoder}
                  value={phone}
                  onChangeText={(value) => setPhone(value)}
                />
              </Block>
            </Block>
          </Block>
        </ScrollView>
        <Block marginTop={10} justifyCenter alignCenter>
          <Button
            style={{ borderRadius: 5 }}
            backgroundColor={Color.mainColor}
            nextScreen={onRegister}>
            <Text padding={15} color={Color.white}>
              Đăng ký
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default RegisterAccount;
