import {
  FETCH_XNTC,
  FETCH_XNTC_SUCCESS,
  FETCH_XNTC_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../services/redux/GlobalLoading/action';

function* fetchXntc({
  payload: {token, machine_id, user_pk, p_fromdate, p_todate, version, crt_by},
}) {
  try {
    yield put(ShowGlobalLoading);
    const dataXntc = yield Api.fetchXntcFromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      version,
      crt_by,
    );
    yield put({
      type: FETCH_XNTC_SUCCESS,
      payload: dataXntc,
    });
  } catch (error) {
    yield put({
      type: FETCH_XNTC_FAILED,
      payload: error,
    });
  } finally {
    yield put(HideGlobalLoading);
  }
}
export function* watchFetchXntc() {
  yield takeLatest(FETCH_XNTC, fetchXntc);
}
