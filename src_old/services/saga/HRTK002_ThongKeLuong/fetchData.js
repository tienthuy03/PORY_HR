import {delay, put, select} from '@redux-saga/core/effects';
import axios from 'axios';
import {Alert} from 'react-native';
import Device from 'react-native-device-info';
import * as actionLoading from '../../redux/GlobalLoading/action';
import {
  HRTK002ChonPhongBan,
  HRTK002LayDanhSachPhongBanS,
  HRTK002LayDuLieu,
  HRTK002LayDuLieuF,
  HRTK002LayDuLieuS,
} from '../../redux/HRTK002_ThongKeLuong/action';
function* fetchDanhSachPhongBan() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  yield put(actionLoading.ShowGlobalLoading);
  yield delay(500);
  const userpk = yield select(
    state => state.loginReducers.data.data.tes_user_pk,
  );
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const param = {
    pro: 'SELHRTK0020100',
    in_par: {
      p1_varchar2: userpk,
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
    .then(rs => {
      return rs.data;
    });
  if (rs.results === 'S') {
    yield put(HRTK002LayDanhSachPhongBanS(rs.data.data));
    if (rs.data.data[0]) {
      yield put(HRTK002ChonPhongBan(rs.data.data[0]));
      yield put(HRTK002LayDuLieu());
    }
  }
  yield put(actionLoading.HideGlobalLoading);
}
function* fetchDuLieuLuong() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  yield put(actionLoading.ShowGlobalLoading);
  yield delay(500);
  const ChonPhongBan = yield select(
    state => state.HRTK002_ThongKeLuongReducer.ChonPhongBan,
  );
  const ChonNam = yield select(
    state => state.HRTK002_ThongKeLuongReducer.ChonNam,
  );
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const userId = yield select(state => state.loginReducers.user_name);
  const param = {
    pro: 'SELHRTK0021100',
    in_par: {
      p1_varchar2: ChonPhongBan.code,
      p2_varchar2: ChonNam,
      p3_varchar2: userId,
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
    .then(rs => {
      return rs.data;
    });
  if (rs.results === 'S') {
    yield put(HRTK002LayDuLieuS(rs.data.data));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(HRTK002LayDuLieuF());
  }
  yield put(actionLoading.HideGlobalLoading);
}
export {fetchDanhSachPhongBan, fetchDuLieuLuong};
