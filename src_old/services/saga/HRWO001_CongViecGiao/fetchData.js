import { select, put } from "@redux-saga/core/effects";
import axios from "axios";
import Device from "react-native-device-info";
import { Alert } from "react-native";
import { APP_VERSION } from "../../../config/Pro";
import {
  HRWO001LayDanhSachLoaiCongViecS,
  HRWO001LayDanhSachLoaiCongViecF,
  HRWO001LayDanhSachDuAnS,
  HRWO001LayDanhSachDuAnF,
  HRWO001LayDanhSachUuTienS,
  HRWO001LayDanhSachUuTienF,
  HRWO001LayDanhSachNguoiGiaoViecS,
  HRWO001LayDanhSachNguoiGiaoViecF,
  HRWO001LayDanhSachNguoiThucHienS,
  HRWO001LayDanhSachNguoiThucHienF,
  HRWO001LayDanhSachNguoiTheoDoiS,
  HRWO001LayDanhSachNguoiTheoDoiF,
  HRWO001LayDanhSachNguoiTheoDoiDefaultS,
  HRWO001LayDanhSachNguoiTheoDoiDefaultF,
  HRWO001ChonNguoiGiaoViec,
  HRWO001LayDanhSachCongViecS,
  HRWO001LayDanhSachCongViecF,
  HRWO001Loading,
  HRWO001EndLoading,
} from "../../redux/HRWO001_CongViecGiao/action";
import {
  ShowGlobalLoading,
  HideGlobalLoading,
} from "../../redux/GlobalLoading/action";

function* FetchDanhSachListControl() {
  try {
    yield put(ShowGlobalLoading);
    yield put(HRWO001Loading());
    const URL = yield select((state) => state.SysConfigReducer.API_URL);

    const employee_pk = yield select(
      (state) => state.loginReducers.data.data.thr_emp_pk
    );

    // const from_dt = yield select(
    //   (state) => state.HRRI000_ThongTinDangKyComReducer.From_dt
    // );
    // const to_dt = yield select(
    //   (state) => state.HRRI000_ThongTinDangKyComReducer.To_dt
    // );

    const crt_by = yield select(
      (state) => state.loginReducers.data.data.crt_by
    );

    const tokenLogin = yield select(
      (state) => state.loginReducers.data.data.tokenLogin
    );
    const param = {
      pro: "SELHRWO001000",
      in_par: {
        p1_varchar2: employee_pk,
        p4_varchar2: APP_VERSION,
        p5_varchar2: crt_by,
      },
      out_par: {
        p1_sys: "dataJobType",
        p2_sys: "dataCustomer",
        p3_sys: "dataPriority",
        p4_sys: "dataAssign",
        p5_sys: "dataImplement",
        p6_sys: "dataFollow",
        p7_sys: "dataImplementDf",
        p8_sys: "dataProject",
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
      console.log("rs S:", rs);
      yield put(HRWO001ChonNguoiGiaoViec(rs.data.dataImplementDf));
      yield put(HRWO001LayDanhSachLoaiCongViecS(rs.data.dataJobType));
      yield put(HRWO001LayDanhSachDuAnS(rs.data.dataCustomer));
      yield put(HRWO001LayDanhSachUuTienS(rs.data.dataPriority));
      yield put(HRWO001LayDanhSachNguoiGiaoViecS(rs.data.dataAssign));
      yield put(HRWO001LayDanhSachNguoiThucHienS(rs.data.dataImplement));
      yield put(HRWO001LayDanhSachNguoiTheoDoiS(rs.data.dataFollow));

      yield put(
        HRWO001LayDanhSachNguoiTheoDoiDefaultS(rs.data.dataImplementDf)
      );

      yield put(HRWO001LayDanhSachCongViecS(rs.data.dataProject));
      yield put(HideGlobalLoading);
      yield put(HRWO001EndLoading());
    } else {
      console.log(rs);
      yield put(HRWO001LayDanhSachLoaiCongViecF());
      yield put(HRWO001LayDanhSachDuAnF());
      yield put(HRWO001LayDanhSachUuTienF());
      yield put(HRWO001LayDanhSachNguoiGiaoViecF());
      yield put(HRWO001LayDanhSachNguoiThucHienF());
      yield put(HRWO001LayDanhSachNguoiTheoDoiF());
      yield put(HRWO001LayDanhSachNguoiTheoDoiDefaultF());
      yield put(HRWO001LayDanhSachCongViecF());
      yield put(HideGlobalLoading);
      yield put(HRWO001EndLoading());
    }
  } catch (error) {
    yield put(HideGlobalLoading);
    yield put(HRWO001EndLoading());
  }
}

export { FetchDanhSachListControl };
// export { FetchDanhSachDangKy, FetchDuLieuHoatDong, FetchDuLieuLuong };
