import {put, select} from '@redux-saga/core/effects';
import axios from 'axios';

import Device from 'react-native-device-info';
import * as action from '../../redux/HRRE005_RaCong/action';
import ShowError from '../../errors';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../redux/GlobalLoading/action';
function* LayDanhSachLyDo() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const org_pk = yield select(state => state.loginReducers.data.data.org_pk);
  const param = {
    pro: 'SELHRRE0050101',
    in_par: {
      p1_varchar2: org_pk,
    },
    out_par: {
      p1_sys: 'lydo',
      p2_sys: 'thongtinnguoipheduyet',
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
    yield put(action.HRRE005LoadLyDoRaCongS(rs.data.lydo));
    yield put(action.HRRE005DSNguoiPheDuyet(rs.data.thongtinnguoipheduyet));
  } else {
    ShowError('fail');
    yield put(action.HRRE005LoadLyDoRaCongF());
  }
}

function* LayThongTinNguoiPheDuyet() {
  const URL = yield select(state => state.SysConfigReducer.API_URL);
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const org_pk = yield select(state => state.loginReducers.data.data.org_pk);
  const param = {
    pro: 'SELHRRE0052100',
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
    let TBP = [];
    let TT = [];
    rs.data.data.map(item => {
      if (item.level_type === '1') {
        TT.push(item);
      } else {
        TBP.push(item);
      }
    });
    yield put(action.HRRE005ChonToTruong(TT[0]));
    yield put(action.HRRE005ChonTruongBoPhan(TBP[0]));
    yield put(action.HRRE005SetDanhSachToTruong(TT));
    yield put(action.HRRE005SetDanhSachTruongBoPhan(TBP));
  } else {
    ShowError('fail');
    yield put(action.HRRE005LoadThongTinNguoiPheDuyetF());
  }
}

function* LayDanhSachRaCong() {
  try {
    yield put(ShowGlobalLoading);
    const URL = yield select(state => state.SysConfigReducer.API_URL);
    const tokenLogin = yield select(
      state => state.loginReducers.data.data.tokenLogin,
    );
    const emp_pk = yield select(
      state => state.loginReducers.data.data.thr_emp_pk,
    );
    const startDate = yield select(
      state => state.HRRE005_RaCongReducer.DSNgayBatDau,
    );
    const endDate = yield select(
      state => state.HRRE005_RaCongReducer.DSNgayKetThuc,
    );
    const param = {
      pro: 'SELHRRE0050101',
      in_par: {
        p1_varchar2: emp_pk,
        p2_varchar2: startDate,
        p3_varchar2: endDate,
      },
      out_par: {
        p1_sys: 'data',
        p2_sys: 'approve_data',
        p3_sys: 'type',
        p4_sys: 'approve_person',
        p5_sys: 'veviec',
        p6_varchar2: 'note',
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
      yield put(action.HRRE005LoadDataRaCongS(rs.data.data));
      yield put(action.HRRE005TinhTrangPheDuyet(rs.data.approve_data));
      yield put(action.HRRE005LoadLyDoRaCongS(rs.data.type));
      yield put(action.HRRE005DSNguoiPheDuyet(rs.data.approve_person));
      yield put(action.HRRE005SetVeViec(rs.data.veviec));
      yield put(
        action.HRRE005SetLimitDate({
          note: rs.data.note,
        }),
      );
    } else {
      ShowError('fail');
    }
  } catch (error) {
  } finally {
    yield put(HideGlobalLoading);
  }
}
export {LayDanhSachLyDo, LayDanhSachRaCong, LayThongTinNguoiPheDuyet};
