import { takeLatest } from "@redux-saga/core/effects";
import {
  HRWO001_LAY_DANH_SACH_LIST_CONTROL,
  HRWO001_RELOAD_DANHSACH,
} from "../../redux/HRWO001_CongViecGiao/action";
import { FetchDanhSachListControl } from "./fetchData";
import { LoadDanhSach } from "./loadDS";
function* watchingHRWO001() {
  yield takeLatest(
    HRWO001_LAY_DANH_SACH_LIST_CONTROL,
    FetchDanhSachListControl
  );
  // yield takeLatest(HRRI000_LAY_DU_LIEU_VI_PHAM_COM, FetchDuLieuViPhamCom);
}

function* HRWO001_LoadList() {
  yield takeLatest(HRWO001_RELOAD_DANHSACH, LoadDanhSach);
}

export { watchingHRWO001, HRWO001_LoadList };
