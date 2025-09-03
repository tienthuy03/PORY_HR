import {takeLatest} from '@redux-saga/core/effects';
import {HRRE008_LOAD_DATA} from '../../redux/HRRE008_BoSungCong/action';
import {LoadData} from './fetchData';
function* watchingHRRE008() {
  yield takeLatest(HRRE008_LOAD_DATA, LoadData);
}

export default watchingHRRE008;
