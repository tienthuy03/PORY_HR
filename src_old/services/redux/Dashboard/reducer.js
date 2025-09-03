import * as action from './action';
const initialState = {
  DuLieuThongKe: [],
  DuLieuHoatDong: [],
  DuLieuLuong: [],
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRDB001_LAY_DU_LIEU_THONG_KE_S:
      return {
        ...state,
        DuLieuThongKe: act.DuLieuThongKe,
      };
    case action.HRDB001_LAY_DU_LIEU_THONG_KE_F:
      return {
        ...state,
        DuLieuThongKe: [],
      };
    case action.HRDB001_LAY_DU_LIEU_HOAT_DONG_S:
      return {
        ...state,
        DuLieuHoatDong: act.DuLieuHoatDong,
      };
    case action.HRDB001_LAY_DU_LIEU_HOAT_DONG_F:
      return {
        ...state,
        DuLieuHoatDong: [],
      };
    case action.HRDB001_LAY_DU_LIEU_LUONG_S:
      return {
        ...state,
        DuLieuLuong: act.DuLieuLuong,
      };
    case action.HRDB001_LAY_DU_LIEU_LUONG_F:
      return {
        ...state,
        DuLieuLuong: [],
      };
    default:
      return state;
  }
};
export default reducer;
