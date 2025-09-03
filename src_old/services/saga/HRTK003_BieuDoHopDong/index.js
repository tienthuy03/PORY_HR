import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import {
  HRTK003_LAY_DANH_SACH_PHONG_BAN,
  HRTK003_LAY_DU_LIEU,
} from '../../redux/HRTK003_BieuDoHopDong/action';
import {fetchDanhSachPhongBan, fetchDuLieuHopDong} from './fetchData';
function* watchingHRTK003() {
  yield takeLatest(HRTK003_LAY_DANH_SACH_PHONG_BAN, fetchDanhSachPhongBan);
  yield takeLatest(HRTK003_LAY_DU_LIEU, fetchDuLieuHopDong);
}
export {watchingHRTK003};
