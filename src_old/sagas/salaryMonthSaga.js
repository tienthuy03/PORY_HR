import {
  FETCH_SALARY_MONTH,
  FETCH_SALARY_MONTH_SUCCESS,
  FETCH_SALARY_MONTH_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchSalaryMonthSaga({
  payload: {token, machine_id, user_pk, p_work_mon},
}) {
  try {
    const dataSalaryMonth = yield Api.fetchSalaryMonthFromApi(
      token,
      machine_id,
      user_pk,
      p_work_mon,
    );
    yield put({
      type: FETCH_SALARY_MONTH_SUCCESS,
      payload: dataSalaryMonth,
    });
  } catch (error) {
    yield put({
      type: FETCH_SALARY_MONTH_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchSalaryMonth() {
  yield takeLatest(FETCH_SALARY_MONTH, fetchSalaryMonthSaga);
}
