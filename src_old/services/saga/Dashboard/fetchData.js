import { select, put } from "@redux-saga/core/effects";
import axios from "axios";
import Device from "react-native-device-info";
import { Alert } from "react-native";
import { APP_VERSION } from "../../../config/Pro";
import {
  HRDB001LayDuLieuThongKeS,
  HRDB001LayDuLieuThongKeF,
  HRDB001LayDuLieuHoatDongS,
  HRDB001LayDuLieuHoatDongF,
  HRDB001LayDuLieuLuongS,
  HRDB001LayDuLieuLuongF,
} from "../../redux/Dashboard/action";

function* FetchDuLieuThongKe() {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  const crt_by = yield select((state) => state.loginReducers.data.data.crt_by);

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  console.log("fetch dashboard");
  console.log({
    p1_varchar2: employee_pk,
    p2_varchar2: APP_VERSION,
    p3_varchar2: crt_by,
  });
  const param = {
    pro: "SELHRDB001000",
    in_par: {
      p1_varchar2: employee_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    },
    out_par: {
      p1_sys: "single",
      p2_sys: "menu",
      p3_sys: "detail",
      p4_sys: "detail2",
    },
    token: "tvs",
    machine_id: Device.getUniqueId(),
  };
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
    },
  };
  const rs = yield axios
    .post(URL + "Exec/MOBILE_V1", param, axiosConfig)
    .then((res) => {
      return res.data;
    });
  if (rs.results === "S") {
    console.log(rs);
    yield put(HRDB001LayDuLieuThongKeS(rs.data));
  } else {
    console.log(rs);
    yield put(HRDB001LayDuLieuThongKeF());
  }
}

function* FetchDuLieuHoatDong() {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  const param = {
    pro: "SELHRDB0011100",
    in_par: {
      p1_varchar2: employee_pk,
    },
    out_par: {
      p1_sys: "data",
    },
    token: "tvs",
    machine_id: Device.getUniqueId(),
  };
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
    },
  };
  const rs = yield axios
    .post(URL + "Exec/MOBILE", param, axiosConfig)
    .then((res) => {
      return res.data;
    });
  if (rs.results === "S") {
    yield put(HRDB001LayDuLieuHoatDongS(rs.data.data));
  } else {
    yield put(HRDB001LayDuLieuHoatDongF());
  }
}

function* FetchDuLieuLuong() {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  const param = {
    pro: "SELHRDB0012100",
    in_par: {
      p1_varchar2: employee_pk,
    },
    out_par: {
      p1_sys: "data",
    },
    token: "tvs",
    machine_id: Device.getUniqueId(),
  };
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
    },
  };
  const rs = yield axios
    .post(URL + "Exec/MOBILE", param, axiosConfig)
    .then((res) => {
      return res.data;
    });
  if (rs.results === "S") {
    yield put(HRDB001LayDuLieuLuongS(rs.data.data));
  } else {
    yield put(HRDB001LayDuLieuLuongF());
  }
}

export { FetchDuLieuThongKe, FetchDuLieuHoatDong, FetchDuLieuLuong };
