import {
  FETCH_ABSENCE_INFORMATION,
  FETCH_ABSENCE_INFORMATION_SUCCESS,
  FETCH_ABSENCE_INFORMATION_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchAbsenceInforSaga({
  payload: {token, machine_id, user_pk, p_fromdate, p_todate, full_name},
}) {
  try {
    const dataAbsence = yield Api.fetchAbsenceInforFromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      full_name,
    );
    yield put({
      type: FETCH_ABSENCE_INFORMATION_SUCCESS,
      payload: dataAbsence,
    });
  } catch (error) {
    yield put({
      type: FETCH_ABSENCE_INFORMATION_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchAbsenceInfor() {
  yield takeLatest(FETCH_ABSENCE_INFORMATION, fetchAbsenceInforSaga);
}
