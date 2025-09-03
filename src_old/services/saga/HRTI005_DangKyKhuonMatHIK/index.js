import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import * as action from '../../redux/HRTI005_DangKyKhuonMatHIK/action';
import {
  CheckAllEmployee,
  LayDanhSachNhanVien,
  LayDanhSachPhongBan,
  LayDanhSachMayChamCong,
} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingHRTI005() {
  yield takeLatest(action.HRTI005_LOAD_DANH_SACH_NHAN_VIEN, LoadData);
  yield takeLatest(action.HRTI005_SET_CHECK_ALL, CheckAll);
}
function* CheckAll() {
  yield call(CheckAllEmployee);
}
function* LoadData({rf}) {
  if (rf) {
    yield put(action.HRTI05OnRefresh(true));
  } else {
    yield put(actionLoading.ShowGlobalLoading);
  }
  yield call(LayDanhSachMayChamCong);
  yield call(LayDanhSachPhongBan);
  yield call(LayDanhSachNhanVien);
  yield delay(500);
  if (rf) {
    yield put(action.HRTI005OnRefresh(false));
  } else {
    yield put(actionLoading.HideGlobalLoading);
  }
}
export default watchingHRTI005;
