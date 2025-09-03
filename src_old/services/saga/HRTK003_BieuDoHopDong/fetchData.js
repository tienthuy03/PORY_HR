import {put, select, delay} from '@redux-saga/core/effects';
import Device from 'react-native-device-info';
import axios from 'axios';
import * as actionLoading from '../../redux/GlobalLoading/action';
import {Alert} from 'react-native';
import {
  HRTK003ChonPhongBan,
  HRTK003LayDanhSachPhongBanF,
  HRTK003LayDanhSachPhongBanS,
  HRTK003LayDuLieu,
  HRTK003LayDuLieuF,
  HRTK003LayDuLieuS,
} from '../../redux/HRTK003_BieuDoHopDong/action';
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
    pro: 'SELHRTK0030100',
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
    yield put(HRTK003LayDanhSachPhongBanS(rs.data.data));
    if (rs.data.data[0]) {
      yield put(HRTK003ChonPhongBan(rs.data.data[0]));
      yield put(HRTK003LayDuLieu());
    }
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(HRTK003LayDanhSachPhongBanF());
  }
  yield put(actionLoading.HideGlobalLoading);
}
function* fetchDuLieuHopDong() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const pie1 = {fill: 'rgb(132, 211,227)'};
  const pie2 = {fill: 'rgb(252, 181,79)'};
  const pie3 = {fill: 'rgb(17, 128,85)'};
  const pie4 = {fill: 'rgb(250, 100,95)'};
  yield put(actionLoading.ShowGlobalLoading);
  yield delay(500);
  const ChonPhongBan = yield select(
    state => state.HRTK003_BieuDoHopDongReducer.ChonPhongBan,
  );
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const param = {
    pro: 'SELHRTK0031100',
    in_par: {
      p1_varchar2: ChonPhongBan.code,
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
      switch (item.key) {
        case 1:
          temp.push({...item, svg: pie1});
          return;
        case 2:
          temp.push({...item, svg: pie2});
          return;
        case 3:
          temp.push({...item, svg: pie3});
          return;
        case 4:
          const amount =
            100 -
            rs.data.data[0].amount -
            rs.data.data[1].amount -
            rs.data.data[2].amount;
          temp.push({...item, amount, svg: pie4});
          return;
      }
    });
    yield put(HRTK003LayDuLieuS(temp));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(HRTK003LayDuLieuF());
  }
  yield put(actionLoading.HideGlobalLoading);
}
export {fetchDanhSachPhongBan, fetchDuLieuHopDong};
