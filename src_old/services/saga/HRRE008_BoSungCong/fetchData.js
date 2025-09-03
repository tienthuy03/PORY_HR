import {put, select, delay} from '@redux-saga/core/effects';
import axios from 'axios';
import {Alert} from 'react-native';
import {
  HRRE008LoadDataSS,
  HRRE008SetDSLyDo,
  HRRE008SetDSNguoiPheDuyet,
  HRRE008SetDSPheDuyet,
  HRRE008SetLimitDate,
} from '../../redux/HRRE008_BoSungCong/action';
import Device from 'react-native-device-info';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../redux/GlobalLoading/action';
function* LoadData() {
  try {
    yield put(ShowGlobalLoading);
    const URL = yield select(state => state.SysConfigReducer.API_URL);
    const startDate = yield select(
      state => state.HRRE008_BoSungCongReducer.StartDate,
    );
    const endDate = yield select(
      state => state.HRRE008_BoSungCongReducer.EndDate,
    );
    const token = yield select(
      state => state.loginReducers.data.data.tokenLogin,
    );
    const emp_pk = yield select(
      state => state.loginReducers.data.data.thr_emp_pk,
    );
    const rs = yield axios
      .post(
        URL + 'Exec/MOBILE',
        {
          pro: 'SELHRRE0080101',
          in_par: {
            p1_varchar2: emp_pk,
            p2_varchar2: startDate,
            p3_varchar2: endDate,
          },
          out_par: {
            p1_sys: 'data',
            p2_sys: 'status',
            p3_sys: 'approve',
            p4_sys: 'reason',
            p5_varchar2: 'limit_reg_date',
            p6_varchar2: 'note',
          },
          token: 'tvs',
          machine_id: Device.getUniqueId(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(rs => {
        return rs.data;
      });
    if (rs.results === 'S') {
      yield put(HRRE008SetDSNguoiPheDuyet(rs.data.approve));
      yield put(HRRE008SetDSPheDuyet(rs.data.status));
      yield put(HRRE008LoadDataSS(rs.data.data));
      yield put(HRRE008SetDSLyDo(rs.data.reason));
      yield put(
        HRRE008SetLimitDate({
          limit_reg_date: rs.data.limit_reg_date,
          note: rs.data.note,
        }),
      );
    } else {
      Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    }
  } catch (error) {
  } finally {
    yield put(HideGlobalLoading);
  }
}
export {LoadData};
