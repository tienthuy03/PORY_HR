import {put, select} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import * as action from '../../redux/HRTI005_DangKyKhuonMatHIK/action';

function* LayDanhSachNhanVien() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const org_pk = yield select(
    state => state.HRTI005_DangKyKhuonMatHIKReducer.ChonPhongBan.code,
  );
  const param = {
    pro: 'SELHRTI0041100',
    in_par: {
      p1_varchar2: org_pk,
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
    yield put(action.HRTI005LoadDanhSachNhanVienS([]));
    yield put(action.HRTI005LoadDanhSachNhanVienS(rs.data.data));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(action.HRTI005LoadDanhSachNhanVienF());
  }
}

function* LayDanhSachPhongBan() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const {tes_user_pk} = yield select(state => state.loginReducers.data.data);
  const org_pk = yield select(
    state => state.HRTI005_DangKyKhuonMatHIKReducer.ChonPhongBan.code,
  );
  const param = {
    pro: 'SELHRTI0040100',
    in_par: {
      p1_varchar2: tes_user_pk,
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
    if (org_pk === 0) {
      yield put(
        action.HRTI005ChonPhongBan({
          code: rs.data.data[0].code,
          code_nm: rs.data.data[0].code_nm,
        }),
      );
    }
    yield put(action.HRTI005LoadDuLieuPhongBanS(rs.data.data));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(action.HRTI005LoadDuLieuPhongBanF());
  }
}

function* CheckAllEmployee() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const {CheckAll} = yield select(
    state => state.HRTI005_DangKyKhuonMatHIKReducer,
  );
  const {DanhSachNhanVien} = yield select(
    state => state.HRTI005_DangKyKhuonMatHIKReducer,
  );
  let arrTemp = [];
  if (CheckAll) {
    DanhSachNhanVien.map(x => {
      x.is_registed = 'Y';
      arrTemp.push(x);
    });
  } else {
    DanhSachNhanVien.map(x => {
      x.is_registed = 'N';
      arrTemp.push(x);
    });
  }
  yield put(action.HRTI005LoadDanhSachNhanVienS(arrTemp));
}
function* LayDanhSachMayChamCong() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const param = {
    pro: 'SELHRTI0042100',
    in_par: {},
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
      temp.push({...item, is_selected: false});
    });
    yield put(action.HRTI005LoadDanhSachMayChamCongS(temp));
  } else {
    Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    yield put(action.HRTI005LoadDanhSachMayChamCongF());
  }
}
export {
  LayDanhSachNhanVien,
  LayDanhSachPhongBan,
  CheckAllEmployee,
  LayDanhSachMayChamCong,
};
