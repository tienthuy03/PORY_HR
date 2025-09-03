import {delay, put, select, call, fork} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* UpdateFlagNotification() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  yield put(actionLoading.ShowGlobalLoading);
  yield delay(50);
  const p_emp_pk = yield select(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const p_mbi_noti_yn = yield select(
    state => state.SystemReducer.receiveNotification,
  );
  const param = {
    pro: 'UPDSYSY0010100',
    in_par: {
      p1_varchar2: p_emp_pk,
      p2_varchar2: p_mbi_noti_yn,
    },
    out_par: {
      p1_varchar2: 'data',
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
    .then(rs => {
      return rs.data;
    });
  if (rs.results === 'S') {
  } else {
    Alert.alert(
      'Thông báo',
      'Cập nhật thất bại.\n Xin liên hệ với nhà phát triển ứng dụng.',
      [{text: 'Xác nhận'}],
    );
  }
  yield put(actionLoading.HideGlobalLoading);
}
export default UpdateFlagNotification;
