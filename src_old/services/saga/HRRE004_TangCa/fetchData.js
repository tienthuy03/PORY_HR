import {put, select} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import ShowError from '../../errors';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../redux/GlobalLoading/action';
import * as action from '../../redux/HRRE004_TangCa/action';

function* LayDanhSachTangCa() {
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
      state => state.HRRE004_TangCaReducer.DSNgayBatDau,
    );
    const endDate = yield select(
      state => state.HRRE004_TangCaReducer.DSNgayKetThuc,
    );
    const param = {
      pro: 'SELHRRE0040100',
      in_par: {
        p1_varchar2: emp_pk,
        p2_varchar2: startDate,
        p3_varchar2: endDate,
      },
      out_par: {
        p1_sys: 'data',
        p2_sys: 'approve_data',
        p4_sys: 'approve_person',
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
      yield put(action.HRRE004LoadDataTangCaS(rs.data.data));
      yield put(action.HRRE004TinhTrangPheDuyet(rs.data.approve_data));
      yield put(action.HRRE004DSNguoiPheDuyet(rs.data.approve_person));
      yield put(
        action.HRRE004SetLimitDate({
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
export {LayDanhSachTangCa};
