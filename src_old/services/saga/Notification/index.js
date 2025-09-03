import { put, takeLatest, select } from "@redux-saga/core/effects";
import {
  ntProcessNotification,
  ntSetCountNotiTab,
  ntSetNotification,
  ntSetNotificationGen,
  ntSetNotificationSys,
  NT_GET_NOTIFICATION,
  NT_PRORESS_NOTIFICATION,
  NT_RESET_COUNT_NOTI_TAB,
} from "../../redux/Notification/action";
import sysFetch from "../../fetch";
import DefaultPreference from "react-native-default-preference";

function* watchingNofitication() {
  yield takeLatest(NT_GET_NOTIFICATION, fetchNotification);
  yield takeLatest(NT_PRORESS_NOTIFICATION, processNotification);
  yield takeLatest(NT_RESET_COUNT_NOTI_TAB, resetCountNotiTab);
}
//resetCountNotiTab
function* resetCountNotiTab() {
  try {
    const lastCheck = yield DefaultPreference.get("countNotiTab");
    const lastMaxTime = lastCheck.split("-")[0];
    DefaultPreference.set("countNotiTab", `${lastMaxTime}-0`);
    yield put(ntSetCountNotiTab(0));
  } catch (error) {
    console.log("Reset Count Noti Tab Fail:", error);
  }
}
//processNotification
function* processNotification() {
  const { notification } = yield select((state) => state.NotificationReducer);

  //handle count message receive
  try {
    const lastCheck = yield DefaultPreference.get("countNotiTab");
    const lastMaxTime = lastCheck.split("-")[0];
    const lastCounting = lastCheck.split("-")[1];
    let currentMaxTime = 0; //max time of noti array
    let arrNewMessage = [];

    arrNewMessage = yield notification.filter((item) => {
      if (parseInt(currentMaxTime) < parseInt(item.post_dt)) {
        currentMaxTime = item.post_dt;
      }
      return parseInt(item.post_dt) > parseInt(lastMaxTime);
    });
    //if checked counting number
    if (lastMaxTime !== currentMaxTime) {
      if (lastCounting === 0) {
        DefaultPreference.set(
          "countNotiTab",
          `${currentMaxTime}-${arrNewMessage.length}`
        );
        yield put(ntSetCountNotiTab(arrNewMessage.length));
      } else {
        DefaultPreference.set(
          "countNotiTab",
          `${currentMaxTime}-${
            parseInt(arrNewMessage.length) + parseInt(lastCounting)
          }`
        );
        yield put(
          ntSetCountNotiTab(
            parseInt(arrNewMessage.length) + parseInt(lastCounting)
          )
        );
      }
    } else {
      yield put(ntSetCountNotiTab(lastCounting));
    }
  } catch (error) {
    console.log("Process Notification Fail:", error);
  }

  //handle reading notification for the checking message
  let tempSys = [];
  let tempGen = [];
  const strRead = yield DefaultPreference.get("readNoti");
  if (strRead) {
    const arrRead = strRead.split("|");
    Promise.all(
      notification.map((item) => {
        if (arrRead.indexOf(item.ann_emp_pk.toString()) > 0) {
          item.read_yn = "Y";
          // if (item.ann_type === 'SYSTEM') {
          tempSys.push(item);
          // } else {
          //   tempGen.push(item);
          // }
        } else {
          item.read_yn = "N";
          // if (item.ann_type === 'SYSTEM') {
          tempSys.push(item);
          // } else {
          //   tempGen.push(item);
          // }
        }
      })
    );
    yield put(ntSetNotificationSys(tempSys));
    // yield put(ntSetNotificationGen(tempGen));
  } else {
    DefaultPreference.set("readNoti", "0");
    yield put(
      // ntSetNotificationSys(notification.filter(x => x.ann_type === 'SYSTEM')),
      ntSetNotificationSys(notification)
    );
    // yield put(
    //   ntSetNotificationGen(notification.filter(x => x.ann_type !== 'SYSTEM')),
    // );
  }
}

//fetchNotification
function* fetchNotification() {
  console.log("get data noti fetchNotification");
  try {
    const URL = yield select((state) => state.SysConfigReducer.API_URL);
    const token = yield select(
      (state) => state.loginReducers.data.data.tokenLogin
    );
    const thr_emp_pk = yield select(
      (state) => state.loginReducers.data.data.thr_emp_pk
    );
    let params = {
      pro: "SELHRAN0010101",
      in_par: {
        p1_varchar2: thr_emp_pk,
      },
      out_par: {
        p1_sys: "notification",
        p2_sys: "image",
        p3_number: "count",
      },
    };
    const responses = yield sysFetch(URL, params, token);
    console.log(responses);
    yield put(ntSetNotification(responses.data));
    yield put(ntProcessNotification());
  } catch (error) {}
}
export default watchingNofitication;
