import {delay, put, select, call, fork} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import * as action from '../../redux/HRAP004_RaCong/action';
import DeviceInfo from 'react-native-device-info';
import {HRIN006SetData} from '../../redux/HRIN006_XepLoai/action';
import ShowError from '../../errors';
function* LoadDataHRIN006(year) {
  try {
    const URL = yield select(state => state.SysConfigReducer.API_URL);
    const tokenLogin = yield select(
      state => state.loginReducers.data.data.tokenLogin,
    );
    const emp_pk = yield select(
      state => state.loginReducers.data.data.thr_emp_pk,
    );
    const param = {
      pro: 'SELHRIN0060100',
      in_par: {
        p1_varchar2: emp_pk,
        p2_varchar2: year,
      },
      out_par: {
        p1_sys: 'data',
      },
      token: 'tvs',
      machine_id: Device.getUniqueId(),
    };
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
      },
    };
    const rs = yield axios
      .post(URL + 'Exec/MOBILE', param, axiosConfig)
      .then(res => {
        return res.data;
      });
    if (rs.results === 'S') {
      yield put(HRIN006SetData(rs.data.data));
    } else {
      Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    }
  } catch (err) {
    ShowError(err.toString());
  }
}
export {LoadDataHRIN006};
