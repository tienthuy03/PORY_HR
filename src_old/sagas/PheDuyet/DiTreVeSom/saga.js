import {takeLatest, put, delay} from 'redux-saga/effects';
import * as action from './action';
import fetchData from './fetchData';
import * as loading from '../../../services/redux/GlobalLoading/action';
function* done({
  payload: {token, machine_id, user_pk, p_from_date, p_to_date},
}) {
  try {
    const data = yield fetchData(
      token,
      machine_id,
      user_pk,
      p_from_date,
      p_to_date,
    );
    yield put(action.successSet(data));
  } catch (error) {
    yield put({
      type: action.failSet,
      payload: error,
    });
  }
}
export function* watchPheDuyetDiTreVeSom() {
  yield put(loading.ShowGlobalLoading);
  yield delay(500);
  yield takeLatest('PHE_DUYET_DI_TRE_VE_SOM', done);
  yield put(loading.HideGlobalLoading);
}
