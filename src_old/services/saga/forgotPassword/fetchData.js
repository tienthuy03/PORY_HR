import {delay, select, put} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import ShowError from '../../errors';
import {fpSetInformation} from '../../redux/ForgotPassword/action';
import {sendMail} from '../../../config/Fetch_data';
import RNRestart from 'react-native-restart';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* GetMethodForgotPassword({username, email, deviceName, deviceId}) {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  try {
    yield put(actionLoading.ShowGlobalLoading);
    const rs = yield axios
      .post(
        URL +
          `User/ResetPasswordMBI?user_id=${username}&email=${email}&device_id=${deviceId}&device_name=${deviceName}`,
        null,
      )
      .then(res => {
        return res.data;
      });
    if (rs.result === 'S') {
      Alert.alert('Thông báo', rs.content, [
        {
          text: 'Đóng',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ]);
    } else {
      Alert.alert('Thông báo', rs.content, [{text: 'Đóng'}]);
    }
  } catch (error) {
    ShowError(error);
  } finally {
    yield delay(400);
    yield put(actionLoading.HideGlobalLoading);
  }
}
export {GetMethodForgotPassword};
