import {delay, put, select, call, fork} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import {
  HRAP008LoadDataS,
  HRAP008SetApproveInfo,
  HRAP008_SET_APPROVE_INFO,
} from '../../redux/HRAP008_BoSungCong/action';
function* LoadData() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const emp_pk = yield select(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const startDate = yield select(
    state => state.HRAP008_BoSungCongReducer.NgayBatDau,
  );
  const endDate = yield select(
    state => state.HRAP008_BoSungCongReducer.NgayKetThuc,
  );
  const param = {
    pro: 'SELHRAP0080101',
    in_par: {
      p1_varchar2: emp_pk,
      p2_varchar2: startDate,
      p3_varchar2: endDate,
    },
    out_par: {
      p1_sys: 'data',
      p2_sys: 'approve_info',
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
    yield put(HRAP008LoadDataS(rs.data.data));
    yield put(HRAP008SetApproveInfo(rs.data.approve_info));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
  }
}
export {LoadData};
