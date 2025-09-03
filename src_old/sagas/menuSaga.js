import {
  FETCH_MENU,
  FETCH_MENU_SUCCESS,
  FETCH_MENU_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchMenu({
  payload: {token, machine_id, tes_user_pk, thr_emp_pk, user_name},
}) {
  try {
    const dataMenu = yield Api.fetchMenuFromApi(
      token,
      machine_id,
      tes_user_pk,
      thr_emp_pk,
      user_name,
    );
    yield put({
      type: FETCH_MENU_SUCCESS,
      payload: dataMenu,
    });
  } catch (error) {
    yield put({
      type: FETCH_MENU_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchMenu() {
  yield takeLatest(FETCH_MENU, fetchMenu);
}
