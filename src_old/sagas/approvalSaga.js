import {
  FETCH_PDDT_VS,
  FETCH_PDDT_VS_SUCCESS,
  FETCH_PDDT_VS_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchApprovalSaga({
  payload: {token, machine_id, user_pk, p_fromdate, p_todate, full_name},
}) {
  try {
    const dataApproval = yield Api.fetchPddt_vsFromApi(
      token,
      machine_id,
      user_pk,
      p_fromdate,
      p_todate,
      full_name,
    );
    yield put({
      type: FETCH_PDDT_VS_SUCCESS,
      payload: dataApproval,
    });
  } catch (error) {
    yield put({
      type: FETCH_PDDT_VS_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchApproval() {
  yield takeLatest(FETCH_PDDT_VS, fetchApprovalSaga);
}
