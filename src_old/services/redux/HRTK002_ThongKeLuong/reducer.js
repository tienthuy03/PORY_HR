import moment from 'moment';
import * as action from './action';
const initialState = {
  DanhSachPhongBan: [],
  ShowPopupPhongBan: false,
  ShowPopupYear: false,
  ChonPhongBan: {
    code: 0,
    code_nm: 'Chọn phòng ban',
  },
  ChonNam: moment().format('YYYY'),
  DuLieuLuong: [],
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRTK002_LAY_DU_LIEU_S:
      return {
        ...state,
        DuLieuLuong: act.DuLieuLuong,
      };
    case action.HRTK002_LAY_DU_LIEU_F:
      return {
        ...state,
        DuLieuLuong: [],
      };
    case action.HRTK002_CHON_PHONG_BAN:
      return {
        ...state,
        ChonPhongBan: act.ChonPhongBan,
      };
    case action.HRTK002_LAY_DANH_SACH_PHONG_BAN_S:
      return {
        ...state,
        DanhSachPhongBan: act.DanhSachPhongBan,
      };
    case action.HRTK002_LAY_DANH_SACH_PHONG_BAN_F:
      return {
        ...state,
        DanhSachPhongBan: [],
      };
    case action.HRTK002_SHOW_POPUP_PHONG_BAN:
      return {
        ...state,
        ShowPopupPhongBan: true,
      };
    case action.HRTK002_HIDE_POPUP_PHONG_BAN:
      return {
        ...state,
        ShowPopupPhongBan: false,
      };
    case action.HRTK002_SHOW_POPUP_YEAR:
      return {
        ...state,
        ShowPopupYear: true,
      };
    case action.HRTK002_HIDE_POPUP_YEAR:
      return {
        ...state,
        ShowPopupYear: false,
      };
      case action.HRTK002_CHON_NAM:
      return {
        ...state,
        ChonNam: act.ChonNam,
      };
    default:
      return state;
  }
};
export default reducer;
