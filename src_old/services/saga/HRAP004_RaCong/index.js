import {
  call,
  delay,
  takeEvery,
  takeLatest,
  put,
} from '@redux-saga/core/effects';
import {action} from '../../redux/HRAP004_RaCong/action';
import {LayDanhSachRaCong, UpdateApprove} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingHRAP004() {
  yield takeLatest(action.HRAP004_LOAD_DATA_RA_CONG, LoadDataRaCong);
  yield takeEvery(action.HRAP004_UPDATE_APPROVE_STATUS, UpdateApprove);
}

function* LoadDataRaCong() {
  yield put(actionLoading.ShowGlobalLoading);
  yield call(LayDanhSachRaCong);
  yield delay(500);
  yield put(actionLoading.HideGlobalLoading);
}
export default watchingHRAP004;
