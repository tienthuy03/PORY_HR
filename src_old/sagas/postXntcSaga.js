import {
  POST_XNTC,
  POST_XNTC_SUCCESS,
  POST_XNTC_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* postXntc({
  payload: {
    token,
    machine_id,
    p_action,
    P_PK_TABLE,
    P_OTXN_NLD,
    P_REASON_NLD,
    p_start_time1,
    p_end_time1,
    p_meal_1,
    p_start_time2,
    p_end_time2,
    p_meal_2,
    P_ARPPOVE_BY_PK,
    P_WORK_DT,
    P_THR_EMP_PK,
    p_crt_by,
    p_empApproved2,
  },
}) {
  try {
    const responsePost = yield Api.postXntcFromApi(
      token,
      machine_id,
      p_action,
      P_PK_TABLE,
      P_OTXN_NLD,
      P_REASON_NLD,
      p_start_time1,
      p_end_time1,
      p_meal_1,
      p_start_time2,
      p_end_time2,
      p_meal_2,
      P_ARPPOVE_BY_PK,
      P_WORK_DT,
      P_THR_EMP_PK,
      p_crt_by,
      p_empApproved2,
    );
    yield put({
      type: POST_XNTC_SUCCESS,
      payload: responsePost,
    });
  } catch (error) {
    yield put({
      type: POST_XNTC_FAILED,
      payload: error,
    });
  }
}
export function* watchPostXntc() {
  yield takeLatest(POST_XNTC, postXntc);
}
