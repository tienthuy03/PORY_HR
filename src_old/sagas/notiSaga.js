import {
  FETCH_NOTI_FAILED,
  FETCH_NOTI_SUCCESS,
  FETCH_NOTI,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchNoti({payload: {token, deviceId, thr_emp_pk, full_name}}) {
  try {
    const dataNoti = yield Api.fetchNotiFromApi(
      token,
      deviceId,
      thr_emp_pk,
      full_name,
    );
    yield put({
      type: FETCH_NOTI_SUCCESS,
      payload: dataNoti,
    });
  } catch (error) {
    yield put({
      type: FETCH_NOTI_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchNoti() {
  yield takeLatest(FETCH_NOTI, fetchNoti);
}
