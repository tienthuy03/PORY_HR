import { select, put } from "@redux-saga/core/effects";
import axios from "axios";
import Device from "react-native-device-info";
import { Alert } from "react-native";
import { APP_VERSION } from "../../../config/Pro";
import {
  HRRI000LayDanhSachDangKyS,
  HRRI000LayDanhSachDangKyF,
  HRRI000LayDuLieuViPhamComS,
  HRRI000LayDuLieuViPhamComF,
  HRRI000LayDanhSachNhaAnS,
  HRRI000LayDanhSachNhaAnF,
} from "../../redux/HRRI000_ThongTinDangKyCom/action";

function* FetchDanhSachDangKy() {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  const from_dt = yield select(
    (state) => state.HRRI000_ThongTinDangKyComReducer.From_dt
  );
  const to_dt = yield select(
    (state) => state.HRRI000_ThongTinDangKyComReducer.To_dt
  );

  const crt_by = yield select((state) => state.loginReducers.data.data.crt_by);

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  const param = {
    pro: "SELHRRI000000",
    in_par: {
      p1_varchar2: employee_pk,
      p2_varchar2: from_dt,
      p3_varchar2: to_dt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
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
    .post(URL + "Exec/MOBILE_V1", param, axiosConfig)
    .then((res) => {
      return res.data;
    });
  if (rs.results === "S") {
    console.log(rs);
    yield put(HRRI000LayDanhSachDangKyS(rs.data));
  } else {
    console.log(rs);
    yield put(HRRI000LayDanhSachDangKyF());
  }
}

function* FetchDanhSachNhaAn() {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  const from_dt = yield select(
    (state) => state.HRRI000_ThongTinDangKyComReducer.From_dt
  );
  const to_dt = yield select(
    (state) => state.HRRI000_ThongTinDangKyComReducer.To_dt
  );

  const crt_by = yield select((state) => state.loginReducers.data.data.crt_by);

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  const param = {
    pro: "SELHRRI000001",
    in_par: {
      p1_varchar2: employee_pk,
      p2_varchar2: from_dt,
      p3_varchar2: to_dt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
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
  console.log("param SELHRRI000001 ===> ", param);
  const rs = yield axios
    .post(URL + "Exec/MOBILE_V1", param, axiosConfig)
    .then((res) => {
      return res.data;
    });
  if (rs.results === "S") {
    console.log(rs);
    yield put(HRRI000LayDanhSachNhaAnS(rs.data));
  } else {
    console.log(rs);
    yield put(HRRI000LayDanhSachNhaAnF());
  }
}

function* FetchDuLieuViPhamCom() {
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  const from_dt = yield select(
    (state) => state.HRRI000_ThongTinDangKyComReducer.From_dt
  );
  const to_dt = yield select(
    (state) => state.HRRI000_ThongTinDangKyComReducer.To_dt
  );

  const crt_by = yield select((state) => state.loginReducers.data.data.crt_by);

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  const param = {
    pro: "SELHRRI000002",
    in_par: {
      p1_varchar2: employee_pk,
      p2_varchar2: from_dt,
      p3_varchar2: to_dt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
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
  console.log("param SELHRRI000002 ===> ", param);
  const rs = yield axios
    .post(URL + "Exec/MOBILE_V1", param, axiosConfig)
    .then((res) => {
      return res.data;
    });
  if (rs.results === "S") {
    console.log(rs);
    yield put(HRRI000LayDuLieuViPhamComS(rs.data));
  } else {
    console.log(rs);
    yield put(HRRI000LayDuLieuViPhamComF());
  }
}

// function* FetchDuLieuHoatDong() {
//   const URL = yield select((state) => state.SysConfigReducer.API_URL);

//   const employee_pk = yield select(
//     (state) => state.loginReducers.data.data.thr_emp_pk
//   );

//   const tokenLogin = yield select(
//     (state) => state.loginReducers.data.data.tokenLogin
//   );
//   const param = {
//     pro: "SELHRDB0011100",
//     in_par: {
//       p1_varchar2: employee_pk,
//     },
//     out_par: {
//       p1_sys: "data",
//     },
//     token: "tvs",
//     machine_id: Device.getUniqueId(),
//   };
//   let axiosConfig = {
//     headers: {
//       Authorization: `Bearer ${tokenLogin}`,
//     },
//   };
//   const rs = yield axios
//     .post(URL + "Exec/MOBILE", param, axiosConfig)
//     .then((res) => {
//       return res.data;
//     });
//   if (rs.results === "S") {
//     yield put(HRDB001LayDuLieuHoatDongS(rs.data.data));
//   } else {
//     yield put(HRDB001LayDuLieuHoatDongF());
//   }
// }

// function* FetchDuLieuLuong() {
//   const URL = yield select((state) => state.SysConfigReducer.API_URL);

//   const employee_pk = yield select(
//     (state) => state.loginReducers.data.data.thr_emp_pk
//   );

//   const tokenLogin = yield select(
//     (state) => state.loginReducers.data.data.tokenLogin
//   );
//   const param = {
//     pro: "SELHRDB0012100",
//     in_par: {
//       p1_varchar2: employee_pk,
//     },
//     out_par: {
//       p1_sys: "data",
//     },
//     token: "tvs",
//     machine_id: Device.getUniqueId(),
//   };
//   let axiosConfig = {
//     headers: {
//       Authorization: `Bearer ${tokenLogin}`,
//     },
//   };
//   const rs = yield axios
//     .post(URL + "Exec/MOBILE", param, axiosConfig)
//     .then((res) => {
//       return res.data;
//     });
//   if (rs.results === "S") {
//     yield put(HRDB001LayDuLieuLuongS(rs.data.data));
//   } else {
//     yield put(HRDB001LayDuLieuLuongF());
//   }
// }

export { FetchDanhSachDangKy, FetchDanhSachNhaAn, FetchDuLieuViPhamCom };
// export { FetchDanhSachDangKy, FetchDuLieuHoatDong, FetchDuLieuLuong };
