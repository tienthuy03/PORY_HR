import {takeLatest} from '@redux-saga/core/effects';
import {
  HRDB001_LAY_DU_LIEU_HOAT_DONG,
  HRDB001_LAY_DU_LIEU_LUONG,
  HRDB001_LAY_DU_LIEU_THONG_KE,
} from '../../redux/Dashboard/action';
import {
  FetchDuLieuThongKe,
  FetchDuLieuHoatDong,
  FetchDuLieuLuong,
} from './fetchData';
function* watchingHRDB001() {
  yield takeLatest(HRDB001_LAY_DU_LIEU_THONG_KE, FetchDuLieuThongKe);
  yield takeLatest(HRDB001_LAY_DU_LIEU_HOAT_DONG, FetchDuLieuHoatDong);
  yield takeLatest(HRDB001_LAY_DU_LIEU_LUONG, FetchDuLieuLuong);
}
export {watchingHRDB001};
