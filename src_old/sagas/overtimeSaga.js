import {
  FETCH_PD_TC,
  FETCH_PDTC_SUCCESS,
  FETCH_PDTC_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchOverTimeSaga({
  payload: {
    token,
    machine_id,
    user_pk,
    p_fromdate,
    p_todate,
    emp_id,
    full_name,
  },
}) {
  try {
    const dataOvertime = yield Api.fetchPDTCFromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      emp_id,
      full_name,
    );
    yield put({
      type: FETCH_PDTC_SUCCESS,
      payload: dataOvertime,
    });
  } catch (error) {
    yield put({
      type: FETCH_PDTC_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchOvertime() {
  yield takeLatest(FETCH_PD_TC, fetchOverTimeSaga);
}
