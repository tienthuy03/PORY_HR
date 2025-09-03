import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import * as action from '../../redux/System/action';
// import {GetData, GetInfo, GetQues} from './fetchData';
import * as actionLoading from '../../redux/GlobalLoading/action';
import UpdateFlagNotification from './fetchData';
function* watchingSettingChange() {
  yield takeLatest(action.SET_RECEIVE_NOTIFICATION, HandleReceiveNofication);
}

function* HandleReceiveNofication() {
  yield put(actionLoading.ShowGlobalLoading);
  yield delay(500);
  yield call(UpdateFlagNotification);
  yield put(actionLoading.HideGlobalLoading);
}
export default watchingSettingChange;
