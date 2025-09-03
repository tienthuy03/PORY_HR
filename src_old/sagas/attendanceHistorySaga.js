import {
  FETCH_ATTENDANCE_HISTORY,
  FETCH_ATTENDANCE_HISTORY_FAILED,
  FETCH_ATTENDANCE_HISTORY_SUCCESS,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchAttendanceSaga({
  payload: {token, machine_id, user_pk, p_fromdate, p_todate, full_name},
}) {
  try {
    const dataAttendance = yield Api.fetchAttendanceHistoryFromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      full_name,
    );
    yield put({
      type: FETCH_ATTENDANCE_HISTORY_SUCCESS,
      payload: dataAttendance,
    });
  } catch (error) {
    yield put({
      type: FETCH_ATTENDANCE_HISTORY_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchAttendance() {
  yield takeLatest(FETCH_ATTENDANCE_HISTORY, fetchAttendanceSaga);
}
