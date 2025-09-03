import {
  FETCH_NPD_FAILED,
  FETCH_NPD,
  FETCH_NPD_SUCCESS,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchNpd({payload: {token, machine_id, org_pk}}) {
  try {
    const dataNpd = yield Api.fetchNpdFromApi(token, machine_id, org_pk);
    yield put({
      type: FETCH_NPD_SUCCESS,
      payload: dataNpd,
    });
  } catch (error) {
    yield put({
      type: FETCH_NPD_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchNpd() {
  yield takeLatest(FETCH_NPD, fetchNpd);
}
