import {
  FETCH_VPCC,
  FETCH_VPCC_SUCCESS,
  FETCH_VPCC_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchVPCCSaga({
  payload: {token, machine_id, userPK, p_fromMonth, p_toMonth},
}) {
  try {
    const dataVPCC = yield Api.fetchVPCCFromApi(
      token,
      machine_id,
      userPK,
      p_fromMonth,
      p_toMonth,
    );
    yield put({
      type: FETCH_VPCC_SUCCESS,
      payload: dataVPCC,
    });
  } catch (error) {
    yield put({
      type: FETCH_VPCC_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchVPCC() {
  yield takeLatest(FETCH_VPCC, fetchVPCCSaga);
}
