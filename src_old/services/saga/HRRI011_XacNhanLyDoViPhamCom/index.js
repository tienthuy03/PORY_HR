import { takeLatest } from "@redux-saga/core/effects";
import { HRRI011_LAY_DANH_SACH_XN } from "../../redux/HRRI011_XacNhanLyDoViPhamCom/action";
import { FetchDanhSach } from "./fetchData";
function* watchingHRRI011() {
  yield takeLatest(HRRI011_LAY_DANH_SACH_XN, FetchDanhSach);
}
export { watchingHRRI011 };
