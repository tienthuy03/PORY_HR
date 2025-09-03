import {call, delay, put, takeLatest} from '@redux-saga/core/effects';
import * as actionLoading from '../../redux/GlobalLoading/action';
import {action} from '../../redux/HRRE006_CongTac/action';
import {LayDanhSachCongTac} from './fetchData';
function* watchingHRRE0006() {
  yield takeLatest(action.HRRE006_LOAD_DATA_CONG_TAC, LoadDataCongTac);
}
function* LoadDataCongTac() {
  yield call(LayDanhSachCongTac);
}
export default watchingHRRE0006;
