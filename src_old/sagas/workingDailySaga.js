import {
  FETCH_WORKING_DAILY,
  FETCH_WORKING_DAILY_SUCCESS,
  FETCH_WORKING_DAILY_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchWorkingDailySaga({
  payload: {token, machine_id, userPK, fullname, p_fromdate, p_todate},
}) {
  try {
    const dataWorkingDaily = yield Api.fetchWorkingDailyFromApi(
      token,
      machine_id,
      userPK,
      fullname,
      p_fromdate,
      p_todate,
    );
    yield put({
      type: FETCH_WORKING_DAILY_SUCCESS,
      payload: dataWorkingDaily,
    });
  } catch (error) {
    yield put({
      type: FETCH_WORKING_DAILY_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchWorkingDaily() {
  yield takeLatest(FETCH_WORKING_DAILY, fetchWorkingDailySaga);
}
