import axios from "axios";
import DefaultPreference from "react-native-default-preference";
import AsyncStorage from "@react-native-community/async-storage";
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";
import {
  SELHRIN0010100,
  SELSYSDICT0100,
  // SELHRMENU0100,
  SELHRMENU0,
  SELHRIN0020100,
  SELHRIN0040100,
  SELHRIN0040101,
  SELHRIN0050100,
  SELHRIN0070100,
  SELHRIN0080100,
  SELHRRE0070101,
  SELHRRE0011100,
  SELHRRE0012100,
  SELHRRE0040100,
  SELHRAP0010101,
  SELHRAP1010100,
  SELHRAP1010101,
  SELHRAP0020101,
  SELHRRE0010101,
  DefaultIP,
} from "../config/Pro";
import { select } from "@redux-saga/core/effects";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../services/redux/GlobalLoading/action";
import { SetApiURL } from "../services/redux/SysConfig/action";
import { put, takeLatest } from "redux-saga/effects";
import { APP_VERSION } from "../config/Pro";

function* logintUserFromApi(username, password, machine_id) {
  let URL = yield select((state) => state.SysConfigReducer.API_URL);
  // if (username.toLowerCase().startsWith("tvs")) {
  //   yield put(SetApiURL("http://tinvietsoft.com/tinviet_api_v1/api/"));
  //   URL = "http://tinvietsoft.com/tinviet_api_v1/api/";
  // }
  // if (username.toLowerCase().startsWith("hpdq")) {
  //   yield put(SetApiURL("http://apihr.hoaphatdungquat.vn/api/"));
  //   URL = "http://apihr.hoaphatdungquat.vn/api/";
  // }

  if (URL.toLowerCase().startsWith("http://117.2.160.69:91/hpdqapi/api/")) {
    yield put(SetApiURL("http://apihr.hoaphatdungquat.vn/api/"));
    AsyncStorage.setItem("API_URL", "http://apihr.hoaphatdungquat.vn/api/");
    URL = "http://apihr.hoaphatdungquat.vn/api/";
  }
  if (
    URL.toLowerCase().startsWith("http://117.2.160.69:91/hoaphatdq_api/api/")
  ) {
    yield put(SetApiURL("http://apihr.hoaphatdungquat.vn/api/"));
    AsyncStorage.setItem("API_URL", "http://apihr.hoaphatdungquat.vn/api/");
    URL = "http://apihr.hoaphatdungquat.vn/api/";
  }
  // if (username.toLowerCase().startsWith("tvs-")) {
  //   yield put(SetApiURL("http://tinvietsoft.com/tinviet_api/api/"));
  //   AsyncStorage.setItem("API_URL", "http://tinvietsoft.com/tinviet_api/api/");
  //   URL = "http://tinvietsoft.com/tinviet_api/api/";
  // }
  // SetApiURL
  // yield put(SetApiURL(''));
  const urlLogin = URL + "User/Login/";
  console.log(urlLogin);
  let param = {
    username: username,
    password: password,
    machine_id: machine_id,
  };
  console.log(param);
  const responses = yield axios
    .post(urlLogin, param)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
      throw err.toString();
    });
  return yield responses;
}

//Fetch language
function* fetchLanguageFromApi(token, deviceId) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetch = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let param = {
    pro: SELSYSDICT0100,
    in_par: {
      p1_varchar2: "ALL",
    },
    out_par: {
      p1_sys: "language",
    },
    token: "tvs",
    machine_id: deviceId,
  };
  const responses = yield axios
    .post(urlFetch, param, axiosConfig)
    .then((res) => res.data)
    .catch(() => {
      //Alert.alert('Errors: ' + error);
    });
  return yield responses;
}

//Fetch menu
function* fetchMenuFromApi(
  token,
  deviceId,
  tes_user_pk,
  thr_emp_pk,
  user_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE_V1/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log({
    p1_varchar2: tes_user_pk,
    p2_varchar2: thr_emp_pk,
    p3_varchar2: APP_VERSION,
    p4_varchar2: user_name,
  });
  let params = {
    // pro: SELHRMENU0100,
    pro: SELHRMENU0,
    in_par: {
      p1_varchar2: tes_user_pk,
      p2_varchar2: thr_emp_pk,
      p3_varchar2: APP_VERSION,
      p4_varchar2: user_name,
    },
    out_par: {
      p1_sys: "menu",
    },
    token: "tvs",
    machine_id: deviceId,
  };
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch noti
function* fetchNotiFromApi(token, deviceId, thr_emp_pk) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
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
    token: "tvs",
    machine_id: deviceId,
  };
  //('Params-------' + JSON.stringify(params));
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch(() => {
      //Alert.alert('Errors: ' + error);
    });
  return yield {
    data: {
      image: responses.data.image,
      notification: responses.data.notification,
    },
  };
}

