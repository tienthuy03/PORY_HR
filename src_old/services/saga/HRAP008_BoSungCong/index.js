import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import {action} from '../../redux/HRAP008_BoSungCong/action';
import {LoadData} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingHRAP0008() {
  yield takeLatest(action.HRAP008_LOAD_DATA, InitialData);
}

function* InitialData() {
  yield put(actionLoading.ShowGlobalLoading);
  yield call(LoadData);
  yield delay(500);
  yield put(actionLoading.HideGlobalLoading);
}
export default watchingHRAP0008;
