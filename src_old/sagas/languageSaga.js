import {
  FETCH_LANGUAGE,
  FETCH_LANGUAGE_SUCCESS,
  FETCH_LANGUAGE_FAILED,
} from '../actions/actionType';
import {put, takeLatest} from 'redux-saga/effects';
import {Api} from './Api';

//Get Movie
function* fetchLanguage({payload: {token, machine_id}}) {
  try {
    const dataLanguage = yield Api.fetchLanguageFromApi(token, machine_id);
    yield put({
      type: FETCH_LANGUAGE_SUCCESS,
      payload: dataLanguage,
    });
  } catch (error) {
    yield put({
      type: FETCH_LANGUAGE_FAILED,
      payload: error,
    });
  }
}
export function* watchFetchLanguage() {
  yield takeLatest(FETCH_LANGUAGE, fetchLanguage);
}
