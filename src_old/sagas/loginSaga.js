import {
  LOGIN_USER,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  CLEAR_USER,
} from "../actions/actionType";
import { put, takeLatest } from "redux-saga/effects";
import { Api } from "./Api";
import { LoadReveiceNotification } from "../services/redux/System/action";
import ShowError from "../services/errors";
import DefaultPreference from "react-native-default-preference";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../services/redux/GlobalLoading/action";
import { APP_VERSION } from "../config/Pro";
//Get Movie
function* fetchUser({ payload: { username, password, machine_id } }) {
  try {
    yield put(ShowGlobalLoading);
    const dataUser = yield Api.logintUserFromApi(
      username + "|" + APP_VERSION,
      // username,
      password,
      machine_id
    );
    if (dataUser.results === "S") {
      console.log("1");
      DefaultPreference.set("logout", "false");
      yield put(LoadReveiceNotification(dataUser.data.noti_mobile_yn));
      yield put({
        type: LOGIN_SUCCESS,
        payload: dataUser,
        username: username,
        password: password,
      });
      yield put(HideGlobalLoading);
    } else if (dataUser.results === "F") {
      console.log("2");
      DefaultPreference.set("logout", "true");
      yield put({
        type: LOGIN_FAILED,
        payload: dataUser,
      });
      yield put(HideGlobalLoading);
    }
  } catch (err) {
    DefaultPreference.set("logout", "true");
    console.log("err");
    console.log(err);
    yield put(HideGlobalLoading);
    ShowError(err.toString());
  }
}

//Get Movie
function* fetchUpdateUser({ payload: { user_language } }) {
  try {
    yield put({
      type: UPDATE_USER_SUCCESS,
      payload: user_language,
    });
  } catch (error) {}
}
export function* watchFetchUser() {
  yield takeLatest(LOGIN_USER, fetchUser);
  yield takeLatest(UPDATE_USER, fetchUpdateUser);
}
