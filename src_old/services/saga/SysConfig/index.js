import {call, takeLatest} from '@redux-saga/core/effects';
import {globalstorage} from '../../../services/globalstorage';
import {CONFIG_API_URL} from '../../redux/SysConfig/action';
function* watchingSysConfig() {
  yield takeLatest(CONFIG_API_URL, RunConfig);
}

function* RunConfig() {
  yield call(globalstorage);
}

export default watchingSysConfig;
