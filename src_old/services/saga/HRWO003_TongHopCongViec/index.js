import { takeLatest } from "@redux-saga/core/effects";
import { 
  HRWO003_RELOAD, 
  HRWO003_RESET_RELOAD 
} from "../../redux/HRWO003_TongHopCongViec/action";
import { LoadDanhSach, ResetReload  } from "./loadDS";

function* HRWO003_LoadList(){
  yield takeLatest(HRWO003_RELOAD, LoadDanhSach);
}

function* HRWO003_ResetReload(){
  yield takeLatest(HRWO003_RESET_RELOAD, ResetReload);
}

export { HRWO003_LoadList, HRWO003_ResetReload };
