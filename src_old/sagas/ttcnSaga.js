import {
  FETCH_TTCN,
  FETCH_TTCN_SUCCESS,
  FETCH_TTCN_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchTtcn({payload: {token, machine_id, userPK, fullname}}) {
  try {
    const dataTtcn = yield Api.fetchTtcnFromApi(
      token,
      machine_id,
      userPK,
      fullname,
    );
    yield put({
      type: FETCH_TTCN_SUCCESS,
      payload: dataTtcn,
    });
  } catch (error) {
    yield put({
      type: FETCH_TTCN_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchTtcn() {
  yield takeLatest(FETCH_TTCN, fetchTtcn);
}
