import {call, delay, fork, takeLatest, put} from '@redux-saga/core/effects';
import {
  HRTK002_LAY_DANH_SACH_PHONG_BAN,
  HRTK002_LAY_DU_LIEU,
} from '../../redux/HRTK002_ThongKeLuong/action';
import {fetchDanhSachPhongBan, fetchDuLieuLuong} from './fetchData';
function* watchingHRTK002() {
  yield takeLatest(HRTK002_LAY_DANH_SACH_PHONG_BAN, fetchDanhSachPhongBan);
  yield takeLatest(HRTK002_LAY_DU_LIEU, fetchDuLieuLuong);
}
export {watchingHRTK002};
