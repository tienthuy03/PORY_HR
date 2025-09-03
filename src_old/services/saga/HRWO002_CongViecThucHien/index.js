import { takeLatest } from "@redux-saga/core/effects";
import { HRWO002_RELOAD, HRWO002_RESET_RELOAD } from "../../redux/HRWO002_CongViecThucHien/action";
import { LoadDanhSach, ResetReload  } from "./loadDS";

function* HRWO002_LoadList(){
  yield takeLatest(HRWO002_RELOAD, LoadDanhSach);
}

function* HRWO002_ResetReload(){
  yield takeLatest(HRWO002_RESET_RELOAD, ResetReload);
}

export { HRWO002_LoadList, HRWO002_ResetReload };
