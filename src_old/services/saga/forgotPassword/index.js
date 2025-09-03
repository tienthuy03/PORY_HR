import {delay, fork, takeLatest} from '@redux-saga/core/effects';
import {call} from 'react-native-reanimated';
import * as action from '../../redux/ForgotPassword/action';
import {GetMethodForgotPassword} from './fetchData';
function* watchingForgotPassword() {
  yield takeLatest(action.FP_CHECK_USERNAME, GetMethodForgotPassword);
}

export default watchingForgotPassword;
