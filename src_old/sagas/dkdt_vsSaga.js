import {
  FETCH_DKDT_VS,
  FETCH_DKDT_VS_SUCCESS,
  FETCH_DKDT_VS_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchDkdt_vsSaga({payload: {token, machine_id, full_name}}) {
  try {
    const dataAttendance = yield Api.fetchDkdt_vsFromApi(
      token,
      machine_id,
      full_name,
    );
    yield put({
      type: FETCH_DKDT_VS_SUCCESS,
      payload: dataAttendance,
    });
  } catch (error) {
    yield put({
      type: FETCH_DKDT_VS_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchDkdt_vs() {
  yield takeLatest(FETCH_DKDT_VS, fetchDkdt_vsSaga);
}
