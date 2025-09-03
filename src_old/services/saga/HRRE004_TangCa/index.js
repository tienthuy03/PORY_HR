import {call, delay, put, takeLatest} from '@redux-saga/core/effects';
import * as actionLoading from '../../redux/GlobalLoading/action';
import {action} from '../../redux/HRRE004_TangCa/action';
import {LayDanhSachTangCa} from './fetchData';
function* watchingHRRE0004() {
  yield takeLatest(action.HRRE004_LOAD_DATA_TANG_CA, LoadDataTangCa);
}
function* LoadDataTangCa() {
  yield call(LayDanhSachTangCa);
}
export default watchingHRRE0004;
