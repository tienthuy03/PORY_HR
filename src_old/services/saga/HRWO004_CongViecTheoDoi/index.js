import { takeLatest } from "@redux-saga/core/effects";
import { HRWO004_RELOAD, HRWO004_RESET_RELOAD } from "../../redux/HRWO004_CongViecTheoDoi/action";
import { LoadDanhSach, ResetReload  } from "./loadDS";

function* HRWO004_LoadList(){
  yield takeLatest(HRWO004_RELOAD, LoadDanhSach);
}

function* HRWO004_ResetReload(){
  yield takeLatest(HRWO004_RESET_RELOAD, ResetReload);
}

export { HRWO004_LoadList, HRWO004_ResetReload };