//Fetch ttcn
function* fetchTtcnFromApi(token, deviceId, userPK, fullname) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRIN0010100,
    in_par: {
      p1_varchar2: userPK,
    },
    out_par: {
      p1_sys: "o1",
      p2_sys: "o2",
      p3_sys: "o3",
      p4_sys: "o4",
      p5_sys: "o5",
      p6_sys: "o6",
      p7_sys: "o7",
      p8_sys: "o8",
      p9_sys: "o9",
      p10_sys: "o10",
      p11_sys: "o11",
      p12_sys: "o12",
      p13_sys: "o13",
      p14_sys: "o14",
      p15_sys: "o15",
      p16_sys: "o16",
    },
    token: "tvs",
    machine_id: deviceId,
  };
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Working Daily
function* fetchWorkingDailyFromApi(
  token,
  deviceId,
  userPK,
  fullname,
  p_fromdate,
  p_todate
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: "SELHRIN0020101",
    in_par: {
      p1_varchar2: userPK,
      p2_varchar2: fullname,
      p3_varchar2: p_fromdate,
      p4_varchar2: p_todate,
    },
    out_par: {
      p1_sys: "ttnc",
    },
    token: "tvs",
    machine_id: deviceId,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch VPCC
function* fetchVPCCFromApi(token, deviceId, userPK, p_fromMonth, p_toMonth) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRIN0080100,
    in_par: {
      p1_varchar2: userPK,
      p2_varchar2: p_fromMonth,
      p3_varchar2: p_toMonth,
    },
    out_par: {
      p1_sys: "vpcc",
    },
    token: "tvs",
    machine_id: deviceId,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}
//Fetch Salary Month
function* fetchSalaryMonthFromApi(token, deviceId, user_pk, p_work_mon) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    //HRIN004_0_100
    pro: SELHRIN0040101,
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_work_mon,
    },
    out_par: {
      p1_sys: "ttlt",
    },
    token: "tvs",
    machine_id: deviceId,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Absence Information
function* fetchAbsenceInforFromApi(
  token,
  deviceId,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRIN0050100,
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_fromdate,
      p3_varchar2: p_todate,
      p4_varchar2: "ALL",
      p5_varchar2: "ALL",
      p6_varchar2: full_name,
    },
    out_par: {
      p1_sys: "ttnn",
    },
    token: "tvs",
    machine_id: deviceId,
  };
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Attendance History
function* fetchAttendanceHistoryFromApi(
  token,
  deviceId,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRIN0070100,
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_fromdate,
      p3_varchar2: p_todate,
      p4_varchar2: full_name,
    },
    out_par: {
      p1_sys: "lscc",
    },
    token: "tvs",
    machine_id: deviceId,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Xntc
function* fetchXntcFromApi(
  token,
  machine_id,
  user_pk,
  p_fromdate,
  p_todate,
  version,
  crt_by
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE_V1/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: "SELHRRE007000",
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_fromdate,
      p3_varchar2: p_todate,
      p4_varchar2: version,
      p5_varchar2: crt_by,
    },
    out_par: {
      p1_sys: "xntc",
      p2_sys: "approve_data",
      p3_sys: "thongtinnguoipheduyet",
      p4_varchar2: "limit_reg_date",
    },
    token: "tvs",
    machine_id: machine_id,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Post xntc
function* postXntcFromApi(
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
  p_empApproved2
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: UPDHRRE0070101,
    in_par: {
      p1_varchar2: p_action,
      p2_varchar2: P_PK_TABLE,
      p3_number: P_OTXN_NLD,
      p4_varchar2: P_REASON_NLD,
      p5_varchar2: p_start_time1,
      p6_varchar2: p_end_time1,
      p7_varchar2: p_meal_1,
      p8_varchar2: p_start_time2,
      p9_varchar2: p_end_time2,
      p10_varchar2: p_meal_2,
      p11_varchar2: P_ARPPOVE_BY_PK,
      p12_varchar2: P_WORK_DT,
      p13_varchar2: P_THR_EMP_PK,
      p14_varchar2: p_crt_by,
      p15_varchar2: p_empApproved2,
    },
    out_par: {
      p1_varchar2: "upd_xntc",
    },
    token: "tvs",
    machine_id: machine_id,
  };

  //('Params-------xntc' + JSON.stringify(params));
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Npd
function* fetchNpdFromApi(token, machine_id, org_pk) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRRE0011100,
    in_par: {
      p1_varchar2: org_pk,
    },
    out_par: {
      p1_sys: "npd",
    },
    token: "tvs",
    machine_id: machine_id,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Dkv
