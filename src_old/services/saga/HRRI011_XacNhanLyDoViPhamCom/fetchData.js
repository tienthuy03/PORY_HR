import { select, put } from "@redux-saga/core/effects";
import axios from "axios";
import Device from "react-native-device-info";
import { Alert } from "react-native";
import { APP_VERSION } from "../../../config/Pro";
import {
  // HRRI000LayDanhSachDangKyS,
  // HRRI000LayDanhSachDangKyF,
  // HRRI000LayDuLieuViPhamComS,
  // HRRI000LayDuLieuViPhamComF,
  // HRRI000LayDanhSachNhaAnS,
  // HRRI000LayDanhSachNhaAnF,

  HRRI011LayDanhSachCXNS,
  HRRI011LayDanhSachCXNF,
  HRRI011LayDanhSachDXNS,
  HRRI011LayDanhSachDXNF,
  HRRI011LayDanhSachVP1S,
  HRRI011LayDanhSachVP1F,
  HRRI011LayDanhSachVP2S,
  HRRI011LayDanhSachVP2F,
} from "../../redux/HRRI011_XacNhanLyDoViPhamCom/action";
import {
  ShowGlobalLoading,
  HideGlobalLoading,
} from "../../redux/GlobalLoading/action";

function* FetchDanhSach() {
  yield put(ShowGlobalLoading);
  const URL = yield select((state) => state.SysConfigReducer.API_URL);

  const employee_pk = yield select(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );

  const from_dt = yield select(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.From_dt
  );
  const to_dt = yield select(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.To_dt
  );

  const crt_by = yield select((state) => state.loginReducers.data.data.crt_by);

  const tokenLogin = yield select(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  // console.log("in_par ", {
  //   p1_varchar2: employee_pk,
  //   p2_varchar2: from_dt,
  //   p3_varchar2: to_dt,
  //   p4_varchar2: APP_VERSION, 
  //   p5_varchar2: crt_by,
  // });
  const param = {
    pro: "SELHRRI011000",
    in_par: {
      p1_varchar2: employee_pk,
      p2_varchar2: from_dt,
      p3_varchar2: to_dt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    },
    out_par: {
      p1_sys: "dataCXN",
      p2_sys: "dataDXN",
      p3_sys: "dataVP1",
      p4_sys: "dataVP2",
      p5_sys: "dataNPD",
      p6_sys: "dataApprove"
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
    // console.log(rs.data);
    yield put(HRRI011LayDanhSachCXNS(rs.data.dataCXN, rs.data.dataNPD));
    yield put(HRRI011LayDanhSachDXNS(rs.data.dataDXN, rs.data.dataApprove));
    yield put(HRRI011LayDanhSachVP1S(rs.data.dataVP1));
    yield put(HRRI011LayDanhSachVP2S(rs.data.dataVP2));
    yield put(HideGlobalLoading);
  } else {
    // console.log(rs); 
    yield put(HRRI011LayDanhSachCXNF());
    yield put(HRRI011LayDanhSachDXNF());
    yield put(HRRI011LayDanhSachVP1F());
    yield put(HRRI011LayDanhSachVP2F());
    yield put(HideGlobalLoading);
  }
}
export { FetchDanhSach };
// export { FetchDanhSachDangKy, FetchDuLieuHoatDong, FetchDuLieuLuong };
