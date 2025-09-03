import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {Alert, Platform, StatusBar} from 'react-native';
import RNRestart from 'react-native-restart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../components/Block';
import Button from '../../components/Button';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput.js';
import {ServerIP} from '../../config/Pro';
import Icon_back from '../../icons/Back';
import {SetApiURL} from '../../services/redux/SysConfig/action';

const SysConfig = ({navigation: {goBack}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const [ClientId, setClientId] = useState('');
  const [ClientKey, setClientKey] = useState('');

  const goBacks = async () => {
    await goBack();
  };
  const onSave = () => {
    if (ClientId.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập Client Id.', [{text: 'Đóng'}]);
      return;
    }

    if (ClientKey.length === 0) {
      Alert.alert('Thông báo', 'Bạn chưa nhập Client Key.', [{text: 'Đóng'}]);
      return;
    }

    checkAPI(ClientId, ClientKey);
  };

  const checkAPI = (clientId, clientKey) => {
    const URL =
      ServerIP.tvs +
      'User/CheckClient?clientId=' +
      clientId +
      '&clientKey=' +
      clientKey;
    axios
      .post(URL, null)
      .then(response => {
        if (response.data.data.length > 0) {
          AsyncStorage.setItem('API_URL', response.data.data[0].api_name);
          dispatch(SetApiURL(response.data.data[0].api_name));
          Alert.alert('Thông báo', 'Cấu hình thành công.', [
            {
              text: 'Đóng',
              onPress: () => {
                RNRestart.Restart();
              },
            },
          ]);
        } else {
          Alert.alert('Thông báo', 'Cấu hình thất bại.', [
            {
              text: 'Đóng',
            },
          ]);
        }
      })
      .catch(error => {
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
            Cấu hình hệ thống
          </Text>
        </Block>
      </Block>
      <Block backgroundColor={Color.white} flex padding={10}>
        <Block marginBottom={10}>
          <Text style={{color: Color.mainColor}}>Mã khách hàng</Text>
          <TextInput
            size={15}
            padding={15}
            borderRadius={5}
            backgroundColor={Color.inputBackgroundColor}
            autoCompleteType={'password'}
            placeholderTextColor={Color.grayPlahoder}
            value={ClientId}
            onChangeText={value => setClientId(value)}
          />
        </Block>
        <Block>
          <Text style={{color: Color.mainColor}}>Mã xác nhận</Text>
          <TextInput
            size={15}
            padding={15}
            borderRadius={5}
            backgroundColor={Color.inputBackgroundColor}
            placeholderTextColor={Color.grayPlahoder}
            value={ClientKey}
            onChangeText={value => setClientKey(value)}
          />
        </Block>
        <Block marginTop={10} justifyCenter alignCenter>
          <Button
            style={{borderRadius: 5}}
            backgroundColor={Color.mainColor}
            nextScreen={onSave}>
            <Text padding={15} color={Color.white}>
              <MaterialCommunityIcons name="content-save" size={17} /> Sao Lưu
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default SysConfig;
