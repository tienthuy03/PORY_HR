import * as action from './action';
const initialState = {
  DanhSachNhanVien: [],
  DanhSachPhongBan: [],
  DanhSachMayChamCong: [],
  ShowPopupDangKyKhuonMat: false,
  ShowPopupMayChamCong: false,
  ChonPhongBan: {
    code: 0,
    code_nm: 'Chọn phòng ban',
  },
  OnRefresh: false,
  CheckAll: false,
  ChonNhanVien: {},
  LoaiDangKy: 0,
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRTI004_LOAI_DANG_KY:
      return {
        ...state,
        LoaiDangKy: act.LoaiDangKy,
      };
    case action.HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_S:
      return {
        ...state,
        DanhSachMayChamCong: act.DanhSachMayChamCong,
      };
    case action.HRTI004_CHON_NHAN_VIEN:
      return {
        ...state,
        ChonNhanVien: act.ChonNhanVien,
      };
    case action.HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_F:
      return {
        ...state,
        DanhSachMayChamCong: [],
      };
    case action.HRTI004_SHOW_POPUP_MAY_CHAM_CONG:
      return {
        ...state,
        ShowPopupMayChamCong: act.ShowPopupMayChamCong,
      };
    case action.HRTI004_SHOW_POPUP_DANG_KY_KHUON_MAT:
      return {
        ...state,
        ShowPopupDangKyKhuonMat: act.ShowPopupDangKyKhuonMat,
      };
    case action.HRTI004_SET_CHECK_ALL:
      return {
        ...state,
        CheckAll: act.CheckAll,
      };
    case action.HRTI004_SET_CHECK_ALL:
      return {
        ...state,
        CheckAll: act.CheckAll,
      };
    case action.HRTI004_ON_REFRESH:
      return {
        ...state,
        OnRefresh: act.OnRefresh,
      };
    case action.HRTI004_LOAD_DU_LIEU_PHONG_BAN_S:
      return {
        ...state,
        DanhSachPhongBan: act.DanhSachPhongBan,
      };
    case action.HRTI004_LOAD_DU_LIEU_PHONG_BAN_F:
      return {
        ...state,
        DanhSachPhongBan: [],
      };
    case action.HRTI004_LOAD_DANH_SACH_NHAN_VIEN_S:
      return {
        ...state,
        DanhSachNhanVien: act.DanhSachNhanVien,
      };
    case action.HRTI004_LOAD_DANH_SACH_NHAN_VIEN_F:
      return {
        ...state,
        DanhSachNhanVien: [],
      };
    case action.HRTI004_CHON_PHONG_BAN:
      return {
        ...state,
        ChonPhongBan: act.ChonPhongBan,
      };
    default:
      return state;
  }
};
export default reducer;
