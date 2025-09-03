import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import {action} from '../../redux/HRRE005_RaCong/action';
import {
  LayDanhSachLyDo,
  LayDanhSachRaCong,
  LayThongTinNguoiPheDuyet,
} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingHRRE0005() {
  // yield takeLatest(action.HRRE005_LOAD_LY_DO_RA_CONG, LoadLyDoRaCong);
  yield takeLatest(action.HRRE005_LOAD_DATA_RA_CONG, LoadDataRaCong);
}

function* LoadLyDoRaCong() {
  yield put(actionLoading.ShowGlobalLoading);
  yield call(LayDanhSachLyDo);
  // yield call(LayThongTinNguoiPheDuyet);
  yield delay(500);
  yield put(actionLoading.HideGlobalLoading);
}
function* LoadDataRaCong() {
  // yield put(actionLoading.ShowGlobalLoading);
  yield call(LayDanhSachRaCong);
  // yield put(actionLoading.HideGlobalLoading);
}
export default watchingHRRE0005;