function* fetchDkvFromApi(
  token,
  machine_id,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: "SELHRRE0010101",
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_fromdate,
      p3_varchar2: p_todate,
    },
    out_par: {
      p1_sys: "ls_dkv",
      p2_sys: "approve_status",
      p3_sys: "ds_lydo",
      p4_sys: "ds_nguoipheduyet",
      p5_varchar2: "limit_reg_dt",
      p6_varchar2: "note",
      p7_varchar2: "hide_time",
    },
    token: "tvs",
    machine_id: machine_id,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Dkv_V2
function* fetchDkvV2FromApi(
  token,
  machine_id,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    // pro: 'SELHRRE0100100',
    pro: "SELHRRE0100101",
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_fromdate,
      p3_varchar2: p_todate,
    },
    out_par: {
      p1_sys: "ls_dkvV2",
      p2_sys: "approve_status",
      p3_sys: "ds_lydo",
      p4_sys: "ds_nguoipheduyet",
      p5_varchar2: "limit_reg_dt",
      p6_varchar2: "note",
      p7_varchar2: "hide_time",
      p8_varchar2: "send_mail",
    },
    token: "tvs",
    machine_id: machine_id,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Dkdt_vs
function* fetchDkdt_vsFromApi(token, deviceId, full_name) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRRE0040100,
    in_par: {
      p1_varchar2: "ALL",
      p2_varchar2: full_name,
    },
    out_par: {
      p1_sys: "dkdt_vs",
    },
    token: "tvs",
    machine_id: deviceId,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Pd_dt_vs
function* fetchPddt_vsFromApi(
  token,
  machine_id,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: SELHRAP0010101,
    in_par: {
      p1_varchar2: user_pk,
      p3_varchar2: p_fromdate,
      p4_varchar2: p_todate,
    },
    out_par: {
      p1_sys: "pdvdtvs",
      p2_sys: "approve_info",
    },
    token: "tvs",
    machine_id: machine_id,
  };
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Pd_dt_vsV2
function* fetchPddt_vsV2FromApi(
  token,
  machine_id,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    // pro: SELHRAP1010100,
    pro: SELHRAP1010101,
    in_par: {
      p1_varchar2: user_pk,
      p3_varchar2: p_fromdate,
      p4_varchar2: p_todate,
    },
    out_par: {
      p1_sys: "pdvdtvs",
      p2_sys: "approve_info",
      p3_varchar2: "send_mail",
    },
    token: "tvs",
    machine_id: machine_id,
  };
  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {
      console.log("Errors: " + error);
    });
  return yield responses;
}

//Fetch Pd_tc
function* fetchPDTCFromApi(
  token,
  machine_id,
  user_pk,
  p_fromdate,
  p_todate,
  full_name
) {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);
  const urlFetchs = URL + "Exec/MOBILE/";
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: "SELHRAP0020101",
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_fromdate,
      p3_varchar2: p_todate,
    },
    out_par: {
      p1_sys: "pdtc",
      p2_sys: "approve_info",
    },
    token: "tvs",
    machine_id: machine_id,
  };

  const responses = yield axios
    .post(urlFetchs, params, axiosConfig)
    .then((ress) => {
      return ress.data;
    })
    .catch((error) => {});
  return yield responses;
}
export const Api = {
  logintUserFromApi,
  fetchLanguageFromApi,
  fetchMenuFromApi,
  fetchTtcnFromApi,
  fetchWorkingDailyFromApi,
  fetchSalaryMonthFromApi,
  fetchAbsenceInforFromApi,
  fetchAttendanceHistoryFromApi,
  fetchXntcFromApi,
  fetchNpdFromApi,
  fetchDkvFromApi,
  fetchDkdt_vsFromApi,
  postXntcFromApi,
  fetchNotiFromApi,
  fetchPddt_vsFromApi,
  fetchPDTCFromApi,
  fetchVPCCFromApi,
  fetchDkvV2FromApi,
};
