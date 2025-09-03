import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import * as action from '../../redux/HRTI004_DangKyKhuonMatFe/action';
import {
  CheckAllEmployee,
  LayDanhSachNhanVien,
  LayDanhSachPhongBan,
  LayDanhSachMayChamCong,
} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingHRTI004() {
  yield takeLatest(action.HRTI004_LOAD_DANH_SACH_NHAN_VIEN, LoadData);
  yield takeLatest(action.HRTI004_SET_CHECK_ALL, CheckAll);
}
function* CheckAll() {
  yield call(CheckAllEmployee);
}
function* LoadData({rf}) {
  if (rf) {
    yield put(action.HRTI004OnRefresh(true));
  } else {
    yield put(actionLoading.ShowGlobalLoading);
  }
  yield call(LayDanhSachMayChamCong);
  yield call(LayDanhSachPhongBan);
  yield call(LayDanhSachNhanVien);
  yield delay(500);
  if (rf) {
    yield put(action.HRTI004OnRefresh(false));
  } else {
    yield put(actionLoading.HideGlobalLoading);
  }
}
export default watchingHRTI004;
