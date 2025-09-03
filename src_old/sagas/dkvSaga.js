import {
  FETCH_DKV,
  FETCH_DKV_SUCCESS,
  FETCH_DKV_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../services/redux/GlobalLoading/action';

//Get Movie
function* fetchDkv({
  payload: {token, machine_id, user_pk, p_fromdate, p_todate, full_name},
}) {
  try {
    yield put(ShowGlobalLoading);
    const dataDkv = yield Api.fetchDkvFromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      full_name,
    );

    yield put({
      type: FETCH_DKV_SUCCESS,
      payload: dataDkv,
    });
  } catch (error) {
    yield put({
      type: FETCH_DKV_FAILED,
      payload: error,
    });
  } finally {
    yield put(HideGlobalLoading);
  }
}
export function* watchFetchDkv() {
  yield takeLatest(FETCH_DKV, fetchDkv);
}
