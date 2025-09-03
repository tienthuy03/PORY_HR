import {
  FETCH_DKVV2,
  FETCH_DKVV2_SUCCESS,
  FETCH_DKVV2_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../services/redux/GlobalLoading/action';

//Get Movie
function* fetchDkvV2({
  payload: {token, machine_id, user_pk, p_fromdate, p_todate, full_name},
}) {
  try {
    yield put(ShowGlobalLoading);
    const dataDkvV2 = yield Api.fetchDkvV2FromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      full_name,
    );

    yield put({
      type: FETCH_DKVV2_SUCCESS,
      payload: dataDkvV2,
    });
  } catch (error) {
    yield put({
      type: FETCH_DKVV2_FAILED,
      payload: error,
    });
  } finally {
    yield put(HideGlobalLoading);
  }
}
export function* watchFetchDkvV2() {
  yield takeLatest(FETCH_DKVV2, fetchDkvV2);
}
