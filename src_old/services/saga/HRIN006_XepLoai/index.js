import {
  call,
  delay,
  takeEvery,
  takeLatest,
  put,
} from '@redux-saga/core/effects';
import {HRIN006_LOAD_DATA} from '../../redux/HRIN006_XepLoai/action';
import {LoadDataHRIN006} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingHRIN006() {
  yield takeLatest(HRIN006_LOAD_DATA, LoadData);
}

function* LoadData({year}) {
  yield call(LoadDataHRIN006, year);
}
export default watchingHRIN006;
