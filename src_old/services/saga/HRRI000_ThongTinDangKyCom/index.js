import { takeLatest } from "@redux-saga/core/effects";
import {
  HRRI000_LAY_DANH_SACH_DANG_KY,
  HRRI000_LAY_DU_LIEU_VI_PHAM_COM,
  HRRI000_LAY_DANH_SACH_NHA_AN,
} from "../../redux/HRRI000_ThongTinDangKyCom/action";
import {
  FetchDanhSachDangKy,
  FetchDanhSachNhaAn,
  FetchDuLieuViPhamCom,
} from "./fetchData";
function* watchingHRRI000() {
  yield takeLatest(HRRI000_LAY_DANH_SACH_DANG_KY, FetchDanhSachDangKy);
  yield takeLatest(HRRI000_LAY_DU_LIEU_VI_PHAM_COM, FetchDuLieuViPhamCom);
  yield takeLatest(HRRI000_LAY_DANH_SACH_NHA_AN, FetchDanhSachNhaAn);
}
export { watchingHRRI000 };
