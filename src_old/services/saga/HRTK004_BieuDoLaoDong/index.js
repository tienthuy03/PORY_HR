import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import {
  HRTK004_LAY_DANH_SACH_PHONG_BAN,
  HRTK004_LAY_DU_LIEU,
} from '../../redux/HRTK004_BieuDoLaoDong/action';
import {fetchDanhSachPhongBan, fetchDuLieuHopDong} from './fetchData';
function* watchingHRTK004() {
  yield takeLatest(HRTK004_LAY_DANH_SACH_PHONG_BAN, fetchDanhSachPhongBan);
  yield takeLatest(HRTK004_LAY_DU_LIEU, fetchDuLieuHopDong);
}
export {watchingHRTK004};
