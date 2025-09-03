import {put, select, delay} from '@redux-saga/core/effects';
import Device from 'react-native-device-info';
import axios from 'axios';
import * as actionLoading from '../../redux/GlobalLoading/action';
import {Alert} from 'react-native';
import {
  HRTK004ChonPhongBan,
  HRTK004LayDanhSachPhongBanF,
  HRTK004LayDanhSachPhongBanS,
  HRTK004LayDuLieu,
  HRTK004LayDuLieuF,
  HRTK004LayDuLieuS,
} from '../../redux/HRTK004_BieuDoLaoDong/action';
const randomRGB = () => {
  //Color Generation Function
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return `rgb(${red}, ${green}, ${blue})`;
};
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
    pro: 'SELHRTK0040100',
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
    yield put(HRTK004LayDanhSachPhongBanS(rs.data.data));

    if (rs.data.data[0]) {
      yield put(HRTK004ChonPhongBan(rs.data.data[0]));
      yield put(HRTK004LayDuLieu());
    }
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(HRTK004LayDanhSachPhongBanF());
  }
  yield put(actionLoading.HideGlobalLoading);
}
function* fetchDuLieuHopDong() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  yield put(actionLoading.ShowGlobalLoading);
  yield delay(500);
  const ChonPhongBan = yield select(
    state => state.HRTK004_BieuDoLaoDongReducer.ChonPhongBan,
  );
  const ChonNgay = yield select(
    state => state.HRTK004_BieuDoLaoDongReducer.ChonNgay,
  );
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const user_id = yield select(state => state.loginReducers.user_name);
  const param = {
    pro: 'SELHRTK0041100',
    in_par: {
      p1_varchar2: ChonPhongBan.code,
      p2_varchar2: ChonNgay,
      p3_varchar2: user_id,
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
    let temp = [];
    rs.data.data.map(item => {
      temp.push({
        ...item,
        color: randomRGB(),
      });
    });
    yield put(HRTK004LayDuLieuS(temp));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(HRTK004LayDuLieuF());
  }
  yield put(actionLoading.HideGlobalLoading);
}
export {fetchDanhSachPhongBan, fetchDuLieuHopDong};
