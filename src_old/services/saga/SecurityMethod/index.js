import {call, delay, fork, takeLatest,put} from '@redux-saga/core/effects';
import {action} from '../../redux/SecurityMethod/action';
import {GetData, GetInfo, GetQues} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
function* watchingSecuriryMethod() {
  yield takeLatest(action.SM_LOAD_DATA, LoadData);
}

function* LoadData() {
  yield put(actionLoading.ShowGlobalLoading);
  yield call(GetInfo);
  // yield call(GetQues);
  yield delay(500);
  yield put(actionLoading.HideGlobalLoading);
}

export default watchingSecuriryMethod;
