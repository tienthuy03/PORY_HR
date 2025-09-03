import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import md5 from 'md5';
import React, {useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import RNRestart from 'react-native-restart';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../components/Block';
import Button from '../../components/Button';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import TVSButton from '../../components/Tvs/Button';
import TVSHeader from '../../components/Tvs/Header';
import {deviceId, deviceName} from '../../constants/index';
import EyeClose from '../../icons/EyeClose';
import EyeOpen from '../../icons/EyeOpen';
import Icon_pass from '../../icons/Password';
import ShowError from '../../services/errors';
import axios from 'axios';
import {updateUserAction} from '../../actions';
import sysFetch from '../../services/fetch';

const UpdatePass = ({}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state.loginReducers);
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [load, setLoad] = useState(false);
  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);
  let user_name = '';
  let tokenLogin = '';
  let userPk;
  let refreshToken;
  try {
    user_name = state.user_name;
    tokenLogin = state.data.data.tokenLogin;
    userPk = state.data.data.tes_user_pk;
    refreshToken = state.data.data.refreshToken;
  } catch (error) {}

  const validate = () => {
    if (passwordNew === '') {
      dialogNoti('Vui lòng nhập mật khẩu mới!');
      return;
    }
    if (passwordNew.length < 6) {
      dialogNoti('Vui lòng nhập mật khẩu có ít nhất 6 ký tự!');
      return;
    }
    if (passwordConfirm === '') {
      dialogNoti('Vui lòng nhập mật khẩu xác nhận!');
      return;
    }

    if (passwordNew !== passwordConfirm) {
      dialogNoti('Xác nhận mật khẩu không trùng khớp!');
      return;
    }

    Alert.alert(
      'Cập nhật mật khẩu',
      'Xác nhận cập nhật mật khẩu?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                updatePass();
                // navigation.push('CheckLogin');
              } else {
                ShowError('No internet');
              }
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  function dialogNoti(text) {
    Alert.alert('Thông báo', text, [{text: 'Thoát'}], {
      cancelable: false,
    });
  }
  const refreshNewToken = obj => {
    axios
      .post(API + 'User/RefreshToken/', {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then(response => {
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.token,
            key: 'tokenLogin',
          }),
        );
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.refreshToken,
            key: 'refreshToken',
          }),
        );
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
        if (obj == 'updatePass') {
          updatePass();
        }
      })
      .catch(error => {
        if (error == 'AxiosError: Request failed with status code 400') {
          Alert.alert(
            'Thông báo',
            'Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            {cancelable: true},
          );
        }
        console.log(error);
      });
  };
  const updatePass = async () => {
    let pass_new = md5(passwordNew);
    sysFetch(
      API,
      {
        pro: 'UPDCFCP0010100',
        in_par: {
          p1_varchar2: user_name,
          p2_varchar2: pass_new,
          p3_varchar2: deviceId,
          p4_varchar2: deviceName,
        },
        out_par: {
          p1_varchar2: 'alert',
          p2_varchar2: 'output',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('updatePass');
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            if (rs.data.output === 'Y') {
              Alert.alert('Thông báo', rs.data.alert, [
                {
                  text: 'Xác nhận',
                  onPress: async () => {
                    await setTimeout(async () => {
                      await setLoad(false);
                      await navigation.push('Index');
                    }, 0);
                  },
                },
              ]);
            } else if (rs.data.output === 'N') {
              Alert.alert('Thông báo', rs.data.alert, [
                {
                  text: 'Thoát',
                  onPress: async () => {
                    await setLoad(false);
                  },
                },
              ]);
            }
          } else {
            ShowError('error');
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={() => RNRestart.Restart()}>
        Thay đổi mật khẩu
      </TVSHeader>

      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <ScrollView>
          <Block
            padding={10}
            backgroundColor={Color.white}
            margin={20}
            radius={10}>
            <Text color={Color.mainColor} size={18} fontFamily={'Roboto-Bold'}>
              Thay đổi mật khẩu
            </Text>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              alignCenter
              row
              backgroundColor={Color.inputBackgroundColor}>
              <Icon_pass />
              <TextInput
                flex
                height={55}
                fontFamily={'Roboto-Medium'}
                paddingLeft={15}
                placeholder={'Nhập mật khẩu mới'}
                autoCompleteType={'password'}
                placeholderTextColor={Color.grayPlahoder}
                secureTextEntry={eye1}
                value={passwordNew}
                onChangeText={text => setPasswordNew(text)}
              />
              <Button
                justifyCenter
                height={30}
                width={30}
                nextScreen={() => setEye1(!eye1)}>
                {eye1 ? <EyeOpen /> : <EyeClose />}
              </Button>
            </Block>
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              alignCenter
              row
              backgroundColor={Color.inputBackgroundColor}>
              <Icon_pass />
              <TextInput
                flex
                height={55}
                fontFamily={'Roboto-Medium'}
                paddingLeft={15}
                placeholder={'Xác nhận mật khẩu'}
                autoCompleteType={'password'}
                placeholderTextColor={Color.grayPlahoder}
                secureTextEntry={eye2}
                value={passwordConfirm}
                onChangeText={text => setPasswordConfirm(text)}
              />
              <Button
                justifyCenter
                height={30}
                width={30}
                nextScreen={() => setEye2(!eye2)}>
                {eye2 ? <EyeOpen /> : <EyeClose />}
              </Button>
            </Block>
          </Block>

          <Block flex justifyEnd alignCenter paddingBottom={8}>
            <TVSButton
              paddingHorizontal={50}
              onPress={() => validate()}
              icon={'check'}>
              Xác nhận
            </TVSButton>
          </Block>
        </ScrollView>
        {/* <CustomProgressBar visible={load} /> */}
      </Block>
    </Block>
  );
};
export default UpdatePass;
