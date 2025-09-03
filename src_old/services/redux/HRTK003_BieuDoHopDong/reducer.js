import * as action from './action';
const initialState = {
  DanhSachPhongBan: [],
  ShowPopupPhongBan: false,
  ChonPhongBan: {
    code: 0,
    code_nm: 'Chọn phòng ban',
  },
  DuLieuHopDong: [],
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRTK003_LAY_DU_LIEU_S:
      return {
        ...state,
        DuLieuHopDong: act.DuLieuHopDong,
      };
    case action.HRTK003_LAY_DU_LIEU_F:
      return {
        ...state,
        DuLieuHopDong: [],
      };
    case action.HRTK003_CHON_PHONG_BAN:
      return {
        ...state,
        ChonPhongBan: act.ChonPhongBan,
      };
    case action.HRTK003_LAY_DANH_SACH_PHONG_BAN_S:
      return {
        ...state,
        DanhSachPhongBan: act.DanhSachPhongBan,
      };
    case action.HRTK003_LAY_DANH_SACH_PHONG_BAN_F:
      return {
        ...state,
        DanhSachPhongBan: [],
      };
    case action.HRTK003_SHOW_POPUP_PHONG_BAN:
      return {
        ...state,
        ShowPopupPhongBan: true,
      };
    case action.HRTK003_HIDE_POPUP_PHONG_BAN:
      return {
        ...state,
        ShowPopupPhongBan: false,
      };
    default:
      return state;
  }
};
export default reducer;
