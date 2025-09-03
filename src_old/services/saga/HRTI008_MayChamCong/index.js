import { takeLatest } from "@redux-saga/core/effects";
import { 
  HRTI008_RELOAD_LIST_MCC, HRTI008_RESET_RELOAD_LIST_MCC 
} from "../../redux/HRTI008_MayChamCong/action";
import { LoadDanhSach, ResetReload  } from "./loadDS";

function* HRWO008_LoadList(){
  yield takeLatest(HRTI008_RELOAD_LIST_MCC, LoadDanhSach);
}

function* HRWO008_ResetReload(){
  yield takeLatest(HRTI008_RESET_RELOAD_LIST_MCC, ResetReload);
}

export { HRWO008_LoadList, HRWO008_ResetReload };
