import * as action from './action';
import moment from 'moment';
const initialState = {
  DanhSachPhongBan: [],
  ShowPopupPhongBan: false,
  ChonPhongBan: {
    code: 0,
    code_nm: 'Chọn phòng ban',
  },
  DuLieuLaoDong: [],
  ChonNgay: moment().format('YYYYMMDD'),
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRTK004_CHON_NGAY:
      return {
        ...state,
        ChonNgay: act.ChonNgay,
      };
    case action.HRTK004_LAY_DU_LIEU_S:
      return {
        ...state,
        DuLieuLaoDong: act.DuLieuLaoDong,
      };
    case action.HRTK004_LAY_DU_LIEU_F:
      return {
        ...state,
        DuLieuHopDong: [],
      };
    case action.HRTK004_CHON_PHONG_BAN:
      return {
        ...state,
        ChonPhongBan: act.ChonPhongBan,
      };
    case action.HRTK004_LAY_DANH_SACH_PHONG_BAN_S:
      return {
        ...state,
        DanhSachPhongBan: act.DanhSachPhongBan,
      };
    case action.HRTK004_LAY_DANH_SACH_PHONG_BAN_F:
      return {
        ...state,
        DanhSachPhongBan: [],
      };
    case action.HRTK004_SHOW_POPUP_PHONG_BAN:
      return {
        ...state,
        ShowPopupPhongBan: true,
      };
    case action.HRTK004_HIDE_POPUP_PHONG_BAN:
      return {
        ...state,
        ShowPopupPhongBan: false,
      };
    default:
      return state;
  }
};
export default reducer;
